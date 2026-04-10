'use client';
import { useState } from 'react';

const DIMENSIONS = [
  {
    key: 'mingpan',
    label: '本命',
    title: '先天格局',
    desc: '命盘一旦确立，命宫主星、五行局、四化等先天配置固定不变。这是整个分析的基础。',
    detail: ['命宫主星性格底色', '本命四化：禄权科忌', '三方四正基础格局'],
    badge: '固定',
  },
  {
    key: 'daxian',
    label: '大限',
    title: '10 年运程',
    desc: '每10年走一个大限，大限命宫天干飞四化，叠加在本命盘上，呈现该阶段的运势走向。',
    detail: ['大限四化叠加本命', '当前大限：34–43 岁', '大限命宫天干判断'],
    badge: '10年周期',
    highlight: true,
  },
  {
    key: 'liunian',
    label: '流年',
    title: '当年运势',
    desc: '流年天干决定该年四化。年干飞化叠加，可以判断当年在哪些宫位有特殊影响。',
    detail: ['流年天干四化', '年干叠加本命宫位', '判断当年机遇风险'],
    badge: '年度',
  },
  {
    key: 'liuyue',
    label: '流月',
    title: '月度侧重',
    desc: '最细粒度的时间维度，结合流月命宫和流月四化，判断近期具体事项的宜忌。',
    detail: ['流月命宫飞四化', '最细粒度判断', '近期具体事项宜忌'],
    badge: '月度',
  },
];

export default function TimeDimension() {
  const [active, setActive] = useState('daxian');
  const current = DIMENSIONS.find(d => d.key === active)!;

  return (
    <section style={{ padding: '100px 40px', background: 'var(--bg-0)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 标题 */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div className="label-section" style={{ marginBottom: '16px' }}>时间维度</div>
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
            命盘是静态的<br />
            <span style={{ color: 'var(--tx-3)', fontWeight: 400 }}>你的人生是动态的</span>
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--tx-3)', maxWidth: '440px', margin: '0 auto' }}>
            本命 / 大限 / 流年 / 流月，四个时间维度随时切换
          </p>
        </div>

        {/* Tab 切换 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '48px' }}>
          <div className="tab-container">
            {DIMENSIONS.map(d => (
              <button
                key={d.key}
                className={`tab-item ${active === d.key ? 'active' : ''}`}
                onClick={() => setActive(d.key)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* 内容展示区 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            alignItems: 'start',
          }}
        >
          {/* 左：说明文字 */}
          <div>
            <div
              style={{
                display: 'inline-block',
                padding: '4px 10px',
                borderRadius: 'var(--r-xs)',
                background: current.highlight ? 'var(--ac-bg)' : 'var(--bg-2)',
                border: `1px solid ${current.highlight ? 'var(--ac-bdr)' : 'var(--bdr)'}`,
                fontSize: '11px',
                color: current.highlight ? 'var(--ac)' : 'var(--tx-3)',
                marginBottom: '20px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {current.badge}
            </div>

            <h3
              style={{
                fontSize: '26px',
                fontWeight: 600,
                color: 'var(--tx-0)',
                marginBottom: '16px',
                letterSpacing: '-0.01em',
              }}
            >
              {current.title}
            </h3>

            <p
              style={{
                fontSize: '15px',
                color: 'var(--tx-2)',
                lineHeight: 1.75,
                marginBottom: '28px',
              }}
            >
              {current.desc}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {current.detail.map((pt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: `1px solid ${current.highlight ? 'var(--ac-bdr)' : 'var(--bdr-heavy)'}`,
                      background: current.highlight ? 'var(--ac-bg)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '9px',
                      color: current.highlight ? 'var(--ac)' : 'var(--tx-3)',
                      fontWeight: 600,
                    }}
                  >
                    {i + 1}
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--tx-2)' }}>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 右：四格视觉示意 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
            }}
          >
            {DIMENSIONS.map(d => (
              <div
                key={d.key}
                onClick={() => setActive(d.key)}
                style={{
                  padding: '20px',
                  borderRadius: 'var(--r-md)',
                  border: `1px solid ${active === d.key ? 'var(--ac-bdr)' : 'var(--bdr)'}`,
                  background: active === d.key ? 'var(--ac-bg)' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  boxShadow: active === d.key ? 'none' : 'var(--sh-xs)',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: active === d.key ? 'var(--ac)' : 'var(--tx-2)',
                    marginBottom: '6px',
                  }}
                >
                  {d.label}
                </div>
                <div
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: active === d.key ? 'var(--ac-dim)' : 'var(--tx-0)',
                    marginBottom: '4px',
                  }}
                >
                  {d.title}
                </div>
                <div style={{ fontSize: '11px', color: active === d.key ? 'var(--ac)' : 'var(--tx-3)', opacity: 0.7 }}>
                  {d.badge}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
