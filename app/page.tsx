'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import StarField from '@/components/StarField';
import { useTheme, type Theme } from '@/components/ThemeProvider';

// ─── 滚动入场 wrapper ────────────────────────────────────
function FadeIn({
  children, delay = 0, y = 28, className = '',
}: {
  children: React.ReactNode; delay?: number; y?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── 主题切换按钮 ────────────────────────────────────────
function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.93 }}
      aria-label={isDark ? '切换亮色主题' : '切换暗色主题'}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
      style={{
        borderColor: isDark ? 'rgba(212,168,67,0.3)' : 'rgba(140,100,20,0.35)',
        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,252,242,0.85)',
        boxShadow: isDark
          ? 'inset 0 1px 0 rgba(255,255,255,0.06)'
          : 'inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 8px rgba(140,100,20,0.1)',
        transition: 'background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease',
      }}
    >
      {/* 滑轨 */}
      <div className="relative w-10 h-5 rounded-full flex-shrink-0"
        style={{
          background: isDark ? 'rgba(12,24,64,0.95)' : 'rgba(230,195,80,0.55)',
          transition: 'background 0.35s ease',
        }}>
        <motion.div
          animate={{ x: isDark ? 2 : 22 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="absolute top-1 w-3.5 h-3.5 rounded-full"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #b8a050, #e8d090)'
              : 'linear-gradient(135deg, #e89010, #f8d050)',
          }}
        />
      </div>
      {/* 图标 + 文字 */}
      <span className="text-[11px] font-medium tracking-wide select-none"
        style={{
          color: isDark ? 'rgba(212,180,100,0.85)' : 'rgba(110,72,8,0.8)',
          transition: 'color 0.35s ease',
        }}>
        {isDark ? '🌙 暗色' : '☀️ 亮色'}
      </span>
    </motion.button>
  );
}

// ─── 主星数据 ────────────────────────────────────────────
const STARS = [
  { name: '紫微', nature: '帝王' }, { name: '天机', nature: '智慧' },
  { name: '太阳', nature: '阳刚' }, { name: '武曲', nature: '财富' },
  { name: '天同', nature: '享福' }, { name: '廉贞', nature: '才艺' },
  { name: '天府', nature: '财库' }, { name: '太阴', nature: '柔美' },
  { name: '贪狼', nature: '桃花' }, { name: '巨门', nature: '口才' },
  { name: '天相', nature: '辅佐' }, { name: '天梁', nature: '荫护' },
  { name: '七杀', nature: '将帅' }, { name: '破军', nature: '开创' },
];

// ─── 功能模块 ────────────────────────────────────────────
const FEATURES = [
  {
    tag: '排盘体系',
    title: '倪海夏正宗\n紫微斗数',
    subtitle: '非简化版，无捷径，遵循真正的传承',
    points: [
      '严格按照倪海夏老师的纳音五行局起盘法，而非网络流传的简化版本',
      '命宫以「逆数生时」安置，身宫以「顺数生时」安置，与倪师教学一致',
      '十四主星位置依紫微系与天府系分别推算，辅星安排遵循月支、时支规则',
      '四化依年干飞入各宫，化禄权科忌含义解读完全参照倪师课堂讲义',
    ],
  },
  {
    tag: '命盘呈现',
    title: '完整十四主星\n四化飞星',
    subtitle: '每颗星都有位置，每个宫位都有故事',
    points: [
      '十四主星全部正确入宫：紫微、天机、太阳、武曲、天同、廉贞、天府、太阴、贪狼、巨门、天相、天梁、七杀、破军',
      '十二辅星煞星完整呈现：文昌文曲、左辅右弼、天魁天钺、禄存天马、地空地劫、火星铃星',
      '庙旺利陷四种亮度标注，一眼识别主星力量强弱',
      '点击任意主星即可查看倪海夏老师对该星的详细解读',
    ],
  },
  {
    tag: 'AI 解读',
    title: '深度解盘\n不止于算',
    subtitle: '倪海夏体系知识库 × Claude AI',
    points: [
      '命格分析：从命宫主星出发，结合三方四正，给出全面的性格与人生格局判断',
      '六大维度解读：事业方向、感情婚姻、财运模式、健康注意、家庭关系、子女缘分',
      '大限流年追踪：当前10年大限重点、今年流年宫位的具体提示与行动建议',
      '自由追问：针对你的命盘直接提问，「今年能换工作吗」「什么时候结婚运最好」',
    ],
  },
  {
    tag: '格局识别',
    title: '自动检测\n命盘格局',
    subtitle: '从星曜组合中发现你的命中注定',
    points: [
      '自动识别11种经典格局：紫府同宫、杀破狼格、机月同梁、廉相格、武曲七杀等',
      '辅弼夹命、日月夹命等特殊格局精准检测，并给出倪海夏体系下的标准解读',
      '四化入命宫迁移宫的特殊状况自动标注，提示需关注的人生议题',
      '格局按吉凶等级分层展示，让你一目了然自己命盘中的优势与挑战',
    ],
  },
  {
    tag: '风水补局',
    title: '五行分析\n裨补阙漏',
    subtitle: '知命不足，以风水调和五行能量',
    points: [
      '根据命盘三方四正的五行分布，精准计算你的缺失或偏弱五行',
      '缺水者：摆放水晶球或流水摆件，布置于北方，增强智慧与财运',
      '缺火者：悬挂红色物件或增加光源，布置于南方，提升名声与社交',
      '缺金者：放置金色风车或铜制摆件，布置于西方，强化决断与财库',
      '缺木者：种植绿植富贵竹，布置于东方，增强生命力与健康运势',
    ],
  },
];

