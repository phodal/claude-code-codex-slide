"use strict";
/**
 * Claude Code Sourcemap — 代码库深度解读
 * 重新设计版 PPT 生成脚本
 *
 * 目标：从源码事实出发，讲清楚这个仓库"到底是什么"。
 * 叙事主轴：它不是聊天 CLI，而是一个完整的 Terminal Agent Runtime Platform。
 */

const path = require("path");
const PptxGenJS = require("/tmp/node_modules/pptxgenjs");
const {
  safeOuterShadow,
  imageSizingContain,
  codeToRuns,
} = require("../.agents/skills/slide-skill/pptxgenjs_helpers");

// ─── Output paths ────────────────────────────────────────────────────────────
const OUT_DIR = __dirname;
const OUT_FILE = path.join(OUT_DIR, "claude-code-sourcemap-deck.pptx");
const QR_PATH = path.join(OUT_DIR, "qrcode_for_gh_2afe73fc7b4a_258.jpg");
const TEMPLATE_REF = path.resolve(
  __dirname,
  "../.agents/skills/slide-skill/slide_templates/template.pptx",
);

// ─── PptxGenJS instance ───────────────────────────────────────────────────────
const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Phodal";
pptx.company = "Analysis Report";
pptx.subject = "Claude Code Sourcemap 源码深度解读";
pptx.title = "Claude Code：从 Source Map 看一个 Terminal Agent Runtime 的内部构造";
pptx.lang = "zh-CN";
pptx.theme = { headFontFace: "Aptos Display", bodyFontFace: "Aptos", lang: "zh-CN" };

// ─── Design system ───────────────────────────────────────────────────────────
const W = 13.333;
const H = 7.5;

// 配色方案：深蓝主题，更有技术感
const C = {
  // Backgrounds
  bg:       "09111F",   // 最深背景
  bgMid:    "0D1829",   // 内容区背景
  bgSoft:   "111E33",   // 柔和背景
  panel:    "162035",   // 卡片背景
  panelAlt: "1A2640",   // 替换卡片背景
  panelBright: "1E2E4A",// 更亮面板

  // Borders
  line:     "2A3F5F",
  lineSoft: "203050",

  // Text
  text:     "E8EDF5",
  textSoft: "C4CDD8",
  muted:    "8A9BB5",
  muted2:   "B0BDD0",

  // Accent colors
  gold:     "F5A623",   // 主强调色：金色
  blue:     "4B8EF5",   // 蓝色
  cyan:     "22D3EE",   // 青色
  green:    "34D399",   // 绿色
  purple:   "A78BFA",   // 紫色
  red:      "F87171",   // 红色
  orange:   "FB923C",   // 橙色

  // Special
  white:    "FFFFFF",
  black:    "000000",
};

let _page = 0;
function nextPage() { return ++_page; }

// ─── Utility helpers ─────────────────────────────────────────────────────────

function addNotes(slide, items) {
  slide.addNotes(["[Sources]", ...items.map(i => `- ${i}`), "[/Sources]"].join("\n"));
}

function topBar(slide, accent = C.gold) {
  // 顶部装饰条
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: W, h: 0.1,
    fill: { color: accent },
    line: { color: accent, transparency: 100 },
  });
}

function bottomRule(slide) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.65, y: 6.84, w: W - 1.3, h: 0.015,
    fill: { color: C.line },
    line: { color: C.line, transparency: 100 },
  });
}

function footer(slide, pageNum, accent = C.gold) {
  bottomRule(slide);
  slide.addText("Claude Code Sourcemap 源码解读 · 仅供研究", {
    x: 0.72, y: 6.9, w: 8.5, h: 0.18,
    fontSize: 7.8, color: C.muted,
  });
  // Page number with accent dot
  slide.addShape(pptx.ShapeType.rect, {
    x: 12.28, y: 6.96, w: 0.08, h: 0.08,
    fill: { color: accent },
    line: { color: accent, transparency: 100 },
  });
  slide.addText(String(pageNum).padStart(2, "0"), {
    x: 11.7, y: 6.88, w: 0.55, h: 0.18,
    fontSize: 8.2, bold: true, align: "right", color: C.muted2,
  });
}

/**
 * 标准内容页 header：section chip + title + subtitle
 */
function header(slide, pageNum, { section, title, subtitle, accent = C.gold }) {
  slide.background = { color: C.bg };
  topBar(slide, accent);

  // Section chip
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.68, y: 0.3, w: section.length * 0.085 + 0.4, h: 0.22,
    rectRadius: 0.04,
    fill: { color: C.panelBright },
    line: { color: accent, pt: 1 },
  });
  slide.addText(section, {
    x: 0.72, y: 0.315, w: 3.5, h: 0.18,
    fontSize: 9.5, bold: true, color: accent,
  });

  // Title
  slide.addText(title, {
    x: 0.72, y: 0.6, w: 11.5, h: 0.58,
    fontSize: 22, bold: true, color: C.text, fit: "shrink",
  });

  // Subtitle
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.72, y: 1.22, w: 11.5, h: 0.28,
      fontSize: 11.5, color: C.muted,
    });
  }

  footer(slide, pageNum, accent);
}

/**
 * 圆角面板
 */
function card(slide, x, y, w, h, { title, body, titleColor, fill, line, bodyFontSize, code } = {}) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    rectRadius: 0.07,
    fill: { color: fill || C.panel },
    line: { color: line || C.line, pt: 1 },
    shadow: safeOuterShadow(C.black, 0.1, 45, 1.5, 0.35),
  });
  let bodyY = y + 0.15;
  if (title) {
    slide.addText(title, {
      x: x + 0.2, y: y + 0.14, w: w - 0.4, h: 0.24,
      fontSize: 12.5, bold: true, color: titleColor || C.text,
    });
    bodyY = y + 0.46;
  }
  if (body) {
    if (code) {
      slide.addText(codeToRuns(body, "typescript"), {
        x: x + 0.16, y: bodyY, w: w - 0.3, h: h - (bodyY - y) - 0.1,
        fontFace: "Menlo", fontSize: bodyFontSize || 9.8,
        valign: "top", margin: 0, fit: "shrink",
      });
    } else {
      slide.addText(body, {
        x: x + 0.2, y: bodyY, w: w - 0.4, h: h - (bodyY - y) - 0.1,
        fontSize: bodyFontSize || 11.8, color: C.textSoft,
        valign: "top", fit: "shrink", margin: 0,
      });
    }
  }
}

/**
 * Bullet list helper — produces plain text with bullets
 */
function bullets(items) {
  return items.map(i => `• ${i}`).join("\n");
}

/**
 * 带 icon 的 stat box
 */
function statBox(slide, x, y, w, h, { label, value, sub, accent }) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.06,
    fill: { color: C.panelAlt },
    line: { color: accent || C.line, pt: 1.2 },
  });
  slide.addText(value, {
    x: x + 0.15, y: y + 0.16, w: w - 0.3, h: 0.44,
    fontSize: 28, bold: true, color: accent || C.gold, align: "center", fit: "shrink",
  });
  slide.addText(label, {
    x: x + 0.1, y: y + 0.62, w: w - 0.2, h: 0.22,
    fontSize: 10.5, bold: true, color: C.text, align: "center",
  });
  if (sub) {
    slide.addText(sub, {
      x: x + 0.1, y: y + 0.86, w: w - 0.2, h: 0.18,
      fontSize: 9, color: C.muted, align: "center",
    });
  }
}

/**
 * 分节页：左侧深色 + 右侧亮色背景
 */
function sectionDivider(pageNum, n, { title, body, accent = C.blue, rightNote }) {
  const slide = pptx.addSlide();
  slide.background = { color: C.bg };

  // 左侧深色面板
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 6.5, h: H,
    fill: { color: C.bgMid },
    line: { color: C.bgMid, transparency: 100 },
  });

  // 右侧强调色面板
  slide.addShape(pptx.ShapeType.rect, {
    x: 6.5, y: 0, w: W - 6.5, h: H,
    fill: { color: accent },
    line: { color: accent, transparency: 100 },
  });

  // 右侧纹理：横向线条感
  for (let i = 0; i < 8; i++) {
    slide.addShape(pptx.ShapeType.rect, {
      x: 6.5, y: i * 1.05, w: W - 6.5, h: 0.015,
      fill: { color: C.white, transparency: 88 },
      line: { color: C.white, transparency: 100 },
    });
  }

  // Section label
  slide.addText("SECTION", {
    x: 1.0, y: 1.2, w: 2.0, h: 0.2,
    fontSize: 9.5, bold: true, color: C.gold, charSpacing: 2,
  });

  // 大标题
  slide.addText(title, {
    x: 1.0, y: 1.55, w: 4.8, h: 1.5,
    fontSize: 27, bold: true, color: C.text, fit: "shrink",
  });

  // 描述
  slide.addText(body, {
    x: 1.0, y: 3.4, w: 4.6, h: 1.0,
    fontSize: 12.5, color: C.muted,
  });

  // 右侧大号码
  slide.addText(String(n).padStart(2, "0"), {
    x: 7.4, y: 1.8, w: 3.0, h: 1.4,
    fontSize: 80, bold: true, align: "center",
    color: C.white, transparency: 20,
  });

  // 右侧注释文字
  if (rightNote) {
    slide.addText(rightNote, {
      x: 7.2, y: 3.5, w: 5.5, h: 1.2,
      fontSize: 12, color: C.white, align: "center",
      transparency: 15,
    });
  }

  footer(slide, pageNum, accent);
  addNotes(slide, [TEMPLATE_REF]);
}

/**
 * 水平流程箭头
 */
function hArrow(slide, x, y, color = C.gold) {
  slide.addShape(pptx.ShapeType.chevron, {
    x, y, w: 0.28, h: 0.2,
    fill: { color },
    line: { color, transparency: 100 },
  });
}

// ─── SLIDES ──────────────────────────────────────────────────────────────────

