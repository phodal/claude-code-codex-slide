"use strict";

/**
 * Claude Code Sourcemap Storyline Deck
 *
 * 目标：补强 generate_sourcemap_deck.js 的叙事线，采用“结论先行 + 证据链”结构。
 */

const path = require("path");
const PptxGenJS = require("/tmp/node_modules/pptxgenjs");
const {
  safeOuterShadow,
  imageSizingContain,
  codeToRuns,
} = require("../.agents/skills/slide-skill/pptxgenjs_helpers");

const OUT_DIR = __dirname;
const OUT_FILE = path.join(OUT_DIR, "claude-code-sourcemap-storyline.pptx");
const QR_PATH = path.join(OUT_DIR, "qrcode_for_gh_2afe73fc7b4a_258.jpg");
const TEMPLATE_REF = path.resolve(
  __dirname,
  "../.agents/skills/slide-skill/slide_templates/template.pptx",
);

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Phodal";
pptx.company = "Analysis Report";
pptx.subject = "Claude Code Sourcemap Storyline";
pptx.title = "Claude Code Sourcemap：从证据到结论的架构故事线";
pptx.lang = "zh-CN";
pptx.theme = { headFontFace: "Aptos Display", bodyFontFace: "Aptos", lang: "zh-CN" };

const W = 13.333;
const H = 7.5;

const C = {
  bg: "09111F",
  bgMid: "0D1829",
  bgSoft: "111E33",
  panel: "162035",
  panelAlt: "1A2640",
  panelBright: "1E2E4A",
  line: "2A3F5F",
  lineSoft: "203050",
  text: "E8EDF5",
  textSoft: "C4CDD8",
  muted: "8A9BB5",
  muted2: "B0BDD0",
  gold: "F5A623",
  blue: "4B8EF5",
  cyan: "22D3EE",
  green: "34D399",
  purple: "A78BFA",
  red: "F87171",
  orange: "FB923C",
  white: "FFFFFF",
  black: "000000",
};

let page = 0;
function nextPage() {
  page += 1;
  return page;
}

function bullets(items) {
  return items.map(item => `• ${item}`).join("\n");
}

function addNotes(slide, items) {
  slide.addNotes(["[Sources]", ...items.map(item => `- ${item}`), "[/Sources]"].join("\n"));
}

function topBar(slide, accent = C.gold) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: W,
    h: 0.1,
    fill: { color: accent },
    line: { color: accent, transparency: 100 },
  });
}

function bottomRule(slide) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.65,
    y: 6.84,
    w: W - 1.3,
    h: 0.015,
    fill: { color: C.line },
    line: { color: C.line, transparency: 100 },
  });
}

function footer(slide, pageNum, accent = C.gold) {
  bottomRule(slide);
  slide.addText("Claude Code Sourcemap Storyline · 仅供研究", {
    x: 0.72,
    y: 6.9,
    w: 8.7,
    h: 0.18,
    fontSize: 7.8,
    color: C.muted,
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 12.28,
    y: 6.96,
    w: 0.08,
    h: 0.08,
    fill: { color: accent },
    line: { color: accent, transparency: 100 },
  });
  slide.addText(String(pageNum).padStart(2, "0"), {
    x: 11.7,
    y: 6.88,
    w: 0.55,
    h: 0.18,
    fontSize: 8.2,
    bold: true,
    align: "right",
    color: C.muted2,
  });
}

function header(slide, pageNum, { section, title, subtitle, accent = C.gold }) {
  slide.background = { color: C.bg };
  topBar(slide, accent);

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.68,
    y: 0.3,
    w: section.length * 0.085 + 0.4,
    h: 0.22,
    rectRadius: 0.04,
    fill: { color: C.panelBright },
    line: { color: accent, pt: 1 },
  });
  slide.addText(section, {
    x: 0.72,
    y: 0.315,
    w: 3.5,
    h: 0.18,
    fontSize: 9.5,
    bold: true,
    color: accent,
  });

  slide.addText(title, {
    x: 0.72,
    y: 0.6,
    w: 11.7,
    h: 0.62,
    fontSize: 22,
    bold: true,
    color: C.text,
    fit: "shrink",
  });

  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.72,
      y: 1.22,
      w: 11.7,
      h: 0.3,
      fontSize: 11.5,
      color: C.muted,
      fit: "shrink",
    });
  }

  footer(slide, pageNum, accent);
}

