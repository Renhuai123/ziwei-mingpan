'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { BirthInfo } from '@/lib/ziwei/types';
import { SHICHEN } from '@/lib/ziwei/constants';
import { useTheme } from '@/components/ThemeProvider';
import { PROVINCES } from '@/lib/ziwei/cities';

export interface BirthFormState {
  name: string;
  year: string;
  month: string;
  day: string;
  clockHour: string;
  clockMinute: string;
  unknownTime: boolean;
  province: string;
  city: string;
  longitude: number;
  gender: 'male' | 'female';
}

interface BirthFormProps {
  onSubmit: (info: BirthInfo) => void;
  loading?: boolean;
  initialData?: Partial<BirthFormState>;
  onFormSave?: (data: BirthFormState) => void;
}

const SHICHEN_NAMES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/** 根据北京时间 + 经度计算真太阳时时辰支 (0-11) */
function calcTrueSolarBranch(clockHour: number, clockMinute: number, longitude: number): number {
  const clockMins = clockHour * 60 + clockMinute;
  const offset = (longitude - 120) * 4; // 每度4分钟
  const solar = ((clockMins + offset) % 1440 + 1440) % 1440;
  if (solar >= 1380 || solar < 60) return 0; // 子时
  return Math.floor((solar - 60) / 120) + 1;
}