// ─── 倪海夏核心教义 ──────────────────────────────────────
const NI_TEACHINGS = [
  {
    title: '命宫为本，三方为用',
    body: '倪师始终强调，看命必先看命宫。命宫主星决定一个人的基本格局与天生性格，三方（财帛、官禄、迁移）则决定此人的「用武之地」。四宫联动才是完整的人生图景。',
  },
  {
    title: '对宫借星，不可忽视',
    body: '倪师的独到之处在于重视「对宫」。任何宫位若为空宫，必须借对宫星曜来论断，命宫的对面是迁移宫，两者互相影响，这是很多初学者容易忽略的关键。',
  },
  {
    title: '四化才是命运的手',
    body: '星曜只是基础，四化（化禄、化权、化科、化忌）才是决定运势好坏的关键。同一颗星，有化禄与有化忌，人生轨迹可以截然不同。倪师反复强调：不看四化，命盘只解了一半。',
  },
  {
    title: '大限十年，运势有节',
    body: '倪师将人生划分为12个大限，每个大限10年。他认为人在不同的大限宫位，际遇完全不同。了解自己现在走的是哪个大限、该宫位有何星曜，才能真正把握当下的运势。',
  },
];

// ─── 主题色彩 helper ─────────────────────────────────────
function useColors(theme: Theme) {
  const d = theme === 'dark';
  return {
    bgBase:       d ? '#020810'                                : '#f5efe0',
    navBg:        d ? 'rgba(2,8,16,0.88)'                     : 'rgba(250,245,235,0.92)',
    navBorder:    d ? 'rgba(255,255,255,0.05)'                : 'rgba(160,120,30,0.15)',
    goldGrad:     d ? 'linear-gradient(160deg,#c8993a 0%,#f0d070 40%,#c8993a 70%,#f0c755 100%)'
                    : 'linear-gradient(160deg,#6a4206 0%,#9a6a10 40%,#6a4206 70%,#885010 100%)',
    goldSolid:    d ? '#d4a843'                               : '#8b6410',
    goldLine:     d ? 'rgba(212,168,67,0.4)'                  : 'rgba(140,100,20,0.4)',
    tagText:      d ? 'rgba(212,168,67,0.6)'                  : 'rgba(120,80,10,0.65)',
    textPrimary:  d ? '#e8eef6'                               : '#1a1005',
    textSecond:   d ? '#9aaac8'                               : '#5a4520',
    textMuted:    d ? '#7a90b8'                               : '#7a6640',
    textFaint:    d ? 'rgba(255,255,255,0.28)'                : '#c0a870',
    // Card with "white shimmer" effect for contrast depth
    cardBg:       d ? 'rgba(255,255,255,0.05)'                : 'rgba(255,255,255,0.88)',
    cardBorder:   d ? 'rgba(255,255,255,0.10)'                : 'rgba(200,160,60,0.25)',
    cardShadow:   d ? '0 4px 32px rgba(0,0,0,0.5)'           : '0 4px 24px rgba(140,100,20,0.12)',
    featureBg:    d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.75)',
    featureBord:  d ? 'rgba(255,255,255,0.08)'                : 'rgba(200,160,60,0.2)',
    glowTint:     d ? 'rgba(212,168,67,0.07)'                 : 'rgba(180,140,40,0.06)',
    glowBlue:     d ? 'rgba(40,80,160,0.12)'                  : 'rgba(160,120,30,0.05)',
    glowPurple:   d ? 'rgba(120,50,180,0.08)'                 : 'rgba(120,80,20,0.04)',
    niBg:         d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.8)',
    niBorder:     d ? 'rgba(212,168,67,0.2)'                  : 'rgba(180,130,40,0.25)',
    niDivider:    d ? 'rgba(255,255,255,0.08)'                : 'rgba(180,130,40,0.12)',
    niCardBg:     d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.9)',
    niCardBord:   d ? 'rgba(255,255,255,0.08)'                : 'rgba(200,160,60,0.2)',
    niCardShadow: d ? '0 2px 20px rgba(0,0,0,0.4)'           : '0 2px 16px rgba(140,100,20,0.1)',
    starBg:       d ? 'rgba(255,255,255,0.04)'                : 'rgba(255,255,255,0.7)',
    starBorder:   d ? 'rgba(212,168,67,0.22)'                 : 'rgba(160,120,30,0.3)',
    starText:     d ? 'rgba(212,168,67,0.7)'                  : 'rgba(120,80,10,0.7)',
    starNature:   d ? 'rgba(255,255,255,0.15)'                : '#c0a870',
    ctaBg:        d ? 'linear-gradient(135deg,#b8892a,#f0d070,#b8892a)'
                    : 'linear-gradient(135deg,#6a4206,#9a6810,#6a4206)',
    ctaText:      d ? '#08080a'                               : '#f8f3e8',
    footerText:   d ? 'rgba(255,255,255,0.08)'                : '#d0b878',
    scrollLine:   d ? 'rgba(212,168,67,0.3)'                  : 'rgba(140,100,20,0.3)',
    scrollText:   d ? 'rgba(255,255,255,0.12)'                : '#c0a870',
    // Section alternating backgrounds
    altSection:   d ? 'rgba(255,255,255,0.02)'                : 'rgba(255,255,255,0.4)',
    quoteBg:      d ? 'rgba(212,168,67,0.04)'                 : 'rgba(255,255,255,0.9)',
    quoteBorder:  d ? 'rgba(212,168,67,0.15)'                 : 'rgba(180,130,40,0.2)',
    tianBg:       d ? 'rgba(255,255,255,0.03)'                : 'rgba(255,255,255,0.85)',
    tianBorder:   d ? 'rgba(255,255,255,0.08)'                : 'rgba(200,160,60,0.22)',
  };
}

