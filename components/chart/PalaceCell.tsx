import type { Palace, Star } from '@/lib/ziwei/types';
import { STEMS, BRANCHES } from '@/lib/ziwei/constants';

interface PalaceCellProps {
  palace: Palace;
  isSelected?: boolean;
  isSanFang?: boolean;
  isOpaque?: boolean;
  overlayStarSiHua?: Record<string, string>;
  overlayLabel?: string;
  onClick?: () => void;
  onStarClick?: (star: Star) => void;
  onSiHuaBadgeClick?: (starName: string, siHua: string) => void;
}

const SIHUA_STYLES: Record<string, React.CSSProperties> = {
  '禄': { color: 'var(--lu)',   background: 'rgba(45,122,74,0.09)',  border: '1px solid rgba(45,122,74,0.22)' },
  '权': { color: 'var(--quan)', background: 'rgba(26,86,168,0.09)',  border: '1px solid rgba(26,86,168,0.22)' },
  '科': { color: 'var(--ke)',   background: 'rgba(138,112,24,0.09)', border: '1px solid rgba(138,112,24,0.22)' },
  '忌': { color: 'var(--ji)',   background: 'rgba(168,50,40,0.09)',  border: '1px solid rgba(168,50,40,0.22)' },
};

function SiHuaBadge({
  siHua,
  overlay,
  label,
  onClick,
}: {
  siHua: string;
  overlay?: boolean;
  label?: string;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <span
      onClick={onClick}
      style={{
        ...SIHUA_STYLES[siHua],
        fontSize: '9px',
        fontFamily: 'var(--font-mono)',
        fontWeight: 600,
        padding: '1px 4px',
        borderRadius: 'var(--r-xs)',
        borderStyle: overlay ? 'dashed' : 'solid',
        cursor: onClick ? 'pointer' : 'default',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '1px',
        opacity: overlay ? 0.85 : 1,
        flexShrink: 0,
      }}
    >
      {overlay && label && <span style={{ opacity: 0.6, fontSize: '8px' }}>{label}</span>}
      {siHua}
    </span>
  );
}

