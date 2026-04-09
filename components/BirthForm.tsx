'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import type { BirthInfo } from '@/lib/ziwei/types';
import { SHICHEN } from '@/lib/ziwei/constants';

interface BirthFormProps {
  onSubmit: (info: BirthInfo) => void;
  loading?: boolean;
}

export default function BirthForm({ onSubmit, loading }: BirthFormProps) {
  const [form, setForm] = useState({
    name: '',
    year: '',
    month: '',
    day: '',
    hour: '0',
    gender: 'male' as 'male' | 'female',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const y = parseInt(form.year);
    const m = parseInt(form.month);
    const d = parseInt(form.day);
    if (!y || !m || !d || y < 1900 || y > 2050) return;
    onSubmit({
      year: y, month: m, day: d,
      hour: parseInt(form.hour),
      gender: form.gender,
      name: form.name || undefined,
    });
  };

  const inputClass = "w-full bg-space-700 border border-palace-border text-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50 focus:bg-space-600 transition-colors placeholder-slate-600";
  const labelClass = "block text-[11px] text-[#4a7090] mb-2 tracking-wide";

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-space-800/80 border border-palace-border/50 rounded-3xl p-7 backdrop-blur-sm"
    >
      <h3 className="text-gold text-sm font-medium tracking-widest mb-5 text-center">
        ── 输入生辰八字 ──
      </h3>

      {/* 姓名 */}
      <div className="mb-4">
        <label className={labelClass}>姓名（可选）</label>
        <input
          type="text"
          placeholder="请输入姓名"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className={inputClass}
        />
      </div>

      {/* 出生日期 */}
      <div className="mb-4">
        <label className={labelClass}>出生日期（公历）</label>
        <div className="grid grid-cols-3 gap-2">
          <select
            value={form.year}
            onChange={e => setForm({ ...form, year: e.target.value })}
            className={inputClass}
            required
          >
            <option value="">年份</option>
            {Array.from({ length: 71 }, (_, i) => 2026 - i).map(y => (
              <option key={y} value={String(y)}>{y} 年</option>
            ))}
          </select>
          <select
            value={form.month}
            onChange={e => setForm({ ...form, month: e.target.value })}
            className={inputClass}
            required
          >
            <option value="">月份</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={String(m)}>{m} 月</option>
            ))}
          </select>
          <select
            value={form.day}
            onChange={e => setForm({ ...form, day: e.target.value })}
            className={inputClass}
            required
          >
            <option value="">日期</option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
              <option key={d} value={String(d)}>{d} 日</option>
            ))}
          </select>
        </div>
      </div>

      {/* 出生时辰 */}
      <div className="mb-4">
        <label className={labelClass}>出生时辰</label>
        <select
          value={form.hour}
          onChange={e => setForm({ ...form, hour: e.target.value })}
          className={inputClass}
        >
          {SHICHEN.map(s => (
            <option key={s.branch} value={s.branch}>
              {s.name} ({s.range})
            </option>
          ))}
        </select>
        <p className="text-[10px] text-[#2a4060] mt-1">
          * 不知道时辰可选子时，会影响命宫和部分星曜
        </p>
      </div>

      {/* 性别 */}
      <div className="mb-5">
        <label className={labelClass}>性别</label>
        <div className="flex gap-3">
          {(['male', 'female'] as const).map(g => (
            <button
              key={g}
              type="button"
              onClick={() => setForm({ ...form, gender: g })}
              className={`flex-1 py-3 rounded-2xl text-sm border transition-all ${
                form.gender === g
                  ? 'border-gold/60 text-gold bg-gold/10'
                  : 'border-palace-border text-slate-500 hover:border-palace-hover'
              }`}
            >
              {g === 'male' ? '♂ 男' : '♀ 女'}
            </button>
          ))}
        </div>
      </div>

      {/* 提交 */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3.5 rounded-2xl text-sm font-medium tracking-widest transition-all ${
          loading
            ? 'bg-gold/20 text-gold/50 cursor-not-allowed'
            : 'bg-gradient-to-r from-gold/80 to-gold-bright/80 text-space-950 hover:from-gold hover:to-gold-bright active:scale-95'
        }`}
      >
        {loading ? '紫微起盘中...' : '立即起盘 · 解命运密码'}
      </button>
    </motion.form>
  );
}