function card(slide, x, y, w, h, { title, body, titleColor, fill, bodyFontSize, code } = {}) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.07,
    fill: { color: fill || C.panel },
    line: { color: C.line, pt: 1 },
    shadow: safeOuterShadow(C.black, 0.1, 45, 1.5, 0.35),
  });

  let bodyY = y + 0.15;
  if (title) {
    slide.addText(title, {
      x: x + 0.2,
      y: y + 0.14,
      w: w - 0.4,
      h: 0.24,
      fontSize: 12.5,
      bold: true,
      color: titleColor || C.text,
    });
    bodyY = y + 0.46;
  }

  if (body) {
    if (code) {
      slide.addText(codeToRuns(body, "typescript"), {
        x: x + 0.16,
        y: bodyY,
        w: w - 0.3,
        h: h - (bodyY - y) - 0.1,
        fontFace: "Menlo",
        fontSize: bodyFontSize || 9.8,
        margin: 0,
        fit: "shrink",
        valign: "top",
      });
    } else {
      slide.addText(body, {
        x: x + 0.2,
        y: bodyY,
        w: w - 0.4,
        h: h - (bodyY - y) - 0.1,
        fontSize: bodyFontSize || 11.4,
        color: C.textSoft,
        fit: "shrink",
        margin: 0,
        valign: "top",
      });
    }
  }
}

function sectionDivider(pageNum, n, { title, body, accent = C.blue, rightNote }) {
  const slide = pptx.addSlide();
  slide.background = { color: C.bg };

  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 6.5,
    h: H,
    fill: { color: C.bgMid },
    line: { color: C.bgMid, transparency: 100 },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 6.5,
    y: 0,
    w: W - 6.5,
    h: H,
    fill: { color: accent },
    line: { color: accent, transparency: 100 },
  });

  slide.addText(`Part ${String(n).padStart(2, "0")}`, {
    x: 1.0,
    y: 1.2,
    w: 2.3,
    h: 0.24,
    fontSize: 11,
    bold: true,
    color: C.gold,
  });
  slide.addText(title, {
    x: 1.0,
    y: 1.58,
    w: 4.9,
    h: 1.1,
    fontSize: 31,
    bold: true,
    color: C.text,
    fit: "shrink",
  });
  slide.addText(body, {
    x: 1.0,
    y: 3.15,
    w: 4.9,
    h: 1.38,
    fontSize: 13,
    color: C.textSoft,
    fit: "shrink",
  });

  if (rightNote) {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 7.2,
      y: 2.25,
      w: 5.05,
      h: 2.7,
      rectRadius: 0.09,
      fill: { color: C.white, transparency: 10 },
      line: { color: C.white, transparency: 70, pt: 1 },
    });
    slide.addText(rightNote, {
      x: 7.45,
      y: 2.5,
      w: 4.55,
      h: 2.2,
      fontSize: 14,
      color: C.bg,
      bold: true,
      valign: "mid",
      fit: "shrink",
    });
  }

  footer(slide, pageNum, accent);
}

