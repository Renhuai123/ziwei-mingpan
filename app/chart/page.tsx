'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import StarField from '@/components/StarField';
import BirthForm, { type BirthFormState } from '@/components/BirthForm';
import { useTheme } from '@/components/ThemeProvider';
import ChartBoard from '@/components/ChartBoard';
import ChartSummary from '@/components/ChartSummary';
import InsightPanel from '@/components/InsightPanel';
import StarDetailPanel from '@/components/StarDetailPanel';
import type { BirthInfo, ZiweiChart, Star, Palace } from '@/lib/ziwei/types';
import type { TimeView } from '@/components/TimeNav';
import { formToSearchParams, searchParamsToForm, formToBirthInfo } from '@/lib/ziwei/share';
import { useHistory } from '@/lib/ziwei/history';

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.93 }}
      aria-label={isDark ? '切换亮色主题' : '切换暗色主题'}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
      style={{
        borderColor: 'var(--t-border-acc)',
        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,252,242,0.85)',
      }}
    >
      <div className="relative w-7 h-3.5 rounded-full flex-shrink-0"
        style={{ background: isDark ? 'rgba(12,24,64,0.95)' : 'rgba(230,195,80,0.55)' }}>
        <motion.div
          animate={{ x: isDark ? 1 : 14 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="absolute top-[3px] w-2.5 h-2.5 rounded-full"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #b8a050, #e8d090)'
              : 'linear-gradient(135deg, #e89010, #f8d050)',
          }}
        />
      </div>
      <span className="text-[10px] font-medium tracking-wide select-none"
        style={{ color: 'var(--t-gold)' }}>
        {isDark ? '暗色' : '亮色'}
      </span>
    </motion.button>
  );
}

