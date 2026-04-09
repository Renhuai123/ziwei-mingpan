import { Solar } from 'lunar-javascript';
import type { BirthInfo, LunarInfo, Star, Palace, DaXian, ZiweiChart } from './types';
import {
  STEMS, BRANCHES, PALACE_NAMES_ORDER,
  NAYIN_ELEMENTS, ELEMENT_TO_JU, JU_NAMES,
  SI_HUA_TABLE, TIANKUI_TABLE, LUCUN_TABLE, TIANMA_TABLE,
  STAR_BRIGHTNESS
} from './constants';

// ─── 农历转换 ───────────────────────────────────────────────
export function getLunarInfo(year: number, month: number, day: number): LunarInfo {
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();

  const yearGanStr = lunar.getYearGan();
  const yearZhiStr = lunar.getYearZhi();
  const yearStem = STEMS.indexOf(yearGanStr);
  const yearBranch = BRANCHES.indexOf(yearZhiStr);
  const rawMonth = lunar.getMonth();

  return {
    lunarYear: lunar.getYear(),
    lunarMonth: Math.abs(rawMonth),
    lunarDay: lunar.getDay(),
    yearStem,
    yearBranch,
    isLeapMonth: rawMonth < 0,
  };
}

// ─── 六十甲子序号 ────────────────────────────────────────────
// 给定天干(0-9)和地支(0-11, 同奇偶), 返回六十甲子序号 0-59
function sexagenaryIndex(stem: number, branch: number): number {
  // x ≡ stem (mod 10), x ≡ branch (mod 12)
  // CRT解: x = stem + 10 * (5 * ((branch - stem) / 2 % 6 + 6) % 6)
  const diff = branch - stem;
  const c = (((diff / 2) % 6) + 6) % 6;
  const k = (5 * c) % 6;
  return (stem + 10 * k) % 60;
}

// ─── 五虎遁年起月法 ─ 寅月天干 ─────────────────────────────
// 甲己→丙(2), 乙庚→戊(4), 丙辛→庚(6), 丁壬→壬(8), 戊癸→甲(0)
function getYinMonthStem(yearStem: number): number {
  return (2 * ((yearStem % 5) + 1)) % 10;
}

// 根据年干和地支，求该宫的天干
function getPalaceStem(yearStem: number, branch: number): number {
  const yinStem = getYinMonthStem(yearStem); // 寅(2)的天干
  return (yinStem + ((branch - 2 + 12) % 12)) % 10;
}

// ─── 命宫 / 身宫 ─────────────────────────────────────────────
export function getMingGongBranch(lunarMonth: number, hourBranch: number): number {
  // 以寅(2)起正月, 逆数生时到命宫
  return ((2 + lunarMonth - 1 - hourBranch) % 12 + 12) % 12;
}

export function getShenGongBranch(lunarMonth: number, hourBranch: number): number {
  return (2 + lunarMonth - 1 + hourBranch) % 12;
}

// ─── 五行局 ──────────────────────────────────────────────────
export function getWuxingJu(yearStem: number, mingGongBranch: number): number {
  const stem = getPalaceStem(yearStem, mingGongBranch);
  const branch = mingGongBranch;
  const idx = sexagenaryIndex(stem, branch);
  const pairIdx = Math.floor(idx / 2);
  const element = NAYIN_ELEMENTS[pairIdx];
  return ELEMENT_TO_JU[element];
}

// ─── 紫微星位置 ──────────────────────────────────────────────
// 公式: n = ceil(day/ju), skip = n*ju - day, pos = (2*(n-1) + skip) % 12
export function getZiweiPosition(lunarDay: number, ju: number): number {
  const n = Math.ceil(lunarDay / ju);
  const skip = n * ju - lunarDay;
  return (2 * (n - 1) + skip) % 12;
}

// ─── 十四主星位置 ────────────────────────────────────────────
export function getMainStarPositions(ziweiPos: number): Record<string, number> {
  const Z = ziweiPos;
  const F = (14 - Z) % 12; // 天府

  return {
    '紫微': Z,
    '天机': (Z + 11) % 12,       // Z-1
    '太阳': (Z + 9) % 12,        // Z-3
    '武曲': (Z + 8) % 12,        // Z-4
    '天同': (Z + 7) % 12,        // Z-5
    '廉贞': (Z + 6) % 12,        // Z-6
    '天府': F,
    '太阴': (F + 1) % 12,
    '贪狼': (F + 2) % 12,
    '巨门': (F + 3) % 12,
    '天相': (F + 4) % 12,
    '天梁': (F + 5) % 12,
    '七杀': (F + 6) % 12,
    '破军': (Z + 5) % 12,        // Z-7, 与巨门同宫
  };
}

