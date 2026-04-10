'use client';
import { useState } from 'react';
import type { ZiweiChart, Palace, Star } from '@/lib/ziwei/types';
import { BRANCHES, STEMS, SI_HUA_TABLE } from '@/lib/ziwei/constants';
import PalaceCell from './PalaceCell';

// 4×4 网格位置映射（地支 → [row, col]，1-indexed）
const BRANCH_GRID_POS: Record<number, [number, number]> = {
  5: [1, 1], 6: [1, 2], 7: [1, 3], 8: [1, 4],
  4: [2, 1],                                    9: [2, 4],
  3: [3, 1],                                   10: [3, 4],
  2: [4, 1], 1: [4, 2], 0: [4, 3],            11: [4, 4],
};

// SVG 百分比坐标（用于连线）
const BRANCH_SVG_POS: Record<number, [number, number]> = {
  5: [12.5, 12.5], 6: [37.5, 12.5], 7: [62.5, 12.5], 8: [87.5, 12.5],
  4: [12.5, 37.5],                                      9: [87.5, 37.5],
  3: [12.5, 62.5],                                     10: [87.5, 62.5],
  2: [12.5, 87.5], 1: [37.5, 87.5], 0: [62.5, 87.5], 11: [87.5, 87.5],
};

// 绘制顺序
const RENDER_ORDER = [5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4];

function getSanFang(branch: number): [number, number, number, number] {
  return [branch, (branch + 6) % 12, (branch + 4) % 12, (branch + 8) % 12];
}

function getYearStemIndex(year: number) {
  return ((year - 4) % 10 + 10) % 10;
}

function buildOverlay(stemIndex: number): Record<string, string> {
  const stars = SI_HUA_TABLE[stemIndex];
  if (!stars) return {};
  return { [stars[0]]: '禄', [stars[1]]: '权', [stars[2]]: '科', [stars[3]]: '忌' };
}

export type TimeView = 'mingpan' | 'daxian' | 'liunian' | 'liuyue';

interface ChartBoardProps {
  chart: ZiweiChart;
  view: TimeView;
  liunianYear: number;
  onStarClick?: (star: Star, palace: Palace) => void;
  onPalaceClick?: (palace: Palace) => void;
  onSiHuaBadgeClick?: (starName: string, siHua: string) => void;
}