// ── Slide 1: Title ────────────────────────────────────────────────────────────
function slide01_title() {
  const p = nextPage();
  const slide = pptx.addSlide();
  slide.background = { color: C.bg };

  topBar(slide, C.gold);

  // 左侧面板
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 7.0, h: H,
    fill: { color: C.bgMid },
    line: { color: C.bgMid, transparency: 100 },
  });

  // 左侧内容
  slide.addText("Claude Code", {
    x: 0.75, y: 0.85, w: 5.0, h: 0.35,
    fontSize: 16, bold: true, color: C.gold,
  });
  slide.addText("从 Source Map 看\n一个 AI Agent Runtime\n的内部构造", {
    x: 0.75, y: 1.3, w: 5.6, h: 1.9,
    fontSize: 27, bold: true, color: C.text, lineSpacingMultiple: 1.15,
  });
  slide.addText("基于 npm 包 @anthropic-ai/claude-code v2.1.88\n通过 cli.js.map 还原的 4,756 个源文件", {
    x: 0.75, y: 3.4, w: 5.6, h: 0.6,
    fontSize: 11.5, color: C.muted, lineSpacingMultiple: 1.5,
  });

  // 核心论点
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.75, y: 4.18, w: 5.7, h: 0.62,
    rectRadius: 0.06,
    fill: { color: C.panel },
    line: { color: C.gold, pt: 1.5 },
  });
  slide.addText("核心论点：这不是\u201C带工具的聊天程序\u201D，而是一个完整的 Terminal Agent Runtime Platform", {
    x: 0.95, y: 4.28, w: 5.35, h: 0.42,
    fontSize: 11, color: C.text, lineSpacingMultiple: 1.3,
  });

  // 右侧：四大维度 chips
  const dims = [
    { label: "Query Loop", sub: "递归执行内核", color: C.blue },
    { label: "Tool Runtime", sub: "40+ 内置工具", color: C.green },
    { label: "Permission System", sub: "多层治理架构", color: C.gold },
    { label: "Multi-Agent", sub: "Swarm 协作模式", color: C.purple },
  ];

  let dy = 1.5;
  dims.forEach(d => {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 7.6, y: dy, w: 4.8, h: 0.72,
      rectRadius: 0.06,
      fill: { color: C.panelAlt },
      line: { color: d.color, pt: 1.5 },
    });
    slide.addShape(pptx.ShapeType.rect, {
      x: 7.6, y: dy, w: 0.15, h: 0.72,
      fill: { color: d.color },
      line: { color: d.color, transparency: 100 },
    });
    slide.addText(d.label, {
      x: 7.9, y: dy + 0.1, w: 4.2, h: 0.25,
      fontSize: 14, bold: true, color: d.color,
    });
    slide.addText(d.sub, {
      x: 7.9, y: dy + 0.36, w: 4.2, h: 0.22,
      fontSize: 10.5, color: C.muted,
    });
    dy += 0.9;
  });

  // QR code
  try {
    slide.addImage({
      path: QR_PATH,
      ...imageSizingContain(QR_PATH, 8.8, 5.55, 1.4, 1.4),
    });
  } catch (e) {}
  slide.addText("phodal 公众号", {
    x: 8.8, y: 7.0, w: 1.4, h: 0.18,
    fontSize: 8, color: C.muted, align: "center",
  });

  footer(slide, p);
  addNotes(slide, ["README.md", "extract-sources.js", QR_PATH, TEMPLATE_REF]);
}

// ── Slide 2: 来源与可信度 ──────────────────────────────────────────────────────
function slide02_provenance() {
  const p = nextPage();
  const slide = pptx.addSlide();
  header(slide, p, {
    section: "背景 · 01",
    title: "这是从 npm 包 Source Map 还原的高保真快照，而不是官方 monorepo",
    subtitle: "理解来源，是正确解读架构的前提。",
    accent: C.cyan,
  });

  // 左：还原过程
  card(slide, 0.68, 1.68, 5.88, 4.28, {
    title: "还原过程",
    titleColor: C.cyan,
    fill: C.panel,
    body: bullets([
      "npm 包内包含完整 cli.js.map（Source Map）",
      "extract-sources.js 提取 sourcesContent 字段",
      "逐文件写回 restored-src/，做 webpack 路径清洗",
      "还原版本：v2.1.88，共 4,756 个文件",
      "包含 1,884 个 .ts/.tsx 源文件，总计 512,664 行",
    ]),
  });

  // 右：分析可信度
  card(slide, 6.73, 1.68, 5.88, 4.28, {
    title: "分析可信度",
    titleColor: C.green,
    fill: C.panelAlt,
    body: bullets([
      "运行时主链、类型签名、注释：高度可信",
      "目录结构、模块边界：与发布版一致",
      "构建脚本、测试框架：可能不完整",
      "内部工具链、CI 配置：不在 source map 范围",
      "结论：足够支撑架构与设计决策分析",
    ]),
  });

  addNotes(slide, ["README.md", "extract-sources.js", "package/package.json"]);
}

// ── Slide 3: 规模数据 ─────────────────────────────────────────────────────────
function slide03_scale() {
  const p = nextPage();
  const slide = pptx.addSlide();
  header(slide, p, {
    section: "背景 · 02",
    title: "规模数据一眼就能判断：这是平台级产品，不是小工具",
    subtitle: "从文件数量、目录分布和功能模块密度，可以还原出系统的真实复杂度。",
    accent: C.cyan,
  });

  // 统计数字卡片
  const stats = [
    { value: "4,756", label: "还原文件总数", sub: "含各类资源与配置", accent: C.gold },
    { value: "1,884", label: ".ts / .tsx 文件", sub: "纯 TypeScript 源码", accent: C.blue },
    { value: "512K", label: "代码行数", sub: "TypeScript 总计", accent: C.green },
    { value: "40+", label: "内置工具", sub: "tools/ 目录", accent: C.purple },
    { value: "101", label: "内置命令", sub: "commands/ 目录", accent: C.orange },
  ];

  let sx = 0.68;
  stats.forEach(s => {
    statBox(slide, sx, 1.72, 2.34, 1.28, s);
    sx += 2.46;
  });

  // 目录分布
  card(slide, 0.68, 3.2, 11.98, 2.64, {
    title: "关键目录分布（按功能层划分）",
    titleColor: C.cyan,
    fill: C.panel,
  });

  const cols = [
    {
      label: "核心运行时",
      color: C.gold,
      items: ["QueryEngine.ts", "query.ts", "main.tsx", "entrypoints/"],
    },
    {
      label: "工具层 (40+)",
      color: C.blue,
      items: ["BashTool", "FileEditTool", "AgentTool", "WebSearchTool + 37 more"],
    },
    {
      label: "服务层",
      color: C.green,
      items: ["services/mcp/", "services/compact/", "services/api/", "services/lsp/"],
    },
    {
      label: "扩展与能力",
      color: C.purple,
      items: ["plugins/", "skills/", "commands/ (101)", "coordinator/"],
    },
    {
      label: "非典型功能",
      color: C.orange,
      items: ["voice/", "vim/", "buddy/", "memdir/"],
    },
  ];

  let cx = 0.88;
  cols.forEach(col => {
    slide.addText(col.label, {
      x: cx, y: 3.56, w: 2.2, h: 0.22,
      fontSize: 10.5, bold: true, color: col.color,
    });
    slide.addText(col.items.join("\n"), {
      x: cx, y: 3.82, w: 2.2, h: 1.78,
      fontSize: 9.8, color: C.textSoft, lineSpacingMultiple: 1.5,
    });
    if (cx < 10.5) {
      slide.addShape(pptx.ShapeType.rect, {
        x: cx + 2.22, y: 3.56, w: 0.015, h: 2.1,
        fill: { color: C.line },
        line: { color: C.line, transparency: 100 },
      });
    }
    cx += 2.38;
  });

  addNotes(slide, [
    "README.md",
    "restored-src/src/ directory census",
    "find restored-src/src -name '*.ts' -o -name '*.tsx' | wc -l",
  ]);
}

// ── Section 1: 架构总览 ──────────────────────────────────────────────────────
// ── Slide 4: 分节页 ───────────────────────────────────────────────────────────
function slide04_sec1_divider() {
  sectionDivider(nextPage(), 1, {
    title: "架构全景",
    body: "从入口分流到 Agent 协作，梳理这套系统的五层结构。",
    accent: C.blue,
    rightNote: "先建立大图，再逐层拆解。\n不要在细节里迷路。",
  });
}

// ── Slide 5: 总体架构五层图 ──────────────────────────────────────────────────
function slide05_arch_overview() {
  const p = nextPage();
  const slide = pptx.addSlide();
  header(slide, p, {
    section: "架构全景 · 01",
    title: "五层架构：从「用户输入」到「模型递归执行」的完整通路",
    subtitle: "这五层不是简单的功能列表，而是被 Query Loop 串起来的有序执行体系。",
    accent: C.blue,
  });

  const layers = [
    {
      num: "01",
      name: "入口层",
      desc: "entrypoints/cli.tsx\n轻量分发器：版本快路径 / 模式分流 / 懒加载",
      color: C.cyan,
    },
    {
      num: "02",
      name: "启动编排层",
      desc: "main.tsx (4,683 行)\n初始化 Config · Auth · MCP · Agents · UI",
      color: C.blue,
    },
    {
      num: "03",
      name: "会话核心层",
      desc: "QueryEngine.ts + query.ts\n会话状态 · 递归 Turn Loop · Budget 管理",
      color: C.gold,
    },
    {
      num: "04",
      name: "执行治理层",
      desc: "toolExecution.ts + toolHooks.ts\nPre/Post Hook · 权限多层决策 · 追踪",
      color: C.orange,
    },
    {
      num: "05",
      name: "扩展与能力层",
      desc: "Agents · MCP · Skills · Commands · Plugins\n多 Agent Swarm · 外部能力接入",
      color: C.purple,
    },
  ];

  // 垂直层级展示，每层一个横条
  let ly = 1.65;
  layers.forEach((layer, i) => {
    // 层号
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.68, y: ly, w: 0.56, h: 0.84,
      rectRadius: 0.06,
      fill: { color: layer.color },
      line: { color: layer.color, transparency: 100 },
    });
    slide.addText(layer.num, {
      x: 0.68, y: ly + 0.2, w: 0.56, h: 0.3,
      fontSize: 14, bold: true, color: C.bg, align: "center",
    });

    // 层名称
    slide.addText(layer.name, {
      x: 1.4, y: ly + 0.04, w: 2.3, h: 0.35,
      fontSize: 14.5, bold: true, color: layer.color,
    });
    slide.addText(layer.desc, {
      x: 1.4, y: ly + 0.42, w: 4.8, h: 0.4,
      fontSize: 10, color: C.muted, lineSpacingMultiple: 1.3,
    });

    // 右侧文件标签
    // (described inline above in desc)

    // 连接箭头（非最后一层）
    if (i < layers.length - 1) {
      slide.addShape(pptx.ShapeType.chevron, {
        x: 0.855, y: ly + 0.9, w: 0.19, h: 0.22,
        rotate: 90,
        fill: { color: layer.color, transparency: 40 },
        line: { color: layer.color, transparency: 100 },
      });
    }

    ly += 0.96 + (i < layers.length - 1 ? 0.28 : 0);
  });

  // 右侧注解：关键观点
  card(slide, 6.6, 1.65, 6.05, 4.88, {
    title: "为什么这五层很重要",
    titleColor: C.blue,
    fill: C.panel,
    body: bullets([
      "入口层做到「极速分流」：--version 等命令不需要加载 main.js，大幅减少启动延迟",
      "main.tsx 是平台级 orchestration，4,683 行的 startup 涵盖了 Auth / Feature Gates / MCP / LSP / Session Restore",
      "QueryEngine 与 query.ts 职责分离：前者管会话生命周期，后者管单轮递归状态机",
      "执行治理层不是可选 middleware，而是工具调用的必经主路径",
      "扩展层可以从 Plugin / Skill / MCP 三条通道接入，但最终都折叠进共享 Tool Surface",
      "不同 Surface（Terminal / Bridge / SDK）只改变入口和输出，不改变中间三层",
    ]),
    bodyFontSize: 11.2,
  });

  addNotes(slide, [
    "restored-src/src/entrypoints/cli.tsx",
    "restored-src/src/main.tsx",
    "restored-src/src/QueryEngine.ts",
    "restored-src/src/query.ts",
    "restored-src/src/services/tools/toolExecution.ts",
  ]);
}

