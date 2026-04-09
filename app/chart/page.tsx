'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import StarField from '@/components/StarField';
import BirthForm from '@/components/BirthForm';
import { useTheme } from '@/components/ThemeProvider';
import ChartBoard from '@/components/ChartBoard';
import ChartSummary from '@/components/ChartSummary';
import ChatPanel from '@/components/ChatPanel';
import StarDetailPanel from '@/components/StarDetailPanel';
import FengShuiPanel from '@/components/FengShuiPanel';
import type { BirthInfo, ZiweiChart, Star, Palace } from '@/lib/ziwei/types';

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.93 }}
      aria-label={isDark ? '切换亮色主题' : '切换暗色主题'}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
      style={{
        borderColor: 'var(--t-border-acc)',
        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,252,242,0.85)',
      }}
    >
      <div className="relative w-7 h-3.5 rounded-full flex-shrink-0"
        style={{ background: isDark ? 'rgba(12,24,64,0.95)' : 'rgba(230,195,80,0.55)' }}>
        <motion.div
          animate={{ x: isDark ? 1 : 14 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="absolute top-[3px] w-2.5 h-2.5 rounded-full"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #b8a050, #e8d090)'
              : 'linear-gradient(135deg, #e89010, #f8d050)',
          }}
        />
      </div>
      <span className="text-[10px] font-medium tracking-wide select-none"
        style={{ color: 'var(--t-gold)' }}>
        {isDark ? '暗色' : '亮色'}
      </span>
    </motion.button>
  );
}

