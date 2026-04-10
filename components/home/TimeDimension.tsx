'use client';
import { useState } from 'react';

const DIMS = [
  {
    key: 'mingpan',
    label: '本命',
    title: '先天格局',
    badge: '固定',
    desc: '命盘一旦确立，命宫主星、五行局、本命四化固定不变。这是所有分析的基础与起点。',
    points: ['命宫主星与性格底色', '本命四化：禄权科忌', '三方四正基础格局'],
  },
  {
    key: 'daxian',
    label: '大限',
    title: '10 年运程',
    badge: '10 年周期',
    desc: '每 10 年走一个大限，大限天干飞四化，叠加在本命盘上，呈现该阶段整体运势走向。',
    points: ['大限四化叠加本命', '当前大限：34–43 岁', '大限命宫天干判断'],
    highlight: true,
  },
  {
    key: 'liunian',
    label: '流年',
    title: '当年运势',
    badge: '年度',
    desc: '流年天干决定该年四化，叠加判断当年在哪些宫位有特殊影响，机遇与风险并存。',
    points: ['流年天干飞四化', '年干叠加本命宫位', '判断当年机遇与风险'],
  },
  {
    key: 'liuyue',
    label: '流月',
    title: '月度侧重',
    badge: '月度',
    desc: '最细粒度的时间维度。结合流月命宫与流月四化，判断近期具体事项的宜与忌。',
    points: ['流月命宫飞四化', '最细粒度判断', '近期事项具体宜忌'],
  },
];

export default function TimeDimension() {
  const [active, setActive] = useState('daxian');
  const cur = DIMS.find(d => d.key === active)!;

  return (
    <section style={{ padding: '120px 48px', background: '#FAFAF8' }}>
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
            时间维度
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
            不只是静态排盘。
          </h2>
          <p style={{ fontSize: '16px', color: '#6B6760', maxWidth: '480px', lineHeight: 1.7 }}>
            同一张命盘，在不同人生阶段有不同的解读重点。
            本命是基础，大限是阶段，流年是当年，流月是近期。
          </p>
        </div>

        {/* 主体：左说明 + 右四格 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '48px',
            alignItems: 'start',
          }}
        >
          {/* 左：详情 */}
          <div>
            {/* Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '5px 12px',
                borderRadius: '100px',
                background: cur.highlight ? 'rgba(184,146,42,0.08)' : '#F0EDE8',
                border: `1px solid ${cur.highlight ? 'rgba(184,146,42,0.25)' : '#DDD9D2'}`,
                fontSize: '11px',
                color: cur.highlight ? '#B8922A' : '#6B6760',
                fontFamily: 'var(--font-mono)',
                marginBottom: '24px',
              }}
            >
              {cur.badge}
            </div>

            <h3
              style={{
                fontSize: '28px',
                fontWeight: 600,
                color: '#1A1A18',
                marginBottom: '16px',
                letterSpacing: '-0.015em',
              }}
            >
              {cur.title}
            </h3>

            <p
              style={{
                fontSize: '15px',
                color: '#6B6760',
                lineHeight: 1.75,
                marginBottom: '32px',
              }}
            >
              {cur.desc}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cur.points.map((pt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: cur.highlight ? '#B8922A' : '#C4BFB4',
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: '14px', color: '#4A4844' }}>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 右：四格点击卡 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
            }}
          >
            {DIMS.map(d => {
              const isActive = active === d.key;
              return (
                <button
                  key={d.key}
                  onClick={() => setActive(d.key)}
                  style={{
                    textAlign: 'left',
                    padding: '24px 22px',
                    borderRadius: '14px',
                    border: `1.5px solid ${isActive ? 'rgba(184,146,42,0.40)' : '#E8E6E0'}`,
                    background: isActive ? 'rgba(184,146,42,0.05)' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    boxShadow: isActive ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      color: isActive ? 'rgba(184,146,42,0.7)' : '#C4BFB4',
                      marginBottom: '8px',
                    }}
                  >
                    {d.badge}
                  </div>
                  <div
                    style={{
                      fontSize: '17px',
                      fontWeight: 600,
                      color: isActive ? '#1A1A18' : '#4A4844',
                      marginBottom: '4px',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {d.label}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: isActive ? '#6B6760' : '#A8A49E',
                    }}
                  >
                    {d.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
