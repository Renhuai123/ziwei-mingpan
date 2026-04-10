'use client';
import Link from 'next/link';

// 命盘示意图：静态简化版，品质感预览
function MiniChartPreview() {
  const cells = [
    { name: '疾厄', stars: '' },
    { name: '迁移', stars: '天梁' },
    { name: '交友', stars: '' },
    { name: '官禄', stars: '廉贞', hua: '禄' },
    { name: '田宅', stars: '太阳' },
    { name: '', stars: '' }, // center placeholder
    { name: '', stars: '' }, // center placeholder
    { name: '福德', stars: '紫微' },
    { name: '父母', stars: '' },
    { name: '', stars: '' }, // center placeholder
    { name: '', stars: '' }, // center placeholder
    { name: '命宫', stars: '天相' },
    { name: '兄弟', stars: '' },
    { name: '夫妻', stars: '七杀' },
    { name: '子女', stars: '贪狼' },
    { name: '财帛', stars: '武曲', hua: '科' },
  ];

  // 4×4 grid layout indices
  const gridLayout = [
    [0,  1,  2,  3 ],
    [4,  -1, -1, 7 ],
    [8,  -1, -1, 11],
    [12, 13, 14, 15],
  ];

  const huaColors: Record<string, string> = {
    '禄': '#2D7A4A',
    '权': '#1A56A8',
    '科': '#8A7018',
    '忌': '#A83228',
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(4, 1fr)',
        gap: '1px',
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.10)',
        width: '100%',
        aspectRatio: '1',
      }}
    >
      {gridLayout.map((row, ri) =>
        row.map((cellIdx, ci) => {
          if (cellIdx === -1) return null; // center cells handled below

          // Center 2×2
          if (ri === 1 && ci === 1) {
            return (
              <div
                key="center"
                style={{
                  gridRow: '2 / 4',
                  gridColumn: '2 / 4',
                  background: 'rgba(255,255,255,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  borderLeft: '1px solid rgba(255,255,255,0.06)',
                  borderRight: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div style={{ fontSize: '22px', color: 'rgba(184,146,42,0.30)', lineHeight: 1 }}>☯</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '9px', color: 'rgba(184,146,42,0.55)', letterSpacing: '0.12em', marginBottom: '3px' }}>紫微斗数</div>
                  <div style={{ fontSize: '8px', color: 'rgba(240,237,232,0.35)', fontFamily: 'var(--font-mono)' }}>金四局</div>
                </div>
              </div>
            );
          }
          if (ri === 1 && ci === 2) return null;
          if (ri === 2 && ci === 1) return null;
          if (ri === 2 && ci === 2) return null;

          const cell = cells[cellIdx] as { name: string; stars: string; hua?: string } | undefined;
          if (!cell) return <div key={`${ri}-${ci}`} />;

          return (
            <div
              key={`${ri}-${ci}`}
              style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '8px 7px',
                display: 'flex',
                flexDirection: 'column',
                gap: '3px',
                borderBottom: ri < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                borderRight: ci < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}
            >
              <div style={{ fontSize: '8px', color: 'rgba(240,237,232,0.35)', letterSpacing: '0.06em' }}>
                {cell.name}
              </div>
              {cell.stars && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(184,146,42,0.80)', fontWeight: 600, letterSpacing: '-0.01em' }}>
                    {cell.stars}
                  </span>
                  {cell.hua && (
                    <span style={{
                      fontSize: '8px',
                      color: huaColors[cell.hua],
                      border: `1px solid ${huaColors[cell.hua]}40`,
                      padding: '0 3px',
                      borderRadius: '3px',
                      fontFamily: 'var(--font-mono)',
                      lineHeight: '1.5',
                      fontWeight: 600,
                    }}>
                      {cell.hua}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default function HeroSection() {
  return (
    <section
      style={{
        background: 'var(--bg-inv)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 导航 */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 40px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'rgba(184,146,42,0.6)', fontSize: '14px' }}>☯</span>
          <span style={{ color: 'var(--tx-inv)', fontSize: '14px', fontWeight: 500, letterSpacing: '0.06em' }}>
            紫薇斗数
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link
            href="/chart"
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--r-pill)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(240,237,232,0.75)',
              fontSize: '13px',
              textDecoration: 'none',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = 'rgba(184,146,42,0.5)'; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'; }}
          >
            起盘
          </Link>
        </div>
      </nav>

      {/* 主内容 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          padding: '60px 40px 80px',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          gap: '80px',
        }}
      >
        {/* 左侧文案 */}
        <div style={{ flex: '1 1 500px' }}>
          {/* 上方小标签 */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: 'var(--r-pill)',
              border: '1px solid rgba(184,146,42,0.25)',
              background: 'rgba(184,146,42,0.06)',
              marginBottom: '32px',
            }}
          >
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--ac)', display: 'block' }} />
            <span style={{ fontSize: '11px', color: 'rgba(184,146,42,0.85)', letterSpacing: '0.08em' }}>
              倪海夏体系 · 南派三合
            </span>
          </div>

          {/* 主标题 */}
          <h1
            style={{
              fontSize: 'clamp(38px, 5.5vw, 68px)',
              fontWeight: 600,
              color: 'var(--tx-inv)',
              lineHeight: 1.10,
              marginBottom: '24px',
              letterSpacing: '-0.02em',
            }}
          >
            你的命盘<br />
            <span style={{ color: 'rgba(240,237,232,0.50)' }}>值得认真对待</span>
          </h1>

          {/* 副标题 */}
          <p
            style={{
              fontSize: '17px',
              color: 'var(--tx-inv2)',
              lineHeight: 1.7,
              marginBottom: '40px',
              maxWidth: '420px',
            }}
          >
            完整排盘，结构化解读，AI 深度追问。<br />
            每一个结论都来自命盘数据，可溯源，可验证。
          </p>

          {/* CTA 区 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/chart" className="btn-accent" style={{ fontSize: '15px', padding: '13px 32px' }}>
              立即起盘
            </Link>
            <a
              href="#core-ability"
              style={{
                fontSize: '14px',
                color: 'rgba(240,237,232,0.50)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(240,237,232,0.85)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(240,237,232,0.50)'; }}
            >
              了解体系 <span style={{ fontSize: '16px' }}>→</span>
            </a>
          </div>

          {/* 底部数字 */}
          <div
            style={{
              display: 'flex',
              gap: '40px',
              marginTop: '60px',
              paddingTop: '32px',
              borderTop: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            {[
              { n: '14', label: '主星' },
              { n: '12', label: '宫位' },
              { n: '100+', label: '倪师解读' },
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontSize: '22px', fontWeight: 600, color: 'var(--ac)', letterSpacing: '-0.01em' }}>
                  {item.n}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(240,237,232,0.35)', marginTop: '2px', letterSpacing: '0.04em' }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧命盘预览 */}
        <div
          style={{
            flex: '0 0 340px',
            maxWidth: '380px',
            width: '100%',
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '20px',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '10px', color: 'rgba(240,237,232,0.30)', letterSpacing: '0.1em' }}>
                命盘预览
              </span>
              <span style={{ fontSize: '10px', color: 'rgba(184,146,42,0.50)', fontFamily: 'var(--font-mono)' }}>
                金四局 · 命宫子
              </span>
            </div>
            <MiniChartPreview />
          </div>
        </div>
      </div>

      {/* 底部滚动提示 */}
      <div style={{ textAlign: 'center', paddingBottom: '32px' }}>
        <div
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            color: 'rgba(240,237,232,0.25)',
            fontSize: '11px',
            letterSpacing: '0.06em',
          }}
        >
          <span>向下滚动</span>
          <span style={{ fontSize: '16px', animation: 'bounce 2s infinite' }}>↓</span>
        </div>
      </div>
    </section>
  );
}
