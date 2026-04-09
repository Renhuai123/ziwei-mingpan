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
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
      style={{
        borderColor: isDark ? 'rgba(212,168,67,0.3)' : 'rgba(140,100,20,0.35)',
        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,252,242,0.85)',
      }}
    >
      <div className="relative w-8 h-4 rounded-full flex-shrink-0"
        style={{ background: isDark ? 'rgba(12,24,64,0.95)' : 'rgba(230,195,80,0.55)' }}>
        <motion.div
          animate={{ x: isDark ? 2 : 16 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="absolute top-0.5 w-3 h-3 rounded-full"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, #b8a050, #e8d090)'
              : 'linear-gradient(135deg, #e89010, #f8d050)',
          }}
        />
      </div>
      <span className="text-[10px] font-medium tracking-wide select-none"
        style={{ color: isDark ? 'rgba(212,180,100,0.85)' : 'rgba(110,72,8,0.8)' }}>
        {isDark ? '🌙' : '☀️'}
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
  // 右侧面板模式: 'ai' | 'detail' | 'fengshui'
  const [rightPanel, setRightPanel] = useState<'ai' | 'detail' | 'fengshui'>('ai');

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

  const isDark = theme === 'dark';
  const bgBase = isDark ? '#020810' : '#f5efe0';
  const headerBg = isDark ? 'rgba(2,8,16,0.88)' : 'rgba(250,245,235,0.92)';
  const headerBorder = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(160,120,30,0.15)';

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: bgBase, transition: 'background 0.35s ease' }}>
      <StarField />

      {/* 顶部光晕 */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-900/4 rounded-full blur-[80px]" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-950/20 rounded-full blur-[60px]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* 顶部导航 */}
        <header className="flex items-center justify-between px-5 py-3 border-b sticky top-0 z-20"
          style={{
            background: headerBg,
            borderColor: headerBorder,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}>
          <motion.button
            onClick={() => router.push('/')}
            whileHover={{ x: -2 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5 transition-colors text-xs group"
            style={{ color: isDark ? 'rgba(212,168,67,0.55)' : 'rgba(140,90,10,0.7)' }}
            onMouseEnter={e => (e.currentTarget.style.color = isDark ? 'rgba(212,168,67,0.9)' : 'rgba(140,90,10,1)')}
            onMouseLeave={e => (e.currentTarget.style.color = isDark ? 'rgba(212,168,67,0.55)' : 'rgba(140,90,10,0.7)')}
          >
            <span className="text-base leading-none">‹</span>
            <span className="tracking-wide">返回</span>
          </motion.button>
          <div className="flex items-center gap-2">
            <span style={{ color: isDark ? 'rgba(212,168,67,0.4)' : 'rgba(140,90,10,0.5)' }} className="text-xs">☯</span>
            <span className="text-xs tracking-[0.3em]" style={{ color: isDark ? 'rgba(212,168,67,0.6)' : 'rgba(120,70,8,0.8)' }}>紫微命盘</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {chart ? (
              <button
                onClick={handleReset}
                className="text-[10px] transition-colors border px-2 py-1 rounded"
                style={{
                  color: isDark ? 'rgba(212,168,67,0.6)' : 'rgba(120,70,8,0.8)',
                  borderColor: isDark ? 'rgba(212,168,67,0.2)' : 'rgba(140,90,10,0.25)',
                }}
              >
                重新起盘
              </button>
            ) : (
              <div className="w-16" />
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
                    className="text-5xl mb-3 text-amber-800/30 select-none"
                  >
                    ☯
                  </motion.div>
                  <h1 className="text-amber-400/90 text-xl tracking-[0.25em] font-medium mb-1">
                    起紫微命盘
                  </h1>
                  <p className="text-[11px] text-[#2a4060]">输入出生年月日时 · 以公历为准</p>
                </div>

                <BirthForm onSubmit={handleSubmit} loading={loading} />

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 p-3 bg-red-950/20 border border-red-800/30 rounded text-red-400/80 text-xs text-center"
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
                {/* 主体三栏布局：命盘 | 摘要 | 右侧面板 */}
                <div className="max-w-[1400px] mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-[minmax(480px,560px)_1fr_360px] gap-4 items-start">

                    {/* ── 左栏: 命盘 ── */}
                    <div>
                      <ChartBoard
                        chart={chart}
                        onStarSelect={handleStarSelect}
                      />
                    </div>

                    {/* ── 中栏: 命格摘要 ── */}
                    <div>
                      <ChartSummary chart={chart} />
                    </div>

                    {/* ── 右栏: AI解读 / 星曜详情 ── */}
                    <div className="lg:sticky lg:top-16" style={{ height: 'calc(100vh - 80px)', maxHeight: '780px' }}>
                      {/* 切换标签 */}
                      <div className="flex mb-2 border border-[#0a1e38] rounded overflow-hidden">
                        {[
                          { key: 'ai', label: 'AI 解读' },
                          { key: 'detail', label: '星曜详解' },
                          { key: 'fengshui', label: '风水补局' },
                        ].map(tab => (
                          <button
                            key={tab.key}
                            onClick={() => setRightPanel(tab.key as 'ai' | 'detail' | 'fengshui')}
                            className={`flex-1 py-1.5 text-[11px] transition-colors ${
                              rightPanel === tab.key
                                ? 'bg-amber-900/30 text-amber-400 border-b border-amber-700/40'
                                : 'text-[#2a4060] hover:text-[#3a5a80]'
                            }`}
                          >
                            {tab.label}
                            {tab.key === 'detail' && selectedStar && (
                              <span className="ml-1 text-amber-500/60">· {selectedStar.name}</span>
                            )}
                          </button>
                        ))}
                      </div>

                      <div className="h-[calc(100%-36px)]">
                        <AnimatePresence mode="wait">
                          {rightPanel === 'ai' ? (
                            <motion.div
                              key="ai"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="h-full"
                            >
                              <ChatPanel chart={chart} />
                            </motion.div>
                          ) : rightPanel === 'fengshui' ? (
                            <motion.div
                              key="fengshui"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="h-full"
                            >
                              <FengShuiPanel chart={chart} />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="detail"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="h-full overflow-y-auto"
                            >
                              {selectedStar ? (
                                <StarDetailPanel
                                  star={selectedStar}
                                  palaceName={selectedStarPalace}
                                  onClose={() => {
                                    setSelectedStar(null);
                                    setRightPanel('ai');
                                  }}
                                />
                              ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-[#0a1e38] rounded-lg bg-[#060c1a]">
                                  <div className="text-4xl text-amber-900/20 mb-4">✦</div>
                                  <p className="text-[#1e3550] text-xs leading-relaxed">
                                    点击命盘中任意<br />
                                    <span className="text-amber-800/50">主星名字</span>
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
