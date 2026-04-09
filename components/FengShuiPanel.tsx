'use client';
import { motion } from 'framer-motion';
import { analyzeFengshui } from '@/lib/ziwei/fengshui';
import type { ZiweiChart } from '@/lib/ziwei/types';

const ELEMENT_COLOR: Record<string, { bg: string; border: string; text: string; bar: string }> = {
  '水': { bg: 'rgba(59,130,246,0.06)', border: 'rgba(59,130,246,0.2)', text: '#60a5fa', bar: '#3b82f6' },
  '火': { bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.2)', text: '#f87171', bar: '#ef4444' },
  '木': { bg: 'rgba(34,197,94,0.06)', border: 'rgba(34,197,94,0.2)', text: '#4ade80', bar: '#22c55e' },
  '金': { bg: 'rgba(234,179,8,0.06)', border: 'rgba(234,179,8,0.2)', text: '#facc15', bar: '#eab308' },
  '土': { bg: 'rgba(217,119,6,0.06)', border: 'rgba(217,119,6,0.2)', text: '#fbbf24', bar: '#d97706' },
};

export default function FengShuiPanel({ chart }: { chart: ZiweiChart }) {
  const result = analyzeFengshui(chart);
  const ALL_ELEMENTS = ['金', '木', '水', '火', '土'];
  const maxCount = Math.max(...Object.values(result.elementCounts), 1);

  return (
    <div className="h-full overflow-y-auto p-4 space-y-5 card-glass rounded-xl" style={{ scrollbarWidth: 'thin' }}>
      {/* 标题 */}
      <div>
        <div className="text-[10px] tracking-[0.4em] mb-1" style={{ color: 'var(--t-gold)', opacity: 0.75 }}>FENG SHUI · 风水补局</div>
        <div className="text-xs leading-relaxed" style={{ color: 'var(--t-text2)' }}>
          根据命盘三方四正的五行分布，为你定制风水补局方案。
        </div>
      </div>

      {/* 五行分布 */}
      <div className="card-inner rounded-lg p-4">
        <div className="text-[9px] tracking-[0.4em] mb-3" style={{ color: 'var(--t-faint)' }}>五行分布</div>
        <div className="space-y-2.5">
          {ALL_ELEMENTS.map(el => {
            const count = result.elementCounts[el];
            const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
            const isMissing = result.missingElements.includes(el);
            const isWeak = result.weakElements.includes(el);
            const isStrong = result.strongElements.includes(el);
            const c = ELEMENT_COLOR[el];
            return (
              <div key={el} className="flex items-center gap-2.5">
                <span className="text-[11px] w-4 text-center font-medium" style={{ color: c.text }}>{el}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--t-border)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="h-full rounded-full"
                    style={{ background: c.bar }}
                  />
                </div>
                <span className="text-[10px] w-4 text-right tabular-nums" style={{ color: c.text, opacity: 0.8 }}>{count}</span>
                {isMissing && (
                  <span className="text-[9px] px-1.5 py-px rounded-full font-medium" style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171' }}>缺</span>
                )}
                {isWeak && (
                  <span className="text-[9px] px-1.5 py-px rounded-full font-medium" style={{ background: 'rgba(251,146,60,0.12)', color: '#fb923c' }}>弱</span>
                )}
                {isStrong && (
                  <span className="text-[9px] px-1.5 py-px rounded-full font-medium" style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80' }}>旺</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 补局建议 */}
      {result.remedies.length > 0 ? (
        <div className="space-y-3">
          <div className="text-[9px] tracking-[0.4em]" style={{ color: 'var(--t-faint)' }}>
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
                className="rounded-xl p-4"
                style={{ background: c.bg, border: `1px solid ${c.border}` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[13px] font-bold" style={{ color: c.text }}>{remedy.element}</span>
                  <span className="text-[9px]" style={{ color: c.text, opacity: 0.6 }}>
                    {remedy.level === 'missing' ? '完全缺失' : '偏弱'}
                  </span>
                  <div className="ml-auto text-[9px]" style={{ color: c.text, opacity: 0.6 }}>
                    吉位：{remedy.direction}
                  </div>
                </div>
                <p className="text-[10px] leading-relaxed mb-3" style={{ color: 'var(--t-text2)' }}>{remedy.desc}</p>
                <div className="space-y-1.5">
                  {[
                    { label: '推荐摆件', value: remedy.items.join('、') },
                    { label: '颜色调和', value: remedy.colors.join('、') },
                    ...(remedy.plants ? [{ label: '推荐植物', value: remedy.plants.join('、') }] : []),
                  ].map(item => (
                    <div key={item.label}>
                      <span className="text-[9px] tracking-wider" style={{ color: 'var(--t-faint)' }}>{item.label}：</span>
                      <span className="text-[10px] ml-1" style={{ color: c.text, opacity: 0.9 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="card-inner rounded-xl p-5 text-center">
          <div className="text-2xl mb-2" style={{ color: 'var(--t-gold)', opacity: 0.2 }}>✦</div>
          <p className="text-[11px]" style={{ color: 'var(--t-gold)', opacity: 0.5 }}>五行较为均衡，无需特别补局</p>
          <p className="text-[10px] mt-1" style={{ color: 'var(--t-faint)' }}>保持现有居家环境即可</p>
        </div>
      )}

      {/* 本命吉位 */}
      <div className="card-inner rounded-xl p-4">
        <div className="text-[9px] tracking-[0.4em] mb-3" style={{ color: 'var(--t-faint)' }}>本命吉位</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3.5 rounded-xl"
            style={{ background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.15)' }}>
            <div className="text-[9px] mb-1" style={{ color: 'var(--t-gold)', opacity: 0.75 }}>主吉方</div>
            <div className="text-lg font-bold" style={{ color: 'var(--t-gold)' }}>{result.auspiciousDir.main}</div>
          </div>
          <div className="text-center p-3.5 rounded-xl"
            style={{ background: 'rgba(212,168,67,0.04)', border: '1px solid rgba(212,168,67,0.1)' }}>
            <div className="text-[9px] mb-1" style={{ color: 'var(--t-gold)', opacity: 0.65 }}>辅吉方</div>
            <div className="text-lg font-bold" style={{ color: 'var(--t-gold)', opacity: 0.6 }}>{result.auspiciousDir.sub}</div>
          </div>
        </div>
        <p className="text-[10px] mt-3 leading-relaxed text-center" style={{ color: 'var(--t-faint)' }}>
          书桌、床头朝向吉方，有助于增强本命气场
        </p>
      </div>

      <div className="text-[9px] leading-relaxed text-center pb-2" style={{ color: 'var(--t-faint)', opacity: 0.7 }}>
        风水补局仅为辅助参考，配合个人努力方为正道
      </div>
    </div>
  );
}