// ── Slide 6: 模块关系图 ──────────────────────────────────────────────────────
function slide06_module_map() {
  const p = nextPage();
  const slide = pptx.addSlide();
  header(slide, p, {
    section: "架构全景 · 02",
    title: "模块关系图：被 Query Loop 串起来的多层系统",
    subtitle: "真正的架构边界不是文件夹，而是这些模块之间的依赖方向和数据流。",
    accent: C.blue,
  });

  // 中央 Query Loop
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 4.9, y: 2.7, w: 3.5, h: 1.2,
    rectRadius: 0.1,
    fill: { color: C.gold },
    line: { color: C.gold, transparency: 100 },
    shadow: safeOuterShadow(C.gold, 0.25, 45, 4, 0.5),
  });
  slide.addText("Query Loop", {
    x: 4.9, y: 2.85, w: 3.5, h: 0.35,
    fontSize: 17, bold: true, color: C.bg, align: "center",
  });
  slide.addText("QueryEngine + query.ts", {
    x: 4.9, y: 3.22, w: 3.5, h: 0.22,
    fontSize: 9.5, color: C.bgMid, align: "center",
  });

  // 上层入口
  const inputs = [
    { x: 0.7, y: 1.7, label: "CLI / entrypoints", sub: "cli.tsx", color: C.cyan },
    { x: 3.1, y: 1.7, label: "Bridge / Remote", sub: "bridgeMain.ts", color: C.blue },
    { x: 5.5, y: 1.7, label: "SDK / Headless", sub: "cli/print.ts", color: C.purple },
    { x: 7.9, y: 1.7, label: "main.tsx startup", sub: "orchestration", color: C.orange },
    { x: 10.3, y: 1.7, label: "AppState", sub: "shared state", color: C.green },
  ];

  inputs.forEach(item => {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: item.x, y: item.y, w: 2.1, h: 0.72,
      rectRadius: 0.06,
      fill: { color: C.panelAlt },
      line: { color: item.color, pt: 1.2 },
    });
    slide.addText(item.label, {
      x: item.x + 0.1, y: item.y + 0.08, w: 1.9, h: 0.25,
      fontSize: 10.5, bold: true, color: item.color,
    });
    slide.addText(item.sub, {
      x: item.x + 0.1, y: item.y + 0.36, w: 1.9, h: 0.2,
      fontSize: 9, color: C.muted,
    });
    // 向下箭头
    slide.addShape(pptx.ShapeType.chevron, {
      x: item.x + 0.78, y: item.y + 0.78, w: 0.5, h: 0.26,
      rotate: 90,
      fill: { color: item.color, transparency: 35 },
      line: { color: item.color, transparency: 100 },
    });
  });

  // 下层执行
  const outputs = [
    { x: 0.7, y: 4.4, label: "Tool Runtime", sub: "toolExecution.ts\n40+ 工具", color: C.orange },
    { x: 3.1, y: 4.4, label: "Permission System", sub: "hooks + rules\n多层决策", color: C.red },
    { x: 5.5, y: 4.4, label: "Agent / Swarm", sub: "runAgent\ninProcessRunner", color: C.purple },
    { x: 7.9, y: 4.4, label: "MCP / Plugins", sub: "外部能力接入\nclient.ts", color: C.cyan },
    { x: 10.3, y: 4.4, label: "compact / budget", sub: "上下文管理\n成本控制", color: C.green },
  ];

  outputs.forEach(item => {
    // 从 query loop 向下箭头
    slide.addShape(pptx.ShapeType.chevron, {
      x: item.x + 0.78, y: 4.0, w: 0.5, h: 0.26,
      rotate: 90,
      fill: { color: item.color, transparency: 35 },
      line: { color: item.color, transparency: 100 },
    });
    slide.addShape(pptx.ShapeType.roundRect, {
      x: item.x, y: item.y, w: 2.1, h: 0.82,
      rectRadius: 0.06,
      fill: { color: C.panel },
      line: { color: item.color, pt: 1.2 },
    });
    slide.addText(item.label, {
      x: item.x + 0.1, y: item.y + 0.08, w: 1.9, h: 0.25,
      fontSize: 10.5, bold: true, color: item.color,
    });
    slide.addText(item.sub, {
      x: item.x + 0.1, y: item.y + 0.36, w: 1.9, h: 0.36,
      fontSize: 9, color: C.muted, lineSpacingMultiple: 1.3,
    });
  });

  addNotes(slide, [
    "restored-src/src/QueryEngine.ts",
    "restored-src/src/query.ts",
    "restored-src/src/services/tools/toolExecution.ts",
    "restored-src/src/tools/AgentTool/runAgent.ts",
    "restored-src/src/utils/swarm/inProcessRunner.ts",
  ]);
}

// ── Section 2: Query Loop ─────────────────────────────────────────────────────
// ── Slide 7: 分节页 ───────────────────────────────────────────────────────────
function slide07_sec2_divider() {
  sectionDivider(nextPage(), 2, {
    title: "Query Loop\n执行内核",
    body: "从用户按下回车，到 agent 递归执行，系统究竟怎么串起来的？",
    accent: C.gold,
    rightNote: "这里才是系统真正的大脑，\n而不是 UI 或 CLI 入口。",
  });
}

// ── Slide 8: QueryEngine vs query.ts ─────────────────────────────────────────
function slide08_queryengine() {
  const p = nextPage();
  const slide = pptx.addSlide();
  header(slide, p, {
    section: "Query Loop · 01",
    title: "QueryEngine 与 query.ts：会话生命周期 vs 单轮状态机",
    subtitle: "这是理解整套系统最关键的一对概念。两者职责完全不同，却又紧密配合。",
    accent: C.gold,
  });

  // QueryEngine
  card(slide, 0.68, 1.68, 5.88, 4.6, {
    title: "QueryEngine（会话对象）",
    titleColor: C.gold,
    fill: C.panel,
    body: bullets([
      "one QueryEngine per conversation（注释明确说明）",
      "维护 mutableMessages：整个会话累积的全部消息",
      "管理 abortController：支持终止单轮或整个会话",
      "记录 permissionDenials / totalUsage / readFileState",
      "封装 SDK/headless 接口，对外提供稳定 API",
      "处理 orphaned permission / skill discovery / session persist",
      "submitMessage() 启动新一轮 turn，把实际递归交给 query()",
    ]),
  });

  // query.ts
  card(slide, 6.73, 1.68, 5.88, 4.6, {
    title: "query.ts（单轮状态机）",
    titleColor: C.blue,
    fill: C.panelAlt,
    body: bullets([
      "buildQueryConfig()：将当次 turn 所需配置快照下来",
      "调用模型 API，流式消费 stream_event",
      "并行维护三个集合：assistantMessages / toolResults / toolUseBlocks",
      "检测到 tool_use → 不结束，而是切入执行阶段",
      "runTools() / StreamingToolExecutor 执行所有工具",
      "tool results 回注为新的 user messages → 进入下一轮",
      "needsFollowUp / maxTurns / compact 共同控制边界",
    ]),
  });

  addNotes(slide, [
    "restored-src/src/QueryEngine.ts",
    "restored-src/src/query.ts",
    "restored-src/src/query/config.ts",
  ]);
}

// ── Slide 9: Turn 执行时序 ────────────────────────────────────────────────────
function slide09_turn_sequence() {
  const p = nextPage();
  const slide = pptx.addSlide();
  header(slide, p, {
    section: "Query Loop · 02",
    title: "一次 Turn 的完整执行时序",
    subtitle: "从 submitMessage() 到「继续还是停止」——每一步都在 query.ts 中有对应代码。",
    accent: C.gold,
  });

  const steps = [
    { label: "submitMessage()", sub: "QueryEngine\n会话层入口", color: C.gold },
    { label: "buildQueryConfig()", sub: "快照运行时配置\n避免状态漂移", color: C.blue },
    { label: "Stream Model", sub: "流式消费\nstream_event", color: C.cyan },
    { label: "Collect tool_use", sub: "显式收集\ntoolUseBlocks", color: C.orange },
    { label: "runTools()", sub: "并行 / 串行\n执行所有工具", color: C.red },
    { label: "Inject Results", sub: "结果回注为\nnew user message", color: C.green },
    { label: "Continue / Stop", sub: "needsFollowUp\nmaxTurns / hooks", color: C.purple },
  ];

  const cardW = 1.68;
  const arrowW = 0.28;
  const totalW = steps.length * cardW + (steps.length - 1) * arrowW;
  let sx = (W - totalW) / 2;
  const sy = 1.78;

  steps.forEach((step, i) => {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: sx, y: sy, w: cardW, h: 1.05,
      rectRadius: 0.07,
      fill: { color: C.panel },
      line: { color: step.color, pt: 1.5 },
    });
    slide.addShape(pptx.ShapeType.rect, {
      x: sx, y: sy, w: cardW, h: 0.12,
      fill: { color: step.color },
      line: { color: step.color, transparency: 100 },
    });
    slide.addText(step.label, {
      x: sx + 0.06, y: sy + 0.18, w: cardW - 0.12, h: 0.3,
      fontSize: 10, bold: true, color: step.color, align: "center", fit: "shrink",
    });
    slide.addText(step.sub, {
      x: sx + 0.06, y: sy + 0.52, w: cardW - 0.12, h: 0.45,
      fontSize: 8.5, color: C.muted, align: "center", lineSpacingMultiple: 1.3,
    });

    if (i < steps.length - 1) {
      hArrow(slide, sx + cardW + 0.01, sy + 0.43, step.color);
    }
    sx += cardW + arrowW;
  });

  // 详细说明区
  card(slide, 0.68, 3.18, 11.98, 2.88, {
    title: "关键设计信号",
    titleColor: C.gold,
    fill: C.panel,
  });

  const points = [
    {
      title: "stop_reason 不可靠",
      body: "stop_reason=tool_use 在流式场景下有缺陷，因此 query.ts 在流式过程中显式收集 toolUseBlocks 作为判断依据",
      color: C.red,
    },
    {
      title: "工具结果不是副作用",
      body: "tool results 被编码成新的 user/attachment messages 回注对话，成为下一轮推理的输入——这是 agent loop 的核心机制",
      color: C.gold,
    },
    {
      title: "StreamingToolExecutor",
      body: "feature gate 打开时，启用 StreamingToolExecutor 允许工具在模型仍在输出时并行开始执行，降低端到端延迟",
      color: C.green,
    },
    {
      title: "Budget & Compact",
      body: "taskBudget / compactWarning / microCompact 共同保证长时任务不会因 context 膨胀而崩溃",
      color: C.purple,
    },
  ];

  let px = 0.88;
  points.forEach(pt => {
    slide.addText(pt.title, {
      x: px, y: 3.52, w: 2.78, h: 0.24,
      fontSize: 10.5, bold: true, color: pt.color,
    });
    slide.addText(pt.body, {
      x: px, y: 3.78, w: 2.78, h: 2.0,
      fontSize: 9.8, color: C.textSoft, lineSpacingMultiple: 1.35, valign: "top",
    });
    if (px < 9.5) {
      slide.addShape(pptx.ShapeType.rect, {
        x: px + 2.8, y: 3.52, w: 0.015, h: 2.4,
        fill: { color: C.line }, line: { color: C.line, transparency: 100 },
      });
    }
    px += 2.98;
  });

  addNotes(slide, ["restored-src/src/query.ts", "restored-src/src/QueryEngine.ts"]);
}

