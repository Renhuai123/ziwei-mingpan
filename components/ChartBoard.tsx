'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ZiweiChart, Palace, Star } from '@/lib/ziwei/types';
import { BRANCHES, STEMS } from '@/lib/ziwei/constants';
import PalaceCell from './PalaceCell';

interface ChartBoardProps {
  chart: ZiweiChart;
  onStarSelect?: (star: Star, palace: Palace) => void;
}

// 地支 → 命盘格子位置 [row, col] (1-indexed)
const BRANCH_GRID_POS: Record<number, [number, number]> = {
  5:  [1, 1], // 巳
  6:  [1, 2], // 午
  7:  [1, 3], // 未
  8:  [1, 4], // 申
  4:  [2, 1], // 辰
  9:  [2, 4], // 酉
  3:  [3, 1], // 卯
  10: [3, 4], // 戌
  2:  [4, 1], // 寅
  1:  [4, 2], // 丑
  0:  [4, 3], // 子
  11: [4, 4], // 亥
};

// 逆时针外圈顺序（用于动画延迟）
const ANIMATION_ORDER = [5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4];

export default function ChartBoard({ chart, onStarSelect }: ChartBoardProps) {
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);

  const palaceMap: Record<number, Palace> = {};
  chart.palaces.forEach(p => { palaceMap[p.branch] = p; });

  const handlePalaceClick = (branch: number) => {
    setSelectedBranch(prev => prev === branch ? null : branch);
  };

  return (
    <div className="w-full select-none">
      {/* 命盘标题 */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-2"
      >
        <div className="text-[10px] tracking-[0.5em] text-[#2a4060] uppercase mb-0.5">
          Zi Wei Dou Shu
        </div>
        <h2 className="text-amber-400/90 text-sm tracking-[0.25em] font-medium">
          {chart.birthInfo.name ? `${chart.birthInfo.name} · ` : ''}紫微斗数命盘
        </h2>
      </motion.div>

      {/* 4×4 命盘网格 */}
      <div
        className="grid border border-[#0f2240]/60 rounded overflow-hidden shadow-[0_0_40px_rgba(0,30,80,0.4)]"
        style={{
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(4, auto)',
          gap: '1px',
          background: '#0a1628',
        }}
      >
        {/* 十二宫 */}
        {ANIMATION_ORDER.map((branch, i) => {
          const [row, col] = BRANCH_GRID_POS[branch];
          const palace = palaceMap[branch];
          if (!palace) return null;
          return (
            <div key={branch} style={{ gridRow: row, gridColumn: col }}>
              <PalaceCell
                palace={palace}
                onClick={() => handlePalaceClick(branch)}
                onStarClick={(star) => onStarSelect?.(star, palace)}
                isSelected={selectedBranch === branch}
                delay={i * 0.04}
              />
            </div>
          );
        })}

        {/* 中央信息区 (row 2-3, col 2-3) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-[#030810] flex flex-col items-center justify-center p-3 gap-2.5"
          style={{ gridRow: '2 / 4', gridColumn: '2 / 4' }}
        >
          {/* 装饰符号 */}
          <div
            className="text-5xl text-amber-900/20 select-none leading-none"
            style={{ filter: 'drop-shadow(0 0 12px rgba(180,120,30,0.15))' }}
          >
            ☯
          </div>

          {/* 命宫身宫 */}
          <div className="text-center space-y-0.5">
            <div className="text-[9px] text-amber-400/90 tracking-[0.3em] font-medium">
              紫微斗数
            </div>
            <div className="text-[10px] text-[#2a5070] space-y-0.5">
              <div>
                命宫 <span className="text-amber-600/60">{BRANCHES[chart.mingGongBranch]}</span>
              </div>
              <div>
                身宫 <span className="text-sky-700/60">{BRANCHES[chart.shenGongBranch]}</span>
              </div>
              <div className="text-amber-800/50 text-[9px]">{chart.wuxingJuName}</div>
            </div>
          </div>

          {/* 当前大限 */}
          {chart.currentDaXianIndex >= 0 && (() => {
            const dx = chart.daXians[chart.currentDaXianIndex];
            return (
              <div className="border border-purple-800/30 rounded px-3 py-1.5 bg-purple-950/20 text-center">
                <div className="text-[8px] text-purple-600 mb-0.5 tracking-wider">当前大限</div>
                <div className="text-[12px] text-purple-300 font-medium tabular-nums">
                  {dx.startAge}–{dx.endAge}岁
                </div>
                <div className="text-[9px] text-purple-500/70">{dx.palaceName}</div>
              </div>
            );
          })()}

          {/* 农历 */}
          <div className="text-[8px] text-[#0f2035] text-center leading-relaxed font-mono">
            {chart.lunarInfo.lunarYear}·{chart.lunarInfo.isLeapMonth ? '闰' : ''}
            {chart.lunarInfo.lunarMonth}·{chart.lunarInfo.lunarDay}
          </div>
        </motion.div>
      </div>

      {/* 四化图例 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-2 flex items-center justify-center gap-3 text-[9px]"
      >
        {[
          { h: '化禄', c: 'text-emerald-500 border-emerald-800/40' },
          { h: '化权', c: 'text-blue-500 border-blue-800/40' },
          { h: '化科', c: 'text-yellow-500 border-yellow-800/40' },
          { h: '化忌', c: 'text-red-600 border-red-900/40' },
        ].map(({ h, c }) => (
          <span key={h} className={`border px-1.5 py-0.5 rounded font-medium ${c}`}>
            {h}
          </span>
        ))}
        <span className="text-[#1a3050] border border-[#0a1a2e] px-1.5 py-0.5 rounded">
          点击主星查看详解
        </span>
      </motion.div>
    </div>
  );
}