function slide01_title() {
  const p = nextPage();
  const slide = pptx.addSlide();
  slide.background = { color: C.bg };
  topBar(slide, C.gold);

  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: W,
    h: H,
    fill: { color: C.bg },
    line: { color: C.bg, transparency: 100 },
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.72,
    y: 0.72,
    w: 8.5,
    h: 0.42,
    rectRadius: 0.08,
    fill: { color: C.panelBright },
    line: { color: C.line, pt: 1 },
  });
  slide.addText("CLAUDE CODE SOURCEMAP / STORYLINE EDITION", {
    x: 0.95,
    y: 0.84,
    w: 8.2,
    h: 0.2,
    fontSize: 12,
    bold: true,
    color: C.gold,
    fontFace: "Menlo",
  });

  slide.addText("Claude Code：\n从 Source Map 到 Runtime 结论", {
    x: 0.72,
    y: 1.42,
    w: 8.9,
    h: 1.78,
    fontSize: 41,
    bold: true,
    color: C.text,
    fit: "shrink",
  });

  slide.addText("叙事线：论点先行 → 证据校验 → 主链机制 → 治理边界 → 工程启发", {
    x: 0.76,
    y: 3.4,
    w: 8.7,
    h: 0.45,
    fontSize: 14,
    color: C.muted2,
  });

  card(slide, 0.72, 4.05, 8.3, 1.9, {
    title: "核心判断（先给结论）",
    titleColor: C.cyan,
    fill: C.panel,
    body: bullets([
      "它不是“聊天 CLI”，而是统一多 surface 的 Terminal Agent Runtime。",
      "真正核心是 Query Loop + Tool Runtime + Permission Governance + Agent Runtime。",
      "MCP / Skills / Plugins / Commands 是扩展入口，最终都要折叠进共享执行面。",
    ]),
    bodyFontSize: 12.2,
  });

  try {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 9.5,
      y: 1.4,
      w: 3.1,
      h: 4.5,
      rectRadius: 0.08,
      fill: { color: C.panel },
      line: { color: C.line, pt: 1 },
    });
    slide.addImage({
      path: QR_PATH,
      ...imageSizingContain(QR_PATH, 9.75, 2.05, 2.6, 2.6),
    });
    slide.addText("关注公众号", {
      x: 9.7,
      y: 4.86,
      w: 2.75,
      h: 0.25,
      align: "center",
      fontSize: 11,
      bold: true,
      color: C.gold,
    });
    slide.addText("phodal", {
      x: 9.7,
      y: 5.11,
      w: 2.75,
      h: 0.2,
      align: "center",
      fontSize: 10,
      color: C.muted,
    });
  } catch (_) {
    // ignore if QR is missing
  }

  footer(slide, p, C.gold);
  addNotes(slide, [
    "artifacts/generate_sourcemap_deck.js",
    "artifacts/generate_claude_code_architecture_slides.js",
    TEMPLATE_REF,
  ]);
}

function slide02_provenance_and_limits() {
  const p = nextPage();
  const slide = pptx.addSlide();
  header(slide, p, {
    section: "背景 · 01",
    title: "先定边界：这是高保真快照，不是完整 monorepo",
    subtitle: "先说清“哪些可信、哪些需谨慎”，避免后续结论越界。",
    accent: C.cyan,
  });

  card(slide, 0.68, 1.75, 6.0, 4.9, {
    title: "可直接采信的证据",
    titleColor: C.green,
    fill: C.panel,
    body: bullets([
      "`extract-sources.js` 从 `cli.js.map` 的 `sourcesContent` 还原源码。",
      "README 记录恢复文件 4,756，包版本 v2.1.88。",
      "核心 runtime 目录与关键实现（Query、Tools、Permissions、Agents）完整可读。",
      "目录结构、注释、调用链对架构分析高度有效。",
    ]),
    bodyFontSize: 11.5,
  });

  card(slide, 6.95, 1.75, 5.7, 4.9, {
    title: "需要保留不确定性的部分",
    titleColor: C.red,
    fill: C.panelAlt,
    body: bullets([
      "构建脚手架、部分测试资产、内部自动化流程可能缺失。",
      "不能把恢复快照等价成“官方仓库的全部工程实践”。",
      "对“产品承诺”要结合公开文档，不只看单一源码证据。",
      "因此本报告聚焦：runtime 机制与系统边界，而非发布工程细节。",
    ]),
    bodyFontSize: 11.5,
  });

  addNotes(slide, [
    "README.md",
    "extract-sources.js",
    "package/package.json",
  ]);
}