// ── Slide 10: Fallback & Compact ─────────────────────────────────────────────
function slide10_fallback() {
  const p = nextPage();
  const slide = pptx.addSlide();
  header(slide, p, {
    section: "Query Loop · 03",
    title: "长任务稳定性：Fallback 恢复、Context 压缩与预算管理",
    subtitle: "这部分代码量不小，但它们是 Claude Code 能真正跑完大型任务的基础设施。",
    accent: C.gold,
  });

  card(slide, 0.68, 1.68, 3.82, 4.6, {
    title: "流式 Fallback 恢复",
    titleColor: C.red,
    fill: C.panel,
    body: bullets([
      "prompt-too-long / media-size /\nmax-output-tokens 错误会先被 withheld",
      "recovery 逻辑判断是否能自救",
      "如需 fallback：给旧 assistant message 发 tombstone",
      "清空旧的 toolUse / toolResult 暂存",
      "重建 StreamingToolExecutor\n（避免旧 tool_use_id 泄漏进 retry）",
    ]),
    bodyFontSize: 10.8,
  });

  card(slide, 4.66, 1.68, 3.82, 4.6, {
    title: "Context 压缩策略",
    titleColor: C.purple,
    fill: C.panelAlt,
    body: bullets([
      "autoCompact：自动触发上下文压缩",
      "microCompact：轻量级压缩，\n保留最近 turns",
      "compact：完整会话摘要替换",
      "sessionMemoryCompact：\n跨会话记忆压缩",
      "compactWarning：提前预警，\n给用户调整机会",
    ]),
    bodyFontSize: 10.8,
  });

  card(slide, 8.64, 1.68, 3.82, 4.6, {
    title: "预算与续跑控制",
    titleColor: C.green,
    fill: C.panel,
    body: bullets([
      "taskBudget：整个 agentic turn\n的 API 调用预算",
      "动态计算 token budget /\noutput tokens",
      "continuation 计数防止无限递归",
      "fallback model 切换（降级到\n更便宜的模型）",
      "maxTurns 硬限制\n作为最后防线",
    ]),
    bodyFontSize: 10.8,
  });

  addNotes(slide, [
    "restored-src/src/query.ts",
    "restored-src/src/services/compact/autoCompact.ts",
    "restored-src/src/services/compact/microCompact.ts",
  ]);
}

// ── Section 3: Tool Runtime ───────────────────────────────────────────────────
// ── Slide 11: 分节页 ──────────────────────────────────────────────────────────
function slide11_sec3_divider() {
  sectionDivider(nextPage(), 3, {
    title: "Tool Runtime\n& Permission",
    body: "模型提出动作，runtime 决定能不能做、怎么做——这才是真正的「受控执行」。",
    accent: C.orange,
    rightNote: "权限不是外围 UI，\n而是工具执行主路径的组成部分。",
  });
}

// ── Slide 12: 工具清单 ────────────────────────────────────────────────────────
function slide12_tools() {
  const p = nextPage();
  const slide = pptx.addSlide();
  header(slide, p, {
    section: "Tool Runtime · 01",
    title: "40+ 内置工具：覆盖从代码编辑到系统管理的完整工作流",
    subtitle: "工具不是简单的函数，而是带有 schema、权限声明、hook 交互能力的可治理执行单元。",
    accent: C.orange,
  });

  const toolGroups = [
    {
      name: "文件操作",
      color: C.blue,
      tools: ["FileReadTool", "FileWriteTool", "FileEditTool", "GlobTool", "GrepTool"],
    },
    {
      name: "代码执行",
      color: C.red,
      tools: ["BashTool", "PowerShellTool", "REPLTool (JS)", "NotebookEditTool"],
    },
    {
      name: "Agent 协作",
      color: C.purple,
      tools: ["AgentTool", "TaskCreateTool", "TaskGetTool", "TaskListTool", "TeamCreateTool", "SendMessageTool"],
    },
    {
      name: "外部集成",
      color: C.cyan,
      tools: ["MCPTool", "WebSearchTool", "WebFetchTool", "McpAuthTool", "ListMcpResourcesTool"],
    },
    {
      name: "开发辅助",
      color: C.green,
      tools: ["LSPTool", "AskUserQuestionTool", "SkillTool", "BriefTool", "TodoWriteTool", "ToolSearchTool"],
    },
    {
      name: "流程控制",
      color: C.orange,
      tools: ["EnterPlanModeTool", "ExitPlanModeTool", "EnterWorktreeTool", "SleepTool", "ScheduleCronTool"],
    },
  ];

  let gx = 0.68;
  toolGroups.forEach((grp, gi) => {
    const gy = gi < 3 ? 1.7 : 4.15;
    const gxi = gi < 3 ? 0.68 + gi * 4.18 : 0.68 + (gi - 3) * 4.18;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: gxi, y: gy, w: 3.98, h: 2.12,
      rectRadius: 0.07,
      fill: { color: C.panel },
      line: { color: grp.color, pt: 1.2 },
    });
    slide.addShape(pptx.ShapeType.rect, {
      x: gxi, y: gy, w: 3.98, h: 0.1,
      fill: { color: grp.color },
      line: { color: grp.color, transparency: 100 },
    });
    slide.addText(grp.name, {
      x: gxi + 0.15, y: gy + 0.16, w: 3.68, h: 0.26,
      fontSize: 12, bold: true, color: grp.color,
    });
    slide.addText(grp.tools.join("  ·  "), {
      x: gxi + 0.15, y: gy + 0.48, w: 3.68, h: 1.48,
      fontSize: 10, color: C.textSoft, lineSpacingMultiple: 1.5, valign: "top",
    });
  });

  addNotes(slide, [
    "restored-src/src/tools/",
    "restored-src/src/Tool.ts",
    "restored-src/src/tools.ts",
  ]);
}

// ── Slide 13: Hook 生命周期 ───────────────────────────────────────────────────
function slide13_hooks() {
  const p = nextPage();
  const slide = pptx.addSlide();
  header(slide, p, {
    section: "Tool Runtime · 02",
    title: "Hook 不是扩展点，而是执行主路径的组成部分",
    subtitle: "Pre Hook / 权限决策 / Post Hook / Failure Hook 贯穿工具执行的全生命周期。",
    accent: C.orange,
  });

  // Hook 生命周期时序
  const stages = [
    { label: "Input\nValidate", color: C.cyan, sub: "zod schema" },
    { label: "Pre-Tool\nHooks", color: C.purple, sub: "策略注入点" },
    { label: "Permission\nResolve", color: C.red, sub: "多层决策" },
    { label: "tool.call()", color: C.green, sub: "实际执行" },
    { label: "Post-Tool\nHooks", color: C.blue, sub: "结果改写" },
    { label: "Failure\nHooks", color: C.orange, sub: "错误处理" },
  ];

  const sw = 1.82;
  const aw = 0.28;
  const sy = 1.75;
  let sx = 0.65;

  stages.forEach((st, i) => {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: sx, y: sy, w: sw, h: 0.98,
      rectRadius: 0.07,
      fill: { color: C.panel },
      line: { color: st.color, pt: 1.5 },
    });
    slide.addShape(pptx.ShapeType.rect, {
      x: sx, y: sy, w: sw, h: 0.1,
      fill: { color: st.color },
      line: { color: st.color, transparency: 100 },
    });
    slide.addText(st.label, {
      x: sx + 0.08, y: sy + 0.16, w: sw - 0.16, h: 0.42,
      fontSize: 11, bold: true, color: st.color, align: "center",
    });
    slide.addText(st.sub, {
      x: sx + 0.08, y: sy + 0.62, w: sw - 0.16, h: 0.24,
      fontSize: 9, color: C.muted, align: "center",
    });
    if (i < stages.length - 1) {
      hArrow(slide, sx + sw + 0.02, sy + 0.37, st.color);
    }
    sx += sw + aw;
  });

  // 三列详情
  card(slide, 0.68, 3.02, 3.9, 3.3, {
    title: "Pre Hook 能返回什么",
    titleColor: C.purple,
    fill: C.panel,
    body: bullets([
      "message：直接注入 UI / transcript",
      "hookPermissionResult：allow / ask / deny",
      "hookUpdatedInput：只改输入，不改权限",
      "preventContinuation：阻断后续控制流",
      "additionalContext：附加上下文给模型",
    ]),
    bodyFontSize: 10.8,
  });

  card(slide, 4.72, 3.02, 3.9, 3.3, {
    title: "权限决策优先级",
    titleColor: C.red,
    fill: C.panelAlt,
    body: bullets([
      "① Hook deny → 直接拒绝",
      "② Hook allow → 再跑 checkRuleBasedPermissions",
      "③ Rule deny/ask → 可覆盖 hook allow",
      "④ 无 hook 决策 → 进入 canUseTool() 流程",
      "结论：权限是 hook + rule + UI 三层叠加",
    ]),
    bodyFontSize: 10.8,
  });

  card(slide, 8.76, 3.02, 3.9, 3.3, {
    title: "Post / Failure Hook",
    titleColor: C.blue,
    fill: C.panel,
    body: bullets([
      "成功：可产出额外 attachment / message",
      "成功：可 preventContinuation 阻止继续",
      "MCP tool：可 updatedMCPToolOutput 改写输出",
      "失败：runPostToolUseFailureHooks() 策略化处理",
      "因此成功与失败都被统一纳入 hook 协议",
    ]),
    bodyFontSize: 10.8,
  });

  addNotes(slide, [
    "restored-src/src/services/tools/toolExecution.ts",
    "restored-src/src/services/tools/toolHooks.ts",
  ]);
}

