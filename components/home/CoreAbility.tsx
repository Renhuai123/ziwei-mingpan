export default function CoreAbility() {
  const abilities = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3" />
          <line x1="12" y1="3" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="21" />
          <line x1="3" y1="12" x2="6" y2="12" />
          <line x1="18" y1="12" x2="21" y2="12" />
        </svg>
      ),
      title: '完整排盘',
      desc: '基于倪海夏南派三合体系，精确实现 14 主星、纳音五行局、正确四化规则与真太阳时校正。不简化，不省略。',
      points: ['14 主星亮度精确', '真太阳时自动校正', '完整辅星与煞星'],
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <line x1="8" y1="14" x2="13" y2="14" />
        </svg>
      ),
      title: '结构化分析',
      desc: '每一个分析结论都有固定结构：核心判断 → 命盘依据 → 风险提醒 → 行动建议。不输出白话文段落。',
      points: ['结论可溯源到宫位', '证据链完整展开', '建议具体可执行'],
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <line x1="9" y1="10" x2="15" y2="10" />
          <line x1="9" y1="14" x2="13" y2="14" />
        </svg>
      ),
      title: '上下文追问',
      desc: '你的问题不是孤立的 AI 聊天，而是有完整命盘数据作为上下文。点击任意宫位，分析即时更新。',
      points: ['命盘数据作为上下文', '宫位/星曜上下文感知', '持续对话不丢失命盘'],
    },
  ];

  return (
    <section
      id="core-ability"
      style={{
        padding: '100px 40px',
        background: 'var(--bg-0)',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {/* 标题区 */}
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <div className="label-section" style={{ marginBottom: '16px' }}>核心能力</div>
        <h2
          style={{
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 600,
            color: 'var(--tx-0)',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            marginBottom: '16px',
          }}
        >
          专业底座，让解读有依据
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--tx-3)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.65 }}>
          不是套话生成，每一个结论都来自命盘数据
        </p>
      </div>

      {/* 三栏 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {abilities.map((ab, i) => (
          <div
            key={i}
            className="card"
            style={{ padding: '32px 28px' }}
          >
            {/* 图标 */}
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--r-sm)',
                background: 'var(--bg-1)',
                border: '1px solid var(--bdr)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--tx-2)',
                marginBottom: '20px',
              }}
            >
              {ab.icon}
            </div>

            {/* 标题 */}
            <h3
              style={{
                fontSize: '17px',
                fontWeight: 600,
                color: 'var(--tx-0)',
                marginBottom: '12px',
                letterSpacing: '-0.01em',
              }}
            >
              {ab.title}
            </h3>

            {/* 描述 */}
            <p style={{ fontSize: '14px', color: 'var(--tx-2)', lineHeight: 1.65, marginBottom: '20px' }}>
              {ab.desc}
            </p>

            {/* 要点列表 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {ab.points.map((pt, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: 'var(--ac)',
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: '13px', color: 'var(--tx-2)' }}>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
