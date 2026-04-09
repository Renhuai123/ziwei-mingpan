import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'edge';
import type { ZiweiChart } from '@/lib/ziwei/types';
import { STEMS, BRANCHES, STAR_DESCRIPTIONS } from '@/lib/ziwei/constants';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function buildChartContext(chart: ZiweiChart): string {
  const { birthInfo, lunarInfo, mingGongBranch, shenGongBranch, wuxingJuName, palaces, daXians, currentDaXianIndex, currentAge } = chart;

  // 命宫主星
  const mingPalace = palaces.find(p => p.branch === mingGongBranch);
  const mingMajorStars = mingPalace?.stars.filter(s => s.type === 'major').map(s => {
    const siHuaStr = s.siHua ? `化${s.siHua}` : '';
    return `${s.name}${siHuaStr}`;
  }).join('、') ?? '空宫';

  // 身宫主星
  const shenPalace = palaces.find(p => p.branch === shenGongBranch);
  const shenMajorStars = shenPalace?.stars.filter(s => s.type === 'major').map(s => s.name).join('、') ?? '空宫';

  // 当前大限
  const currentDx = daXians[currentDaXianIndex];

  // 各宫详细信息
  const palaceDetails = palaces.map(p => {
    const majorStars = p.stars.filter(s => s.type === 'major');
    const minorStars = p.stars.filter(s => s.type !== 'major');
    const majorDesc = majorStars.map(s => `${s.name}${s.siHua ? '化' + s.siHua : ''}${s.brightness === 'bright' ? '(庙旺)' : s.brightness === 'dim' ? '(陷)' : ''}`).join(' ');
    const minorDesc = minorStars.map(s => `${s.name}${s.siHua ? '化' + s.siHua : ''}`).join(' ');
    const ganzhi = `${STEMS[p.stem]}${BRANCHES[p.branch]}`;
    return `${p.name}[${ganzhi}]: 主星=${majorDesc || '空'} 辅星=${minorDesc || '无'} 大限${p.daXianAge?.[0]}~${p.daXianAge?.[1]}岁${p.isCurrentDaXian ? '(当前大限)' : ''}`;
  }).join('\n');

  return `
【命主基本信息】
姓名: ${birthInfo.name ?? '匿名'}
性别: ${birthInfo.gender === 'male' ? '男' : '女'}
公历生日: ${birthInfo.year}年${birthInfo.month}月${birthInfo.day}日
出生时辰: ${BRANCHES[birthInfo.hour]}时
农历: ${lunarInfo.lunarYear}年${lunarInfo.isLeapMonth ? '闰' : ''}${lunarInfo.lunarMonth}月${lunarInfo.lunarDay}日
年干支: ${STEMS[lunarInfo.yearStem]}${BRANCHES[lunarInfo.yearBranch]}年
五行局: ${wuxingJuName}
命宫: ${BRANCHES[mingGongBranch]}宫，主星: ${mingMajorStars}
身宫: ${BRANCHES[shenGongBranch]}宫，主星: ${shenMajorStars}
当前年龄: ${currentAge}岁
当前大限: ${currentDx ? `${currentDx.startAge}~${currentDx.endAge}岁，${currentDx.palaceName}` : '未知'}

【十二宫完整信息】
${palaceDetails}
`.trim();
}