// ── Slide 14: Permission System ───────────────────────────────────────────────
function slide14_permissions() {
  const p = nextPage();
  const slide = pptx.addSlide();
  header(slide, p, {
    section: "Tool Runtime · 03",
    title: "权限系统：不是一个 bool，而是 Mode + Rules + Classifier + Shell Analysis",
    subtitle: "这套系统让 Claude Code 可以被企业策略、本地规则和用户偏好共同治理。",
    accent: C.orange,
  });

  // 左：Permission Modes
  card(slide, 0.68, 1.68, 3.62, 4.6, {
    title: "Permission Modes",
    titleColor: C.gold,
    fill: C.panel,
    body: bullets([
      "default：默认交互模式",
      "plan：只规划，不执行",
      "acceptEdits：自动接受文件修改",
      "bypassPermissions：受信任模式",
      "dontAsk：静默模式",
      "auto：自动（feature gated）",
      "",
      "每个 mode 都有 title / symbol /\ncolor / external 映射，\n同时服务策略、UI 和对外接口",
    ]),
    bodyFontSize: 10.5,
  });

  // 中：Rules
  card(slide, 4.46, 1.68, 3.62, 4.6, {
    title: "规则系统",
    titleColor: C.red,
    fill: C.panelAlt,
    body: bullets([
      "permissionRuleParser.ts 解析规则字符串",
      "例：Bash(npm install) / Edit(src/**)",
      "shellRuleMatching.ts 匹配 shell 命令",
      "filesystem.ts 处理读写范围与路径分析",
      "shadowedRuleDetection.ts 检测冗余规则",
      "",
      "规则可来自：CLAUDE.md / 企业策略 /\n用户设置 / 会话临时授权",
    ]),
    bodyFontSize: 10.5,
  });

  // 右：Classifier
  card(slide, 8.24, 1.68, 4.42, 4.6, {
    title: "Bash Classifier（自动审批）",
    titleColor: C.purple,
    fill: C.panel,
    body: bullets([
      "bashClassifier.ts 对 shell 命令做风险分类",
      "yoloClassifier.ts 在 bypass 模式下处理",
      "dangerousPatterns.ts 维护危险命令模式库",
      "classifierDecision.ts 给出审批建议",
      "",
      "高置信度安全命令可跳过用户确认",
      "这使 agent 在 auto 模式下能高效运行",
      "同时保留对高风险命令的拦截能力",
    ]),
    bodyFontSize: 10.5,
  });

  addNotes(slide, [
    "restored-src/src/utils/permissions/PermissionMode.ts",
    "restored-src/src/utils/permissions/permissionRuleParser.ts",
    "restored-src/src/utils/permissions/bashClassifier.ts",
    "restored-src/src/utils/permissions/filesystem.ts",
  ]);
}

// ── Section 4: Multi-Agent ────────────────────────────────────────────────────
// ── Slide 15: 分节页 ──────────────────────────────────────────────────────────
function slide15_sec4_divider() {
  sectionDivider(nextPage(), 4, {
    title: "Multi-Agent\nSwarm",
    body: "多 Agent 不是演示特性，而是带状态、可追踪、可治理的 Actor 子系统。",
    accent: C.purple,
    rightNote: "主 agent 只是第一个 agent，\n系统从一开始就允许递归生成更多。",
  });
}

// ── Slide 16: Agent 体系 ──────────────────────────────────────────────────────
function slide16_agent_system() {
  const p = nextPage();
  const slide = pptx.addSlide();
  header(slide, p, {
    section: "Multi-Agent · 01",
    title: "AgentTool → runAgent → inProcessRunner：从工具调用到子 Agent 运行时",
    subtitle: "这条链路证明：多 Agent 是 Query Loop 的内生能力，不是外部 orchestration shell。",
    accent: C.purple,
  });

  // 流程链
  const chain = [
    { label: "模型调用\nAgentTool", sub: "像调用普通工具一样", color: C.blue },
    { label: "AgentTool\n解析参数", sub: "prompt / type / mode\nisolation / cwd", color: C.purple },
    { label: "runAgent()\n构建子运行时", sub: "agentId / transcript\n裁剪上下文 / 初始化", color: C.gold },
    { label: "inProcessRunner\n或 background", sub: "context 隔离\n共享终端", color: C.orange },
    { label: "query.ts\n子代理循环", sub: "完整 agent loop\n复用主内核", color: C.red },
  ];

  const sw = 2.3;
  const aw = 0.25;
  let sx = 0.62;
  chain.forEach((item, i) => {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: sx, y: 1.75, w: sw, h: 1.1,
      rectRadius: 0.07,
      fill: { color: C.panel },
      line: { color: item.color, pt: 1.5 },
    });
    slide.addShape(pptx.ShapeType.rect, {
      x: sx, y: 1.75, w: sw, h: 0.1,
      fill: { color: item.color },
      line: { color: item.color, transparency: 100 },
    });
    slide.addText(item.label, {
      x: sx + 0.1, y: 1.9, w: sw - 0.2, h: 0.44,
      fontSize: 11, bold: true, color: item.color, align: "center",
    });
    slide.addText(item.sub, {
      x: sx + 0.1, y: 2.36, w: sw - 0.2, h: 0.38,
      fontSize: 8.8, color: C.muted, align: "center", lineSpacingMultiple: 1.3,
    });
    if (i < chain.length - 1) {
      hArrow(slide, sx + sw + 0.01, 2.22, item.color);
    }
    sx += sw + aw;
  });

  // 下方两列详情
  card(slide, 0.68, 3.2, 5.88, 3.06, {
    title: "runAgent() 关键逻辑",
    titleColor: C.gold,
    fill: C.panel,
    body: bullets([
      "计算子代理使用的 model（可与父代理不同）",
      "创建 agentId，设置 transcript 子目录与 trace 层级",
      "构造 initialMessages，过滤 incomplete tool calls",
      "根据 agent type 裁剪 claudeMd / gitStatus 等上下文",
      "子代理不继承父代理所有上下文——这是关键设计决策",
      "最终调用 query()，形成子代理递归 loop",
    ]),
    bodyFontSize: 11,
  });

  card(slide, 6.73, 3.2, 5.92, 3.06, {
    title: "inProcessRunner 额外职责",
    titleColor: C.purple,
    fill: C.panelAlt,
    body: bullets([
      "AsyncLocalStorage / teammate context 做上下文隔离",
      "把进度更新和 AppState 写回 leader 可见状态",
      "完成后给 leader 发 idle notification",
      "支持 plan mode approval flow / abort cleanup",
      "权限申请优先通过 leader UI bridge，不可用时降级为 mailbox sync",
    ]),
    bodyFontSize: 11,
  });

  addNotes(slide, [
    "restored-src/src/tools/AgentTool/AgentTool.tsx",
    "restored-src/src/tools/AgentTool/runAgent.ts",
    "restored-src/src/utils/swarm/inProcessRunner.ts",
  ]);
}

// ── Slide 17: Teammate Actor Model ────────────────────────────────────────────
function slide17_teammate_actor() {
  const p = nextPage();
  const slide = pptx.addSlide();
  header(slide, p, {
    section: "Multi-Agent · 02",
    title: "Teammate 是持续存活的 Actor，而不是一次性函数调用",
    subtitle: "waitForNextPromptOrShutdown() 实现的 idle 循环，让 subagent 能响应多轮任务。",
    accent: C.purple,
  });

  // 状态图
  const states = [
    { x: 0.78, y: 1.85, label: "idle", color: C.green },
    { x: 2.78, y: 1.85, label: "check\npending msgs", color: C.blue },
    { x: 4.78, y: 1.85, label: "poll\nmailbox", color: C.purple },
    { x: 6.78, y: 1.85, label: "claim\nteam task?", color: C.gold },
    { x: 8.78, y: 1.85, label: "run prompt /\nshutdown", color: C.red },
  ];

  states.forEach((st, i) => {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: st.x, y: st.y, w: 1.8, h: 0.92,
      rectRadius: 0.07,
      fill: { color: C.panel },
      line: { color: st.color, pt: 1.5 },
    });
    slide.addText(st.label, {
      x: st.x + 0.08, y: st.y + 0.22, w: 1.64, h: 0.48,
      fontSize: 11, bold: true, color: st.color, align: "center",
    });
    if (i < states.length - 1) {
      hArrow(slide, st.x + 1.84, st.y + 0.34, st.color);
    }
  });

  // 循环回路：run → idle
  slide.addText("每 500ms 轮询", {
    x: 0.5, y: 2.98, w: 2.5, h: 0.2,
    fontSize: 9, color: C.muted, align: "center",
  });

  // 三列机制说明
  const cols = [
    {
      title: "Mailbox 通信",
      color: C.purple,
      items: [
        "leader / teammate 通过 mailbox 交换消息",
        "优先处理 shutdown request",
        "再处理 team lead 消息",
        "teammateMailbox.ts 管理消息队列",
      ],
    },
    {
      title: "Task Claim 系统",
      color: C.gold,
      items: [
        "tasks.ts 维护团队任务列表",
        "空闲时主动尝试 claim 可用任务",
        "任务有 owner 概念，防止重复执行",
        "完成后写回 task output，持久化",
      ],
    },
    {
      title: "Permission Bridge",
      color: C.red,
      items: [
        "worker ask 权限 → 先尝试 leader UI queue",
        "leader UI 不可用 → 降级为 mailbox sync",
        "成功时写回 permission updates 到 leader context",
        "worker 不会绕开权限系统",
      ],
    },
    {
      title: "Built-in Agents",
      color: C.blue,
      items: [
        "builtInAgents.ts：feature-gated agent registry",
        "Explore / Plan / Verification / Code Guide",
        "SDK 场景可通过环境变量禁用",
        "coordinator mode 下使用 workerAgent.js",
      ],
    },
  ];

  let cx = 0.68;
  cols.forEach(col => {
    card(slide, cx, 3.15, 3.0, 3.14, {
      title: col.title,
      titleColor: col.color,
      fill: C.panel,
      body: bullets(col.items),
      bodyFontSize: 10,
    });
    cx += 3.16;
  });

  addNotes(slide, [
    "restored-src/src/utils/swarm/inProcessRunner.ts",
    "restored-src/src/utils/swarm/permissionSync.ts",
    "restored-src/src/utils/teammateMailbox.ts",
    "restored-src/src/utils/tasks.ts",
    "restored-src/src/tools/AgentTool/builtInAgents.ts",
  ]);
}

// ── Section 5: Extension & Surfaces ──────────────────────────────────────────
// ── Slide 18: 分节页 ──────────────────────────────────────────────────────────
function slide18_sec5_divider() {
  sectionDivider(nextPage(), 5, {
    title: "扩展层与\n多 Surface",
    body: "MCP / Skills / Plugins / Commands 如何汇合；Terminal / Bridge / SDK 如何共用一套引擎。",
    accent: C.cyan,
    rightNote: "不同入口改变的只是 ingress/egress，\n推理内核始终是同一套。",
  });
}