// ─── 辅星位置 ────────────────────────────────────────────────
export function getSupportingStarPositions(
  lunarMonth: number,
  hourBranch: number,
  yearStem: number,
  yearBranch: number
): Record<string, number> {
  // 文昌: 从戌起子年, 逆数
  const wenChang = ((10 - yearBranch) % 12 + 12) % 12;

  // 文曲: 从辰起子年, 顺数
  const wenQu = (4 + yearBranch) % 12;

  // 左辅: 从辰起正月, 顺数
  const zuoFu = (4 + lunarMonth - 1) % 12;

  // 右弼: 从戌起正月, 逆数
  const youBi = ((10 - (lunarMonth - 1)) % 12 + 12) % 12;

  // 天魁天钺
  const [tiankui, tianyue] = TIANKUI_TABLE[yearStem] ?? [1, 7];

  // 禄存
  const lucun = LUCUN_TABLE[yearStem] ?? 2;

  // 天马
  const tianma = TIANMA_TABLE[yearBranch] ?? 2;

  // 地空: 从亥起子时, 逆数生时
  const diKong = ((11 - hourBranch) % 12 + 12) % 12;

  // 地劫: 从亥起子时, 顺数生时
  const diJie = (11 + hourBranch) % 12;

  // 火星: 寅午戌年寅时起, 申子辰年戌时起, 巳酉丑年丑时起, 亥卯未年酉时起
  const huoStarts = [11, 2, 11, 9, 11, 2, 2, 9, 11, 2, 9, 9]; // indexed by yearBranch for month... simplified
  // 简化版火星（按年支）
  const huoXingBase: Record<number, number> = { 2:2, 6:2, 10:2, 8:10, 0:10, 4:10, 5:1, 9:1, 1:1, 11:9, 3:9, 7:9 };
  const huoXing = (((huoXingBase[yearBranch] ?? 2) + hourBranch - 1) % 12 + 12) % 12;

  // 铃星
  const lingXingBase: Record<number, number> = { 2:10, 6:10, 10:10, 8:3, 0:3, 4:3, 5:3, 9:3, 1:3, 11:10, 3:10, 7:10 };
  const lingXing = (((lingXingBase[yearBranch] ?? 10) + hourBranch - 1) % 12 + 12) % 12;

  return {
    '文昌': wenChang,
    '文曲': wenQu,
    '左辅': zuoFu,
    '右弼': youBi,
    '天魁': tiankui,
    '天钺': tianyue,
    '禄存': lucun,
    '天马': tianma,
    '地空': diKong,
    '地劫': diJie,
    '火星': huoXing,
    '铃星': lingXing,
  };
}

// ─── 大限 ────────────────────────────────────────────────────
export function getDaXians(
  yearStem: number,
  gender: 'male' | 'female',
  mingGongBranch: number,
  wuxingJu: number,
  palaceNames: string[]
): DaXian[] {
  // 阳年男/阴年女: 顺行; 阴年男/阳年女: 逆行
  const isYangYear = yearStem % 2 === 0;
  const isForward = (isYangYear && gender === 'male') || (!isYangYear && gender === 'female');
  const direction = isForward ? 1 : -1;

  const daXians: DaXian[] = [];
  for (let i = 0; i < 12; i++) {
    const startAge = wuxingJu + i * 10;
    const endAge = startAge + 9;
    const palaceBranch = ((mingGongBranch + direction * i) % 12 + 12) % 12;
    const palaceName = palaceNames[palaceBranch] ?? PALACE_NAMES_ORDER[i];
    daXians.push({ startAge, endAge, palaceBranch, palaceName });
  }
  return daXians;
}

// ─── 宫名分配 ────────────────────────────────────────────────
// 命宫分配到 mingGongBranch，然后顺时针: 兄弟, 夫妻, ...
export function getPalaceNames(mingGongBranch: number): Record<number, string> {
  const names: Record<number, string> = {};
  for (let i = 0; i < 12; i++) {
    const branch = (mingGongBranch + i) % 12;
    names[branch] = PALACE_NAMES_ORDER[i];
  }
  return names;
}

