export default function ExplainDemo() {
  const layers = [
    {
      tag: '结论',
      tagColor: 'var(--ac)',
      tagBg: 'rgba(184,146,42,0.08)',
      tagBorder: 'rgba(184,146,42,0.20)',
      borderColor: 'var(--ac)',
      text: '官禄宫廉贞化禄，宜任职，事业即财路。工作本身是主要进财方式，不宜合伙或自营。',
    },
    {
      tag: '依据',
      tagColor: '#1A56A8',
      tagBg: 'rgba(26,86,168,0.07)',
      tagBorder: 'rgba(26,86,168,0.18)',
      borderColor: 'rgba(26,86,168,0.5)',
      text: '官禄宫 · 廉贞星 · 本命化禄入宫 → 三方财帛受益 · 倪海夏：禄在官禄，禄随人走，最宜固定职位。',
    },
    {
      tag: '建议',
      tagColor: '#2D7A4A',
      tagBg: 'rgba(45,122,74,0.07)',
      tagBorder: 'rgba(45,122,74,0.18)',
      borderColor: 'rgba(45,122,74,0.5)',
      text: '当前大限（34–43岁）走事业宫，是职业晋升关键期。今年流年官禄逢吉，可主动争取机会。',
    },
  ];

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
            不是只给结论<br />
            <span style={{ color: 'rgba(240,237,232,0.50)', fontWeight: 400 }}>也给判断路径</span>
          </h2>
          <p
            style={{
              fontSize: '15px',
              color: 'var(--tx-inv2)',
              lineHeight: 1.75,
              marginBottom: '20px',
            }}
          >
            每一条分析都有三层结构：得出了什么结论、依据是哪个宫位与星曜、以及对你当下阶段的具体建议。
          </p>
          <p style={{ fontSize: '15px', color: 'rgba(240,237,232,0.35)', lineHeight: 1.75 }}>
            结论可溯源，路径透明，命盘值得反复研究。
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
                事业分析 · 官禄宫
              </span>
            </div>

            {/* 三层结构 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {layers.map((layer, i) => (
                <div
                  key={i}
                  style={{
                    borderLeft: `3px solid ${layer.borderColor}`,
                    paddingLeft: '14px',
                    paddingTop: '4px',
                    paddingBottom: '4px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        color: layer.tagColor,
                        background: layer.tagBg,
                        border: `1px solid ${layer.tagBorder}`,
                        padding: '2px 8px',
                        borderRadius: '100px',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {layer.tag}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: 'rgba(240,237,232,0.75)',
                      lineHeight: 1.65,
                    }}
                  >
                    {layer.text}
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
                fontSize: '11px',
                color: 'rgba(240,237,232,0.22)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>可点击依据中的宫位跳转查看命盘</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
