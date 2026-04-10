'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import type { ZiweiChart, Palace, Star } from '@/lib/ziwei/types';
import { STEMS, SI_HUA_TABLE } from '@/lib/ziwei/constants';
import type { TimeView } from '@/components/chart/ChartBoard';

// ─── 类型 ────────────────────────────────────────────────
interface Message {
  role: 'user' | 'assistant';
  content: string;
  hidden?: boolean;
}

export interface FocusState {
  type: 'palace' | 'star' | 'sihua';
  label: string;
  palace?: Palace;
  star?: Star;
  siHua?: string;
}

// ─── 宫位职责说明 ─────────────────────────────────────────
const PALACE_ROLES: Record<string, string> = {
  '命宫': '自我、性格、先天格局',
  '兄弟宫': '兄弟关系、合伙人',
  '夫妻宫': '感情关系、婚姻状态',
  '子女宫': '子女缘分、下属关系',
  '财帛宫': '财运来源、收入方式',
  '疾厄宫': '身体健康、意外',
  '迁移宫': '外出机遇、人际格局',
  '交友宫': '朋友圈、贵人与小人',
  '官禄宫': '事业成就、社会地位',
  '田宅宫': '不动产、家庭环境',
  '福德宫': '精神享受、内心福分',
  '父母宫': '父母关系、文书契约',
};

// ─── Prompt 构造 ──────────────────────────────────────────
const TOPIC_PROMPTS: Record<string, string> = {
  overview: `请生成命格总览，按以下结构输出（每段标题用 **【标题】** 格式）：

**【一句话结论】**
用一句话概括命格核心定性。

**【核心判断】**
列出 3-5 条最重要的命盘特征，每条以"◎"开头。

**【命盘依据】**
说明上述判断的主要宫位依据，引用倪海夏体系解读。

**【风险提醒】**
列出 1-3 条需要注意的风险或功课，以"⚠"开头。

**【行动建议】**
给出 2-3 条具体可操作的建议，以"→"开头。

**【继续追问】**
给出 2-3 个推荐的追问问题。`,

  love: `请深度分析感情婚姻运，按以下结构输出：
**【一句话结论】** **【核心判断】** **【命盘依据】** **【风险提醒】** **【行动建议】** **【继续追问】**`,

  career: `请深度分析事业运，按以下结构输出：
**【一句话结论】** **【核心判断】** **【命盘依据】** **【风险提醒】** **【行动建议】** **【继续追问】**`,

  wealth: `请深度分析财运，按以下结构输出：
**【一句话结论】** **【核心判断】** **【命盘依据】** **【风险提醒】** **【行动建议】** **【继续追问】**`,

  health: `请分析健康运势，按以下结构输出：
**【一句话结论】** **【核心判断】** **【命盘依据】** **【风险提醒】** **【行动建议】** **【继续追问】**`,

  personality: `请深度解析性格特质，按以下结构输出：
**【一句话结论】** **【核心判断】** **【命盘依据】** **【风险提醒】** **【行动建议】** **【继续追问】**`,
};

const TOPICS = [
  { key: 'overview',     label: '命格总览' },
  { key: 'love',        label: '感情' },
  { key: 'career',      label: '事业' },
  { key: 'wealth',      label: '财运' },
  { key: 'health',      label: '健康' },
  { key: 'personality', label: '性格' },
] as const;

// ─── AI 内容渲染 ──────────────────────────────────────────
function AiContent({ text, streaming }: { text: string; streaming?: boolean }) {
  const lines = text.split('\n');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {lines.map((line, i) => {
        const sectionMatch = line.match(/^\*\*【(.+?)】\*\*$/);
        if (sectionMatch) {
          return (
            <div key={i} style={{ paddingTop: i === 0 ? 0 : '14px', paddingBottom: '4px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--ac)',
                  letterSpacing: '0.04em',
                }}
              >
                【{sectionMatch[1]}】
              </span>
            </div>
          );
        }
        if (line.trim() === '') return <div key={i} style={{ height: '4px' }} />;
        const parts = line.split(/\*\*(.+?)\*\*/);
        return (
          <div key={i} style={{ fontSize: '13px', lineHeight: 1.7, color: 'var(--tx-2)' }}>
            {parts.map((part, j) =>
              j % 2 === 0
                ? part
                : <strong key={j} style={{ fontWeight: 500, color: 'var(--tx-0)' }}>{part}</strong>
            )}
          </div>
        );
      })}
      {streaming && (
        <span
          style={{
            display: 'inline-block',
            width: '7px',
            height: '13px',
            background: 'var(--ac)',
            opacity: 0.5,
            borderRadius: '2px',
            animation: 'pulse 1s ease-in-out infinite',
            verticalAlign: 'middle',
            marginLeft: '2px',
          }}
        />
      )}
    </div>
  );
}

