'use client';
import Link from 'next/link';

const QUESTIONS = [
  '今年适合换工作吗？',
  '我的财运模式是什么？',
  '感情什么时候会到来？',
  '我适合做什么类型的工作？',
  '当前大限走的是什么运？',
  '夫妻宫主星说明什么？',
];

export default function SampleQuestions() {
  return (
    <section style={{ padding: '120px 48px', background: '#FAFAF8' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* 标题 */}
        <div style={{ marginBottom: '64px' }}>
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
            从这里开始
          </div>
          <h2
            style={{
              fontSize: 'clamp(30px, 4vw, 48px)',
              fontWeight: 600,
              color: '#1A1A18',
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              marginBottom: '16px',
            }}
          >
            从一个问题开始。
          </h2>
          <p style={{ fontSize: '15px', color: '#6B6760', lineHeight: 1.7, maxWidth: '420px' }}>
            起盘之后，你可以直接问。<br />
            AI 以你的命盘为上下文来回答，不是通用建议。
          </p>
        </div>

        {/* 问题列表 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            marginBottom: '60px',
            border: '1px solid #E8E6E0',
            borderRadius: '16px',
            overflow: 'hidden',
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
                padding: '20px 28px',
                background: '#FFFFFF',
                borderBottom: i < QUESTIONS.length - 1 ? '1px solid #F0EDE8' : 'none',
                textDecoration: 'none',
                transition: 'background 0.15s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#FAFAF8'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#FFFFFF'; }}
            >
              <span style={{ fontSize: '15px', color: '#1A1A18', fontWeight: 400 }}>{q}</span>
              <span style={{ fontSize: '14px', color: '#C4BFB4', flexShrink: 0 }}>→</span>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link
            href="/chart"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '14px 36px',
              borderRadius: '100px',
              background: '#1A1A18',
              color: '#F0EDE8',
              fontSize: '15px',
              fontWeight: 500,
              textDecoration: 'none',
              letterSpacing: '0.01em',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.80'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
          >
            立即起盘，开始分析
          </Link>
          <p style={{ marginTop: '14px', fontSize: '12px', color: '#A8A49E', letterSpacing: '0.04em' }}>
            约 5 秒生成完整命盘
          </p>
        </div>
      </div>
    </section>
  );
}