export default function ChartPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [chart, setChart] = useState<ZiweiChart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedStar, setSelectedStar] = useState<Star | null>(null);
  const [selectedStarPalace, setSelectedStarPalace] = useState<string>('');
  const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);
  const [selectedSiHua, setSelectedSiHua] = useState<{ starName: string; siHua: string; view: TimeView } | null>(null);
  const [rightPanel, setRightPanel] = useState<'ai' | 'detail'>('ai');
  const [savedForm, setSavedForm] = useState<BirthFormState | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const { history, save: saveHistory, remove: removeHistory } = useHistory();

  const isDark = theme === 'dark';

  // ── URL 参数自动起盘 ──────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const formData = searchParamsToForm(params);
    if (!formData?.year) return;
    const fullForm: BirthFormState = {
      name: '', year: '', month: '', day: '',
      clockHour: '8', clockMinute: '0', unknownTime: false,
      province: '', city: '', longitude: 120, gender: 'male',
      ...formData,
    };
    setSavedForm(fullForm);
    handleSubmit(formToBirthInfo(fullForm));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (info: BirthInfo) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? '命盘生成失败');
      }
      const data: ZiweiChart = await res.json();
      setChart(data);
      setSelectedStar(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleStarSelect = (star: Star, palace: Palace) => {
    setSelectedStar(star);
    setSelectedStarPalace(palace.name);
    setRightPanel('detail');
  };

  const handleBack = () => {
    if (chart) {
      setChart(null);
      setError('');
      setSelectedStar(null);
      setRightPanel('ai');
      setFormKey(k => k + 1);
    } else {
      router.push('/');
    }
  };

  const handlePalaceSelect = (palace: Palace) => {
    setSelectedPalace(palace);
    setRightPanel('ai');
  };

  const handleSiHuaClick = (starName: string, siHua: string, view: TimeView) => {
    setSelectedSiHua({ starName, siHua, view });
    setRightPanel('ai');
  };

  const handleReset = () => {
    setChart(null);
    setError('');
    setSelectedStar(null);
    setSelectedPalace(null);
    setSelectedSiHua(null);
    setRightPanel('ai');
    setSavedForm(null);
    setFormKey(k => k + 1);
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', '/chart');
    }
  };

  const handleShare = () => {
    if (!savedForm) return;
    const params = formToSearchParams(savedForm);
    const url = `${window.location.origin}/chart?${params.toString()}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // 降级：选中输入框
      const el = document.createElement('input');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleLoadHistory = (form: BirthFormState) => {
    setSavedForm(form);
    const params = formToSearchParams(form);
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', `/chart?${params.toString()}`);
    }
    handleSubmit(formToBirthInfo(form));
  };

  const TABS = [
    { key: 'ai', label: 'AI 解读' },
    { key: 'detail', label: '星曜详解' },
  ] as const;

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: 'var(--t-bg)', transition: 'background 0.35s ease' }}>
      <div className="no-print">
        <StarField />
      </div>

      {/* 顶部光晕 */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden no-print">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[80px]"
          style={{ background: 'var(--t-glow1)' }} />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* ─── 顶部导航 ─── */}
        <header
          className="no-print relative flex items-center justify-between px-5 py-2.5 border-b sticky top-0 z-20"
          style={{
            background: 'var(--t-nav-bg)',
            borderColor: 'var(--t-border)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          }}
        >
          <motion.button
            onClick={handleBack}
            whileHover={{ x: -2 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5 text-xs"
            style={{ color: 'var(--t-faint)' }}
          >
            <span className="text-base leading-none">‹</span>
            <span className="tracking-wide">{chart ? '修改信息' : '返回首页'}</span>
          </motion.button>

          {/* 绝对居中标题 */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none">
            <span style={{ color: 'var(--t-gold)', opacity: 0.4 }} className="text-xs">☯</span>
            <span className="text-xs tracking-[0.3em]" style={{ color: 'var(--t-gold)' }}>紫微命盘</span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {chart && (
              <>
                {/* 分享按钮 */}
                <motion.button
                  onClick={handleShare}
                  whileTap={{ scale: 0.95 }}
                  className="text-[10px] transition-colors border px-2.5 py-1 rounded-full"
                  style={{
                    color: copied ? '#4ade80' : 'var(--t-gold)',
                    borderColor: copied ? 'rgba(74,222,128,0.4)' : 'var(--t-border-acc)',
                    opacity: 0.9,
                  }}
                >
                  {copied ? '已复制 ✓' : '分享链接'}
                </motion.button>
                {/* 导出 PDF */}
                <button
                  onClick={() => window.print()}
                  className="text-[10px] transition-colors border px-2.5 py-1 rounded-full"
                  style={{ color: 'var(--t-faint)', borderColor: 'var(--t-border)', opacity: 0.7 }}
                >
                  导出
                </button>
                {/* 重新起盘 */}
                <button
                  onClick={handleReset}
                  className="text-[10px] transition-colors border px-2.5 py-1 rounded-full"
                  style={{ color: 'var(--t-gold)', borderColor: 'var(--t-border-acc)', opacity: 0.8 }}
                >
                  重新起盘
                </button>
              </>
            )}
          </div>
        </header>

        <div className="flex-1">
          <AnimatePresence mode="wait">
            {!chart ? (
              /* ─── 输入表单 ─── */
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3 }}
                className="max-w-md mx-auto px-4 pt-10 pb-16"
              >
                <div className="text-center mb-7">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: 'spring' }}
                    className="text-5xl mb-3 select-none"
                    style={{ color: 'var(--t-faint)', opacity: 0.3 }}
                  >
                    ☯
                  </motion.div>
                  <h1 className="text-xl tracking-[0.25em] font-medium mb-1" style={{ color: 'var(--t-gold)' }}>
                    起紫微命盘
                  </h1>
                  <p className="text-[11px]" style={{ color: 'var(--t-faint)' }}>输入出生年月日时 · 以公历为准</p>
                </div>
                <BirthForm
                  key={formKey}
                  onSubmit={handleSubmit}
                  loading={loading}
                  initialData={savedForm ?? undefined}
                  onFormSave={form => {
                    setSavedForm(form);
                    saveHistory(form);
                    const params = formToSearchParams(form);
                    if (typeof window !== 'undefined') {
                      window.history.replaceState({}, '', `/chart?${params.toString()}`);
                    }
                  }}
                />
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 p-3 bg-red-950/20 border border-red-800/30 rounded-xl text-red-400/80 text-xs text-center"
                  >
                    {error}
                  </motion.div>
                )}

                {/* ── 历史命盘 ── */}
                {history.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[9px] tracking-[0.4em]" style={{ color: 'var(--t-faint)' }}>历史命盘</span>
                      <div className="flex-1 h-px" style={{ background: 'var(--t-border)' }} />
                    </div>
                    <div className="space-y-1.5">
                      {history.map(entry => (
                        <motion.div
                          key={entry.id}
                          layout
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer group"
                          style={{
                            background: 'var(--t-surface)',
                            border: '1px solid var(--t-border)',
                            transition: 'border-color 0.2s',
                          }}
                          onClick={() => handleLoadHistory(entry.form)}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--t-border-acc)'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--t-border)'; }}
                        >
                          <span className="text-[9px]" style={{ color: 'var(--t-gold)', opacity: 0.5 }}>☯</span>
                          <span className="text-[11px] flex-1 truncate" style={{ color: 'var(--t-text2)' }}>
                            {entry.label}
                          </span>
                          <span className="text-[9px] hidden group-hover:inline" style={{ color: 'var(--t-gold)' }}>
                            重新起盘
                          </span>
                          <button
                            onClick={e => { e.stopPropagation(); removeHistory(entry.id); }}
                            className="text-[11px] ml-1 opacity-0 group-hover:opacity-100 transition-opacity leading-none"
                            style={{ color: 'var(--t-faint)' }}
                          >
                            ×
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              /* ─── 命盘视图 ─── */
              <motion.div
                key="chart"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="p-3 md:p-5"
              >
                <div className="max-w-[1440px] mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-[minmax(480px,560px)_1fr_380px] gap-5 items-start">

                    {/* ── 左栏: 命盘 ── */}
                    <div>
                      <ChartBoard
                        chart={chart}
                        onStarSelect={handleStarSelect}
                        onPalaceSelect={handlePalaceSelect}
                        onSiHuaClick={handleSiHuaClick}
                      />
                    </div>

                    {/* ── 中栏: 命格摘要 ── */}
                    <div>
                      <ChartSummary chart={chart} />
                    </div>

                    {/* ── 右栏: 洞察工作区 ── */}
                    <div className="no-print lg:sticky lg:top-16" style={{ height: 'calc(100vh - 80px)', maxHeight: '800px' }}>
                      {/* 切换标签 */}
                      <div
                        className="flex mb-3 rounded-xl overflow-hidden p-1 gap-1"
                        style={{ background: 'var(--t-surface)', border: '1px solid var(--t-border)' }}
                      >
                        {TABS.map(tab => {
                          const isActive = rightPanel === tab.key;
                          return (
                            <button
                              key={tab.key}
                              onClick={() => setRightPanel(tab.key as 'ai' | 'detail')}
                              className="relative flex-1 py-2 text-[11px] font-medium rounded-lg transition-all duration-200"
                              style={{
                                background: isActive
                                  ? isDark ? 'rgba(212,168,67,0.12)' : 'rgba(180,130,40,0.12)'
                                  : 'transparent',
                                color: isActive ? 'var(--t-gold)' : 'var(--t-faint)',
                                boxShadow: isActive
                                  ? isDark
                                    ? 'inset 0 0 0 1px rgba(212,168,67,0.2)'
                                    : 'inset 0 0 0 1px rgba(140,100,20,0.2), 0 1px 3px rgba(0,0,0,0.05)'
                                  : 'none',
                              }}
                            >
                              {tab.label}
                              {tab.key === 'detail' && selectedStar && (
                                <span className="ml-1 opacity-60">· {selectedStar.name}</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <div className="h-[calc(100%-52px)]">
                        <AnimatePresence mode="wait">
                          {rightPanel === 'ai' ? (
                            <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                              <InsightPanel chart={chart} selectedPalace={selectedPalace} selectedSiHua={selectedSiHua} />
                            </motion.div>
                          ) : (
                            <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto">
                              {selectedStar ? (
                                <StarDetailPanel
                                  star={selectedStar}
                                  palaceName={selectedStarPalace}
                                  onClose={() => { setSelectedStar(null); setRightPanel('ai'); }}
                                />
                              ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8 rounded-xl card-glass">
                                  <div className="text-4xl mb-4" style={{ color: 'var(--t-gold)', opacity: 0.15 }}>✦</div>
                                  <p className="text-xs leading-relaxed" style={{ color: 'var(--t-faint)' }}>
                                    点击命盘中任意<br />
                                    <span style={{ color: 'var(--t-gold)', opacity: 0.7 }}>主星名字</span>
                                    <br />查看倪海夏详细解读
                                  </p>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* 移动端：底部抽屉 */}
                  <AnimatePresence>
                    {selectedStar && (
                      <>
                        <motion.div
                          key="drawer-mask"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => setSelectedStar(null)}
                          className="fixed inset-0 z-40 lg:hidden no-print"
                          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}
                        />
                        <motion.div
                          key="drawer-body"
                          initial={{ y: '100%' }}
                          animate={{ y: 0 }}
                          exit={{ y: '100%' }}
                          transition={{ type: 'spring', stiffness: 340, damping: 38 }}
                          drag="y"
                          dragConstraints={{ top: 0 }}
                          dragElastic={{ top: 0, bottom: 0.3 }}
                          onDragEnd={(_, info) => { if (info.offset.y > 80) setSelectedStar(null); }}
                          className="fixed bottom-0 left-0 right-0 z-50 lg:hidden rounded-t-2xl overflow-hidden no-print"
                          style={{
                            background: 'var(--t-surface, var(--t-bg))',
                            border: '1px solid var(--t-border)',
                            borderBottom: 'none',
                            maxHeight: '78vh',
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <div className="flex justify-center pt-3 pb-1 flex-shrink-0" style={{ cursor: 'grab' }}>
                            <div className="w-10 h-1 rounded-full" style={{ background: 'var(--t-border-acc)', opacity: 0.5 }} />
                          </div>
                          <div className="overflow-y-auto flex-1 pb-safe">
                            <StarDetailPanel
                              star={selectedStar}
                              palaceName={selectedStarPalace}
                              onClose={() => setSelectedStar(null)}
                            />
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
