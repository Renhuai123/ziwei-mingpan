'use client';
import { motion } from 'framer-motion';
import type { Palace, Star } from '@/lib/ziwei/types';
import { STEMS, BRANCHES } from '@/lib/ziwei/constants';
import clsx from 'clsx';

interface PalaceCellProps {
  palace: Palace;
  onClick?: () => void;
  onStarClick?: (star: Star) => void;
  isSelected?: boolean;
  delay?: number;
}

const SiHuaBadge = ({ siHua }: { siHua: string }) => {
  const styles: Record<string, string> = {
    '禄': 'text-emerald-400 bg-emerald-900/30 border-emerald-700/40',
    '权': 'text-blue-400 bg-blue-900/30 border-blue-700/40',
    '科': 'text-yellow-400 bg-yellow-900/30 border-yellow-700/40',
    '忌': 'text-red-400 bg-red-900/30 border-red-700/40',
  };
  return (
    <span className={clsx(
      'inline-flex items-center text-[8px] px-0.5 rounded border leading-none py-px font-medium ml-0.5 flex-shrink-0',
      styles[siHua]
    )}>
      {siHua}
    </span>
  );
};

export default function PalaceCell({
  palace, onClick, onStarClick, isSelected, delay = 0
}: PalaceCellProps) {
  const { branch, stem, name, stars, daXianAge, isCurrentDaXian, isMingGong, isShenGong } = palace;
  const ganzhi = `${STEMS[stem]}${BRANCHES[branch]}`;

  const majorStars = stars.filter(s => s.type === 'major');
  const luckyStars = stars.filter(s => s.type === 'lucky');
  const shaStars = stars.filter(s => s.type === 'sha');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      onClick={onClick}
      className={clsx(
        'relative flex flex-col p-1.5 cursor-pointer transition-all duration-200',
        'border',
        isCurrentDaXian
          ? 'bg-purple-950/40 border-purple-700/40 ring-1 ring-purple-600/30 ring-inset'
          : isSelected
          ? 'bg-amber-950/30 border-amber-600/50'
          : isMingGong
          ? 'bg-amber-950/20 border-amber-800/40 hover:border-amber-600/50'
          : 'bg-[#070e1c] border-[#0f2240]/60 hover:border-[#1a3a60]/80 hover:bg-[#090f1e]',
      )}
      style={{ minHeight: '90px' }}
    >
      {/* 大限年龄 — 右上角 */}
      {daXianAge && (
        <div className={clsx(
          'absolute top-1 right-1 text-[9px] font-mono tabular-nums',
          isCurrentDaXian ? 'text-purple-400' : 'text-[#1e3850]'
        )}>
          {daXianAge[0]}–{daXianAge[1]}
        </div>
      )}

      {/* 宫名行 */}
      <div className="flex items-center gap-0.5 mb-0.5 pr-8">
        <span className={clsx(
          'text-[10px] font-medium tracking-wide',
          isMingGong ? 'text-amber-400' : isShenGong ? 'text-sky-400' : 'text-[#2a5070]'
        )}>
          {name}
        </span>
        {isMingGong && (
          <span className="text-[7px] text-amber-400/70 border border-amber-700/40 px-0.5 rounded leading-tight">命</span>
        )}
        {isShenGong && (
          <span className="text-[7px] text-sky-400/70 border border-sky-700/40 px-0.5 rounded leading-tight">身</span>
        )}
      </div>

      {/* 干支 */}
      <div className="text-[9px] text-[#1a3050] font-mono mb-1">{ganzhi}</div>

      {/* 主星区域 */}
      <div className="flex flex-col gap-0.5 flex-1">
        {majorStars.length === 0 && (
          <span className="text-[10px] text-[#0f1e30] italic">空宫</span>
        )}
        {majorStars.map((star) => (
          <div
            key={star.name}
            className="flex items-center"
            onClick={e => { e.stopPropagation(); onStarClick?.(star); }}
          >
            <span className={clsx(
              'text-[13px] leading-tight font-bold tracking-tight cursor-pointer hover:brightness-125 transition-all',
              star.brightness === 'bright'
                ? 'text-amber-300'
                : star.brightness === 'dim'
                ? 'text-amber-700/80'
                : 'text-amber-400',
            )}>
              {star.name}
            </span>
            {star.siHua && <SiHuaBadge siHua={star.siHua} />}
          </div>
        ))}
      </div>

      {/* 吉星行 */}
      {luckyStars.length > 0 && (
        <div className="flex flex-wrap gap-x-1 mt-0.5">
          {luckyStars.map(s => (
            <span key={s.name} className="text-[9px] text-sky-600/80 leading-tight">
              {s.name}{s.siHua && <SiHuaBadge siHua={s.siHua} />}
            </span>
          ))}
        </div>
      )}

      {/* 煞星行 */}
      {shaStars.length > 0 && (
        <div className="flex flex-wrap gap-x-1">
          {shaStars.map(s => (
            <span key={s.name} className="text-[9px] text-red-700/70 leading-tight">
              {s.name}{s.siHua && <SiHuaBadge siHua={s.siHua} />}
            </span>
          ))}
        </div>
      )}

      {/* 选中高亮边框 */}
      {isSelected && (
        <motion.div
          layoutId="selected-border"
          className="absolute inset-0 border border-amber-500/50 rounded-sm pointer-events-none"
        />
      )}
    </motion.div>
  );
}
