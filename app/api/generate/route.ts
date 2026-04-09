import { NextRequest, NextResponse } from 'next/server';
import { generateChart } from '@/lib/ziwei/algorithm';
import type { BirthInfo } from '@/lib/ziwei/types';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body: BirthInfo = await req.json();

    // 基本校验
    const { year, month, day, hour, gender } = body;
    if (!year || !month || !day || hour === undefined || !gender) {
      return NextResponse.json({ error: '请提供完整的出生信息' }, { status: 400 });
    }
    if (year < 1900 || year > 2050) {
      return NextResponse.json({ error: '出生年份需在1900-2050之间' }, { status: 400 });
    }
    if (month < 1 || month > 12) {
      return NextResponse.json({ error: '月份无效' }, { status: 400 });
    }
    if (day < 1 || day > 31) {
      return NextResponse.json({ error: '日期无效' }, { status: 400 });
    }
    if (hour < 0 || hour > 11) {
      return NextResponse.json({ error: '时辰无效' }, { status: 400 });
    }

    const chart = generateChart(body);
    return NextResponse.json(chart);
  } catch (err) {
    console.error('Chart generation error:', err);
    const message = err instanceof Error ? err.message : '命盘生成失败';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