export default function BirthForm({ onSubmit, loading, initialData, onFormSave }: BirthFormProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [form, setForm] = useState<BirthFormState>({
    name: initialData?.name ?? '',
    year: initialData?.year ?? '',
    month: initialData?.month ?? '',
    day: initialData?.day ?? '',
    clockHour: initialData?.clockHour ?? '8',
    clockMinute: initialData?.clockMinute ?? '0',
    unknownTime: initialData?.unknownTime ?? false,
    province: initialData?.province ?? '',
    city: initialData?.city ?? '',
    longitude: initialData?.longitude ?? 120,
    gender: initialData?.gender ?? 'male',
  });

  // 根据省份动态生成城市列表
  const cityList = useMemo(() => {
    const prov = PROVINCES.find(p => p.name === form.province);
    return prov ? prov.cities : [];
  }, [form.province]);

  // 计算真太阳时时辰支
  const branch = useMemo(() => {
    if (form.unknownTime) return 0;
    return calcTrueSolarBranch(
      parseInt(form.clockHour) || 0,
      parseInt(form.clockMinute) || 0,
      form.longitude,
    );
  }, [form.clockHour, form.clockMinute, form.longitude, form.unknownTime]);

  const offsetMin = Math.round((form.longitude - 120) * 4);
  const shichenInfo = SHICHEN[branch];

  const handleProvince = (prov: string) => {
    const provData = PROVINCES.find(p => p.name === prov);
    const firstCity = provData?.cities[0];
    setForm({
      ...form,
      province: prov,
      city: firstCity?.name || '',
      longitude: firstCity?.longitude ?? 120,
    });
  };

  const handleCity = (cityName: string) => {
    const prov = PROVINCES.find(p => p.name === form.province);
    const cityData = prov?.cities.find(c => c.name === cityName);
    setForm({ ...form, city: cityName, longitude: cityData?.longitude ?? 120 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const y = parseInt(form.year);
    const m = parseInt(form.month);
    const d = parseInt(form.day);
    if (!y || !m || !d || y < 1900 || y > 2050) return;
    onFormSave?.({ ...form });
    onSubmit({
      year: y, month: m, day: d,
      hour: branch,
      gender: form.gender,
      name: form.name || undefined,
      province: form.province || undefined,
      city: form.city || undefined,
      longitude: form.province ? form.longitude : undefined,
    });
  };

  // ─── 主题自适应样式 ──────────────────────────────────────
  const formClass = isDark
    ? 'bg-space-800/80 border-palace-border/50'
    : 'bg-white/90 border-amber-200/60 shadow-lg shadow-amber-100/40';

  const titleClass = isDark ? 'text-gold' : 'text-amber-700';

  const labelClass = isDark
    ? 'block text-[11px] text-[#4a7090] mb-2 tracking-wide'
    : 'block text-[11px] text-amber-800/60 mb-2 tracking-wide';

  const inputClass = isDark
    ? 'w-full bg-space-700 border border-palace-border text-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50 focus:bg-space-600 transition-colors placeholder-slate-600'
    : 'w-full bg-amber-50/50 border border-amber-200/60 text-gray-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400/70 focus:bg-white transition-colors placeholder-gray-400';

  const noteClass = isDark ? 'text-[10px] text-[#2a4060] mt-1.5' : 'text-[10px] text-amber-700/40 mt-1.5';
  const infoClass = isDark ? 'text-[10px] text-[#2a5070] mt-1.5' : 'text-[10px] text-amber-700/50 mt-1.5';

  const timePanelClass = isDark
    ? 'rounded-2xl p-3 bg-space-700/40 border border-palace-border/30'
    : 'rounded-2xl p-3 bg-amber-50/60 border border-amber-200/40';

  const shichenResultClass = isDark ? 'text-gold font-semibold tracking-wide' : 'text-amber-600 font-semibold tracking-wide';
  const shichenSubClass = isDark ? 'text-[11px] text-[#3a6080]' : 'text-[11px] text-amber-600/60';

  const checkboxLabelClass = isDark
    ? 'text-[10px] text-[#3a5070] cursor-pointer'
    : 'text-[10px] text-amber-700/50 cursor-pointer';

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`border rounded-3xl p-7 backdrop-blur-sm ${formClass}`}
    >
      <h3 className={`text-sm font-medium tracking-widest mb-5 text-center ${titleClass}`}>
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

      {/* 出生地点 */}
      <div className="mb-4">
        <label className={labelClass}>出生地点（用于真太阳时校正）</label>
        <div className="grid grid-cols-2 gap-2">
          <select
            value={form.province}
            onChange={e => handleProvince(e.target.value)}
            className={inputClass}
          >
            <option value="">省份 / 直辖市</option>
            {PROVINCES.map(p => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>
          <select
            value={form.city}
            onChange={e => handleCity(e.target.value)}
            className={`${inputClass} ${!form.province ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!form.province}
          >
            <option value="">{form.province ? '城市' : '先选省份'}</option>
            {cityList.map(c => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        {form.province ? (
          <p className={infoClass}>
            {form.city || '（请选择城市）'} · 经度 {form.longitude.toFixed(1)}°E
            · 时差&nbsp;
            <span className="font-medium">
              {offsetMin > 0 ? '+' : ''}{offsetMin} 分钟
            </span>
          </p>
        ) : (
          <p className={noteClass}>
            * 倪海夏批命用真太阳时，建议填写出生地以自动校正时辰
          </p>
        )}
      </div>

      {/* 出生时间 */}
      <div className="mb-4">
        <label className={labelClass}>出生时间（北京时间）</label>
        <div className={`${timePanelClass} ${form.unknownTime ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <select
              value={form.clockHour}
              onChange={e => setForm({ ...form, clockHour: e.target.value })}
              className={inputClass}
            >
              {Array.from({ length: 24 }, (_, i) => i).map(h => (
                <option key={h} value={String(h)}>
                  {h.toString().padStart(2, '0')} 时
                </option>
              ))}
            </select>
            <select
              value={form.clockMinute}
              onChange={e => setForm({ ...form, clockMinute: e.target.value })}
              className={inputClass}
            >
              {Array.from({ length: 60 }, (_, i) => i).map(min => (
                <option key={min} value={String(min)}>
                  {min.toString().padStart(2, '0')} 分
                </option>
              ))}
            </select>
          </div>
          {/* 真太阳时结果 */}
          <div className="text-center py-1">
            <span className={shichenSubClass}>真太阳时 →</span>
            <span className={`ml-1.5 text-[15px] ${shichenResultClass}`}>
              {SHICHEN_NAMES[branch]}时
            </span>
            {shichenInfo && (
              <span className={`ml-1 ${shichenSubClass}`}>
                （{shichenInfo.range}）
              </span>
            )}
          </div>
        </div>
        <label className="flex items-center gap-2 mt-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.unknownTime}
            onChange={e => setForm({ ...form, unknownTime: e.target.checked })}
            className="w-3.5 h-3.5 rounded cursor-pointer"
          />
          <span className={checkboxLabelClass}>
            不知道出生时间，以子时（23:00–01:00）起盘
          </span>
        </label>
      </div>

      {/* 性别 */}
      <div className="mb-5">
        <label className={labelClass}>性别</label>
        <div className="flex gap-3">
          {/* 男 — 蓝色主题 */}
          <button
            type="button"
            onClick={() => setForm({ ...form, gender: 'male' })}
            className={`flex-1 py-3 rounded-2xl text-sm border font-medium transition-all ${
              form.gender === 'male'
                ? isDark
                  ? 'border-blue-400/70 text-blue-300 bg-blue-500/10'
                  : 'border-blue-400/60 text-blue-600 bg-blue-50'
                : isDark
                  ? 'border-palace-border text-slate-500 hover:border-blue-400/40 hover:text-blue-400/60'
                  : 'border-amber-200/60 text-gray-400 hover:border-blue-300/60 hover:text-blue-500/60'
            }`}
          >
            ♂ 男
          </button>
          {/* 女 — 玫瑰色主题 */}
          <button
            type="button"
            onClick={() => setForm({ ...form, gender: 'female' })}
            className={`flex-1 py-3 rounded-2xl text-sm border font-medium transition-all ${
              form.gender === 'female'
                ? isDark
                  ? 'border-rose-400/70 text-rose-300 bg-rose-500/10'
                  : 'border-rose-400/60 text-rose-600 bg-rose-50'
                : isDark
                  ? 'border-palace-border text-slate-500 hover:border-rose-400/40 hover:text-rose-400/60'
                  : 'border-amber-200/60 text-gray-400 hover:border-rose-300/60 hover:text-rose-500/60'
            }`}
          >
            ♀ 女
          </button>
        </div>
      </div>

      {/* 提交 */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3.5 rounded-2xl text-sm font-medium tracking-widest transition-all ${
          loading
            ? 'bg-gold/20 text-gold/50 cursor-not-allowed'
            : isDark
              ? 'bg-gradient-to-r from-gold/80 to-gold-bright/80 text-space-950 hover:from-gold hover:to-gold-bright active:scale-95'
              : 'bg-gradient-to-r from-amber-500 to-amber-400 text-white hover:from-amber-600 hover:to-amber-500 active:scale-95 shadow-md shadow-amber-200/50'
        }`}
      >
        {loading ? '紫微起盘中...' : '立即起盘 · 解命运密码'}
      </button>
    </motion.form>
  );
}
