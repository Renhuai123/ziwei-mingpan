'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ZiweiChart, Palace, Star } from '@/lib/ziwei/types';
import { BRANCHES, STEMS } from '@/lib/ziwei/constants';
import PalaceCell from './PalaceCell';

interface ChartBoardProps {
  chart: ZiweiChart;
  onStarSelect?: (star: Star, palace: Palace) => void;
}

const BRANCH_GRID_POS: Record<number, [number, number]> = {
  5: [1, 1], 6: [1, 2], 7: [1, 3], 8: [1, 4],
  4: [2, 1], 9: [2, 4],
  3: [3, 1], 10: [3, 4],
  2: [4, 1], 1: [4, 2], 0: [4, 3], 11: [4, 4],
};

// 每个地支宫位在 SVG 中的中心坐标（百分比）
const BRANCH_SVG_POS: Record<number, [number, number]> = {
  5: [12.5, 12.5], 6: [37.5, 12.5], 7: [62.5, 12.5], 8: [87.5, 12.5],
  4: [12.5, 37.5],                                      9: [87.5, 37.5],
  3: [12.5, 62.5],                                     10: [87.5, 62.5],
  2: [12.5, 87.5], 1: [37.5, 87.5], 0: [62.5, 87.5], 11: [87.5, 87.5],
};

/** 三方四正：本宫 + 对宫 + 两个三合宫 */
function getSanFangSiZheng(branch: number): [number, number, number, number] {
  return [
    branch,
    (branch + 6) % 12,   // 对宫
    (branch + 4) % 12,   // 三合1
    (branch + 8) % 12,   // 三合2
  ];
}

const ANIMATION_ORDER = [5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4];

