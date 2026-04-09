'use client';
import { motion } from 'framer-motion';
import type { ZiweiChart } from '@/lib/ziwei/types';
import { BRANCHES, STEMS } from '@/lib/ziwei/constants';
import { detectPatterns, getMingGongSummary } from '@/lib/ziwei/patterns';

interface ChartSummaryProps {
  chart: ZiweiChart;
}

const PatternLevelStyle = {
  excellent: {
    border: 'border-amber-600/40',
    bg: 'bg-amber-950/20',
    dot: 'bg-amber-400',
    label: 'text-amber-400',
    badge: 'text-amber-400 bg-amber-900/30 border-amber-700/40',
  },
  good: {
    border: 'border-sky-700/30',
    bg: 'bg-sky-950/15',
    dot: 'bg-sky-400',
    label: 'text-sky-400',
    badge: 'text-sky-400 bg-sky-900/30 border-sky-700/40',
  },
  neutral: {
    border: 'border-slate-700/30',
    bg: 'bg-slate-900/10',
    dot: 'bg-slate-400',
    label: 'text-slate-400',
    badge: 'text-slate-400 bg-slate-900/30 border-slate-700/40',
  },
  caution: {
    border: 'border-orange-800/30',
    bg: 'bg-orange-950/15',
    dot: 'bg-orange-500',
    label: 'text-orange-400',
    badge: 'text-orange-400 bg-orange-900/30 border-orange-700/40',
  },
};