// ─── 主星亮度 ─────────────────────────────────────────────────
function getStarBrightness(starName: string, branch: number): string {
  const table = STAR_BRIGHTNESS[starName];
  if (!table) return 'normal';
  return table[branch] ?? 'normal';
}

// ─── 完整命盘生成 ────────────────────────────────────────────
export function generateChart(birthInfo: BirthInfo): ZiweiChart {
  const { year, month, day, hour: hourBranch, gender } = birthInfo;

  // 1. 农历信息
  const lunarInfo = getLunarInfo(year, month, day);
  const { lunarMonth, lunarDay, yearStem, yearBranch } = lunarInfo;

  // 2. 命宫 / 身宫
  const mingGongBranch = getMingGongBranch(lunarMonth, hourBranch);
  const shenGongBranch = getShenGongBranch(lunarMonth, hourBranch);

  // 3. 五行局
  const wuxingJu = getWuxingJu(yearStem, mingGongBranch);
  const wuxingJuName = JU_NAMES[wuxingJu];

  // 4. 紫微星位置
  const ziweiPos = getZiweiPosition(lunarDay, wuxingJu);

  // 5. 十四主星
  const mainStars = getMainStarPositions(ziweiPos);

  // 6. 辅星
  const supportStars = getSupportingStarPositions(lunarMonth, hourBranch, yearStem, yearBranch);

  // 7. 四化（本命年干四化）
  const siHua = SI_HUA_TABLE[yearStem] ?? ['', '', '', ''];
  const siHuaMap: Record<string, '禄' | '权' | '科' | '忌'> = {
    [siHua[0]]: '禄',
    [siHua[1]]: '权',
    [siHua[2]]: '科',
    [siHua[3]]: '忌',
  };

  // 8. 宫名分配
  const palaceNameMap = getPalaceNames(mingGongBranch);

  // 9. 大限
  const daXians = getDaXians(yearStem, gender, mingGongBranch, wuxingJu, Object.values(palaceNameMap));

  // 10. 当前年龄和大限
  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - year;
  const currentDaXianIndex = daXians.findIndex(
    (dx) => currentAge >= dx.startAge && currentAge <= dx.endAge
  );

  // 11. 组装十二宫
  const palaces: Palace[] = [];
  for (let b = 0; b < 12; b++) {
    const stars: Star[] = [];

    // 主星
    for (const [name, pos] of Object.entries(mainStars)) {
      if (pos === b) {
        const brightness = getStarBrightness(name, b);
        const siHuaVal = siHuaMap[name];
        stars.push({
          name,
          type: 'major',
          brightness: brightness as 'bright' | 'normal' | 'dim',
          siHua: siHuaVal,
        });
      }
    }

    // 辅星
    const supportStarTypes: Record<string, Star['type']> = {
      '文昌': 'lucky', '文曲': 'lucky', '左辅': 'lucky', '右弼': 'lucky',
      '天魁': 'lucky', '天钺': 'lucky', '禄存': 'lucky', '天马': 'lucky',
      '地空': 'sha', '地劫': 'sha', '火星': 'sha', '铃星': 'sha',
    };
    for (const [name, pos] of Object.entries(supportStars)) {
      if (pos === b) {
        const siHuaVal = siHuaMap[name];
        stars.push({
          name,
          type: supportStarTypes[name] ?? 'minor',
          siHua: siHuaVal,
        });
      }
    }

    const daXianEntry = daXians.find((dx) => dx.palaceBranch === b);

    palaces.push({
      branch: b,
      stem: getPalaceStem(yearStem, b),
      name: palaceNameMap[b] ?? '',
      stars,
      daXianAge: daXianEntry ? [daXianEntry.startAge, daXianEntry.endAge] : undefined,
      isCurrentDaXian: daXianEntry ? daXians.indexOf(daXianEntry) === currentDaXianIndex : false,
      isMingGong: b === mingGongBranch,
      isShenGong: b === shenGongBranch,
    });
  }

  return {
    birthInfo,
    lunarInfo,
    mingGongBranch,
    shenGongBranch,
    wuxingJu,
    wuxingJuName,
    ziweiPos,
    palaces,
    daXians,
    currentAge,
    currentDaXianIndex,
  };
}
