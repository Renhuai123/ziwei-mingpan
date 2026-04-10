'use client';
import { useState } from 'react';
import Link from 'next/link';

const FAQS = [
  {
    q: '这和网上免费的紫微排盘有什么区别？',
    a: '多数免费工具只排盘，不解读，或输出固定套话。我们在完整排盘基础上提供结构化分析和可追问的 AI，区别在内容质量，而不是功能数量。',
  },
  {
    q: '倪海夏体系和其他派系有什么不同？',
    a: '倪海夏是南派三合派代表人物，重三方四正，强调大道至简，解读有明确逻辑链，不依赖神秘感。算法实现按其原著体系，包含正确的四化规则和亮度判断。',
  },
  {
    q: '我不懂紫微斗数术语，可以使用吗？',
    a: '可以。分析结果用可读的语言说明，不需要懂术语。如果你想深入研究，命盘的每个宫位和星曜都有背景解读，学习路径清晰。',
  },
  {
    q: '分析结果准确吗？',
    a: '准确性取决于出生信息，尤其是出生时辰。我们做真太阳时校正，尽量减少误差。命理是参考框架，不是决定框架，建议理性参考，不要完全依赖结论做重大决策。',
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section style={{ padding: '100px 40px', background: 'var(--bg-1)' }}>
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
            <div className="label-section" style={{ marginBottom: '16px' }}>常见问题</div>
            <h2
              style={{
                fontSize: 'clamp(24px, 3vw, 34px)',
                fontWeight: 600,
                color: 'var(--tx-0)',
                letterSpacing: '-0.02em',
                marginBottom: '36px',
              }}
            >
              你可能有这些疑问
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  style={{
                    borderRadius: 'var(--r-md)',
                    border: '1px solid var(--bdr)',
                    background: open === i ? 'white' : 'transparent',
                    overflow: 'hidden',
                    transition: 'background 0.15s ease',
                  }}
                >
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      gap: '12px',
                    }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--tx-0)', lineHeight: 1.45 }}>
                      {faq.q}
                    </span>
                    <span
                      style={{
                        fontSize: '18px',
                        color: 'var(--tx-3)',
                        flexShrink: 0,
                        transition: 'transform 0.18s ease',
                        transform: open === i ? 'rotate(45deg)' : 'rotate(0)',
                        display: 'block',
                      }}
                    >
                      +
                    </span>
                  </button>
                  {open === i && (
                    <div
                      style={{
                        padding: '0 20px 18px',
                        fontSize: '13px',
                        color: 'var(--tx-2)',
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

          {/* 右：最终 CTA */}
          <div>
            <div
              style={{
                background: 'var(--bg-inv)',
                borderRadius: 'var(--r-xl)',
                padding: '52px 40px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '28px',
                  color: 'rgba(184,146,42,0.25)',
                  marginBottom: '24px',
                  lineHeight: 1,
                }}
              >
                ☯
              </div>
              <h3
                style={{
                  fontSize: 'clamp(22px, 2.5vw, 30px)',
                  fontWeight: 600,
                  color: 'var(--tx-inv)',
                  letterSpacing: '-0.01em',
                  marginBottom: '12px',
                  lineHeight: 1.2,
                }}
              >
                准备好了吗？
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--tx-inv2)',
                  lineHeight: 1.65,
                  marginBottom: '32px',
                }}
              >
                输入你的出生年月日时<br />
                约 5 秒生成完整命盘
              </p>
              <Link
                href="/chart"
                className="btn-accent"
                style={{
                  display: 'inline-flex',
                  fontSize: '15px',
                  padding: '14px 36px',
                  width: '100%',
                  justifyContent: 'center',
                }}
              >
                立即起盘
              </Link>
              <p
                style={{
                  marginTop: '16px',
                  fontSize: '11px',
                  color: 'rgba(240,237,232,0.25)',
                  letterSpacing: '0.04em',
                }}
              >
                无需注册 · 完全免费起盘
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 底部 footer */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '80px auto 0',
          paddingTop: '32px',
          borderTop: '1px solid var(--bdr)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'rgba(184,146,42,0.5)', fontSize: '13px' }}>☯</span>
          <span style={{ fontSize: '13px', color: 'var(--tx-3)' }}>紫薇斗数 2.0</span>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--tx-3)' }}>
          基于倪海夏南派三合体系 · 仅供参考，请理性使用
        </p>
      </div>
    </section>
  );
}
