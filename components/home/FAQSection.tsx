'use client';
import { useState } from 'react';
import Link from 'next/link';

const FAQS = [
  {
    q: '这和网上免费的排盘工具有什么区别？',
    a: '多数工具只排盘，不解读，或输出固定套话。我们在完整排盘基础上提供结构化分析和可追问的 AI，区别在分析质量，不在功能数量。',
  },
  {
    q: '我不懂紫微术语，可以使用吗？',
    a: '可以。分析结果用可读语言说明，不需要懂术语。如果你想深入研究，每个宫位和星曜都有背景解读，学习路径清晰。',
  },
  {
    q: '分析结果准确吗？',
    a: '准确性取决于出生信息，尤其是出生时辰。我们做真太阳时校正以减少误差。命理是参考框架，建议理性使用，不要将结论作为决策唯一依据。',
  },
  {
    q: '倪海夏体系和其他派系有什么不同？',
    a: '倪海夏是南派三合代表人物，强调三方四正、逻辑链清晰、解读有依据。算法按原著体系实现，包含正确四化规则和亮度判断。',
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section style={{ padding: '120px 48px', background: '#F4F2EC' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            alignItems: 'start',
          }}
        >
          {/* 左：FAQ */}
          <div>
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
              常见问题
            </div>
            <h2
              style={{
                fontSize: 'clamp(24px, 3vw, 36px)',
                fontWeight: 600,
                color: '#1A1A18',
                letterSpacing: '-0.02em',
                marginBottom: '40px',
                lineHeight: 1.15,
              }}
            >
              你可能想知道这些。
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  style={{
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: open === i ? '#DDD9D2' : 'transparent',
                    background: open === i ? '#FFFFFF' : 'transparent',
                    overflow: 'hidden',
                    transition: 'background 0.15s ease, border-color 0.15s ease',
                  }}
                >
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '18px 20px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      gap: '16px',
                    }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A18', lineHeight: 1.5 }}>
                      {faq.q}
                    </span>
                    <span
                      style={{
                        fontSize: '20px',
                        color: '#9A9490',
                        flexShrink: 0,
                        transition: 'transform 0.18s ease',
                        transform: open === i ? 'rotate(45deg)' : 'rotate(0)',
                        display: 'block',
                        lineHeight: 1,
                      }}
                    >
                      +
                    </span>
                  </button>
                  {open === i && (
                    <div
                      style={{
                        padding: '0 20px 20px',
                        fontSize: '14px',
                        color: '#6B6760',
                        lineHeight: 1.75,
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 右：最终 CTA 卡 */}
          <div style={{ position: 'sticky', top: '80px' }}>
            <div
              style={{
                background: '#0D0D0B',
                borderRadius: '20px',
                padding: '60px 44px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '28px',
                  color: 'rgba(184,146,42,0.22)',
                  marginBottom: '28px',
                  lineHeight: 1,
                }}
              >
                ☯
              </div>
              <h3
                style={{
                  fontSize: 'clamp(22px, 2.5vw, 28px)',
                  fontWeight: 600,
                  color: '#F0EDE8',
                  letterSpacing: '-0.015em',
                  marginBottom: '14px',
                  lineHeight: 1.2,
                }}
              >
                开始建立你的命盘
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(240,237,232,0.45)',
                  lineHeight: 1.65,
                  marginBottom: '36px',
                }}
              >
                输入出生年月日时<br />
                约 5 秒生成完整命盘
              </p>
              <Link
                href="/chart"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '14px 0',
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
              <p
                style={{
                  marginTop: '18px',
                  fontSize: '11px',
                  color: 'rgba(240,237,232,0.22)',
                  letterSpacing: '0.05em',
                }}
              >
                无需注册 · 免费起盘
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: '80px',
            paddingTop: '32px',
            borderTop: '1px solid #DDD9D2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span style={{ color: 'rgba(184,146,42,0.45)', fontSize: '12px' }}>☯</span>
            <span style={{ fontSize: '13px', color: '#9A9490' }}>紫薇斗数</span>
          </div>
          <p style={{ fontSize: '12px', color: '#9A9490' }}>
            基于倪海夏南派三合体系 · 仅供参考，请理性使用
          </p>
        </div>
      </div>
    </section>
  );
}