// ── Slide 19: 扩展层汇合 ──────────────────────────────────────────────────────
function slide19_extensions() {
  const p = nextPage();
  const slide = pptx.addSlide();
  header(slide, p, {
    section: "扩展层 · 01",
    title: "Plugin / Skill / Command / MCP：四条通道，最终折叠进同一个 Tool Surface",
    subtitle: "这四层经常被混淆，但在源码里边界非常清晰，职责完全不同。",
    accent: C.cyan,
  });

  // 漏斗图：四个入口 → 共享 Tool Surface
  const inlets = [
    { x: 0.68, label: "Plugin", sub: "pluginLoader.ts\n安装 / manifest / 分发", color: C.purple },
    { x: 3.58, label: "Skill", sub: "loadSkillsDir.ts\n工作流模板 / 经验封装", color: C.green },
    { x: 6.48, label: "Command", sub: "commands.ts (101个)\n用户显式入口", color: C.blue },
    { x: 9.38, label: "MCP", sub: "services/mcp/client.ts\n外部 server 能力桥接", color: C.gold },
  ];

  inlets.forEach(inlet => {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: inlet.x, y: 1.72, w: 2.76, h: 1.0,
      rectRadius: 0.07,
      fill: { color: C.panel },
      line: { color: inlet.color, pt: 1.5 },
    });
    slide.addText(inlet.label, {
      x: inlet.x + 0.12, y: 1.84, w: 2.52, h: 0.28,
      fontSize: 15, bold: true, color: inlet.color,
    });
    slide.addText(inlet.sub, {
      x: inlet.x + 0.12, y: 2.14, w: 2.52, h: 0.44,
      fontSize: 9.5, color: C.muted, lineSpacingMultiple: 1.3,
    });
    // 向下箭头
    slide.addShape(pptx.ShapeType.chevron, {
      x: inlet.x + 1.04, y: 2.8, w: 0.62, h: 0.32,
      rotate: 90,
      fill: { color: inlet.color, transparency: 30 },
      line: { color: inlet.color, transparency: 100 },
    });
  });

  // 共享 Tool Surface
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 2.5, y: 3.28, w: 8.3, h: 0.92,
    rectRadius: 0.08,
    fill: { color: C.gold },
    line: { color: C.gold, transparency: 100 },
    shadow: safeOuterShadow(C.gold, 0.2, 45, 3, 0.5),
  });
  slide.addText("Shared Tool Surface  +  Command Surface", {
    x: 2.5, y: 3.5, w: 8.3, h: 0.42,
    fontSize: 18, bold: true, color: C.bg, align: "center",
  });
  slide.addText("tools.ts · toolExecution.ts · permissions · hooks", {
    x: 2.5, y: 3.94, w: 8.3, h: 0.2,
    fontSize: 10, color: C.bgMid, align: "center",
  });

  // 下方说明
  const notes = [
    { color: C.purple, title: "Plugin", body: "管分发、安装、manifest，最终转化为可用工具或命令" },
    { color: C.green, title: "Skill", body: "封装工作流模板，很多情况下最终下沉为 command" },
    { color: C.blue, title: "Command", body: "用户显式调用入口，101 个命令覆盖开发全流程" },
    { color: C.gold, title: "MCP", body: "把外部 server 的 tools / resources 映射进本地 runtime，仍受本地治理" },
  ];

  let nx = 0.68;
  notes.forEach(n => {
    slide.addShape(pptx.ShapeType.rect, {
      x: nx, y: 4.4, w: 2.9, h: 0.06,
      fill: { color: n.color },
      line: { color: n.color, transparency: 100 },
    });
    slide.addText(n.title, {
      x: nx, y: 4.52, w: 2.9, h: 0.24,
      fontSize: 11.5, bold: true, color: n.color,
    });
    slide.addText(n.body, {
      x: nx, y: 4.8, w: 2.9, h: 1.3,
      fontSize: 10.5, color: C.textSoft, lineSpacingMultiple: 1.35,
    });
    nx += 3.08;
  });

  addNotes(slide, [
    "restored-src/src/utils/plugins/pluginLoader.ts",
    "restored-src/src/skills/loadSkillsDir.ts",
    "restored-src/src/commands.ts",
    "restored-src/src/services/mcp/client.ts",
    "restored-src/src/tools.ts",
  ]);
}

// ── Slide 20: Multi-Surface ────────────────────────────────────────────────────
function slide20_surfaces() {
  const p = nextPage();
  const slide = pptx.addSlide();
  header(slide, p, {
    section: "扩展层 · 02",
    title: "Terminal / Bridge / SDK：不同 Surface 共用同一套推理引擎",
    subtitle: "这是「same engine across surfaces」在源码层面的真实落点。",
    accent: C.cyan,
  });

  // 三列 surface 说明
  const surfaces = [
    {
      name: "Terminal REPL",
      files: "ink/components/App.tsx\nAppStateProvider\ncli/print.ts",
      color: C.blue,
      features: [
        "Ink (React 终端 UI) 渲染交互界面",
        "AppState 共享运行时状态",
        "支持 Vim 模式 (vim/ 目录)",
        "权限弹窗直接在终端 UI 显示",
        "支持 voice/ 语音交互（实验性）",
      ],
    },
    {
      name: "Bridge / Remote",
      files: "bridge/bridgeMain.ts\ninitReplBridge.ts\nbridgeUI.ts",
      color: C.purple,
      features: [
        "把远端消息重新注入本地消息队列",
        "replBridge.ts 建立双向通道",
        "bridgeUI.ts 在 bridge 模式显示 UI",
        "sessionRunner.ts 管理远程会话生命周期",
        "trustedDevice.ts 处理远端认证",
      ],
    },
    {
      name: "SDK / Headless",
      files: "QueryEngine.ts SDK 接口\ncli/print.ts 结构化输出\nremote/ 目录",
      color: C.green,
      features: [
        "QueryEngine 对外提供稳定 SDK API",
        "cli/print.ts 格式化结构化输出",
        "可通过环境变量禁用 built-in agents",
        "sdkMessageAdapter.ts 适配消息格式",
        "SessionsWebSocket.ts 管理 SDK 会话",
      ],
    },
  ];

  surfaces.forEach((s, i) => {
    const sx = 0.68 + i * 4.18;
    card(slide, sx, 1.68, 3.94, 4.98, {
      title: s.name,
      titleColor: s.color,
      fill: C.panel,
    });
    slide.addShape(pptx.ShapeType.rect, {
      x: sx, y: 1.68, w: 3.94, h: 0.1,
      fill: { color: s.color },
      line: { color: s.color, transparency: 100 },
    });
    slide.addText(s.files, {
      x: sx + 0.18, y: 2.08, w: 3.58, h: 0.52,
      fontSize: 8.8, color: C.muted, lineSpacingMultiple: 1.3, fontFace: "Menlo",
    });
    slide.addShape(pptx.ShapeType.rect, {
      x: sx + 0.18, y: 2.65, w: 3.58, h: 0.01,
      fill: { color: C.line }, line: { color: C.line, transparency: 100 },
    });
    slide.addText(bullets(s.features), {
      x: sx + 0.18, y: 2.72, w: 3.58, h: 3.7,
      fontSize: 10.5, color: C.textSoft, lineSpacingMultiple: 1.5, valign: "top",
    });
  });

  addNotes(slide, [
    "restored-src/src/ink/components/App.tsx",
    "restored-src/src/cli/print.ts",
    "restored-src/src/bridge/bridgeMain.ts",
    "restored-src/src/bridge/initReplBridge.ts",
    "restored-src/src/remote/",
    "restored-src/src/QueryEngine.ts",
  ]);
}

// ── Slide 21: 非典型功能 ──────────────────────────────────────────────────────
function slide21_unique_features() {
  const p = nextPage();
  const slide = pptx.addSlide();
  header(slide, p, {
    section: "特色功能 · 01",
    title: "这些你可能没想到它会有：Voice、Vim、Buddy、KAIROS",
    subtitle: "这些不是边角功能——它们暗示了产品对「AI 工作方式」更深远的设想。",
    accent: C.green,
  });

  const features = [
    {
      title: "Voice 模式",
      icon: "🎙",
      color: C.cyan,
      path: "services/voice.ts\nservices/voiceStreamSTT.ts",
      items: [
        "流式语音转文字（STT）",
        "voiceModeEnabled.ts 控制开关",
        "voiceKeyterms.ts 关键词识别优化",
        "集成进主 UI 交互流程",
      ],
    },
    {
      title: "Vim 模式",
      icon: "⌨",
      color: C.green,
      path: "vim/motions.ts\nvim/operators.ts\nvim/textObjects.ts",
      items: [
        "完整的 Vim 动作系统",
        "motions / operators / textObjects",
        "transitions.ts 管理模式切换",
        "在终端编辑器内提供 Vim 体验",
      ],
    },
    {
      title: "AI Buddy（伴侣 UI）",
      icon: "🐧",
      color: C.purple,
      path: "buddy/companion.ts\nbuddy/CompanionSprite.tsx\nbuddy/sprites.ts",
      items: [
        "像素风格 AI 伴侣动画精灵",
        "useBuddyNotification 推送通知",
        "companion.ts 管理伴侣状态",
        "通过精灵动画表达工作状态",
      ],
    },
    {
      title: "Memory / memdir",
      icon: "🧠",
      color: C.gold,
      path: "memdir/memdir.ts\nmemdir/findRelevantMemories.ts\nservices/SessionMemory/",
      items: [
        "结构化记忆文件目录系统",
        "findRelevantMemories 语义搜索",
        "teamMemPrompts 团队共享记忆",
        "跨会话持久化 agent 经验",
      ],
    },
  ];

  let fx = 0.68;
  features.forEach((f, i) => {
    const fy = i < 2 ? 1.7 : 4.15;
    const fxi = i < 2 ? 0.68 + i * 6.28 : 0.68 + (i - 2) * 6.28;

    card(slide, fxi, fy, 6.08, 2.2, {
      title: f.title,
      titleColor: f.color,
      fill: C.panel,
    });
    slide.addShape(pptx.ShapeType.rect, {
      x: fxi, y: fy, w: 6.08, h: 0.1,
      fill: { color: f.color },
      line: { color: f.color, transparency: 100 },
    });
    slide.addText(f.path, {
      x: fxi + 0.18, y: fy + 0.5, w: 3.0, h: 0.52,
      fontSize: 8.5, color: C.muted, lineSpacingMultiple: 1.3, fontFace: "Menlo",
    });
    slide.addText(bullets(f.items), {
      x: fxi + 3.3, y: fy + 0.5, w: 2.6, h: 1.55,
      fontSize: 10, color: C.textSoft, lineSpacingMultiple: 1.4, valign: "top",
    });
  });

  addNotes(slide, [
    "restored-src/src/voice/",
    "restored-src/src/vim/",
    "restored-src/src/buddy/",
    "restored-src/src/memdir/",
    "restored-src/src/services/SessionMemory/",
  ]);
}