export default function ChartPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [chart, setChart] = useState<ZiweiChart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedStar, setSelectedStar] = useState<Star | null>(null);
  const [selectedStarPalace, setSelectedStarPalace] = useState<string>('');
  const [rightPanel, setRightPanel] = useState<'ai' | 'detail' | 'fengshui'>('ai');

  const isDark = theme === 'dark';

  const handleSubmit = async (info: BirthInfo) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? '命盘生成失败');
      }
      const data: ZiweiChart = await res.json();
      setChart(data);
      setSelectedStar(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleStarSelect = (star: Star, palace: Palace) => {
    setSelectedStar(star);
    setSelectedStarPalace(palace.name);
    setRightPanel('detail');
  };

  const handleReset = () => {
    setChart(null);
    setError('');
    setSelectedStar(null);
    setRightPanel('ai');
  };

  const TABS = [
    { key: 'ai', label: 'AI 解读' },
    { key: 'detail', label: '星曜详解' },
    { key: 'fengshui', label: '风水补局' },
  ] as const;

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: 'var(--t-bg)', transition: 'background 0.35s ease' }}>
      <StarField />

      {/* 顶部光晕 */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[80px]"
          style={{ background: 'var(--t-glow1)' }} />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* ─── 顶部导航 ─── */}
        <header
          className="flex items-center justify-between px-5 py-2.5 border-b sticky top-0 z-20"
          style={{
            background: 'var(--t-nav-bg)',
            borderColor: 'var(--t-border)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          }}
        >
          <motion.button
            onClick={() => router.push('/')}
            whileHover={{ x: -2 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5 text-xs"
            style={{ color: 'var(--t-faint)' }}
          >
            <span className="text-base leading-none">‹</span>
            <span className="tracking-wide">返回</span>
          </motion.button>

          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--t-gold)', opacity: 0.4 }} className="text-xs">☯</span>
            <span className="text-xs tracking-[0.3em]" style={{ color: 'var(--t-gold)' }}>紫微命盘</span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {chart && (
              <button
                onClick={handleReset}
                className="text-[10px] transition-colors border px-2.5 py-1 rounded-full"
                style={{ color: 'var(--t-gold)', borderColor: 'var(--t-border-acc)', opacity: 0.8 }}
              >
                重新起盘
              </button>
            )}
          </div>
        </header>

        <div className="flex-1">
          <AnimatePresence mode="wait">
            {!chart ? (
              /* ─── 输入表单 ─── */
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3 }}
                className="max-w-md mx-auto px-4 pt-10 pb-16"
              >
                <div className="text-center mb-7">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: 'spring' }}
                    className="text-5xl mb-3 select-none"
                    style={{ color: 'var(--t-faint)', opacity: 0.3 }}
                  >
                    ☯
                  </motion.div>
                  <h1 className="text-xl tracking-[0.25em] font-medium mb-1" style={{ color: 'var(--t-gold)' }}>
                    起紫微命盘
                  </h1>
                  <p className="text-[11px]" style={{ color: 'var(--t-faint)' }}>输入出生年月日时 · 以公历为准</p>
                </div>
                <BirthForm onSubmit={handleSubmit} loading={loading} />
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 p-3 bg-red-950/20 border border-red-800/30 rounded-xl text-red-400/80 text-xs text-center"
                  >
                    {error}
                  </motion.div>
                )}
              </motion.div>
            ) : (
              /* ─── 命盘视图 ─── */
              <motion.div
                key="chart"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="p-3 md:p-5"
              >
                <div className="max-w-[1440px] mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-[minmax(480px,560px)_1fr_380px] gap-5 items-start">

                    {/* ── 左栏: 命盘 ── */}
                    <div>
                      <ChartBoard chart={chart} onStarSelect={handleStarSelect} />
                    </div>

                    {/* ── 中栏: 命格摘要 ── */}
                    <div>
                      <ChartSummary chart={chart} />
                    </div>

                    {/* ── 右栏: AI解读 / 星曜详情 / 风水 ── */}
                    <div className="lg:sticky lg:top-16" style={{ height: 'calc(100vh - 80px)', maxHeight: '800px' }}>
                      {/* 切换标签 — 圆角胶囊式 */}
                      <div
                        className="flex mb-3 rounded-xl overflow-hidden p-1 gap-1"
                        style={{ background: 'var(--t-surface)', border: '1px solid var(--t-border)' }}
                      >
                        {TABS.map(tab => {
                          const isActive = rightPanel === tab.key;
                          return (
                            <button
                              key={tab.key}
                              onClick={() => setRightPanel(tab.key as 'ai' | 'detail' | 'fengshui')}
                              className="relative flex-1 py-2 text-[11px] font-medium rounded-lg transition-all duration-200"
                              style={{
                                background: isActive
                                  ? isDark ? 'rgba(212,168,67,0.12)' : 'rgba(180,130,40,0.12)'
                                  : 'transparent',
                                color: isActive ? 'var(--t-gold)' : 'var(--t-faint)',
                                boxShadow: isActive
                                  ? isDark
                                    ? 'inset 0 0 0 1px rgba(212,168,67,0.2)'
                                    : 'inset 0 0 0 1px rgba(140,100,20,0.2), 0 1px 3px rgba(0,0,0,0.05)'
                                  : 'none',
                              }}
                            >
                              {tab.label}
                              {tab.key === 'detail' && selectedStar && (
                                <span className="ml-1 opacity-60">· {selectedStar.name}</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <div className="h-[calc(100%-52px)]">
                        <AnimatePresence mode="wait">
                          {rightPanel === 'ai' ? (
                            <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                              <ChatPanel chart={chart} />
                            </motion.div>
                          ) : rightPanel === 'fengshui' ? (
                            <motion.div key="fengshui" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                              <FengShuiPanel chart={chart} />
                            </motion.div>
                          ) : (
                            <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto">
                              {selectedStar ? (
                                <StarDetailPanel
                                  star={selectedStar}
                                  palaceName={selectedStarPalace}
                                  onClose={() => { setSelectedStar(null); setRightPanel('ai'); }}
                                />
                              ) : (
                                <div
                                  className="h-full flex flex-col items-center justify-center text-center p-8 rounded-xl card-glass"
                                >
                                  <div className="text-4xl mb-4" style={{ color: 'var(--t-gold)', opacity: 0.15 }}>✦</div>
                                  <p className="text-xs leading-relaxed" style={{ color: 'var(--t-faint)' }}>
                                    点击命盘中任意<br />
                                    <span style={{ color: 'var(--t-gold)', opacity: 0.7 }}>主星名字</span>
                                    <br />查看倪海夏详细解读
                                  </p>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* 移动端下方星曜详情 */}
                  {selectedStar && (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 lg:hidden"
                    >
                      <StarDetailPanel
                        star={selectedStar}
                        palaceName={selectedStarPalace}
                        onClose={() => setSelectedStar(null)}
                      />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
