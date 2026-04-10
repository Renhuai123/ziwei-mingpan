export default function TrustSection() {
  const stats = [
    { n: '14',   label: '主星',    desc: '精确亮度计算' },
    { n: '12',   label: '宫位',    desc: '准确天干对应' },
    { n: '4',    label: '化系统',  desc: '禄权科忌完整规则' },
    { n: '100+', label: '解读条目', desc: '倪海夏体系原著' },
  ];

  return (
    <section style={{ padding: '120px 48px', background: '#F4F2EC' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* 标题 */}
        <div style={{ marginBottom: '72px' }}>
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '0.12em',
              color: 'var(--ac)',
              opacity: 0.7,
              marginBottom: '20px',
              textTransform: 'uppercase',
            }}
          >
            体系基础
          </div>
          <h2
            style={{
              fontSize: 'clamp(30px, 4vw, 48px)',
              fontWeight: 600,
              color: '#1A1A18',
              letterSpacing: '-0.025em',
              lineHeight: 1.12,
              marginBottom: '16px',
            }}
          >
            建立在一套可以学习、<br />可以验证的体系之上。
          </h2>
          <p style={{ fontSize: '15px', color: '#6B6760', lineHeight: 1.7 }}>
            倪海夏 · 南派三合 · 台湾正统传承
          </p>
        </div>

        {/* 数字四格 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1px',
            background: '#DDD9D2',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid #DDD9D2',
            marginBottom: '56px',
          }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              style={{
                background: '#FAFAF8',
                padding: '40px 28px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 'clamp(32px, 4vw, 48px)',
                  fontWeight: 700,
                  color: '#1A1A18',
                  letterSpacing: '-0.03em',
                  marginBottom: '6px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {s.n}
              </div>
              <div style={{ fontSize: '15px', fontWeight: 500, color: '#2A2A28', marginBottom: '4px' }}>
                {s.label}
              </div>
              <div style={{ fontSize: '12px', color: '#9A9490' }}>{s.desc}</div>
            </div>
          ))}
        </div>

        {/* 正文 + 引用 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          {/* 正文 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '15px', color: '#4A4844', lineHeight: 1.80, margin: 0 }}>
              紫微斗数不是神秘学，是一套有逻辑结构的分析框架。
            </p>
            <p style={{ fontSize: '15px', color: '#4A4844', lineHeight: 1.80, margin: 0 }}>
              倪海夏体系强调大道至简：解读有逻辑链，每一个判断
              都来自命盘的宫位组合，不依赖神秘感和模糊语言。
            </p>
            <p style={{ fontSize: '14px', color: '#9A9490', lineHeight: 1.75, margin: 0 }}>
              我们按照原著体系实现，包含正确的四化规则、
              精确的亮度判断和完整的三方四正逻辑。
            </p>
          </div>

          {/* 引用卡 */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E8E6E0',
              borderRadius: '16px',
              padding: '36px 36px 32px',
              position: 'relative',
            }}
          >
            <div
              style={{
                fontSize: '48px',
                color: '#B8922A',
                opacity: 0.12,
                position: 'absolute',
                top: '16px',
                left: '28px',
                lineHeight: 1,
                fontFamily: 'serif',
              }}
            >
              ❝
            </div>
            <p
              style={{
                fontSize: '16px',
                color: '#2A2A28',
                lineHeight: 1.75,
                textAlign: 'center',
                paddingTop: '12px',
                margin: '0 0 20px',
              }}
            >
              紫微斗数是可以学习、可以研究的学问。<br />
              它不是迷信，是系统。
            </p>
            <div style={{ textAlign: 'center', fontSize: '12px', color: '#9A9490', letterSpacing: '0.06em' }}>
              倪海夏体系核心理念
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