function slide03_docs_vs_source() {
  const p = nextPage();
  const slide = pptx.addSlide();
  header(slide, p, {
    section: "背景 · 02",
    title: "Docs vs Source：产品承诺如何在源码里落地",
    subtitle: "这页是原 sourcemap 版较弱的一环，这里补上承诺与机制的对照。",
    accent: C.blue,
  });

  card(slide, 0.68, 1.74, 5.9, 4.95, {
    title: "文档层（What）",
    titleColor: C.blue,
    fill: C.panel,
    body: bullets([
      "多 surface 共享同一引擎（terminal / sdk / remote）。",
      "具备 tools、permissions、MCP、agents 等能力。",
      "强调协作自动化而非单轮问答。",
    ]),
    bodyFontSize: 11.8,
  });

  card(slide, 6.78, 1.74, 5.9, 4.95, {
    title: "源码层（How）",
    titleColor: C.green,
    fill: C.panelAlt,
    body: bullets([
      "`entrypoints/cli.tsx` 做模式分流与懒加载启动。",
      "`QueryEngine.ts` + `query.ts` 形成递归执行主链。",
      "`toolExecution.ts` + `toolHooks.ts` 把治理编进执行主路径。",
      "`AgentTool/*` + `utils/swarm/*` 让多 agent 变成可运行系统。",
    ]),
    bodyFontSize: 11.6,
  });

  addNotes(slide, [
    "https://code.claude.com/docs/en/overview",
    "restored-src/src/entrypoints/cli.tsx",
    "restored-src/src/QueryEngine.ts",
    "restored-src/src/query.ts",
    "restored-src/src/services/tools/toolExecution.ts",
    "restored-src/src/tools/AgentTool/runAgent.ts",
  ]);
}

function slide04_scale_signal() {
  const p = nextPage();
  const slide = pptx.addSlide();
  header(slide, p, {
    section: "背景 · 03",
    title: "规模本身就是信号：这更像平台，不像轻量 CLI",
    subtitle: "先用体量与目录密度建立“平台级复杂度”的共识。",
    accent: C.gold,
  });

  const stats = [
    { value: "4,756", label: "恢复文件数", sub: "README 记录", color: C.gold },
    { value: "1,900+", label: "src 源文件", sub: ".ts/.tsx", color: C.blue },
    { value: "512,664", label: "TypeScript 行数", sub: "代码规模", color: C.green },
    { value: "40+", label: "核心工具", sub: "tools runtime", color: C.purple },
  ];

  let x = 0.72;
  stats.forEach(s => {
    card(slide, x, 1.8, 3.05, 1.35, {
      title: s.value,
      titleColor: s.color,
      fill: C.panelAlt,
      body: `${s.label}\n${s.sub}`,
      bodyFontSize: 10,
    });
    x += 3.15;
  });

  card(slide, 0.72, 3.35, 12.0, 3.3, {
    title: "由规模推导的架构判断",
    titleColor: C.cyan,
    fill: C.panel,
    body: bullets([
      "`utils`、`components`、`commands`、`tools` 高密度目录并存，说明不是单用途 CLI。",
      "终端 UI、bridge/remote、headless 输出共存，体现多 surface 产品化。",
      "复杂度重心在 orchestration（编排）与 governance（治理），不是 prompt 拼接。",
      "因此后续分析应围绕“执行主链 + 治理体系 + 扩展边界”展开。",
    ]),
    bodyFontSize: 12,
  });

  addNotes(slide, [
    "README.md",
    "local file census via `rg --files restored-src/src | wc -l`",
    "local file census via `find restored-src/src -name '*.ts' -o -name '*.tsx' | xargs wc -l`",
  ]);
}

function slide05_divider_runtime() {
  sectionDivider(nextPage(), 1, {
    title: "运行时主链",
    body: "从入口到递归循环，建立可解释系统行为的最短主路径。",
    accent: C.orange,
    rightNote: "先抓主链\n再看扩展\n最后看治理",
  });
}