export default function PalaceCell({
  palace,
  isSelected,
  isSanFang,
  overlayStarSiHua,
  overlayLabel,
  onClick,
  onStarClick,
  onSiHuaBadgeClick,
}: PalaceCellProps) {
  const { branch, stem, name, stars, daXianAge, isCurrentDaXian, isMingGong, isShenGong } = palace;
  const ganzhi = `${STEMS[stem]}${BRANCHES[branch]}`;

  const majorStars = stars.filter(s => s.type === 'major');
  const luckyStars = stars.filter(s => s.type === 'lucky');
  const shaStars   = stars.filter(s => s.type === 'sha');

  let bg = 'white';
  let borderColor = 'var(--bdr)';
  let boxShadow = 'none';

  if (isSelected) {
    bg = 'rgba(184,146,42,0.05)';
    borderColor = 'var(--ac-bdr)';
    boxShadow = 'inset 0 0 0 1.5px var(--ac-bdr)';
  } else if (isSanFang) {
    bg = 'rgba(26,86,168,0.04)';
    borderColor = 'rgba(26,86,168,0.20)';
  } else if (isCurrentDaXian) {
    bg = 'rgba(138,112,24,0.04)';
  } else if (isMingGong) {
    bg = 'rgba(184,146,42,0.03)';
  }

  return (
    <div
      onClick={onClick}
      style={{
        background: bg,
        borderBottom: `1px solid ${borderColor}`,
        borderRight: `1px solid ${borderColor}`,
        boxShadow,
        padding: '8px 8px 6px',
        cursor: 'pointer',
        minHeight: '88px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        transition: 'background 0.15s ease',
        position: 'relative',
      }}
      onMouseEnter={e => {
        if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'var(--bg-1)';
      }}
      onMouseLeave={e => {
        if (!isSelected) (e.currentTarget as HTMLElement).style.background = bg;
      }}
    >
      {/* 大限年龄（右上角） */}
      {daXianAge && (
        <div
          style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            fontSize: '9px',
            fontFamily: 'var(--font-mono)',
            color: isCurrentDaXian ? 'var(--ac)' : 'var(--tx-3)',
            fontWeight: isCurrentDaXian ? 600 : 400,
          }}
        >
          {daXianAge[0]}–{daXianAge[1]}
        </div>
      )}

      {/* 宫名行 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', paddingRight: '28px' }}>
        <span
          style={{
            fontSize: '10px',
            fontWeight: 500,
            color: isMingGong ? 'var(--ac)' : isShenGong ? 'var(--quan)' : 'var(--tx-3)',
            letterSpacing: '0.02em',
          }}
        >
          {name}
        </span>
        {isMingGong && (
          <span
            style={{
              fontSize: '8px',
              color: 'var(--ac)',
              border: '1px solid var(--ac-bdr)',
              padding: '0 3px',
              borderRadius: 'var(--r-xs)',
              lineHeight: '1.6',
            }}
          >
            命
          </span>
        )}
        {isShenGong && (
          <span
            style={{
              fontSize: '8px',
              color: 'var(--quan)',
              border: '1px solid rgba(26,86,168,0.25)',
              padding: '0 3px',
              borderRadius: 'var(--r-xs)',
              lineHeight: '1.6',
            }}
          >
            身
          </span>
        )}
      </div>

      {/* 干支 */}
      <div
        style={{
          fontSize: '9px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--tx-3)',
          marginBottom: '2px',
          opacity: 0.7,
        }}
      >
        {ganzhi}
      </div>

      {/* 主星 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {majorStars.length === 0 && (
          <span style={{ fontSize: '10px', color: 'var(--tx-3)', opacity: 0.45, fontStyle: 'italic' }}>空宫</span>
        )}
        {majorStars.map(star => {
          const overlaySiHua = overlayStarSiHua?.[star.name];
          const brightnessColor =
            star.brightness === 'bright' ? '#9A6210' :
            star.brightness === 'dim'    ? '#C8A870' :
            '#7A5218';
          return (
            <div key={star.name} style={{ display: 'flex', alignItems: 'center', gap: '3px', flexWrap: 'wrap' }}>
              <span
                onClick={e => { e.stopPropagation(); onStarClick?.(star); }}
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: brightnessColor,
                  cursor: 'pointer',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.3,
                  transition: 'opacity 0.12s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.75'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
              >
                {star.name}
              </span>
              {star.siHua && (
                <SiHuaBadge
                  siHua={star.siHua}
                  onClick={e => { e.stopPropagation(); onSiHuaBadgeClick?.(star.name, star.siHua!); }}
                />
              )}
              {overlaySiHua && (
                <SiHuaBadge
                  siHua={overlaySiHua}
                  overlay
                  label={overlayLabel}
                  onClick={e => { e.stopPropagation(); onSiHuaBadgeClick?.(star.name, overlaySiHua); }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 吉星 */}
      {luckyStars.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '1px' }}>
          {luckyStars.map(s => {
            const overlaySiHua = overlayStarSiHua?.[s.name];
            return (
              <span key={s.name} style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '9px', color: 'var(--quan)', opacity: 0.7 }}>
                {s.name}
                {s.siHua && <SiHuaBadge siHua={s.siHua} />}
                {overlaySiHua && <SiHuaBadge siHua={overlaySiHua} overlay label={overlayLabel} onClick={e => { e.stopPropagation(); onSiHuaBadgeClick?.(s.name, overlaySiHua); }} />}
              </span>
            );
          })}
        </div>
      )}

      {/* 煞星 */}
      {shaStars.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
          {shaStars.map(s => (
            <span key={s.name} style={{ fontSize: '9px', color: 'var(--ji)', opacity: 0.65 }}>{s.name}</span>
          ))}
        </div>
      )}
    </div>
  );
}