export default function ChartBoard({
  chart, view, liunianYear,
  onStarClick, onPalaceClick, onSiHuaBadgeClick,
}: ChartBoardProps) {
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);

  const palaceMap: Record<number, Palace> = {};
  chart.palaces.forEach(p => { palaceMap[p.branch] = p; });

  const currentDx = chart.daXians[chart.currentDaXianIndex];

  // 叠加四化数据
  const overlayData: Record<string, string> = (() => {
    if (view === 'daxian' && currentDx) {
      const dxPalace = chart.palaces.find(p => p.branch === currentDx.palaceBranch);
      if (dxPalace) return buildOverlay(dxPalace.stem);
    }
    if (view === 'liunian' || view === 'liuyue') {
      return buildOverlay(getYearStemIndex(liunianYear));
    }
    return {};
  })();
  const overlayLabel = view === 'daxian' ? '限' : (view === 'liunian' || view === 'liuyue') ? '年' : undefined;
  const hasOverlay = Object.keys(overlayData).length > 0;

  const sanFangBranches = selectedBranch !== null ? getSanFang(selectedBranch) : null;
  const sanFangSet = sanFangBranches ? new Set(sanFangBranches) : null;

  const handlePalaceClick = (branch: number) => {
    const isDeselect = selectedBranch === branch;
    setSelectedBranch(isDeselect ? null : branch);
    if (!isDeselect) {
      const palace = palaceMap[branch];
      if (palace) onPalaceClick?.(palace);
    }
  };

  return (
    <div style={{ userSelect: 'none' }}>
      {/* 命盘标题 */}
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.4em', color: 'var(--tx-3)', marginBottom: '4px' }}>
          Zi Wei Dou Shu
        </div>
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--tx-0)', letterSpacing: '0.08em' }}>
          {chart.birthInfo.name ? `${chart.birthInfo.name} · ` : ''}紫薇命盘
        </h2>
      </div>

      {/* 4×4 命盘网格 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(4, auto)',
          border: '1px solid var(--bdr-med)',
          borderRadius: 'var(--r-md)',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: 'var(--sh-sm)',
        }}
      >
        {RENDER_ORDER.map(branch => {
          const [row, col] = BRANCH_GRID_POS[branch];
          const palace = palaceMap[branch];
          if (!palace) return null;
          return (
            <div key={branch} style={{ gridRow: row, gridColumn: col }}>
              <PalaceCell
                palace={palace}
                isSelected={selectedBranch === branch}
                isSanFang={!!(sanFangSet?.has(branch) && selectedBranch !== branch)}
                overlayStarSiHua={hasOverlay ? overlayData : undefined}
                overlayLabel={overlayLabel}
                onClick={() => handlePalaceClick(branch)}
                onStarClick={star => onStarClick?.(star, palace)}
                onSiHuaBadgeClick={onSiHuaBadgeClick}
              />
            </div>
          );
        })}

        {/* 中央信息区 */}
        <div
          style={{
            gridRow: '2 / 4',
            gridColumn: '2 / 4',
            background: 'var(--bg-0)',
            borderLeft: '1px solid var(--bdr)',
            borderRight: '1px solid var(--bdr)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '16px',
          }}
        >
          <div style={{ fontSize: '28px', color: 'var(--ac)', opacity: 0.15, lineHeight: 1 }}>☯</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.2em', color: 'var(--ac)', opacity: 0.6, marginBottom: '4px' }}>
              紫薇斗数
            </div>
            <div style={{ fontSize: '10px', color: 'var(--tx-2)', lineHeight: 1.7 }}>
              <div>命宫 <span style={{ color: 'var(--ac)', fontWeight: 500 }}>{BRANCHES[chart.mingGongBranch]}</span></div>
              <div>身宫 <span style={{ color: 'var(--quan)', fontWeight: 500 }}>{BRANCHES[chart.shenGongBranch]}</span></div>
              <div style={{ fontSize: '9px', color: 'var(--tx-3)', marginTop: '2px' }}>{chart.wuxingJuName}</div>
            </div>
          </div>
          {currentDx && (
            <div
              style={{
                border: '1px solid var(--ac-bdr)',
                borderRadius: 'var(--r-sm)',
                padding: '6px 12px',
                textAlign: 'center',
                background: 'var(--ac-bg)',
              }}
            >
              <div style={{ fontSize: '8px', color: 'var(--ac)', opacity: 0.7, letterSpacing: '0.06em', marginBottom: '2px' }}>当前大限</div>
              <div style={{ fontSize: '13px', color: 'var(--ac-dim)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                {currentDx.startAge}–{currentDx.endAge}岁
              </div>
              <div style={{ fontSize: '9px', color: 'var(--ac)', opacity: 0.6 }}>{currentDx.palaceName}</div>
            </div>
          )}
          <div style={{ fontSize: '8px', color: 'var(--tx-3)', textAlign: 'center', fontFamily: 'var(--font-mono)', lineHeight: 1.6 }}>
            {chart.lunarInfo.lunarYear}·
            {chart.lunarInfo.isLeapMonth ? '闰' : ''}
            {chart.lunarInfo.lunarMonth}月·
            {chart.lunarInfo.lunarDay}日
          </div>
        </div>

        {/* 三方四正 SVG 连线层 */}
        {sanFangBranches && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              {(() => {
                const [b0, b1, b2, b3] = sanFangBranches;
                const p0 = BRANCH_SVG_POS[b0];
                const p1 = BRANCH_SVG_POS[b1];
                const p2 = BRANCH_SVG_POS[b2];
                const p3 = BRANCH_SVG_POS[b3];
                const stroke = 'rgba(26,86,168,0.45)';
                const dash = '5,4';
                const sw = '1.5';
                return (
                  <>
                    <line x1={`${p0[0]}%`} y1={`${p0[1]}%`} x2={`${p1[0]}%`} y2={`${p1[1]}%`} stroke={stroke} strokeWidth={sw} strokeDasharray={dash} strokeLinecap="round" />
                    <line x1={`${p0[0]}%`} y1={`${p0[1]}%`} x2={`${p2[0]}%`} y2={`${p2[1]}%`} stroke={stroke} strokeWidth={sw} strokeDasharray={dash} strokeLinecap="round" />
                    <line x1={`${p2[0]}%`} y1={`${p2[1]}%`} x2={`${p3[0]}%`} y2={`${p3[1]}%`} stroke={stroke} strokeWidth={sw} strokeDasharray={dash} strokeLinecap="round" />
                    <line x1={`${p3[0]}%`} y1={`${p3[1]}%`} x2={`${p0[0]}%`} y2={`${p0[1]}%`} stroke={stroke} strokeWidth={sw} strokeDasharray={dash} strokeLinecap="round" />
                    {[p0, p1, p2, p3].map((p, i) => (
                      <circle key={i} cx={`${p[0]}%`} cy={`${p[1]}%`} r="3" fill={i === 0 ? 'rgba(26,86,168,0.75)' : 'rgba(26,86,168,0.35)'} />
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>
        )}
      </div>

      {/* 图例 */}
      <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
        {[
          { label: '化禄', c: 'var(--lu)' },
          { label: '化权', c: 'var(--quan)' },
          { label: '化科', c: 'var(--ke)' },
          { label: '化忌', c: 'var(--ji)' },
        ].map(({ label, c }) => (
          <span key={label} style={{ fontSize: '10px', color: c, display: 'flex', alignItems: 'center', gap: '3px' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: c, display: 'inline-block' }} />
            {label}
          </span>
        ))}
        <span style={{ fontSize: '10px', color: 'var(--tx-3)' }}>· 点击宫位查看三方四正</span>
      </div>
    </div>
  );
}