// ── Feature Deep Dives ────────────────────────────────────────────────────────
// ── Slide 22: Voice 模式 ──────────────────────────────────────────────────────
function slide22_voice() {
  const p = nextPage();
  const slide = pptx.addSlide();
  header(slide, p, {
    section: "特色功能 · 02",
    title: "Voice 模式：Push-to-Talk，接入 Anthropic 语音流服务",
    subtitle: "不是通用 TTS/STT 库封装——而是直连 claude.ai voice_stream WebSocket，要求 OAuth 登录。",
    accent: C.cyan,
  });

  // 左列：架构
  card(slide, 0.68, 1.68, 5.72, 4.88, {
    title: "实现架构",
    titleColor: C.cyan,
    fill: C.panel,
    body: bullets([
      "services/voice.ts — 音频录制主服务（525 行）",
      "  原生 audio-capture-napi（CoreAudio / ALSA）",
      "  fallback：SoX rec 或 arecord (Linux)",
      "  dlopen 懒加载——首次按键触发，避免启动卡顿",
      "",
      "services/voiceStreamSTT.ts — 流式 STT（544 行）",
      "  WebSocket 连接 /api/ws/speech_to_text/voice_stream",
      "  协议：JSON 控制帧 + 二进制音频帧",
      "  服务端响应 TranscriptText / TranscriptEndpoint",
      "  8s KeepAlive 保活，5s safety timeout",
      "",
      "services/voiceKeyterms.ts — 关键词识别优化（106 行）",
      "  voice/voiceModeEnabled.ts — GrowthBook 开关",
    ]),
    bodyFontSize: 10.5,
  });

  // 右上：工作模式
  card(slide, 6.56, 1.68, 6.1, 2.24, {
    title: "Push-to-Talk 工作方式",
    titleColor: C.blue,
    fill: C.panelAlt,
    body: bullets([
      "按住快捷键 → 开始录音（16kHz 单声道）",
      "松开 → 发送 CloseStream，等待 finalize()",
      "沉默检测：SoX 2s / 3% 阈值（自动停止模式）",
      "连接音频帧流式推送，边录边传，降低延迟",
    ]),
    bodyFontSize: 11,
  });

  // 右下：权限与限制
  card(slide, 6.56, 4.08, 6.1, 2.48, {
    title: "权限与限制（源码直接说明）",
    titleColor: C.gold,
    fill: C.panel,
    body: bullets([
      "必须 Anthropic OAuth 登录——API key 不支持",
      "Bedrock / Vertex / Foundry 均不可用",
      "tengu_amber_quartz_disabled GrowthBook 紧急关闭开关",
      "WSL1 / headless Linux：arecord 需 ALSA/PulseAudio",
      "WSL2+WSLg（Win11）通过 RDP pipes 支持",
      "冷启动 dlopen 可能阻塞事件循环 1–8s（已有注释说明）",
    ]),
    bodyFontSize: 11,
  });

  addNotes(slide, [
    "restored-src/src/services/voice.ts",
    "restored-src/src/services/voiceStreamSTT.ts",
    "restored-src/src/services/voiceKeyterms.ts",
    "restored-src/src/voice/voiceModeEnabled.ts",
  ]);
}

// ── Slide 23: Vim 模式 ────────────────────────────────────────────────────────
function slide23_vim() {
  const p = nextPage();
  const slide = pptx.addSlide();
  header(slide, p, {
    section: "特色功能 · 03",
    title: "Vim 模式：1,513 行的完整终端编辑器状态机",
    subtitle: "不是「支持几个快捷键」——而是严格的 INSERT / NORMAL 双模式状态机，含 dot-repeat 和 text objects。",
    accent: C.green,
  });

  // 左：状态机图示（用文字模拟）
  card(slide, 0.68, 1.68, 5.72, 4.88, {
    title: "状态机设计（types.ts 注释原文）",
    titleColor: C.green,
    fill: C.panel,
  });
  // 代码块
  slide.addText(
    [
      "VimState",
      "  INSERT  (tracks insertedText)",
      "  NORMAL  — CommandState 子状态机",
      "",
      "  idle ──┬─[d/c/y]──► operator",
      "         ├─[1-9]────► count",
      "         ├─[fFtT]───► find",
      "         ├─[g]──────► g",
      "         ├─[r]──────► replace",
      "         └─[><]─────► indent",
      "",
      "  operator ─┬─[motion]──► execute",
      "            ├─[0-9]────► operatorCount",
      "            ├─[ia]─────► operatorTextObj",
      "            └─[fFtT]───► operatorFind",
    ].join("\n"),
    {
      x: 0.88, y: 2.14, w: 5.32, h: 4.28,
      fontFace: "Menlo", fontSize: 9.8,
      color: C.green, valign: "top",
    }
  );

  // 右上：实现文件
  card(slide, 6.56, 1.68, 6.1, 2.24, {
    title: "实现文件（1,513 行）",
    titleColor: C.green,
    fill: C.panelAlt,
    body: bullets([
      "types.ts（199 行）——状态机类型即文档",
      "transitions.ts（490 行）——状态转移核心",
      "operators.ts（556 行）——delete / change / yank",
      "textObjects.ts（186 行）——w W ( [ { < \" ' ` …",
      "motions.ts（82 行）——h j k l w b e ^ $ …",
    ]),
    bodyFontSize: 11,
  });

  // 右下：支持的特性
  card(slide, 6.56, 4.08, 6.1, 2.48, {
    title: "支持特性（源码验证）",
    titleColor: C.cyan,
    fill: C.panel,
    body: bullets([
      "完整 operators：delete(d) / change(c) / yank(y)",
      "Text objects：word / WORD / 括号 / 引号 / 花括号",
      "Find motions：f F t T（含反向）",
      "Count prefix：3dw / 2dd / 5j 等",
      "Dot-repeat（.）：RecordedChange 记录完整重放",
      "Register：yank/paste 寄存器 + linewise 标记",
      "MAX_VIM_COUNT = 10000（防止卡死）",
    ]),
    bodyFontSize: 11,
  });

  addNotes(slide, [
    "restored-src/src/vim/types.ts",
    "restored-src/src/vim/transitions.ts",
    "restored-src/src/vim/operators.ts",
    "restored-src/src/vim/textObjects.ts",
    "restored-src/src/vim/motions.ts",
  ]);
}

// ── Slide 24: Buddy ───────────────────────────────────────────────────────────
function slide24_buddy() {
  const p = nextPage();
  const slide = pptx.addSlide();
  header(slide, p, {
    section: "特色功能 · 04",
    title: "Buddy：你的 AI 伴侣——18 个物种、5 个稀有度、确定性孵化算法",
    subtitle: "源码里的隐藏彩蛋：2026 年 4 月 1 日 Teaser 窗口，基于 userId hash 生成唯一伴侣。",
    accent: C.purple,
  });

  // 左：物种与属性系统
  card(slide, 0.68, 1.68, 5.72, 4.88, {
    title: "角色生成系统（1,298 行）",
    titleColor: C.purple,
    fill: C.panel,
    body: bullets([
      "18 种物种：duck / goose / cat / dragon / octopus /",
      "  owl / penguin / turtle / snail / ghost / axolotl /",
      "  capybara / cactus / robot / rabbit / mushroom / chonk / blob",
      "",
      "5 个稀有度（按权重）：",
      "  common 60% / uncommon 25% / rare 10%",
      "  epic 4% / legendary 1%",
      "",
      "6 种眼睛：· ✦ × ◉ @ °",
      "8 种帽子：crown / tophat / propeller / halo /",
      "  wizard / beanie / tinyduck（common 无帽子）",
      "Shiny 概率：1%",
      "",
      "5 维属性：DEBUGGING / PATIENCE / CHAOS / WISDOM / SNARK",
    ]),
    bodyFontSize: 10.5,
  });

  // 右上：孵化算法
  card(slide, 6.56, 1.68, 6.1, 2.55, {
    title: "确定性孵化算法",
    titleColor: C.gold,
    fill: C.panelAlt,
    body: bullets([
      "mulberry32（seeded PRNG）+ hashString(userId + SALT)",
      "SALT = 'friend-2026-401'（固定种子）",
      "同一 userId 永远孵化同一只伴侣",
      "Bones 每次从 hash 重新生成，不持久化",
      "  — 防止用户编辑 config 作弊稀有度",
      "Soul（name + personality）由模型生成，持久化",
      "Bun.hash 加速（Bun 环境下用原生 hash）",
    ]),
    bodyFontSize: 10.5,
  });

  // 右下：发布策略
  card(slide, 6.56, 4.38, 6.1, 2.18, {
    title: "发布窗口（源码硬编码）",
    titleColor: C.cyan,
    fill: C.panel,
    body: bullets([
      "Teaser 窗口：2026-04-01 ~ 04-07（本地时区）",
      "  — 跨时区滚动，避免 UTC 午夜流量峰值",
      "功能永久上线：2026 年 4 月之后",
      "feature('BUDDY') gate 控制全局可见性",
      "companion.ts 注释：'good enough for picking ducks'",
    ]),
    bodyFontSize: 11,
  });

  addNotes(slide, [
    "restored-src/src/buddy/types.ts",
    "restored-src/src/buddy/companion.ts",
    "restored-src/src/buddy/sprites.ts",
    "restored-src/src/buddy/CompanionSprite.tsx",
    "restored-src/src/buddy/useBuddyNotification.tsx",
    "restored-src/src/buddy/prompt.ts",
  ]);
}

// ── Slide 25: KAIROS ──────────────────────────────────────────────────────────
function slide25_kairos() {
  const p = nextPage();
  const slide = pptx.addSlide();
  header(slide, p, {
    section: "特色功能 · 05",
    title: "KAIROS：隐藏在 feature gate 背后的 Assistant 模式",
    subtitle: "代码里出现 20+ 次 feature('KAIROS')——这是一套与 coding agent 并列的 AI 助手运行模式。",
    accent: C.gold,
  });

  // 左：是什么
  card(slide, 0.68, 1.68, 5.72, 2.34, {
    title: "KAIROS 是什么",
    titleColor: C.gold,
    fill: C.panel,
    body: bullets([
      "assistant/ 目录下的独立运行模块",
      "assistant/index.js：isAssistantMode() / initializeAssistantTeam()",
      "assistant/gate.js：isKairosEnabled()——GrowthBook 动态开关",
      "assistant/sessionHistory.ts：会话历史翻页 API",
      "通过 --assistant 命令行参数强制启用",
      "defaultView: 'chat' 时触发 brief-only 模式",
    ]),
    bodyFontSize: 11,
  });

  // 左下：与 coding agent 的差异
  card(slide, 0.68, 4.18, 5.72, 2.38, {
    title: "与 Coding Agent 模式的差异",
    titleColor: C.red,
    fill: C.panel,
    body: bullets([
      "独立 assistantTeamContext——不共用 coding agent team",
      "有 pendingAssistantChat（session discover 逻辑）",
      "assistantActivationPath 影响工具可见性",
      "getUserMsgOptIn() 控制 brief-only 初始状态",
      "KAIROS_BRIEF / KAIROS_CHANNELS 是子特性开关",
    ]),
    bodyFontSize: 11,
  });

  // 右上：子特性
  card(slide, 6.56, 1.68, 6.1, 1.52, {
    title: "关联子特性",
    titleColor: C.purple,
    fill: C.panelAlt,
    body: bullets([
      "KAIROS_BRIEF — BriefTool 可见性（检查点汇报）",
      "KAIROS_CHANNELS — 允许 --channels / --dangerously-load-development-channels",
      "PROACTIVE — 主动触发，与 KAIROS 部分逻辑共享",
    ]),
    bodyFontSize: 11,
  });

  // 右中：源码信号
  card(slide, 6.56, 3.36, 6.1, 1.56, {
    title: "源码直接可见的信号",
    titleColor: C.cyan,
    fill: C.panel,
    body: bullets([
      "main.tsx 78 行：Dead code elimination 注释",
      "  — 说明 KAIROS 模块在外部构建中被剔除",
      "tengu_kairos GrowthBook 标志控制实际启用",
      "session history 使用 ccr-byoc-2025-07-29 beta 头",
    ]),
    bodyFontSize: 11,
  });

  // 右下：推测
  card(slide, 6.56, 5.08, 6.1, 1.48, {
    title: "可以合理推断",
    titleColor: C.gold,
    fill: C.panelAlt,
    body: bullets([
      "KAIROS 是 Claude.ai 对话能力接入 Claude Code 的通道",
      "与 Bridge/Remote 共同构成多 surface 战略",
      "目前仅对内部或白名单用户开放",
    ]),
    bodyFontSize: 11,
  });

  addNotes(slide, [
    "restored-src/src/main.tsx (lines 78-81, 1049-1086, 1642, 2184-2206)",
    "restored-src/src/assistant/sessionHistory.ts",
    "restored-src/src/tools/AskUserQuestionTool/AskUserQuestionTool.tsx",
  ]);
}