function slide06_three_layer_model() {
  const p = nextPage();
  const slide = pptx.addSlide();
  header(slide, p, {
    section: "主链 · 01",
    title: "三层模型：入口层、内核层、执行层",
    subtitle: "先抽象，再下钻；这是理解 Claude Code 行为的最低复杂度模型。",
    accent: C.orange,
  });

  const layers = [
    {
      title: "入口层",
      color: C.cyan,
      body: bullets([
        "`entrypoints/cli.tsx`",
        "`bridge/*` / `remote/*`",
        "模式分流 + 延迟加载",
      ]),
    },
    {
      title: "内核层",
      color: C.gold,
      body: bullets([
        "`main.tsx` startup orchestration",
        "`QueryEngine.ts` 会话生命周期",
        "`query.ts` 单轮递归状态机",
      ]),
    },
    {
      title: "执行层",
      color: C.purple,
      body: bullets([
        "`toolExecution.ts` + hooks",
        "permissions / budget / compact",
        "agent / mcp / commands 扩展入口",
      ]),
    },
  ];

  let x = 0.88;
  layers.forEach(layer => {
    card(slide, x, 2.0, 3.9, 3.8, {
      title: layer.title,
      titleColor: layer.color,
      fill: C.panel,
      body: layer.body,
      bodyFontSize: 11.4,
    });
    x += 4.15;
  });

  slide.addShape(pptx.ShapeType.chevron, {
    x: 4.78,
    y: 3.45,
    w: 0.34,
    h: 0.52,
    fill: { color: C.lineSoft },
    line: { color: C.lineSoft, transparency: 100 },
  });
  slide.addShape(pptx.ShapeType.chevron, {
    x: 8.94,
    y: 3.45,
    w: 0.34,
    h: 0.52,
    fill: { color: C.lineSoft },
    line: { color: C.lineSoft, transparency: 100 },
  });

  addNotes(slide, [
    "restored-src/src/entrypoints/cli.tsx",
    "restored-src/src/main.tsx",
    "restored-src/src/QueryEngine.ts",
    "restored-src/src/query.ts",
    "restored-src/src/services/tools/toolExecution.ts",
  ]);
}

function slide07_query_loop_evidence() {
  const p = nextPage();
  const slide = pptx.addSlide();
  header(slide, p, {
    section: "主链 · 02",
    title: "关键证据：Query Loop 把“模型输出”转成“执行计划”",
    subtitle: "这页替换“纯流程图”式叙述，强调可验证的源码机制。",
    accent: C.green,
  });

  card(slide, 0.72, 1.78, 6.0, 4.9, {
    title: "递归循环的最小机制",
    titleColor: C.green,
    fill: C.panel,
    body: bullets([
      "流式阶段显式收集 `toolUseBlocks`，而不只依赖 stop reason。",
      "出现 `tool_use` 后进入 `runTools()` 执行，而非结束回答。",
      "工具结果被回注为新一轮 messages，作为后续推理输入。",
      "`needsFollowUp` / `maxTurns` / hooks 共同决定循环边界。",
    ]),
    bodyFontSize: 11.4,
  });

  const code = [
    "for await (const ev of streamEvents) {",
    "  collectAssistant(ev);",
    "  if (isToolUse(ev)) toolUseBlocks.push(ev.block);",
    "}",
    "if (toolUseBlocks.length > 0) {",
    "  const results = await runTools(toolUseBlocks);",
    "  messages.push(...toUserMessages(results));",
    "  return continueNextTurn(messages);",
    "}",
  ].join("\n");

  card(slide, 6.95, 1.78, 5.7, 4.9, {
    title: "抽象伪码（对应 query.ts）",
    titleColor: C.cyan,
    fill: C.panelAlt,
    body: code,
    code: true,
    bodyFontSize: 10,
  });

  addNotes(slide, [
    "restored-src/src/query.ts",
    "restored-src/src/QueryEngine.ts",
  ]);
}

function slide08_divider_governance() {
  sectionDivider(nextPage(), 2, {
    title: "执行治理",
    body: "把权限与预算看成执行协议的一部分，而非外围防护。",
    accent: C.red,
    rightNote: "治理不在外围\n治理在主链里",
  });
}