export default function ChartBoard({ chart, onStarSelect }: ChartBoardProps) {
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);

  const palaceMap: Record<number, Palace> = {};
  chart.palaces.forEach(p => { palaceMap[p.branch] = p; });

  const handlePalaceClick = (branch: number) => {
    setSelectedBranch(prev => prev === branch ? null : branch);
  };

  // 三方四正宫位集合
  const sanFangBranches = selectedBranch !== null ? getSanFangSiZheng(selectedBranch) : null;
  const sanFangSet = sanFangBranches ? new Set(sanFangBranches) : null;

  return (
    <div className="w-full select-none">
      {/* 命盘标题 */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-3"
      >
        <div className="text-[10px] tracking-[0.5em] uppercase mb-1" style={{ color: 'var(--t-faint)' }}>
          Zi Wei Dou Shu
        </div>
        <h2 className="text-sm tracking-[0.25em] font-medium" style={{ color: 'var(--t-gold)' }}>
          {chart.birthInfo.name ? `${chart.birthInfo.name} · ` : ''}紫微斗数命盘
        </h2>
      </motion.div>

      {/* 网格 + SVG 叠加层容器 */}
      <div className="relative">
        {/* 4x4 命盘网格 */}
        <div
          className="grid rounded-xl overflow-hidden"
          style={{
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: 'repeat(4, auto)',
            gap: '1px',
            background: 'var(--t-border)',
            border: '1px solid var(--t-border)',
            boxShadow: '0 4px 32px rgba(0,0,0,0.15)',
          }}
        >
          {ANIMATION_ORDER.map((branch, i) => {
            const [row, col] = BRANCH_GRID_POS[branch];
            const palace = palaceMap[branch];
            if (!palace) return null;
            return (
              <div key={branch} style={{ gridRow: row, gridColumn: col, background: 'var(--t-bg)' }}>
                <PalaceCell
                  palace={palace}
                  onClick={() => handlePalaceClick(branch)}
                  onStarClick={(star) => onStarSelect?.(star, palace)}
                  isSelected={selectedBranch === branch}
                  isSanFang={!!(sanFangSet?.has(branch) && selectedBranch !== branch)}
                  delay={i * 0.04}
                />
              </div>
            );
          })}

          {/* 中央信息区 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center justify-center p-4 gap-3"
            style={{ gridRow: '2 / 4', gridColumn: '2 / 4', background: 'var(--t-bg)' }}
          >
            <div className="text-5xl select-none leading-none" style={{ color: 'var(--t-gold)', opacity: 0.12, filter: 'drop-shadow(0 0 12px rgba(180,120,30,0.15))' }}>
              ☯
            </div>

            <div className="text-center space-y-1">
              <div className="text-[9px] tracking-[0.3em] font-medium" style={{ color: 'var(--t-gold)' }}>紫微斗数</div>
              <div className="text-[10px] space-y-0.5" style={{ color: 'var(--t-faint)' }}>
                <div>命宫 <span style={{ color: 'var(--t-gold)', opacity: 0.7 }}>{BRANCHES[chart.mingGongBranch]}</span></div>
                <div>身宫 <span className="text-sky-500/70">{BRANCHES[chart.shenGongBranch]}</span></div>
                <div className="text-[9px]" style={{ color: 'var(--t-gold)', opacity: 0.75 }}>{chart.wuxingJuName}</div>
              </div>
            </div>

            {chart.currentDaXianIndex >= 0 && (() => {
              const dx = chart.daXians[chart.currentDaXianIndex];
              return (
                <div className="border border-purple-500/30 rounded-lg px-3 py-1.5 text-center"
                  style={{ background: 'rgba(147,51,234,0.06)' }}>
                  <div className="text-[8px] text-purple-500/80 mb-0.5 tracking-wider">当前大限</div>
                  <div className="text-[12px] text-purple-400 font-medium tabular-nums">{dx.startAge}–{dx.endAge}岁</div>
                  <div className="text-[9px] text-purple-500/60">{dx.palaceName}</div>
                </div>
              );
            })()}

            <div className="text-[8px] text-center leading-relaxed font-mono" style={{ color: 'var(--t-faint)', opacity: 0.75 }}>
              {chart.lunarInfo.lunarYear}·{chart.lunarInfo.isLeapMonth ? '闰' : ''}
              {chart.lunarInfo.lunarMonth}·{chart.lunarInfo.lunarDay}
            </div>
          </motion.div>
        </div>

        {/* ── 三方四正 SVG 连线叠加层 ── */}
        <AnimatePresence>
          {sanFangBranches && (
            <motion.svg
              key={selectedBranch}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 10 }}
            >
              {(() => {
                const [selB, oppB, tri1B, tri2B] = sanFangBranches;
                const sel = BRANCH_SVG_POS[selB];
                const opp = BRANCH_SVG_POS[oppB];
                const tri1 = BRANCH_SVG_POS[tri1B];
                const tri2 = BRANCH_SVG_POS[tri2B];
                return (
                  <>
                    {/* 连线：本宫 ↔ 对宫 */}
                    <line
                      x1={`${sel[0]}%`} y1={`${sel[1]}%`}
                      x2={`${opp[0]}%`} y2={`${opp[1]}%`}
                      stroke="rgba(212,168,67,0.45)"
                      strokeWidth="1.5"
                      strokeDasharray="8 5"
                      strokeLinecap="round"
                    />
                    {/* 连线：三合1 ↔ 三合2 */}
                    <line
                      x1={`${tri1[0]}%`} y1={`${tri1[1]}%`}
                      x2={`${tri2[0]}%`} y2={`${tri2[1]}%`}
                      stroke="rgba(212,168,67,0.45)"
                      strokeWidth="1.5"
                      strokeDasharray="8 5"
                      strokeLinecap="round"
                    />
                    {/* 交汇点（中心）高亮 */}
                    <circle
                      cx="50%" cy="50%" r="3"
                      fill="rgba(212,168,67,0.35)"
                    />
                    {/* 四个宫位端点圆 */}
                    {[sel, opp, tri1, tri2].map(([x, y], i) => (
                      <circle
                        key={i}
                        cx={`${x}%`} cy={`${y}%`}
                        r="4"
                        fill="none"
                        stroke="rgba(212,168,67,0.55)"
                        strokeWidth="1.5"
                      />
                    ))}
                    {/* 选中宫位的实心圆 */}
                    <circle
                      cx={`${sel[0]}%`} cy={`${sel[1]}%`}
                      r="3"
                      fill="rgba(212,168,67,0.6)"
                    />
                  </>
                );
              })()}
            </motion.svg>
          )}
        </AnimatePresence>
      </div>

      {/* 图例 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-3 flex items-center justify-center gap-2 text-[9px] flex-wrap"
      >
        {[
          { h: '化禄', c: 'text-emerald-500 border-emerald-500/30' },
          { h: '化权', c: 'text-blue-500 border-blue-500/30' },
          { h: '化科', c: 'text-yellow-500 border-yellow-500/30' },
          { h: '化忌', c: 'text-red-500 border-red-500/30' },
        ].map(({ h, c }) => (
          <span key={h} className={`border px-1.5 py-0.5 rounded-full font-medium ${c}`}>{h}</span>
        ))}
        <span className="px-1.5 py-0.5 rounded-full" style={{ color: 'var(--t-faint)', border: '1px solid var(--t-border)' }}>
          点击宫位看三方四正
        </span>
      </motion.div>
    </div>
  );
}
