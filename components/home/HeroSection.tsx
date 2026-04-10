'use client';
import Link from 'next/link';

// 产品界面 Mock — 命盘 + AI 分析面板
function ProductMock() {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
      }}
    >
      {/* 窗口顶栏 */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        {['#FF5F57', '#FFBD2E', '#28CA41'].map((c, i) => (
          <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c, opacity: 0.7 }} />
        ))}
        <div
          style={{
            flex: 1,
            height: '22px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '6px',
            marginLeft: '8px',
          }}
        />
      </div>

      {/* 主内容：左命盘 + 右分析 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '260px' }}>
        {/* 左：简化命盘 */}
        <div
          style={{
            borderRight: '1px solid rgba(255,255,255,0.07)',
            padding: '12px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: 'repeat(4, 1fr)',
            gap: '1px',
            background: 'rgba(255,255,255,0.04)',
          }}
        >
          {[
            { n: '疾厄', s: '' },
            { n: '迁移', s: '天梁' },
            { n: '交友', s: '' },
            { n: '官禄', s: '廉贞', hua: '禄', huaC: '#2D7A4A' },
            { n: '田宅', s: '太阳' },
            { n: '', s: '', center: true },
            { n: '', s: '', skip: true },
            { n: '福德', s: '紫微' },
            { n: '父母', s: '' },
            { n: '', s: '', skip: true },
            { n: '', s: '', skip: true },
            { n: '命宫', s: '天相', ming: true },
            { n: '兄弟', s: '' },
            { n: '夫妻', s: '七杀' },
            { n: '子女', s: '贪狼' },
            { n: '财帛', s: '武曲', hua: '科', huaC: '#8A7018' },
          ].map((cell, idx) => {
            if (cell.skip) return null;
            if (cell.center) return (
              <div
                key={idx}
                style={{
                  gridRow: '2 / 4', gridColumn: '2 / 4',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column', gap: '4px',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <div style={{ fontSize: '16px', color: 'rgba(184,146,42,0.25)' }}>☯</div>
                <div style={{ fontSize: '7px', color: 'rgba(184,146,42,0.4)', letterSpacing: '0.1em' }}>金四局</div>
              </div>
            );
            return (
              <div
                key={idx}
                style={{
                  background: cell.ming ? 'rgba(184,146,42,0.08)' : 'rgba(255,255,255,0.02)',
                  padding: '6px 5px',
                  display: 'flex', flexDirection: 'column', gap: '2px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  borderRight: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.04em' }}>{cell.n}</div>
                {cell.s && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <span style={{ fontSize: '10px', color: cell.ming ? 'rgba(184,146,42,0.9)' : 'rgba(184,146,42,0.65)', fontWeight: 600 }}>{cell.s}</span>
                    {cell.hua && (
                      <span style={{ fontSize: '7px', color: cell.huaC, border: `1px solid ${cell.huaC}50`, padding: '0 2px', borderRadius: '2px', lineHeight: 1.4, fontWeight: 600 }}>{cell.hua}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 右：AI 分析面板 */}
        <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* 主题按钮 */}
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {['命格总览', '感情', '事业', '财运'].map((t, i) => (
              <span
                key={t}
                style={{
                  fontSize: '9px', padding: '3px 8px',
                  borderRadius: '100px',
                  background: i === 0 ? 'rgba(184,146,42,0.15)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${i === 0 ? 'rgba(184,146,42,0.35)' : 'rgba(255,255,255,0.08)'}`,
                  color: i === 0 ? 'rgba(184,146,42,0.9)' : 'rgba(255,255,255,0.35)',
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* 分析内容 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { tag: '结论', c: '#B8922A', text: '官禄宫廉贞化禄，宜任职，事业即财路。' },
              { tag: '依据', c: '#1A56A8', text: '官禄宫 · 廉贞星 · 本命化禄入宫' },
              { tag: '建议', c: '#2D7A4A', text: '大限 34–43 走事业宫，晋升关键期。' },
            ].map((item, i) => (
              <div key={i} style={{ borderLeft: `2px solid ${item.c}60`, paddingLeft: '8px' }}>
                <span style={{ fontSize: '7px', color: item.c, fontWeight: 600, background: `${item.c}15`, padding: '1px 5px', borderRadius: '3px', display: 'inline-block', marginBottom: '3px' }}>
                  {item.tag}
                </span>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{item.text}</div>
              </div>
            ))}
          </div>

          {/* 追问输入框 */}
          <div
            style={{
              marginTop: 'auto',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              padding: '7px 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.25)' }}>继续追问…</span>
            <span style={{ fontSize: '8px', color: 'rgba(184,146,42,0.5)' }}>↑</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section
      style={{
        background: '#0D0D0B',
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
          padding: '20px 48px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <span style={{ color: 'rgba(184,146,42,0.55)', fontSize: '13px' }}>☯</span>
          <span style={{ color: 'rgba(240,237,232,0.85)', fontSize: '13px', fontWeight: 500, letterSpacing: '0.06em' }}>
            紫薇斗数
          </span>
        </div>
        <Link
          href="/chart"
          style={{
            padding: '7px 20px',
            borderRadius: '100px',
            border: '1px solid rgba(255,255,255,0.14)',
            color: 'rgba(240,237,232,0.65)',
            fontSize: '13px',
            textDecoration: 'none',
            transition: 'border-color 0.15s, color 0.15s',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = 'rgba(184,146,42,0.45)';
            el.style.color = 'rgba(240,237,232,0.9)';
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = 'rgba(255,255,255,0.14)';
            el.style.color = 'rgba(240,237,232,0.65)';
          }}
        >
          起盘
        </Link>
      </nav>

      {/* 主内容 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          padding: '72px 48px 80px',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          gap: '72px',
        }}
      >
        {/* 左侧文案 */}
        <div style={{ flex: '1 1 480px' }}>
          {/* 主标题 */}
          <h1
            style={{
              fontSize: 'clamp(40px, 5.5vw, 68px)',
              fontWeight: 600,
              color: '#F0EDE8',
              lineHeight: 1.08,
              marginBottom: '28px',
              letterSpacing: '-0.025em',
            }}
          >
            看懂命盘，<br />不止于排盘。
          </h1>

          {/* 副标题 */}
          <p
            style={{
              fontSize: '17px',
              color: 'rgba(240,237,232,0.50)',
              lineHeight: 1.75,
              marginBottom: '44px',
              maxWidth: '400px',
            }}
          >
            基于倪海夏体系的紫微命盘工作台。<br />
            专业排盘、结构化分析、限量 AI 追问。
          </p>

          {/* CTA 区 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <Link
              href="/chart"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '13px 30px',
                borderRadius: '100px',
                background: '#B8922A',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 500,
                textDecoration: 'none',
                letterSpacing: '0.01em',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.88'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
            >
              立即起盘
            </Link>
            <Link
              href="/chart"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '13px 24px',
                borderRadius: '100px',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(240,237,232,0.60)',
                fontSize: '15px',
                textDecoration: 'none',
                transition: 'border-color 0.15s, color 0.15s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'rgba(184,146,42,0.40)';
                el.style.color = 'rgba(240,237,232,0.85)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'rgba(255,255,255,0.15)';
                el.style.color = 'rgba(240,237,232,0.60)';
              }}
            >
              查看样例命盘
            </Link>
          </div>

          {/* 辅助小字 */}
          <p style={{ fontSize: '12px', color: 'rgba(240,237,232,0.25)', letterSpacing: '0.04em', marginBottom: '56px' }}>
            无需注册 · 免费起盘
          </p>

          {/* 三标签 */}
          <div
            style={{
              display: 'flex',
              gap: '0',
              paddingTop: '28px',
              borderTop: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            {['专业排盘', '自动分析', '继续追问'].map((tag, i) => (
              <div
                key={tag}
                style={{
                  flex: 1,
                  paddingLeft: i === 0 ? 0 : '24px',
                  borderLeft: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.07)',
                  marginLeft: i === 0 ? 0 : '24px',
                }}
              >
                <div style={{ fontSize: '13px', color: 'rgba(240,237,232,0.50)', fontWeight: 400, letterSpacing: '0.02em' }}>
                  {tag}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧产品 Mock */}
        <div style={{ flex: '0 0 400px', maxWidth: '440px', width: '100%' }}>
          <ProductMock />
        </div>
      </div>
    </section>
  );
}
