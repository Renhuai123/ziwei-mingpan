'use client';
import { motion } from 'framer-motion';
import { analyzeFengshui } from '@/lib/ziwei/fengshui';
import type { ZiweiChart } from '@/lib/ziwei/types';

const ELEMENT_ICON: Record<string, string> = {
  '水': '💧', '火': '🔥', '木': '🌿', '金': '⚙️', '土': '🪨',
};
const ELEMENT_COLOR: Record<string, { bg: string; border: string; text: string }> = {
  '水': { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.3)', text: '#60a5fa' },
  '火': { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.3)', text: '#f87171' },
  '木': { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.3)', text: '#4ade80' },
  '金': { bg: 'rgba(234,179,8,0.08)', border: 'rgba(234,179,8,0.3)', text: '#facc15' },
  '土': { bg: 'rgba(217,119,6,0.08)', border: 'rgba(217,119,6,0.3)', text: '#fbbf24' },
};

export default function FengShuiPanel({ chart }: { chart: ZiweiChart }) {
  const result = analyzeFengshui(chart);
  const ALL_ELEMENTS = ['金', '木', '水', '火', '土'];
  const maxCount = Math.max(...Object.values(result.elementCounts), 1);

  return (
    <div className="h-full overflow-y-auto p-4 space-y-5"
      style={{ scrollbarWidth: 'thin' }}>

      {/* 标题 */}
      <div>
        <div className="text-[10px] tracking-[0.4em] text-amber-700/50 mb-1">FENG SHUI · 风水补局</div>
        <div className="text-xs text-amber-600/60 leading-relaxed">
          根据命盘三方四正的五行分布，为你定制风水补局方案，裨补阙漏、强化弱项。
        </div>
      </div>

      {/* 五行分布 */}
      <div className="rounded-lg border border-[#0a1e38] bg-[#040a14] p-4">
        <div className="text-[9px] tracking-[0.4em] text-[#1e3550] mb-3">五行分布</div>
        <div className="space-y-2">
          {ALL_ELEMENTS.map(el => {
            const count = result.elementCounts[el];
            const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
            const isMissing = result.missingElements.includes(el);
            const isWeak = result.weakElements.includes(el);
            const isStrong = result.strongElements.includes(el);
            const c = ELEMENT_COLOR[el];
            return (
              <div key={el} className="flex items-center gap-2">
                <span className="text-[11px] w-4 text-center">{ELEMENT_ICON[el]}</span>
                <span className="text-[11px] w-4 transition-colors"
                  style={{ color: c.text }}>{el}</span>
                <div className="flex-1 h-1.5 rounded-full bg-[#0a1e38] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="h-full rounded-full"
                    style={{ background: c.border }}
                  />
                </div>
                <span className="text-[10px] w-4 text-right"
                  style={{ color: c.text, opacity: 0.7 }}>{count}</span>
                {isMissing && (
                  <span className="text-[9px] px-1 rounded"
                    style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>缺</span>
                )}
                {isWeak && (
                  <span className="text-[9px] px-1 rounded"
                    style={{ background: 'rgba(251,146,60,0.15)', color: '#fb923c' }}>弱</span>
                )}
                {isStrong && (
                  <span className="text-[9px] px-1 rounded"
                    style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80' }}>旺</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 补局建议 */}
      {result.remedies.length > 0 ? (
        <div className="space-y-3">
          <div className="text-[9px] tracking-[0.4em] text-[#1e3550]">
            {result.remedies.some(r => r.level === 'missing') ? '缺失五行 · 重点补局' : '偏弱五行 · 建议补局'}
          </div>
          {result.remedies.map((remedy, i) => {
            const c = ELEMENT_COLOR[remedy.element];
            return (
              <motion.div
                key={remedy.element}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-lg p-4"
                style={{ background: c.bg, border: `1px solid ${c.border}` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{ELEMENT_ICON[remedy.element]}</span>
                  <div>
                    <span className="text-[11px] font-medium" style={{ color: c.text }}>
                      缺{remedy.element}
                    </span>
                    <span className="text-[9px] ml-2 opacity-60" style={{ color: c.text }}>
                      {remedy.level === 'missing' ? '完全缺失' : '偏弱'}
                    </span>
                  </div>
                  <div className="ml-auto text-[9px] opacity-60" style={{ color: c.text }}>
                    吉位：{remedy.direction}
                  </div>
                </div>

                <p className="text-[10px] text-[#334155] leading-relaxed mb-3">{remedy.desc}</p>

                <div className="space-y-1.5">
                  <div>
                    <span className="text-[9px] text-[#1e3550] tracking-wider">推荐摆件：</span>
                    <span className="text-[10px] ml-1" style={{ color: c.text, opacity: 0.9 }}>
                      {remedy.items.join('、')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#1e3550] tracking-wider">颜色调和：</span>
                    <span className="text-[10px] ml-1" style={{ color: c.text, opacity: 0.9 }}>
                      {remedy.colors.join('、')}
                    </span>
                  </div>
                  {remedy.plants && (
                    <div>
                      <span className="text-[9px] text-[#1e3550] tracking-wider">推荐植物：</span>
                      <span className="text-[10px] ml-1" style={{ color: c.text, opacity: 0.9 }}>
                        {remedy.plants.join('、')}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-[#0a1e38] bg-[#040a14] p-4 text-center">
          <div className="text-amber-500/30 text-2xl mb-2">✦</div>
          <p className="text-[11px] text-amber-700/50">五行较为均衡，无需特别补局</p>
          <p className="text-[10px] text-[#1e3550] mt-1">保持现有居家环境即可</p>
        </div>
      )}

      {/* 本命吉位 */}
      <div className="rounded-lg border border-[#0a1e38] bg-[#040a14] p-4">
        <div className="text-[9px] tracking-[0.4em] text-[#1e3550] mb-3">本命吉位</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded"
            style={{ background: 'rgba(180,130,40,0.06)', border: '1px solid rgba(180,130,40,0.2)' }}>
            <div className="text-[9px] text-amber-700/50 mb-1">主吉方</div>
            <div className="text-base font-bold text-amber-400/80">{result.auspiciousDir.main}</div>
          </div>
          <div className="text-center p-3 rounded"
            style={{ background: 'rgba(180,130,40,0.04)', border: '1px solid rgba(180,130,40,0.15)' }}>
            <div className="text-[9px] text-amber-700/50 mb-1">辅吉方</div>
            <div className="text-base font-bold text-amber-600/60">{result.auspiciousDir.sub}</div>
          </div>
        </div>
        <p className="text-[10px] text-[#1e3550] mt-3 leading-relaxed text-center">
          书桌、床头朝向吉方，有助于增强本命气场
        </p>
      </div>

      {/* 免责提示 */}
      <div className="text-[9px] text-[#0f1e30] leading-relaxed text-center pb-2">
        风水补局仅为辅助参考，配合个人努力方为正道
      </div>
    </div>
  );
}