// ─── 主组件 ──────────────────────────────────────────────
interface InsightPanelProps {
  chart: ZiweiChart;
  view: TimeView;
  liunianYear: number;
  focus?: FocusState | null;
  onClearFocus?: () => void;
}

export default function InsightPanel({ chart, view, liunianYear, focus, onClearFocus }: InsightPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string>('overview');
  const [error, setError] = useState(false);

  const messagesRef = useRef<Message[]>([]);
  const loadingRef = useRef(false);
  const autoLoaded = useRef(false);
  const lastFocusKey = useRef<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamResponse = useCallback(async (apiMessages: { role: 'user' | 'assistant'; content: string }[]) => {
    setError(false);
    try {
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chart, messages: apiMessages }),
      });
      if (!res.ok) throw new Error('请求失败');
      if (!res.body) throw new Error('无响应流');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const delta = JSON.parse(data).delta?.text ?? '';
            assistantText += delta;
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: 'assistant', content: assistantText };
              return updated;
            });
          } catch { /* skip */ }
        }
      }
    } catch {
      setError(true);
      setMessages(prev => prev.slice(0, -1)); // 移除空的 assistant 消息
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [chart]);

  const sendMessage = useCallback((text: string, hidden = false) => {
    if (!text.trim() || loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    const userMsg: Message = { role: 'user', content: text, hidden };
    const apiMessages = [...messagesRef.current, userMsg].map(m => ({ role: m.role, content: m.content }));
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    streamResponse(apiMessages);
  }, [streamResponse]);

  // 自动生成命格总览
  useEffect(() => {
    if (autoLoaded.current) return;
    autoLoaded.current = true;
    sendMessage(TOPIC_PROMPTS.overview, true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 聚焦变化时自动分析
  useEffect(() => {
    if (!focus) return;
    const key = JSON.stringify(focus);
    if (key === lastFocusKey.current) return;
    lastFocusKey.current = key;

    let prompt = '';
    if (focus.type === 'palace' && focus.palace) {
      const p = focus.palace;
      const majorStars = p.stars.filter(s => s.type === 'major');
      const starDesc = majorStars.length > 0
        ? majorStars.map(s => `${s.name}${s.siHua ? '化' + s.siHua : ''}`).join('、')
        : '空宫（借对宫）';
      const role = PALACE_ROLES[p.name] ?? '';
      prompt = `请重点分析【${p.name}】（主管：${role}），主星：${starDesc}，按结构输出：
**【一句话结论】** **【核心判断】** **【命盘依据】** **【风险提醒】** **【行动建议】** **【继续追问】**`;
    } else if (focus.type === 'star' && focus.star && focus.palace) {
      prompt = `请分析【${focus.star.name}】星落于【${focus.palace.name}】${focus.star.siHua ? '化' + focus.star.siHua : ''}的影响，按结构输出：
**【一句话结论】** **【核心判断】** **【命盘依据】** **【风险提醒】** **【行动建议】** **【继续追问】**`;
    } else if (focus.type === 'sihua' && focus.star && focus.siHua) {
      const palaceOfStar = chart.palaces.find(p => p.stars.some(s => s.name === focus.star!.name));
      const viewLabel = view === 'daxian' ? '大限' : '流年';
      prompt = `请分析【${viewLabel}${focus.star.name}化${focus.siHua}】落于【${palaceOfStar?.name ?? ''}】的飞化影响，按结构输出：
**【一句话结论】** **【核心判断】** **【命盘依据】** **【风险提醒】** **【行动建议】** **【继续追问】**`;
    }

    if (prompt) sendMessage(prompt, true);
  }, [focus]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTopicClick = (key: string) => {
    if (loadingRef.current) return;
    setActiveTopic(key);
    sendMessage(TOPIC_PROMPTS[key], true);
  };

  const handleRetry = () => {
    setError(false);
    sendMessage(TOPIC_PROMPTS[activeTopic], true);
  };

  // 当前聚焦面包屑
  const getFocusLabel = () => {
    if (!focus) return null;
    if (focus.type === 'palace') return focus.palace?.name;
    if (focus.type === 'star') return `${focus.star?.name} · ${focus.palace?.name}`;
    if (focus.type === 'sihua') return `${focus.star?.name} 化${focus.siHua}`;
    return null;
  };

  const focusLabel = getFocusLabel();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* 聚焦面包屑 */}
      {focusLabel && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 16px',
            background: 'var(--ac-bg)',
            border: '1px solid var(--ac-bdr)',
            borderRadius: 'var(--r-sm)',
            marginBottom: '10px',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--ac)', fontWeight: 500 }}>
            当前聚焦：{focusLabel}
          </span>
          <button
            onClick={onClearFocus}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--ac)',
              fontSize: '16px',
              padding: '0 4px',
              opacity: 0.6,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* 主题按钮区 */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap',
          marginBottom: '12px',
          flexShrink: 0,
        }}
      >
        {TOPICS.map(t => {
          const isActive = activeTopic === t.key && !focus;
          return (
            <button
              key={t.key}
              onClick={() => handleTopicClick(t.key)}
              disabled={loading}
              style={{
                padding: '6px 13px',
                borderRadius: 'var(--r-pill)',
                fontSize: '12px',
                fontWeight: isActive ? 500 : 400,
                color: isActive ? 'var(--ac)' : 'var(--tx-3)',
                background: isActive ? 'var(--ac-bg)' : 'white',
                border: `1px solid ${isActive ? 'var(--ac-bdr)' : 'var(--bdr-med)'}`,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                transition: 'all 0.15s',
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* 消息区 */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', minHeight: 0 }}>

        {/* 空态 */}
        {messages.length === 0 && !loading && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              gap: '12px',
              color: 'var(--tx-3)',
            }}
          >
            <div style={{ fontSize: '28px', opacity: 0.15 }}>☯</div>
            <p style={{ fontSize: '13px', lineHeight: 1.6 }}>命盘洞察生成中…</p>
          </div>
        )}

        {/* 加载中（空消息状态） */}
        {loading && messages.every(m => m.hidden || m.role === 'user') && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--tx-3)', fontSize: '13px' }}>
            <div
              style={{
                width: '14px', height: '14px',
                border: '2px solid var(--bdr-med)',
                borderTopColor: 'var(--ac)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                flexShrink: 0,
              }}
            />
            正在分析命盘数据…
          </div>
        )}

        {/* 错误态 */}
        {error && (
          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--r-md)',
              border: '1px solid var(--bdr)',
              background: 'white',
            }}
          >
            <p style={{ fontSize: '13px', color: 'var(--tx-2)', marginBottom: '10px' }}>
              分析暂时不可用，网络异常或服务繁忙。
            </p>
            <p style={{ fontSize: '12px', color: 'var(--tx-3)', marginBottom: '12px' }}>
              你的命盘数据已保留，重新分析即可。
            </p>
            <button
              onClick={handleRetry}
              className="btn-ghost"
              style={{ fontSize: '12px', padding: '8px 16px' }}
            >
              重新分析
            </button>
          </div>
        )}

        {/* 消息列表 */}
        {messages.map((msg, i) => {
          if (msg.role === 'user' && msg.hidden) return null;

          if (msg.role === 'user') {
            return (
              <div key={i} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '10px 14px',
                    borderRadius: 'var(--r-md)',
                    background: 'var(--ac-bg)',
                    border: '1px solid var(--ac-bdr)',
                    fontSize: '13px',
                    color: 'var(--ac-dim)',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            );
          }

          const isLast = i === messages.length - 1;
          return (
            <div key={i}>
              <div
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  color: 'var(--tx-3)',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ color: 'var(--ac)', opacity: 0.4 }}>✦</span>
                命盘洞察
              </div>
              <AiContent text={msg.content} streaming={loading && isLast} />
            </div>
          );
        })}
      </div>

      {/* 追问输入区 */}
      <div
        style={{
          flexShrink: 0,
          paddingTop: '12px',
          borderTop: '1px solid var(--bdr)',
          marginTop: '12px',
        }}
      >
        {/* 推荐问题 */}
        {!loading && messages.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
            {['今年财运如何？', '感情何时到来？', '当前大限重点？'].map(q => (
              <button
                key={q}
                onClick={() => { setInput(q); }}
                style={{
                  fontSize: '11px',
                  padding: '4px 10px',
                  borderRadius: 'var(--r-pill)',
                  border: '1px solid var(--bdr-med)',
                  background: 'white',
                  color: 'var(--tx-3)',
                  cursor: 'pointer',
                  transition: 'border-color 0.12s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--ac-bdr)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--bdr-med)'; }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
            placeholder="继续追问，如：今年适合换工作吗？"
            disabled={loading}
            className="input-base"
            style={{ fontSize: '13px' }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            style={{
              flexShrink: 0,
              padding: '10px 16px',
              borderRadius: 'var(--r-sm)',
              border: 'none',
              background: loading || !input.trim() ? 'var(--bg-2)' : 'var(--tx-0)',
              color: loading || !input.trim() ? 'var(--tx-3)' : 'white',
              fontSize: '13px',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {loading ? '…' : '↑'}
          </button>
        </div>
      </div>
    </div>
  );
}

