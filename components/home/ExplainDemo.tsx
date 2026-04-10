export default function ExplainDemo() {
  const layers = [
    {
      tag: '结论',
      tagColor: '#B8922A',
      tagBg: 'rgba(184,146,42,0.10)',
      tagBorder: 'rgba(184,146,42,0.22)',
      bar: '#B8922A',
      text: '官禄宫廉贞化禄，事业即财路，宜任职，不宜合伙自营。',
    },
    {
      tag: '依据',
      tagColor: '#1A56A8',
      tagBg: 'rgba(26,86,168,0.08)',
      tagBorder: 'rgba(26,86,168,0.20)',
      bar: '#1A56A8',
      text: '官禄宫 · 廉贞星 · 本命化禄入宫  三方财帛受益 · 倪师：禄随人走',
    },
    {
      tag: '建议',
      tagColor: '#2D7A4A',
      tagBg: 'rgba(45,122,74,0.08)',
      tagBorder: 'rgba(45,122,74,0.20)',
      bar: '#2D7A4A',
      text: '当前大限（34–43岁）走事业宫，是职业晋升关键期。今年流年官禄逢吉，可主动争取。',
    },
  ];

  return (
    <section
      style={{
        background: '#0D0D0B',
        padding: '120px 48px',
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
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '0.12em',
              color: 'rgba(184,146,42,0.6)',
              marginBottom: '20px',
              textTransform: 'uppercase',
            }}
          >
            可解释性
          </div>
          <h2
            style={{
              fontSize: 'clamp(28px, 3.8vw, 44px)',
              fontWeight: 600,
              color: '#F0EDE8',
              lineHeight: 1.12,
              letterSpacing: '-0.025em',
              marginBottom: '32px',
            }}
          >
            不是只给结论，<br />也给判断路径。
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <p style={{ fontSize: '15px', color: 'rgba(240,237,232,0.50)', lineHeight: 1.75, margin: 0 }}>
              普通命理工具输出一段话，你不知道它从哪里来。
            </p>
            <p style={{ fontSize: '15px', color: 'rgba(240,237,232,0.70)', lineHeight: 1.75, margin: 0 }}>
              每一条分析都有三层结构：
              <br />结论是什么 · 依据在哪里 · 对你的建议是什么
            </p>
            <p style={{ fontSize: '14px', color: 'rgba(240,237,232,0.30)', lineHeight: 1.75, margin: 0 }}>
              判断路径透明，命盘才能被研究，不只是被消费。
            </p>
          </div>
        </div>

        {/* 右侧分析卡片 */}
        <div>
          <div
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: '16px',
              padding: '28px',
            }}
          >
            {/* 顶部 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '24px',
                paddingBottom: '18px',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#B8922A', opacity: 0.8 }} />
              <span style={{ fontSize: '12px', color: 'rgba(184,146,42,0.65)', letterSpacing: '0.05em' }}>
                事业分析 · 官禄宫
              </span>
            </div>

            {/* 三层 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {layers.map((layer, i) => (
                <div
                  key={i}
                  style={{
                    borderLeft: `2.5px solid ${layer.bar}`,
                    paddingLeft: '14px',
                  }}
                >
                  <div style={{ marginBottom: '6px' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        color: layer.tagColor,
                        background: layer.tagBg,
                        border: `1px solid ${layer.tagBorder}`,
                        padding: '2px 8px',
                        borderRadius: '100px',
                        letterSpacing: '0.03em',
                      }}
                    >
                      {layer.tag}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: 'rgba(240,237,232,0.68)',
                      lineHeight: 1.65,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {layer.text}
                  </div>
                </div>
              ))}
            </div>

            {/* 底部 */}
            <div
              style={{
                marginTop: '22px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                fontSize: '11px',
                color: 'rgba(240,237,232,0.20)',
              }}
            >
              点击依据中的宫位，跳转命盘对应位置 →
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