export default function ChartSummary({ chart }: ChartSummaryProps) {
  const patterns = detectPatterns(chart);
  const { stars: mingStars, keywords, nature } = getMingGongSummary(chart);
  const currentDx = chart.daXians[chart.currentDaXianIndex];

  // 四化汇总
  const siHuaSummary: { name: string; siHua: string; palaceName: string }[] = [];
  for (const palace of chart.palaces) {
    for (const star of palace.stars) {
      if (star.siHua) {
        siHuaSummary.push({ name: star.name, siHua: star.siHua, palaceName: palace.name });
      }
    }
  }
  // 排序: 禄权科忌
  const siHuaOrder = ['禄', '权', '科', '忌'];
  siHuaSummary.sort((a, b) => siHuaOrder.indexOf(a.siHua) - siHuaOrder.indexOf(b.siHua));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="space-y-3"
    >
      {/* 命格总览 */}
      <div className="border border-[#0f2240]/80 rounded-lg p-4 bg-[#060c1a]">
        <div className="text-[10px] text-[#2a4060] tracking-widest mb-3 flex items-center gap-2">
          <span className="text-amber-700/60">✦</span>
          命格总览
        </div>
        <div className="flex flex-wrap items-start gap-3">
          {/* 命宫主星 */}
          <div>
            <div className="text-[9px] text-[#1a3050] mb-1">命宫主星</div>
            <div className="flex items-center gap-1">
              {mingStars.length > 0 ? (
                mingStars.map(s => (
                  <span key={s} className="text-amber-300 font-bold text-base">{s}</span>
                ))
              ) : (
                <span className="text-[#2a4060] text-sm">空宫</span>
              )}
            </div>
            {nature && (
              <div className="text-[10px] text-amber-700/60 mt-0.5">{nature}</div>
            )}
          </div>

          {/* 关键词 */}
          {keywords.length > 0 && (
            <div>
              <div className="text-[9px] text-[#1a3050] mb-1">性格特质</div>
              <div className="flex flex-wrap gap-1">
                {keywords.map(k => (
                  <span key={k} className="text-[10px] text-amber-500/60 border border-amber-900/30 px-1.5 py-px rounded">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 基本信息 */}
          <div className="ml-auto text-right">
            <div className="text-[9px] text-[#1a3050] mb-1">五行局 · 当前大限</div>
            <div className="text-[11px] text-[#3a6080]">{chart.wuxingJuName}</div>
            {currentDx && (
              <div className="text-[11px] text-purple-400 mt-0.5">
                {currentDx.startAge}~{currentDx.endAge}岁 · {currentDx.palaceName}
              </div>
            )}
          </div>
        </div>

        {/* 出生信息条 */}
        <div className="mt-3 pt-3 border-t border-[#0a1a2e] flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-[#1e3550]">
          <span>
            公历 {chart.birthInfo.year}·{chart.birthInfo.month}·{chart.birthInfo.day}
          </span>
          <span>
            农历 {chart.lunarInfo.lunarYear}年
            {chart.lunarInfo.isLeapMonth ? '闰' : ''}
            {chart.lunarInfo.lunarMonth}月
            {chart.lunarInfo.lunarDay}日
          </span>
          <span>
            {STEMS[chart.lunarInfo.yearStem]}{BRANCHES[chart.lunarInfo.yearBranch]}年 ·{' '}
            {BRANCHES[chart.birthInfo.hour]}时
          </span>
          <span>
            命宫{BRANCHES[chart.mingGongBranch]} · 身宫{BRANCHES[chart.shenGongBranch]}
          </span>
        </div>
      </div>

      {/* 本命四化 */}
      {siHuaSummary.length > 0 && (
        <div className="border border-[#0f2240]/60 rounded-lg p-3 bg-[#060c1a]">
          <div className="text-[10px] text-[#2a4060] tracking-widest mb-2.5 flex items-center gap-2">
            <span className="text-amber-700/60">◆</span>
            本命四化
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {siHuaSummary.map(({ name, siHua, palaceName }) => {
              const colors = {
                '禄': 'text-emerald-400 border-emerald-900/30 bg-emerald-950/20',
                '权': 'text-blue-400 border-blue-900/30 bg-blue-950/20',
                '科': 'text-yellow-400 border-yellow-900/30 bg-yellow-950/20',
                '忌': 'text-red-400 border-red-900/30 bg-red-950/20',
              };
              return (
                <div key={name + siHua} className={`flex items-center justify-between px-2 py-1.5 border rounded text-[10px] ${colors[siHua as keyof typeof colors]}`}>
                  <span className="font-medium">{name}</span>
                  <div className="flex items-center gap-1 text-right">
                    <span className="opacity-60 text-[9px]">{palaceName.replace('宫', '')}</span>
                    <span className="font-bold">化{siHua}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 格局识别 */}
      {patterns.length > 0 && (
        <div className="border border-[#0f2240]/60 rounded-lg p-3 bg-[#060c1a]">
          <div className="text-[10px] text-[#2a4060] tracking-widest mb-2.5 flex items-center gap-2">
            <span className="text-amber-700/60">◉</span>
            格局识别
            <span className="text-[9px] text-[#1a3050] ml-auto">{patterns.length}个格局</span>
          </div>
          <div className="space-y-2">
            {patterns.map((p, i) => {
              const style = PatternLevelStyle[p.level];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.08 }}
                  className={`border rounded p-2.5 ${style.border} ${style.bg}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.dot}`} />
                    <span className={`text-[11px] font-medium ${style.label}`}>{p.name}</span>
                    <div className="flex gap-1 ml-auto">
                      {p.palaces.slice(0, 2).map(pa => (
                        <span key={pa} className={`text-[8px] px-1 py-px rounded border ${style.badge}`}>
                          {pa.replace('宫', '')}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed pl-3.5">
                    {p.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* 大限流年表 */}
      <div className="border border-[#0f2240]/60 rounded-lg p-3 bg-[#060c1a]">
        <div className="text-[10px] text-[#2a4060] tracking-widest mb-2.5 flex items-center gap-2">
          <span className="text-purple-700/60">◎</span>
          大限运程
        </div>
        <div className="grid grid-cols-3 gap-1">
          {chart.daXians.slice(0, 9).map((dx, i) => (
            <div
              key={i}
              className={`text-[10px] px-2 py-1.5 rounded border text-center transition-colors ${
                i === chart.currentDaXianIndex
                  ? 'border-purple-600/50 bg-purple-950/30 text-purple-300'
                  : 'border-[#0a1a2e] text-[#1e3550] hover:border-[#1a3060]'
              }`}
            >
              <div className="font-mono tabular-nums">{dx.startAge}~{dx.endAge}</div>
              <div className="text-[9px] mt-0.5 opacity-80">{dx.palaceName.replace('宫', '')}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