// ─── 主页 ─────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = useColors(theme);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <div style={{ background: c.bgBase, transition: 'background 0.35s ease' }} className="overflow-x-hidden">
      <StarField />

      {/* 全局光晕 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full"
          style={{ background: `radial-gradient(ellipse, ${c.glowTint} 0%, transparent 70%)` }} />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full"
          style={{ background: `radial-gradient(ellipse, ${c.glowBlue} 0%, transparent 70%)` }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full"
          style={{ background: `radial-gradient(ellipse, ${c.glowPurple} 0%, transparent 70%)` }} />
      </div>

      {/* ── 顶部导航 ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
        style={{
          background: c.navBg,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${c.navBorder}`,
        }}>
        <div className="text-xs tracking-[0.4em] font-medium transition-colors duration-300"
          style={{ color: c.goldSolid }}>
          紫微命盘
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/chart')}
            className="text-xs px-4 py-1.5 rounded-full transition-all duration-300"
            style={{
              border: `1px solid ${c.goldLine}`,
              color: c.goldSolid,
            }}
          >
            立即起盘
          </motion.button>
        </div>
      </nav>

      {/* ══ HERO ══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 z-10">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="text-center max-w-4xl mx-auto">

          {/* 标签行 */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center justify-center gap-3 mb-10">
            <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
            <span className="text-[11px] tracking-[0.5em] uppercase transition-colors duration-300"
              style={{ color: c.tagText }}>
              Zi Wei Dou Shu · AI Divination
            </span>
            <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
          </motion.div>

          {/* 主标题 */}
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className={`grad-text font-bold leading-none mb-6 ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'}`}
            style={{
              fontSize: 'clamp(64px, 12vw, 140px)',
              letterSpacing: '0.08em',
            }}>
            紫微命盘
          </motion.h1>

          {/* 副标题 */}
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="text-lg md:text-xl tracking-widest mb-4 transition-colors duration-300"
            style={{ color: c.textSecond }}>
            倪海夏正宗体系 · AI 深度解读
          </motion.p>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="text-sm max-w-lg mx-auto leading-relaxed mb-12 transition-colors duration-300"
            style={{ color: c.textMuted }}>
            输入出生年月日时，生成专属紫微斗数命盘<br />
            依据倪海夏老师完整教学体系，AI 解读你的命格与运势
          </motion.p>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="flex flex-col items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: `0 0 40px ${c.glowTint}` }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/chart')}
              className="px-12 py-4 font-semibold text-base tracking-widest rounded-full transition-all duration-300"
              style={{ background: c.ctaBg, color: c.ctaText }}>
              立即起盘
            </motion.button>
            <p className="text-[10px] tracking-wider transition-colors duration-300"
              style={{ color: c.textFaint }}>
              完全免费 · 无需注册 · 基于倪海夏老师教学体系
            </p>
          </motion.div>

          {/* 十四主星 */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-20 flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
            {STARS.map((star, i) => (
              <motion.div key={star.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 + i * 0.04, duration: 0.4 }}
                className="group flex items-center gap-1 px-2.5 py-1 rounded-full cursor-default transition-all duration-200"
                style={{
                  background: c.starBg,
                  border: `1px solid ${c.starBorder}`,
                  boxShadow: theme === 'light' ? '0 1px 4px rgba(140,100,20,0.08)' : 'none',
                }}>
                <span className="text-[11px] transition-colors duration-200"
                  style={{ color: c.starText }}>{star.name}</span>
                <span className="text-[9px] transition-colors duration-200"
                  style={{ color: c.starNature }}>{star.nature}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* 滚动提示 */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[9px] tracking-[0.4em] uppercase transition-colors duration-300"
            style={{ color: c.scrollText }}>探索更多</span>
          <motion.div animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-px h-8 transition-all duration-300"
            style={{ background: `linear-gradient(to bottom, ${c.scrollLine}, transparent)` }} />
        </motion.div>
      </section>

      {/* ══ 哲学引言 ══════════════════════════════════════ */}
      <section className="relative z-10 overflow-hidden" style={{ padding: '120px 24px' }}>
        {/* 深色背景：顶底融入页面底色，中心为深色调 */}
        <div className="absolute inset-0 transition-all duration-500"
          style={{
            background: theme === 'dark'
              ? `linear-gradient(to bottom, ${c.bgBase} 0%, #030a18 14%, #0d0820 32%, #0a0618 68%, #030a18 86%, ${c.bgBase} 100%)`
              : `linear-gradient(to bottom, ${c.bgBase} 0%, #3a1204 12%, #1e0a02 28%, #180802 72%, #3a1204 88%, ${c.bgBase} 100%)`,
          }} />

        {/* 大字水印 "命" */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-bold"
            style={{
              fontSize: 'clamp(280px, 45vw, 560px)',
              color: 'rgba(212,168,67,0.028)',
              lineHeight: 1,
              fontFamily: 'var(--font-serif, serif)',
              letterSpacing: '-0.05em',
            }}>命</span>
        </div>


        {/* 顶部光晕 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(212,168,67,0.06) 0%, transparent 70%)' }} />

        <FadeIn>
          <div className="relative max-w-4xl mx-auto text-center">

            {/* 标签 */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center gap-4 mb-14">
              <div className="h-px w-20" style={{ background: 'linear-gradient(to right, transparent, rgba(212,168,67,0.45))' }} />
              <span className="text-[10px] tracking-[0.6em] uppercase" style={{ color: 'rgba(212,168,67,0.5)' }}>
                命 · 运 · 观
              </span>
              <div className="h-px w-20" style={{ background: 'linear-gradient(to left, transparent, rgba(212,168,67,0.45))' }} />
            </motion.div>

            {/* 三行递进式文字——由淡到亮，层层递进 */}
            <div className="space-y-5">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="tracking-widest"
                style={{
                  fontSize: 'clamp(16px, 2.2vw, 28px)',
                  color: 'rgba(215,228,252,0.72)',
                  fontWeight: 400,
                  letterSpacing: '0.15em',
                }}>
                提前窥见命运的意义，
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="tracking-wider leading-loose"
                style={{
                  fontSize: 'clamp(20px, 2.8vw, 38px)',
                  color: 'rgba(220,232,250,0.75)',
                  fontWeight: 400,
                  letterSpacing: '0.1em',
                }}>
                不在于预知未来，<br />
                而在于不断认识自己、精进自己，
              </motion.p>

              {/* 最后一行：最亮、最大、金色渐变 */}
              <motion.p
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                className="grad-text grad-text-dark font-bold"
                style={{
                  fontSize: 'clamp(24px, 3.8vw, 52px)',
                  letterSpacing: '0.06em',
                  lineHeight: 1.3,
                }}>
                最终书写只属于你的<br className="md:hidden" />人生剧本。
              </motion.p>
            </div>

            {/* 底部金线 */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.65 }}
              className="mt-14 flex items-center justify-center gap-4">
              <div className="h-px w-28" style={{ background: 'linear-gradient(to right, transparent, rgba(212,168,67,0.5))' }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(212,168,67,0.5)' }} />
              <div className="h-px w-28" style={{ background: 'linear-gradient(to left, transparent, rgba(212,168,67,0.5))' }} />
            </motion.div>
          </div>
        </FadeIn>
      </section>

      {/* ══ 功能详解 ══════════════════════════════════════ */}
      <section className="relative z-10 py-8">
        {FEATURES.map((feature, i) => (
          <div key={i} className="min-h-screen flex items-center px-6 md:px-12 lg:px-24 py-24"
            style={{ background: i % 2 === 1 ? c.altSection : 'transparent' }}>
            <div className="max-w-6xl mx-auto w-full">
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start ${i % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>

                {/* 文字区 */}
                <div className={i % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <FadeIn delay={0}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-px w-8 transition-all duration-300"
                        style={{ background: c.goldLine }} />
                      <span className="text-[10px] tracking-[0.5em] uppercase transition-colors duration-300"
                        style={{ color: c.tagText }}>{feature.tag}</span>
                    </div>
                  </FadeIn>

                  <FadeIn delay={0.1}>
                    <h2 className={`grad-text text-4xl md:text-5xl font-bold leading-tight mb-5 tracking-tight ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'}`}
                      style={{ whiteSpace: 'pre-line' }}>
                      {feature.title}
                    </h2>
                  </FadeIn>

                  <FadeIn delay={0.2}>
                    <p className="text-base mb-8 leading-relaxed transition-colors duration-300"
                      style={{ color: c.textSecond }}>{feature.subtitle}</p>
                  </FadeIn>

                  <div className="space-y-4">
                    {feature.points.map((point, j) => {
                      const isHighlight = i === 1 && j === feature.points.length - 1;
                      return (
                        <FadeIn key={j} delay={0.25 + j * 0.08}>
                          {isHighlight ? (
                            <div className="flex gap-3 rounded-xl px-3 py-2.5 -mx-3 transition-all duration-300"
                              style={{
                                border: `1px solid ${c.goldLine}`,
                                background: theme === 'dark' ? 'rgba(212,168,67,0.06)' : 'rgba(180,130,30,0.08)',
                              }}>
                              <div className="flex-shrink-0 mt-2 w-1.5 h-1.5 rounded-full"
                                style={{ background: c.goldSolid }} />
                              <p className="text-sm leading-relaxed font-medium transition-colors duration-300"
                                style={{ color: c.goldSolid }}>{point}</p>
                            </div>
                          ) : (
                            <div className="flex gap-3">
                              <div className="flex-shrink-0 mt-2 w-1 h-1 rounded-full transition-all duration-300"
                                style={{ background: c.goldSolid, opacity: 0.6 }} />
                              <p className="text-sm leading-relaxed transition-colors duration-300"
                                style={{ color: c.textMuted }}>{point}</p>
                            </div>
                          )}
                        </FadeIn>
                      );
                    })}
                  </div>
                </div>

                {/* 视觉装饰区 */}
                <div className={`${i % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''} ${i === 4 ? 'lg:pt-10' : ''}`}>
                  <FadeIn delay={0.15}>
                    <div className="relative rounded-2xl overflow-hidden p-8 md:p-12 transition-all duration-300"
                      style={{
                        border: `1px solid ${c.featureBord}`,
                        background: c.featureBg,
                        minHeight: '320px',
                        boxShadow: c.cardShadow,
                      }}>
                      <FeatureVisual index={i} colors={c} />
                    </div>
                  </FadeIn>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ══ 天·地·人 三分理论 ════════════════════════════ */}
      <section className="relative z-10 py-32 px-6 md:px-12 lg:px-24"
        style={{ background: c.altSection }}>
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
                <span className="text-[10px] tracking-[0.5em] uppercase transition-colors duration-300"
                  style={{ color: c.tagText }}>Ni Haixia · Philosophy</span>
                <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
              </div>
              <h2 className={`grad-text text-4xl md:text-5xl font-bold mb-5 tracking-tight ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'}`}>
                天 · 地 · 人
              </h2>
              <p className="max-w-xl mx-auto text-sm leading-relaxed transition-colors duration-300"
                style={{ color: c.textSecond }}>
                倪海夏老师的核心命运观：命运从来不是人生的全部。
                他将影响人生的力量分为三个同等重要的维度。
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                glyph: '天',
                label: '先天命运',
                pct: '⅓',
                color: theme === 'dark' ? '#d4a843' : '#8b6410',
                borderColor: theme === 'dark' ? 'rgba(212,168,67,0.3)' : 'rgba(140,100,20,0.35)',
                bgColor: theme === 'dark' ? 'rgba(212,168,67,0.04)' : 'rgba(255,255,255,0.9)',
                desc: '紫微斗数所揭示的，是一个人的先天命盘格局——出生时间决定的星曜布局、五行局数、命宫主星。这只是命运的三分之一，是人生的底色，而非全貌。',
                sub: '命盘 · 星曜 · 五行',
              },
              {
                glyph: '地',
                label: '地理环境',
                pct: '⅓',
                color: theme === 'dark' ? '#60a5fa' : '#2563eb',
                borderColor: theme === 'dark' ? 'rgba(96,165,250,0.3)' : 'rgba(37,99,235,0.3)',
                bgColor: theme === 'dark' ? 'rgba(96,165,250,0.04)' : 'rgba(255,255,255,0.9)',
                desc: '你所在的地理环境、城市、国家、风水格局，乃至家庭背景与社会结构，共同构成了命运的第二个维度。同一命盘，生在不同地方，际遇可以天壤之别。',
                sub: '地域 · 风水 · 环境',
              },
              {
                glyph: '人',
                label: '人心意念',
                pct: '⅓',
                color: theme === 'dark' ? '#4ade80' : '#16a34a',
                borderColor: theme === 'dark' ? 'rgba(74,222,128,0.3)' : 'rgba(22,163,74,0.3)',
                bgColor: theme === 'dark' ? 'rgba(74,222,128,0.04)' : 'rgba(255,255,255,0.9)',
                desc: '个人的意志、心态、选择与行动，才是改变命运最主动的力量。倪师强调：了解命盘是为了更好地做人，而不是坐等命运安排。精进自己，是最强的破局之道。',
                sub: '意志 · 选择 · 行动',
              },
            ].map((item, i) => (
              <FadeIn key={item.glyph} delay={0.1 + i * 0.12}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: `0 0 0 1.5px ${item.borderColor}, 0 12px 40px ${item.borderColor}` }}
                  transition={{ duration: 0.1 }}
                  className="rounded-2xl p-7 h-full flex flex-col"
                  style={{
                    background: item.bgColor,
                    border: `1px solid ${item.borderColor}`,
                    boxShadow: c.cardShadow,
                  }}
                >
                  {/* 大字符 */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="text-5xl font-bold leading-none"
                      style={{ color: item.color, opacity: 0.9 }}>{item.glyph}</div>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: item.color }}>{item.pct}</div>
                      <div className="text-[9px] mt-0.5 tracking-widest transition-colors duration-300"
                        style={{ color: c.textMuted }}>of life</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-sm font-medium mb-0.5 transition-colors duration-300"
                      style={{ color: item.color }}>{item.label}</div>
                    <div className="text-[10px] tracking-wider transition-colors duration-300"
                      style={{ color: c.textMuted }}>{item.sub}</div>
                  </div>

                  {/* 分隔线 */}
                  <div className="h-px mb-4 transition-colors duration-300"
                    style={{ background: item.borderColor }} />

                  <p className="text-xs leading-relaxed flex-1 transition-colors duration-300"
                    style={{ color: c.textSecond }}>
                    {item.desc}
                  </p>
                </motion.div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3}>
            <div className="mt-10 text-center">
              <p className="text-sm leading-relaxed transition-colors duration-300"
                style={{ color: c.textSecond }}>
                「命运不是人生的全部，加上地理位置和人念，才是。」
              </p>
              <p className="mt-2 text-[10px] tracking-widest transition-colors duration-300"
                style={{ color: c.tagText }}>— 倪海夏</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ 倪海夏详细介绍 ════════════════════════════════ */}
      <section className="relative z-10 py-32 px-6 md:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto">

          {/* 标题 */}
          <FadeIn>
            <div className="text-center mb-20">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
                <span className="text-[10px] tracking-[0.5em] uppercase transition-colors duration-300"
                  style={{ color: c.tagText }}>Master · 1953 – 2012</span>
                <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
              </div>
              <h2 className={`grad-text text-4xl md:text-5xl font-bold mb-6 tracking-tight ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'}`}>
                倪海夏老师
              </h2>
              <p className="max-w-xl mx-auto leading-relaxed text-sm transition-colors duration-300"
                style={{ color: c.textSecond }}>
                当代最重要的紫微斗数传承者之一，以系统化、实用化的教学方式，
                将数百年的命理智慧带入现代。
              </p>
            </div>
          </FadeIn>

          {/* 生平卡片 */}
          <FadeIn delay={0.1}>
            <div className="rounded-2xl p-8 md:p-12 mb-12 transition-all duration-300"
              style={{
                border: `1px solid ${c.niBorder}`,
                background: c.niBg,
                boxShadow: c.cardShadow,
              }}>

              {/* 三栏数据 */}
              <div className="grid grid-cols-3 gap-8 mb-8">
                {[
                  { label: '生于', value: '1953年', sub: '台湾新竹' },
                  { label: '离世', value: '2012年', sub: '享年59岁' },
                  { label: '传承', value: '紫微斗数', sub: '奇门遁甲 · 六壬' },
                ].map(item => (
                  <div key={item.label} className="text-center">
                    <div className="text-[10px] tracking-widest mb-1 transition-colors duration-300"
                      style={{ color: c.textFaint }}>{item.label}</div>
                    <div className="text-xl font-bold mb-0.5 transition-colors duration-300"
                      style={{ color: c.goldSolid }}>{item.value}</div>
                    <div className="text-xs transition-colors duration-300"
                      style={{ color: c.textMuted }}>{item.sub}</div>
                  </div>
                ))}
              </div>

              <div className="h-px mb-8 transition-colors duration-300"
                style={{ background: c.niDivider }} />

              {/* 传记文字 */}
              <div className="space-y-4 text-sm leading-relaxed max-w-3xl mx-auto text-center transition-colors duration-300"
                style={{ color: c.textSecond }}>
                <p>
                  倪海夏老师自幼接触命理，精研紫微斗数、奇门遁甲、六壬等传统术数数十年。
                  他最大的贡献在于将极为复杂的紫微斗数系统化、条理化——他设计了一套严谨的学习路径，
                  从「十四主星」到「四化飞星」再到「大限流年」，层层递进，
                  有别于市面上碎片化的「口诀记忆法」。
                </p>
                <p>
                  倪师的课堂以「理解」而非「背诵」为核心。他反复强调：
                  每颗星都有其五行属性与根本性格，理解了这颗星的本质，
                  才能在任何宫位中推导出正确的判断，而不是死记硬背「此星在此宫代表什么」。
                  这种教学方式培养了无数真正能独立解盘的命理师。
                </p>
                <p>
                  他留下的数百小时教学录音与课堂笔记，至今仍是学习正宗紫微斗数最权威的资料，
                  被全球华人命理界奉为当代传承的重要典籍。
                </p>
              </div>
            </div>
          </FadeIn>

          {/* 四大核心教义 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NI_TEACHINGS.map((teaching, i) => (
              <FadeIn key={i} delay={0.1 + i * 0.08}>
                <motion.div
                  whileHover={{
                    y: -3,
                    boxShadow: theme === 'dark'
                      ? '0 0 0 1.5px rgba(212,168,67,0.55), 0 8px 28px rgba(212,168,67,0.14)'
                      : '0 0 0 1.5px rgba(140,100,20,0.5), 0 8px 24px rgba(140,100,20,0.12)',
                  }}
                  transition={{ duration: 0.1 }}
                  className="rounded-xl p-6 h-full"
                  style={{
                    border: `1px solid ${c.niCardBord}`,
                    background: c.niCardBg,
                    boxShadow: c.niCardShadow,
                  }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 transition-colors duration-300"
                      style={{ borderColor: c.goldLine }}>
                      <span className="text-[9px] transition-colors duration-300"
                        style={{ color: c.goldSolid }}>{i + 1}</span>
                    </div>
                    <h3 className="text-sm font-medium leading-relaxed transition-colors duration-300"
                      style={{ color: c.goldSolid }}>
                      {teaching.title}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed pl-8 transition-colors duration-300"
                    style={{ color: c.textSecond }}>
                    {teaching.body}
                  </p>
                </motion.div>
              </FadeIn>
            ))}
          </div>

          {/* 声明 */}
          <FadeIn delay={0.2}>
            <div className="mt-8 text-center">
              <p className="text-[11px] tracking-wider leading-relaxed transition-colors duration-300"
                style={{ color: c.textFaint }}>
                本平台的排盘算法、四化规则、星曜解读与大限判断<br />
                均严格依据倪海夏老师的课堂教学内容构建，致敬传承
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ 最终 CTA ══════════════════════════════════════ */}
      <section className="relative z-10 py-40 px-6 text-center"
        style={{ background: c.altSection }}>
        <FadeIn>
          <p className="text-[10px] tracking-[0.6em] uppercase mb-6 transition-colors duration-300"
            style={{ color: c.tagText }}>
            开始你的命盘之旅
          </p>
          <h2 className={`grad-text text-4xl md:text-6xl font-bold mb-8 tracking-tight leading-tight ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'}`}>
            你的紫微命盘<br />等你解读
          </h2>
          <p className="text-sm mb-10 max-w-md mx-auto leading-relaxed transition-colors duration-300"
            style={{ color: c.textSecond }}>
            输入出生年月日时，在几秒内生成你的专属命盘<br />
            再由 AI 按倪海夏体系为你深度解读
          </p>
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: `0 0 60px ${c.glowTint}` }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/chart')}
            className="px-14 py-4 font-semibold text-base tracking-widest rounded-full transition-all duration-300"
            style={{ background: c.ctaBg, color: c.ctaText }}>
            免费起盘
          </motion.button>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 text-center transition-all duration-300"
        style={{ borderTop: `1px solid ${c.niCardBord}` }}>
        <p className="text-[10px] tracking-wider transition-colors duration-300"
          style={{ color: c.footerText }}>
          紫微命盘 · 基于倪海夏正宗体系 · 仅供参考，命运掌握在自己手中
        </p>
      </footer>
    </div>
  );
}

// ─── 四化简介数据 ─────────────────────────────────────────
const SIHUA_BRIEF: Record<string, { attr: string; brief: string }> = {
  '化禄': { attr: '吉化·增益', brief: '福星到宫，主财运与福气增益。所在宫位事物顺遂，能力增强，是命盘中最受欢迎的化星。倪师言：化禄所在，皆得滋润。' },
  '化权': { attr: '吉化·权威', brief: '权力星到宫，主掌控与领导力。所在宫位主强势与决断，喜入官禄宫与命宫，主事业上的实权与执行力。' },
  '化科': { attr: '吉化·名誉', brief: '科名星到宫，主声誉与贵人缘。所在宫位主文名与考运，有贵人扶持，宜学术、考试与公开场合的表现。' },
  '化忌': { attr: '凶化·阻碍', brief: '劫数星到宫，主执念与阻碍。所在宫位需特别关注，该宫人生课题将成为重要考验。倪师言：化忌是命盘最需重视的变量。' },
};

// ─── 主星简介数据 ─────────────────────────────────────────
const STAR_BRIEF: Record<string, { attr: string; brief: string }> = {
  '紫微': { attr: '土·帝王星', brief: '天皇贵星，统御众星。坐命者有孤傲之气，主权威显达，天生具备领导气质，适合独当一面的领导岗位，辰戌宫最佳。' },
  '天机': { attr: '木·智慧星', brief: '益寿星，主智谋与变动。聪慧机灵，善于筹谋，心思细腻，宜从事策划、顾问、技术类工作，一生变动多。' },
  '太阳': { attr: '火·官禄主', brief: '官禄主星，主声誉与名望。慷慨大度，重视公众形象，利官场与公职，男命力强，入庙时光明磊落。' },
  '武曲': { attr: '金·财帛主', brief: '财帛主星，主财务与决断。意志坚定，行动果敢，适合财务、金融、军警类职业，孤克之星，利晚婚。' },
  '天同': { attr: '水·福星', brief: '福德主星，主享乐与人缘。性情温和，人缘极好，注重生活品质，感情细腻，晚年运势佳，福寿双全。' },
  '廉贞': { attr: '火·才艺星', brief: '次桃花星，主才艺与情欲。才华出众，感情丰富，适合艺术、政界，多才多艺但需防桃花是非。' },
  '天府': { attr: '土·财库星', brief: '南斗主星，主财库与积蓄。稳重保守，理财能力强，是命盘的稳定力量，适合管理财务、行政与资产。' },
  '太阴': { attr: '水·田宅主', brief: '田宅主星，主财富与阴柔。细腻温柔，感受力强，女命尤佳，利不动产与积蓄，适合文艺或服务业。' },
  '贪狼': { attr: '木水·桃花', brief: '桃花星，主欲望与才艺。多才多艺，欲望旺盛，社交活跃，宜从事艺术、公关、商业，人缘极好。' },
  '巨门': { attr: '水·是非星', brief: '暗星，主口才与是非。口才出众，思辨能力强，适合律师、教育、媒体，注意口舌是非，以辩才立身。' },
  '天相': { attr: '水·印星', brief: '印星，主辅佐与印绶。善于协调，重视礼节，正直守法，适合幕僚、行政、法律类工作，贵人运佳。' },
  '天梁': { attr: '土·荫星', brief: '荫星，主老成与荫蔽。正直稳重，慈悲心强，老天爷会保佑，适合医疗、社会工作、宗教领域。' },
  '七杀': { attr: '金火·将星', brief: '将星，主刚烈与开创。性格刚毅，行动力强，勇于挑战，适合创业、军警、竞争性行业，逢凶化吉。' },
  '破军': { attr: '水·耗星', brief: '耗星，主变动与开拓。勇于突破，不惧改变，一生变动大但有魄力，适合开拓型工作，走别人没走过的路。' },
};

// ─── 功能视觉装饰 ────────────────────────────────────────
function FeatureVisual({ index, colors: c }: { index: number; colors: ReturnType<typeof useColors> }) {
  if (index === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="grid grid-cols-4 gap-1 w-52">
          {Array.from({ length: 16 }).map((_, i) => {
            const isCenter = [5, 6, 9, 10].includes(i);
            const isActive = [0, 3, 12, 15].includes(i);
            return (
              <motion.div key={i}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="h-11 rounded-sm flex items-center justify-center text-[10px] transition-all duration-300"
                style={{
                  border: `1px solid ${isActive ? c.goldLine : c.cardBorder}`,
                  background: isCenter ? 'transparent' : isActive ? c.starBg : c.featureBg,
                  color: isCenter ? (i === 5 ? c.goldSolid : 'transparent') : isActive ? c.goldSolid : c.textFaint,
                  opacity: isCenter && i !== 5 ? 0 : 1,
                }}>
                {isCenter && i === 5 ? '☯' : isActive ? '★' : ''}
              </motion.div>
            );
          })}
        </div>
        <p className="text-[10px] tracking-widest transition-colors duration-300"
          style={{ color: c.textFaint }}>倪海夏排盘法</p>
      </div>
    );
  }

  if (index === 1) {
    const [sel, setSel] = useState<string | null>(null);
    const selInfo = sel ? (STAR_BRIEF[sel] ?? SIHUA_BRIEF[sel] ?? null) : null;
    return (
      <div className="flex flex-col gap-3 h-full justify-center">
        {[
          { group: '紫微系', stars: ['紫微', '天机', '太阳', '武曲', '天同', '廉贞'] },
          { group: '天府系', stars: ['天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'] },
        ].map(group => (
          <div key={group.group}>
            <div className="text-[9px] tracking-widest mb-1.5 transition-colors duration-300"
              style={{ color: c.textFaint }}>{group.group}</div>
            <div className="flex flex-wrap gap-1">
              {group.stars.map(s => (
                <motion.button
                  key={s}
                  onClick={() => setSel(sel === s ? null : s)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="text-[10px] px-1.5 py-0.5 rounded cursor-pointer"
                  style={{
                    border: `1px solid ${sel === s ? c.goldSolid : c.goldLine}`,
                    color: sel === s ? c.goldSolid : c.goldSolid,
                    background: sel === s ? `${c.goldLine}30` : 'transparent',
                    fontWeight: sel === s ? 600 : 400,
                  }}>
                  {s}
                </motion.button>
              ))}
            </div>
          </div>
        ))}
        <div>
          <div className="text-[9px] tracking-widest mb-1.5 transition-colors duration-300"
            style={{ color: c.textFaint }}>四化飞星</div>
          <div className="flex gap-1.5 flex-wrap">
            {[['化禄', 'rgba(52,211,153,0.7)'], ['化权', 'rgba(96,165,250,0.7)'], ['化科', 'rgba(250,204,21,0.7)'], ['化忌', 'rgba(248,113,113,0.7)']].map(([label, color]) => (
              <motion.button
                key={label}
                onClick={() => setSel(sel === label ? null : label)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="text-[10px] px-2 py-0.5 rounded cursor-pointer"
                style={{
                  border: `1px solid ${color}`,
                  color,
                  background: sel === label ? `${color.replace('0.7', '0.15')}` : 'transparent',
                  fontWeight: sel === label ? 600 : 400,
                }}>
                {label}
              </motion.button>
            ))}
          </div>
        </div>
        {/* 星曜/四化详情展示 */}
        <AnimatePresence mode="wait">
          {selInfo && (
            <motion.div
              key={sel}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl p-3 mt-1"
              style={{
                border: `1px solid ${c.goldLine}`,
                background: c.featureBg,
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[12px] font-semibold" style={{ color: c.goldSolid }}>{sel}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ color: c.tagText, border: `1px solid ${c.goldLine}` }}>{selInfo.attr}</span>
              </div>
              <p className="text-[10px] leading-relaxed" style={{ color: c.textSecond }}>{selInfo.brief}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (index === 2) {
    const msgs = [
      { role: 'user', text: '我今年的事业运势如何？' },
      { role: 'ai', text: '命宫天机化禄，今年大限走官禄宫，三方有左辅相助，事业有贵人提携，适合主动拓展…' },
      { role: 'user', text: '什么时候感情运最好？' },
    ];
    return (
      <div className="flex flex-col gap-2 h-full justify-center">
        {msgs.map((m, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: m.role === 'user' ? 10 : -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[85%] text-[11px] px-3 py-2 rounded-lg leading-relaxed transition-all duration-300"
              style={{
                border: `1px solid ${m.role === 'user' ? c.goldLine : c.cardBorder}`,
                background: m.role === 'user' ? c.starBg : c.featureBg,
                color: m.role === 'user' ? c.goldSolid : c.textSecond,
              }}>
              {m.text}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (index === 3) {
    const patterns = [
      { name: '杀破狼格', desc: '开创进取之命', ok: true },
      { name: '廉相格',   desc: '行政印绶之格', ok: true },
      { name: '化忌入命', desc: '需关注心理课题', ok: false },
    ];
    return (
      <div className="flex flex-col gap-3 h-full justify-center">
        {patterns.map((p, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300"
            style={{
              border: `1px solid ${p.ok ? 'rgba(96,165,250,0.25)' : 'rgba(251,146,60,0.25)'}`,
              background: p.ok ? 'rgba(96,165,250,0.05)' : 'rgba(251,146,60,0.05)',
            }}>
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: p.ok ? 'rgba(96,165,250,0.6)' : 'rgba(251,146,60,0.6)' }} />
            <div>
              <div className="text-[11px] font-medium"
                style={{ color: p.ok ? 'rgba(147,197,253,0.8)' : 'rgba(253,186,116,0.8)' }}>{p.name}</div>
              <div className="text-[10px] transition-colors duration-300" style={{ color: c.textMuted }}>{p.desc}</div>
            </div>
          </motion.div>
        ))}
        <div className="text-[9px] mt-2 tracking-wider text-center transition-colors duration-300"
          style={{ color: c.textFaint }}>自动识别 11 种经典格局</div>
      </div>
    );
  }

  // index === 4: 风水补局
  const elements = [
    { el: '水', icon: '💧', item: '水晶球', color: 'rgba(96,165,250,0.7)', dir: '北方' },
    { el: '火', icon: '🔥', item: '红色挂件', color: 'rgba(248,113,113,0.7)', dir: '南方' },
    { el: '金', icon: '⚙️', item: '金色风车', color: 'rgba(250,204,21,0.7)', dir: '西方' },
    { el: '木', icon: '🌿', item: '绿植盆栽', color: 'rgba(52,211,153,0.7)', dir: '东方' },
  ];
  return (
    <div className="flex flex-col gap-3 h-full justify-center">
      <div className="text-[9px] tracking-[0.4em] mb-2 transition-colors duration-300"
        style={{ color: c.textFaint }}>五行补局示例</div>
      {elements.map((e, i) => (
        <motion.div key={e.el}
          initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
          style={{ border: `1px solid ${e.color}25`, background: `${e.color}08` }}>
          <span className="text-base">{e.icon}</span>
          <div className="flex-1">
            <span className="text-[11px] font-medium" style={{ color: e.color }}>缺{e.el} → {e.item}</span>
          </div>
          <span className="text-[9px] opacity-60" style={{ color: e.color }}>{e.dir}</span>
        </motion.div>
      ))}
      <div className="text-[9px] mt-1 tracking-wider text-center transition-colors duration-300"
        style={{ color: c.textFaint }}>基于命宫五行局精准分析</div>
    </div>
  );
}
