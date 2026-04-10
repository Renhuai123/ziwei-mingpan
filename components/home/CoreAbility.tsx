export default function CoreAbility() {
  const abilities = [
    {
      num: '01',
      title: '专业排盘',
      desc: '完整实现倪海夏体系。14 主星、12 宫位、四化规则、真太阳时校正，算法完整，不简化。',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3" />
          <line x1="12" y1="3" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="21" />
          <line x1="3" y1="12" x2="6" y2="12" />
          <line x1="18" y1="12" x2="21" y2="12" />
        </svg>
      ),
    },
    {
      num: '02',
      title: '结构化分析',
      desc: '每一条结论都附带宫位来源。结论可溯源，路径可验证。不是套话，不是白话文段落。',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <line x1="8" y1="14" x2="13" y2="14" />
        </svg>
      ),
    },
    {
      num: '03',
      title: '继续追问',
      desc: '点击任意宫位，AI 即时注入命盘上下文。不是聊天框，是以命盘为核心的分析引擎。',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="core-ability"
      style={{
        padding: '120px 48px',
        background: '#FAFAF8',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* 标题区 */}
        <div style={{ marginBottom: '80px' }}>
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
            核心能力
          </div>
          <h2
            style={{
              fontSize: 'clamp(30px, 4vw, 48px)',
              fontWeight: 600,
              color: '#1A1A18',
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
            }}
          >
            三件事，做到专业。
          </h2>
        </div>

        {/* 三栏能力卡 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1px',
            background: '#E8E6E0',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid #E8E6E0',
          }}
        >
          {abilities.map((ab, i) => (
            <div
              key={i}
              style={{
                background: '#FFFFFF',
                padding: '44px 36px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0',
              }}
            >
              {/* 序号 + 图标 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '32px',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    color: '#C4BFB4',
                    letterSpacing: '0.05em',
                  }}
                >
                  {ab.num}
                </span>
                <div style={{ color: '#9A9490' }}>
                  {ab.icon}
                </div>
              </div>

              {/* 标题 */}
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#1A1A18',
                  marginBottom: '14px',
                  letterSpacing: '-0.01em',
                }}
              >
                {ab.title}
              </h3>

              {/* 副文案 */}
              <p
                style={{
                  fontSize: '14px',
                  color: '#6B6760',
                  lineHeight: 1.70,
                  margin: 0,
                }}
              >
                {ab.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