function slide09_governance_stack() {
  const p = nextPage();
  const slide = pptx.addSlide();
  header(slide, p, {
    section: "治理 · 01",
    title: "治理栈：Hook + Rules + Mode + Budget",
    subtitle: "原版对权限有覆盖，但这一版强化“为何必须在主链”。",
    accent: C.red,
  });

  const rows = [
    {
      name: "Pre/Post Hook",
      desc: "在工具执行前后注入验证、审计与策略分流。",
      color: C.orange,
    },
    {
      name: "Permissions Rules",
      desc: "基于上下文与策略判断 allow / deny / ask。",
      color: C.red,
    },
    {
      name: "Execution Mode",
      desc: "interactive / headless 等模式驱动不同确认路径。",
      color: C.purple,
    },
    {
      name: "Budget & Compact",
      desc: "上下文压缩与 token 预算共同约束递归深度。",
      color: C.green,
    },
  ];

  let y = 1.9;
  rows.forEach((row, idx) => {
    card(slide, 0.82, y, 12.0, 1.0, {
      title: `${String(idx + 1).padStart(2, "0")}  ${row.name}`,
      titleColor: row.color,
      fill: idx % 2 ? C.panelAlt : C.panel,
      body: row.desc,
      bodyFontSize: 11.8,
    });
    y += 1.15;
  });

  addNotes(slide, [
    "restored-src/src/services/tools/toolExecution.ts",
    "restored-src/src/services/tools/toolHooks.ts",
    "restored-src/src/utils/permissions/",
    "restored-src/src/services/compact/",
  ]);
}

function slide10_divider_extension() {
  sectionDivider(nextPage(), 3, {
    title: "扩展边界",
    body: "把 MCP、Skill、Plugin、Command 的边界讲清楚，避免概念混淆。",
    accent: C.purple,
    rightNote: "入口不同\n落点一致：\n共享 runtime",
  });
}

function slide11_extension_boundary() {
  const p = nextPage();
  const slide = pptx.addSlide();
  header(slide, p, {
    section: "扩展 · 01",
    title: "四类扩展入口的边界与汇合点",
    subtitle: "这一页是原 sourcemap 版最需要补强的结构化说明。",
    accent: C.purple,
  });

  const cols = [
    {
      title: "MCP",
      body: bullets([
        "外部 server 协议接入",
        "映射 tools/resources",
        "进入本地 runtime 执行",
      ]),
      color: C.cyan,
    },
    {
      title: "Plugin",
      body: bullets([
        "安装/缓存/manifest",
        "组织能力分发",
        "常与 skills/commands 协同",
      ]),
      color: C.blue,
    },
    {
      title: "Skill",
      body: bullets([
        "经验模板与工作流封装",
        "常转译成 command/tool 使用",
        "强调可复用过程",
      ]),
      color: C.green,
    },
    {
      title: "Command",
      body: bullets([
        "用户显式入口",
        "slash command surface",
        "最终落到同一执行主链",
      ]),
      color: C.orange,
    },
  ];

  let x = 0.72;
  cols.forEach(col => {
    card(slide, x, 1.95, 2.95, 3.85, {
      title: col.title,
      titleColor: col.color,
      fill: C.panel,
      body: col.body,
      bodyFontSize: 10.8,
    });
    x += 3.03;
  });

  card(slide, 0.72, 5.95, 11.95, 0.7, {
    title: "汇合结论",
    titleColor: C.gold,
    fill: C.panelBright,
    body: "无论入口来自 MCP / Plugin / Skill / Command，最终都进入统一的 Query + Tool Runtime + Permission 治理主链。",
    bodyFontSize: 11.3,
  });

  addNotes(slide, [
    "restored-src/src/services/mcp/client.ts",
    "restored-src/src/utils/plugins/pluginLoader.ts",
    "restored-src/src/skills/loadSkillsDir.ts",
    "restored-src/src/commands.ts",
  ]);
}

