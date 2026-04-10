import Link from 'next/link';

const QUESTIONS = [
  '今年适合换工作吗？',
  '我的财运模式是什么？',
  '感情什么时候会到来？',
  '为什么总是创业受挫？',
  '我适合做哪类工作？',
  '当前大限走的是什么运？',
  '身体需要注意什么？',
  '夫妻宫的主星说明什么？',
];

export default function SampleQuestions() {
  return (
    <section style={{ padding: '100px 40px', background: 'var(--bg-0)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 标题 */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="label-section" style={{ marginBottom: '16px' }}>你可能想知道</div>
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
            这些问题<br />都可以在命盘里找到答案
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--tx-3)' }}>
            输入出生年月日时，AI 以你的命盘数据作为上下文来回答
          </p>
        </div>

        {/* 问题卡片 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '12px',
            marginBottom: '52px',
          }}
        >
          {QUESTIONS.map((q, i) => (
            <Link
              key={i}
              href="/chart"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderRadius: 'var(--r-md)',
                border: '1px solid var(--bdr)',
                background: 'white',
                textDecoration: 'none',
                color: 'var(--tx-1)',
                fontSize: '14px',
                fontWeight: 400,
                boxShadow: 'var(--sh-xs)',
                transition: 'all 0.18s ease',
                lineHeight: 1.45,
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'var(--ac-bdr)';
                el.style.background = 'var(--ac-bg)';
                el.style.transform = 'translateY(-2px)';
                el.style.boxShadow = 'var(--sh-md)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'var(--bdr)';
                el.style.background = 'white';
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = 'var(--sh-xs)';
              }}
            >
              <span>{q}</span>
              <span style={{ color: 'var(--tx-3)', marginLeft: '8px', flexShrink: 0 }}>→</span>
            </Link>
          ))}
        </div>

        {/* 大 CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link href="/chart" className="btn-accent" style={{ fontSize: '15px', padding: '14px 36px' }}>
            输入出生信息，开始分析
          </Link>
          <p style={{ marginTop: '14px', fontSize: '12px', color: 'var(--tx-3)' }}>
            约 5 秒生成完整命盘 · 无需注册
          </p>
        </div>
      </div>
    </section>
  );
}
