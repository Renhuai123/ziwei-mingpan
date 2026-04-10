'use client';
import { useRouter } from 'next/navigation';
import type { ZiweiChart } from '@/lib/ziwei/types';

export type TimeView = 'mingpan' | 'daxian' | 'liunian' | 'liuyue';

interface TopBarProps {
  chart: ZiweiChart;
  view: TimeView;
  liunianYear: number;
  liuyueMonth: number;
  onViewChange: (v: TimeView) => void;
  onYearChange: (y: number) => void;
  onMonthChange: (m: number) => void;
  onShare?: () => void;
  onExport?: () => void;
  copied?: boolean;
}

export default function TopBar({
  chart, view, liunianYear, liuyueMonth,
  onViewChange, onYearChange, onMonthChange,
  onShare, onExport, copied,
}: TopBarProps) {
  const router = useRouter();
  const dx = chart.daXians[chart.currentDaXianIndex];

  const tabs: { key: TimeView; label: string }[] = [
    { key: 'mingpan', label: '本命' },
    { key: 'daxian',  label: dx ? `大限 ${dx.startAge}–${dx.endAge}` : '大限' },
    { key: 'liunian', label: '流年' },
    { key: 'liuyue',  label: '流月' },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(250,250,249,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--bdr)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        height: '52px',
        gap: '16px',
      }}
    >
      {/* 返回 */}
      <button
        onClick={() => router.push('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '13px',
          color: 'var(--tx-3)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 0',
          flexShrink: 0,
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--tx-1)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--tx-3)'; }}
      >
        <span style={{ fontSize: '16px' }}>‹</span>
        <span>返回</span>
      </button>

      <div style={{ width: '1px', height: '20px', background: 'var(--bdr-med)' }} />

      {/* 时间维度 Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => onViewChange(tab.key)}
            style={{
              padding: '5px 14px',
              borderRadius: 'var(--r-pill)',
              fontSize: '12px',
              fontWeight: view === tab.key ? 500 : 400,
              color: view === tab.key ? 'var(--tx-0)' : 'var(--tx-3)',
              background: view === tab.key ? 'white' : 'transparent',
              border: view === tab.key ? '1px solid var(--bdr-med)' : '1px solid transparent',
              cursor: 'pointer',
              boxShadow: view === tab.key ? 'var(--sh-xs)' : 'none',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}

        {/* 流年年份控制 */}
        {(view === 'liunian' || view === 'liuyue') && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              marginLeft: '4px',
              background: 'white',
              border: '1px solid var(--bdr-med)',
              borderRadius: 'var(--r-pill)',
              padding: '3px 8px',
              boxShadow: 'var(--sh-xs)',
            }}
          >
            <button
              onClick={() => onYearChange(liunianYear - 1)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--tx-3)', fontSize: '14px', padding: '0 4px', lineHeight: 1 }}
            >‹</button>
            <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--tx-0)', minWidth: '36px', textAlign: 'center', fontWeight: 500 }}>
              {liunianYear}
            </span>
            <button
              onClick={() => onYearChange(liunianYear + 1)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--tx-3)', fontSize: '14px', padding: '0 4px', lineHeight: 1 }}
            >›</button>
          </div>
        )}

        {/* 流月控制 */}
        {view === 'liuyue' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              background: 'white',
              border: '1px solid var(--bdr-med)',
              borderRadius: 'var(--r-pill)',
              padding: '3px 8px',
              boxShadow: 'var(--sh-xs)',
            }}
          >
            <button
              onClick={() => onMonthChange(liuyueMonth <= 1 ? 12 : liuyueMonth - 1)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--tx-3)', fontSize: '14px', padding: '0 4px', lineHeight: 1 }}
            >‹</button>
            <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--tx-0)', minWidth: '28px', textAlign: 'center', fontWeight: 500 }}>
              {liuyueMonth}月
            </span>
            <button
              onClick={() => onMonthChange(liuyueMonth >= 12 ? 1 : liuyueMonth + 1)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--tx-3)', fontSize: '14px', padding: '0 4px', lineHeight: 1 }}
            >›</button>
          </div>
        )}
      </div>

      {/* 右侧工具栏 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {onShare && (
          <button
            onClick={onShare}
            style={{
              padding: '5px 14px',
              borderRadius: 'var(--r-pill)',
              border: '1px solid var(--bdr-med)',
              background: copied ? 'rgba(45,122,74,0.07)' : 'transparent',
              color: copied ? 'var(--lu)' : 'var(--tx-3)',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {copied ? '已复制 ✓' : '分享'}
          </button>
        )}
        {onExport && (
          <button
            onClick={onExport}
            style={{
              padding: '5px 14px',
              borderRadius: 'var(--r-pill)',
              border: '1px solid var(--bdr-med)',
              background: 'transparent',
              color: 'var(--tx-3)',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            导出
          </button>
        )}
      </div>
    </header>
  );
}