const SYSTEM_PROMPT = `你是一位精通倪海夏正宗紫微斗数的命理大师。你的解读完全基于倪海夏老师的教学体系与方法论。

## 倪海夏紫微斗数核心方法论

### 分析框架（按重要性排序）
1. **命宫为本**：命宫主星决定人的基本格局与性格，是解盘第一要务
2. **三方四正**：命宫、财帛宫、官禄宫、迁移宫四宫联动分析
3. **对宫借星**：任何宫位必参考其对宫（180度对面）的星曜影响
4. **四化为纲**：化禄（财进）化权（掌控）化科（名声）化忌（阻碍）是判断吉凶的核心
5. **大限当运**：大限宫所在星曜代表该10年的主要运势走向
6. **身宫晚年**：身宫代表晚年运势和内在深层需求

### 十四主星倪海夏体系核心解读

**紫微**：帝王星，喜独处，主观强，晚婚倾向，有贵气，需有辅星相助才能发挥
**天机**：智慧灵动，善算计，适合技术/策划/研究，心思细密，不宜轻信
**太阳**：阳刚慷慨，男命贵星，利官贵，照耀他人但自身有所失，入庙光明正大
**武曲**：财帛主星，刚毅果断，利财务金融，孤克性较强，感情需注意
**天同**：福星享乐，随遇而安，晚年佳，女命吉，不爱竞争，宜安逸行业
**廉贞**：次桃花，才艺出众，刑囚煞意，感情复杂，有才华但多波折
**天府**：财库守成，稳重保守，不主动但能守住财富，女命旺夫
**太阴**：财星（尤利女命），柔美内敛，利房地产，入庙富贵，陷地受损
**贪狼**：欲望桃花，多才多艺，善交际，晚发，五术/才艺/娱乐业有利
**巨门**：口舌是非，善辩论，适合教学/律师/销售，多疑多虑，化禄化权转吉
**天相**：印星辅佐，行政管理，温和待人，行事中规中矩，贵人缘好
**天梁**：荫星保护，医药宗教，长辈缘佳，刑克意味，早年艰辛晚年享福
**七杀**：将帅之星，果决行动，孤克性强，适合开创事业，需辅星化解孤性
**破军**：变动开创，破旧立新，六亲缘薄，事业起伏但有闯劲，化禄转好

### 四化详细含义（倪海夏体系）
- **化禄**：该星所在宫位财运增旺，对应事项顺遂，但过旺易成执着
- **化权**：掌控欲强，该领域积极主动，权势地位，但需防强势过头
- **化科**：名声文书，贵人相助，学业顺利，考试有利
- **化忌**：阻滞麻烦，该宫位事项多障碍，需多加留意与化解

### 格局判断
- 紫府同宫：尊贵之命，大富大贵
- 廉贞天相：廉相格，行政印绶，适合公职
- 武曲七杀：将星格，开创力强，财运波动
- 天同天梁：清雅格，适合学术文艺
- 日月并明：光明磊落，事业显赫（太阳太阴分别在旺位）

### 倪海夏特别强调
1. 紫微斗数看的是"格局"，不是单颗星的好坏
2. 同一颗星在不同宫位有截然不同的意义
3. 化忌不一定坏，关键看在哪个宫位、化的是哪颗星
4. 大限是人生各阶段的缩影，需与本命盘叠加分析
5. 对宫的影响不可忽视，许多事情的答案在对宫中

## 解读风格要求
- **具体实用**：给出实际可参考的建议，不空泛
- **结合现代**：将古典命理与现代生活场景结合
- **客观诚实**：好的说好，需注意的如实指出，不过度美化
- **有据可查**：每个判断都基于具体星曜和宫位
- **亲切自然**：像师傅对学生讲解，不要过于神秘玄乎
- **中文回答**：使用简体中文，语言流畅自然
- **长度适中**：每次回答200-400字为宜，重点突出

当用户提问时，先找到命盘中与问题最相关的宫位，分析该宫主星及四化，再结合三方四正和当前大限，给出综合判断。`;

interface RequestBody {
  chart: ZiweiChart;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export async function POST(req: NextRequest) {
  try {
    const { chart, messages }: RequestBody = await req.json();

    if (!chart || !messages?.length) {
      return new Response('缺少命盘数据', { status: 400 });
    }

    const chartContext = buildChartContext(chart);
    const systemWithContext = `${SYSTEM_PROMPT}\n\n---\n\n以下是命主的完整命盘数据，请基于此进行解读：\n\n${chartContext}`;

    const stream = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system: systemWithContext,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            const data = JSON.stringify({ delta: { text: event.delta.text } });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
          if (event.type === 'message_stop') {
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          }
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (err) {
    console.error('Interpret error:', err);
    const message = err instanceof Error ? err.message : '解读失败';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
