export default function TrustSection() {
  const stats = [
    { n: '14',   label: '主星', sub: '精确亮度计算' },
    { n: '12',   label: '宫位', sub: '准确天干对应' },
    { n: '4',    label: '化系统', sub: '禄权科忌完整规则' },
    { n: '100+', label: '解读条目', sub: '倪师体系文案' },
  ];

  const diffs = [
    { col: '普通算命工具', items: ['输出一段结论', '不知道依据来源', '套话，无法验证', '一次性使用'] },
    { col: '紫薇斗数 2.0', items: ['结论附带命盘溯源', '每一句话有星曜依据', '结构化，可反复研究', '大限流年持续使用'], accent: true },
  ];

  return (
    <section style={{ padding: '100px 40px', background: 'var(--bg-1)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 标题 */}
        <div style={{ textAlign: 'center', marginBottom: '72px' }}>
          <div className="label-section" style={{ marginBottom: '16px' }}>体系可信度</div>
          <h2
            style={{
              fontSize: 'clamp(26px, 3.5vw, 40px)',
              fontWeight: 600,
              color: 'var(--tx-0)',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              marginBottom: '12px',
            }}
          >
            一套值得认真研究的体系
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--tx-3)', maxWidth: '440px', margin: '0 auto' }}>
            倪海夏 · 南派三合 · 台湾正统传承
          </p>
        </div>

        {/* 数字四格 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1px',
            background: 'var(--bdr)',
            borderRadius: 'var(--r-lg)',
            overflow: 'hidden',
            marginBottom: '60px',
            border: '1px solid var(--bdr)',
          }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              style={{
                background: 'white',
                padding: '32px 24px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 'clamp(28px, 3.5vw, 40px)',
                  fontWeight: 700,
                  color: 'var(--tx-0)',
                  letterSpacing: '-0.02em',
                  marginBottom: '4px',
                }}
              >
                {s.n}
              </div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--tx-1)',
                  marginBottom: '4px',
                }}
              >
                {s.label}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--tx-3)' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* 对比表 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '60px' }}>
          {diffs.map((col, ci) => (
            <div
              key={ci}
              style={{
                borderRadius: 'var(--r-md)',
                border: `1px solid ${col.accent ? 'var(--ac-bdr)' : 'var(--bdr)'}`,
                background: col.accent ? 'var(--ac-bg)' : 'white',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '14px 20px',
                  borderBottom: `1px solid ${col.accent ? 'var(--ac-bdr)' : 'var(--bdr)'}`,
                  fontSize: '13px',
                  fontWeight: 500,
                  color: col.accent ? 'var(--ac)' : 'var(--tx-3)',
                }}
              >
                {col.col}
              </div>
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {col.items.map((item, ii) => (
                  <div key={ii} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        fontSize: '12px',
                        color: col.accent ? 'var(--ac)' : 'var(--tx-3)',
                        flexShrink: 0,
                      }}
                    >
                      {col.accent ? '✓' : '○'}
                    </span>
                    <span style={{ fontSize: '13px', color: col.accent ? 'var(--tx-1)' : 'var(--tx-3)' }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 引用语 */}
        <div
          style={{
            background: 'white',
            border: '1px solid var(--bdr)',
            borderRadius: 'var(--r-lg)',
            padding: '36px 40px',
            position: 'relative',
          }}
        >
          <div
            style={{
              fontSize: '40px',
              color: 'var(--ac)',
              opacity: 0.15,
              position: 'absolute',
              top: '20px',
              left: '32px',
              lineHeight: 1,
              fontFamily: 'serif',
            }}
          >
            ❝
          </div>
          <p
            style={{
              fontSize: '17px',
              color: 'var(--tx-1)',
              lineHeight: 1.75,
              textAlign: 'center',
              maxWidth: '600px',
              margin: '0 auto',
              paddingTop: '8px',
            }}
          >
            紫微斗数是一门可以学习、可以验证、<br />
            可以用来理解人生规律的学问。<br />
            它不是迷信，是系统。
          </p>
          <div
            style={{
              textAlign: 'center',
              marginTop: '20px',
              fontSize: '12px',
              color: 'var(--tx-3)',
              letterSpacing: '0.06em',
            }}
          >
            倪海夏体系核心理念
          </div>
        </div>
      </div>
    </section>
  );
}