function slide12_surface_unification() {
  const p = nextPage();
  const slide = pptx.addSlide();
  header(slide, p, {
    section: "扩展 · 02",
    title: "多 Surface 的差异点与共性点",
    subtitle: "强调“入口与输出不同，核心引擎相同”。",
    accent: C.blue,
  });

  card(slide, 0.72, 1.78, 3.85, 4.95, {
    title: "Terminal",
    titleColor: C.blue,
    fill: C.panel,
    body: bullets([
      "Ink UI + AppState",
      "权限弹窗直观可见",
      "交互密度最高",
    ]),
  });

  card(slide, 4.72, 1.78, 3.85, 4.95, {
    title: "Bridge / Remote",
    titleColor: C.purple,
    fill: C.panelAlt,
    body: bullets([
      "消息桥接与会话同步",
      "重视 ingress/egress 协议",
      "强调远程运行一致性",
    ]),
  });

  card(slide, 8.72, 1.78, 3.85, 4.95, {
    title: "SDK / Headless",
    titleColor: C.green,
    fill: C.panel,
    body: bullets([
      "结构化输出与可集成性",
      "更少 UI，更多自动化",
      "适合流水线与平台接入",
    ]),
  });

  addNotes(slide, [
    "restored-src/src/ink/components/App.tsx",
    "restored-src/src/cli/print.ts",
    "restored-src/src/bridge/bridgeMain.ts",
    "restored-src/src/bridge/initReplBridge.ts",
    "restored-src/src/QueryEngine.ts",
    "restored-src/src/query.ts",
  ]);
}

function slide13_divider_closing() {
  sectionDivider(nextPage(), 4, {
    title: "结论与行动",
    body: "把“架构结论”转成“阅读顺序与工程实践建议”。",
    accent: C.gold,
    rightNote: "结论不是终点\n要能指导实践",
  });
}

function slide14_reading_path() {
  const p = nextPage();
  const slide = pptx.addSlide();
  header(slide, p, {
    section: "结论 · 01",
    title: "建议阅读路径：两轮拿下系统",
    subtitle: "先建模再攻复杂度，避免陷入碎片化阅读。",
    accent: C.green,
  });

  card(slide, 0.72, 1.82, 5.95, 4.9, {
    title: "第一轮：建立主模型（约 70% 行为）",
    titleColor: C.green,
    fill: C.panel,
    body: bullets([
      "`entrypoints/cli.tsx`：入口分流策略",
      "`main.tsx`：启动编排与子系统装配",
      "`QueryEngine.ts` + `query.ts`：递归循环与会话状态",
      "`Tool.ts` + `tools.ts`：执行面与注册模型",
    ]),
    bodyFontSize: 11.2,
  });

  card(slide, 6.92, 1.82, 5.75, 4.9, {
    title: "第二轮：攻克复杂度（剩余 30%）",
    titleColor: C.orange,
    fill: C.panelAlt,
    body: bullets([
      "`services/tools/toolExecution.ts` + `toolHooks.ts`",
      "`tools/AgentTool/*` + `utils/swarm/*`",
      "`services/mcp/*` + `skills/*` + `plugins/*` + `commands.ts`",
      "`utils/permissions/*` + `services/compact/*`",
    ]),
    bodyFontSize: 11.2,
  });

  addNotes(slide, [
    "restored-src/src/entrypoints/cli.tsx",
    "restored-src/src/main.tsx",
    "restored-src/src/QueryEngine.ts",
    "restored-src/src/query.ts",
    "restored-src/src/services/tools/toolExecution.ts",
    "restored-src/src/tools/AgentTool/runAgent.ts",
  ]);
}

function slide15_final_judgment() {
  const p = nextPage();
  const slide = pptx.addSlide();
  header(slide, p, {
    section: "结论 · 02",
    title: "最终判断：Claude Code 的核心创新在“统一 runtime”",
    subtitle: "把终端工作流、治理策略、扩展能力和多 agent 协作折叠到一条执行主链里。",
    accent: C.gold,
  });

  const items = [
    {
      title: "架构定位",
      body: "Terminal Agent Runtime，而非聊天式 CLI。",
      color: C.gold,
    },
    {
      title: "核心机制",
      body: "Query Loop + Tool Runtime + Permission Governance + Agent Runtime。",
      color: C.blue,
    },
    {
      title: "扩展哲学",
      body: "MCP / Skills / Plugins / Commands 入口不同，但执行落点一致。",
      color: C.purple,
    },
    {
      title: "工程启发",
      body: "可用 agent 系统必须把权限、预算、追踪做进主链，而不是外围补丁。",
      color: C.green,
    },
  ];

  let y = 1.88;
  items.forEach((item, idx) => {
    card(slide, 0.88, y, 11.8, 1.0, {
      title: `${String(idx + 1).padStart(2, "0")}  ${item.title}`,
      titleColor: item.color,
      fill: idx % 2 ? C.panelAlt : C.panel,
      body: item.body,
      bodyFontSize: 11.6,
    });
    y += 1.16;
  });

  addNotes(slide, [
    "restored-src/src/QueryEngine.ts",
    "restored-src/src/query.ts",
    "restored-src/src/services/tools/toolExecution.ts",
    "restored-src/src/tools/AgentTool/runAgent.ts",
    "https://code.claude.com/docs/en/overview",
  ]);
}