// ── Section 6: Closing ────────────────────────────────────────────────────────
// ── Slide 26: 阅读指南 ────────────────────────────────────────────────────────
function slide22_reading_guide() {
  const p = nextPage();
  const slide = pptx.addSlide();
  header(slide, p, {
    section: "总结 · 01",
    title: "如何继续阅读源码：建议按这条顺序推进",
    subtitle: "先建立全局模型，再逐层下钻——避免在细节里迷失。",
    accent: C.blue,
  });

  const rounds = [
    {
      round: "第一轮",
      goal: "建立系统大图（理解 70% 行为）",
      color: C.gold,
      files: [
        { file: "entrypoints/cli.tsx", why: "入口分流逻辑与启动策略" },
        { file: "main.tsx", why: "startup 编排全景（4,683 行，建议用 outline view）" },
        { file: "QueryEngine.ts", why: "会话对象设计与 SDK 接口" },
        { file: "query.ts", why: "agent loop 的真正核心，递归状态机" },
        { file: "Tool.ts + tools.ts", why: "tool 抽象模型与 registry" },
      ],
    },
    {
      round: "第二轮",
      goal: "攻克执行与扩展层（理解剩余 30%）",
      color: C.blue,
      files: [
        { file: "services/tools/toolExecution.ts", why: "工具执行主路径与 hook 编排" },
        { file: "services/tools/toolHooks.ts", why: "Pre/Post hook 协议细节" },
        { file: "tools/AgentTool/ + utils/swarm/", why: "多 Agent 运行时" },
        { file: "services/mcp/client.ts", why: "外部能力接入协议" },
        { file: "utils/permissions/", why: "权限系统全景" },
      ],
    },
  ];

  rounds.forEach((r, ri) => {
    const rx = 0.68 + ri * 6.42;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: rx, y: 1.68, w: 6.15, h: 4.9,
      rectRadius: 0.08,
      fill: { color: C.panel },
      line: { color: r.color, pt: 1.5 },
    });
    slide.addText(r.round, {
      x: rx + 0.2, y: 1.82, w: 2.5, h: 0.28,
      fontSize: 13, bold: true, color: r.color,
    });
    slide.addText(r.goal, {
      x: rx + 0.2, y: 2.14, w: 5.75, h: 0.26,
      fontSize: 10.5, color: C.muted,
    });
    slide.addShape(pptx.ShapeType.rect, {
      x: rx + 0.2, y: 2.46, w: 5.75, h: 0.01,
      fill: { color: C.line }, line: { color: C.line, transparency: 100 },
    });

    r.files.forEach((f, fi) => {
      const fy = 2.56 + fi * 0.78;
      slide.addText(f.file, {
        x: rx + 0.22, y: fy, w: 5.7, h: 0.24,
        fontSize: 10.2, bold: true, color: r.color, fontFace: "Menlo",
      });
      slide.addText(f.why, {
        x: rx + 0.22, y: fy + 0.25, w: 5.7, h: 0.3,
        fontSize: 9.8, color: C.textSoft,
      });
    });
  });

  addNotes(slide, [
    "restored-src/src/entrypoints/cli.tsx",
    "restored-src/src/main.tsx",
    "restored-src/src/QueryEngine.ts",
    "restored-src/src/query.ts",
    "restored-src/src/services/tools/toolExecution.ts",
    "restored-src/src/tools/AgentTool/",
  ]);
}

// ── Slide 23: 结论 ────────────────────────────────────────────────────────────
function slide23_conclusion() {
  const p = nextPage();
  const slide = pptx.addSlide();
  header(slide, p, {
    section: "总结 · 02",
    title: "三个可以直接带走的结论",
    subtitle: "这些结论由源码事实支撑，不是主观评价。",
    accent: C.gold,
  });

  const conclusions = [
    {
      num: "01",
      title: "它是 Terminal Agent Runtime，不是「聊天 CLI」",
      body: "系统中心是 QueryEngine / query.ts 构成的递归 Agent Loop，而不是终端 UI 本身。UI、Bridge、SDK 只是不同的 surface，共享同一套推理内核。4,683 行的 main.tsx 启动编排直接说明了这是平台级产品。",
      color: C.gold,
    },
    {
      title: "权限系统是架构必需品，不是后期添加的防护",
      num: "02",
      body: "Hook + Rules + Classifier + Mode 四层构成的权限决策树，位于工具执行的主路径上，不是可绕过的 middleware。这使它能同时服务本地开发者、企业策略和 headless 自动化场景。",
      color: C.orange,
    },
    {
      num: "03",
      title: "多 Agent 是可治理的 Actor 系统，不是并发调用模型",
      body: "inProcessRunner 的 Actor 模型（mailbox + task claim + idle loop）+ 权限 bridge 机制，让子代理在不绕开任何治理的情况下真正协作。这才是「multi-agent」从概念变成工程的关键。",
      color: C.purple,
    },
  ];

  conclusions.forEach((c, i) => {
    const cy = 1.7 + i * 1.7;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.68, y: cy, w: 11.98, h: 1.52,
      rectRadius: 0.07,
      fill: { color: C.panel },
      line: { color: c.color, pt: 1.5 },
    });
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.68, y: cy, w: 0.88, h: 1.52,
      rectRadius: 0.07,
      fill: { color: c.color },
      line: { color: c.color, transparency: 100 },
    });
    slide.addText(c.num, {
      x: 0.68, y: cy + 0.52, w: 0.88, h: 0.4,
      fontSize: 16, bold: true, color: C.bg, align: "center",
    });
    slide.addText(c.title, {
      x: 1.72, y: cy + 0.12, w: 10.7, h: 0.3,
      fontSize: 13.5, bold: true, color: c.color,
    });
    slide.addText(c.body, {
      x: 1.72, y: cy + 0.48, w: 10.6, h: 0.9,
      fontSize: 11, color: C.textSoft, lineSpacingMultiple: 1.35, fit: "shrink",
    });
  });

  addNotes(slide, [
    "restored-src/src/QueryEngine.ts",
    "restored-src/src/query.ts",
    "restored-src/src/services/tools/toolExecution.ts",
    "restored-src/src/tools/AgentTool/runAgent.ts",
    "restored-src/src/utils/swarm/inProcessRunner.ts",
    "https://code.claude.com/docs/en/overview",
  ]);
}

// ── Slide 24: End / QR ────────────────────────────────────────────────────────
function slide24_end() {
  const p = nextPage();
  const slide = pptx.addSlide();
  slide.background = { color: C.bg };
  topBar(slide, C.gold);

  // 左侧
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 8.5, h: H,
    fill: { color: C.bgMid },
    line: { color: C.bgMid, transparency: 100 },
  });

  slide.addText("Thanks", {
    x: 0.9, y: 1.5, w: 6.5, h: 1.1,
    fontSize: 52, bold: true, color: C.gold,
  });
  slide.addText("Claude Code Sourcemap 源码解读", {
    x: 0.9, y: 2.75, w: 6.8, h: 0.4,
    fontSize: 17, color: C.text, bold: true,
  });
  slide.addText("基于 @anthropic-ai/claude-code v2.1.88 source map 还原分析\n仅供研究与学习目的，版权归 Anthropic 所有", {
    x: 0.9, y: 3.28, w: 6.8, h: 0.6,
    fontSize: 11, color: C.muted, lineSpacingMultiple: 1.5,
  });

  // 关键文件快速索引
  slide.addText("关键文件索引", {
    x: 0.9, y: 4.08, w: 4.0, h: 0.28,
    fontSize: 11, bold: true, color: C.gold,
  });
  const keyFiles = [
    "QueryEngine.ts + query.ts → Agent Loop",
    "main.tsx → startup orchestration",
    "services/tools/toolExecution.ts → Tool Runtime",
    "tools/AgentTool/ + utils/swarm/ → Multi-Agent",
    "utils/permissions/ → Permission System",
  ];
  slide.addText(keyFiles.join("\n"), {
    x: 0.9, y: 4.42, w: 6.8, h: 1.9,
    fontSize: 10.2, color: C.textSoft, lineSpacingMultiple: 1.6, fontFace: "Menlo",
  });

  // 右侧 QR
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 9.1, y: 1.8, w: 3.0, h: 3.5,
    rectRadius: 0.08,
    fill: { color: C.panel },
    line: { color: C.line, pt: 1 },
  });
  try {
    slide.addImage({
      path: QR_PATH,
      ...imageSizingContain(QR_PATH, 9.3, 2.0, 2.6, 2.6),
    });
  } catch (e) {}
  slide.addText("关注公众号 · 持续更新", {
    x: 9.1, y: 4.72, w: 3.0, h: 0.3,
    fontSize: 11, bold: true, color: C.gold, align: "center",
  });
  slide.addText("phodal", {
    x: 9.1, y: 5.04, w: 3.0, h: 0.22,
    fontSize: 10, color: C.muted, align: "center",
  });

  footer(slide, p);
  addNotes(slide, ["README.md", QR_PATH, TEMPLATE_REF]);
}

// ─── Build all slides ─────────────────────────────────────────────────────────
slide01_title();
slide02_provenance();
slide03_scale();
slide04_sec1_divider();
slide05_arch_overview();
slide06_module_map();
slide07_sec2_divider();
slide08_queryengine();
slide09_turn_sequence();
slide10_fallback();
slide11_sec3_divider();
slide12_tools();
slide13_hooks();
slide14_permissions();
slide15_sec4_divider();
slide16_agent_system();
slide17_teammate_actor();
slide18_sec5_divider();
slide19_extensions();
slide20_surfaces();
slide21_unique_features();
slide22_voice();
slide23_vim();
slide24_buddy();
slide25_kairos();
slide22_reading_guide();
slide23_conclusion();
slide24_end();

// ─── Save ─────────────────────────────────────────────────────────────────────
pptx.writeFile({ fileName: OUT_FILE })
  .then(() => {
    console.log(`\n✅  Saved: ${OUT_FILE}`);
    console.log(`   Total slides: ${_page}`);
  })
  .catch(err => {
    console.error("❌  Error:", err);
    process.exit(1);
  });
