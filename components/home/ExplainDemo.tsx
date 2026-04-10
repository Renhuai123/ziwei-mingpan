export default function ExplainDemo() {
  const analysisLines = [
    {
      text: '官禄宫廉贞化禄，宜任职，事业即财路。',
      source: '官禄宫 · 廉贞 · 化禄入宫 · 南派三合解读',
      type: 'conclusion',
    },
    {
      text: '三方财帛受惠，收入稳定，工作是主要进财方式。',
      source: '财帛宫（三合）· 官禄禄照财',
      type: 'logic',
    },
    {
      text: '当前大限（34–43岁）走事业宫，为事业上升期。',
      source: '大限命宫 · 丙干 · 大限四化',
      type: 'period',
    },
  ];

  const typeStyles: Record<string, React.CSSProperties> = {
    conclusion: { borderLeft: '3px solid var(--ac)', paddingLeft: '14px' },
    logic:      { borderLeft: '3px solid rgba(26,86,168,0.5)', paddingLeft: '14px' },
    period:     { borderLeft: '3px solid rgba(45,122,74,0.5)', paddingLeft: '14px' },
  };

  return (
    <section
      style={{
        background: 'var(--bg-inv)',
        padding: '100px 40px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'center',
        }}
      >
        {/* 左侧文案 */}
        <div>
          <div className="label-section" style={{ color: 'rgba(184,146,42,0.6)', marginBottom: '16px' }}>
            可解释性
          </div>
          <h2
            style={{
              fontSize: 'clamp(26px, 3.5vw, 38px)',
              fontWeight: 600,
              color: 'var(--tx-inv)',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              marginBottom: '24px',
            }}
          >
            命中感<br />来自逻辑链
          </h2>
          <p
            style={{
              fontSize: '15px',
              color: 'var(--tx-inv2)',
              lineHeight: 1.75,
              marginBottom: '32px',
            }}
          >
            传统命理软件输出一段话，你无法知道它从哪里来。
          </p>
          <p style={{ fontSize: '15px', color: 'var(--tx-inv2)', lineHeight: 1.75, marginBottom: '32px' }}>
            我们不这样做。每一句结论，都附带它的命盘来源——
            是哪个宫位、哪颗星、哪个四化，以及倪海夏如何解读这种配置。
          </p>
          <p style={{ fontSize: '15px', color: 'rgba(240,237,232,0.35)', lineHeight: 1.75 }}>
            这种透明度，让命盘可以被研究，而不只是被消费。
          </p>
        </div>

        {/* 右侧分析卡片 */}
        <div>
          <div
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: '16px',
              padding: '24px',
            }}
          >
            {/* 顶部标签行 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--ac)' }} />
              <span style={{ fontSize: '12px', color: 'rgba(184,146,42,0.70)', letterSpacing: '0.05em' }}>
                事业分析 · 命盘依据
              </span>
            </div>

            {/* 分析条目 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {analysisLines.map((line, i) => (
                <div key={i} style={typeStyles[line.type]}>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'var(--tx-inv)',
                      lineHeight: 1.6,
                      marginBottom: '6px',
                    }}
                  >
                    {line.text}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'rgba(240,237,232,0.30)',
                      fontFamily: 'var(--font-mono)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>↑</span>
                    <span>{line.source}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 底部提示 */}
            <div
              style={{
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255,255,255,0.07)',
                fontSize: '12px',
                color: 'rgba(240,237,232,0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>点击任意依据，跳转命盘对应宫位</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