function slide16_end() {
  const p = nextPage();
  const slide = pptx.addSlide();
  slide.background = { color: C.bg };
  topBar(slide, C.gold);

  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 8.4,
    h: H,
    fill: { color: C.bgMid },
    line: { color: C.bgMid, transparency: 100 },
  });

  slide.addText("Thanks", {
    x: 0.9,
    y: 1.5,
    w: 6.2,
    h: 1.0,
    fontSize: 52,
    bold: true,
    color: C.gold,
  });
  slide.addText("Claude Code Sourcemap Storyline", {
    x: 0.9,
    y: 2.7,
    w: 6.8,
    h: 0.35,
    fontSize: 17,
    bold: true,
    color: C.text,
  });
  slide.addText("如果只记一句：\n这是“可治理、可扩展、可多面呈现”的 Agent Runtime。", {
    x: 0.9,
    y: 3.3,
    w: 6.7,
    h: 0.9,
    fontSize: 13,
    color: C.muted2,
    lineSpacingMultiple: 1.35,
  });

  slide.addText("关键文件索引", {
    x: 0.9,
    y: 4.55,
    w: 3.8,
    h: 0.28,
    fontSize: 11,
    bold: true,
    color: C.gold,
  });
  slide.addText(
    [
      "entrypoints/cli.tsx + main.tsx",
      "QueryEngine.ts + query.ts",
      "services/tools/toolExecution.ts",
      "tools/AgentTool/* + utils/swarm/*",
      "services/mcp/* + commands.ts",
    ].join("\n"),
    {
      x: 0.9,
      y: 4.9,
      w: 6.7,
      h: 1.7,
      fontSize: 10.2,
      color: C.textSoft,
      fontFace: "Menlo",
      lineSpacingMultiple: 1.55,
    },
  );

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 9.0,
    y: 1.9,
    w: 3.2,
    h: 3.5,
    rectRadius: 0.08,
    fill: { color: C.panel },
    line: { color: C.line, pt: 1 },
  });
  try {
    slide.addImage({
      path: QR_PATH,
      ...imageSizingContain(QR_PATH, 9.26, 2.12, 2.68, 2.68),
    });
  } catch (_) {
    // ignore
  }

  slide.addText("关注公众号 · 持续更新", {
    x: 9.0,
    y: 4.9,
    w: 3.2,
    h: 0.27,
    align: "center",
    fontSize: 11,
    bold: true,
    color: C.gold,
  });

  footer(slide, p, C.gold);
  addNotes(slide, ["README.md", QR_PATH, TEMPLATE_REF]);
}

slide01_title();
slide02_provenance_and_limits();
slide03_docs_vs_source();
slide04_scale_signal();
slide05_divider_runtime();
slide06_three_layer_model();
slide07_query_loop_evidence();
slide08_divider_governance();
slide09_governance_stack();
slide10_divider_extension();
slide11_extension_boundary();
slide12_surface_unification();
slide13_divider_closing();
slide14_reading_path();
slide15_final_judgment();
slide16_end();

pptx
  .writeFile({ fileName: OUT_FILE })
  .then(() => {
    console.log(`\\n✅  Saved: ${OUT_FILE}`);
    console.log(`   Total slides: ${page}`);
  })
  .catch(err => {
    console.error("❌  Error:", err);
    process.exit(1);
  });
