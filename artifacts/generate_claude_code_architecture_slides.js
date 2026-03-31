const fs = require("fs");
const path = require("path");
const PptxGenJS = require("/tmp/node_modules/pptxgenjs");
const {
  safeOuterShadow,
  imageSizingContain,
} = require("../.agents/skills/slide-skill/pptxgenjs_helpers");

const OUT_DIR = __dirname;
const OUT_FILE = path.join(OUT_DIR, "claude-code-architecture-analysis.pptx");
const QR_PATH = path.join(OUT_DIR, "qrcode_for_gh_2afe73fc7b4a_258.jpg");
const TEMPLATE_REFERENCE = path.resolve(
  __dirname,
  "../.agents/skills/slide-skill/slide_templates/template.pptx",
);

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "OpenAI Codex";
pptx.company = "OpenAI";
pptx.subject = "Recovered Claude Code source analysis";
pptx.title = "Claude Code / YLKR AI Agent 深度源码分析";
pptx.lang = "zh-CN";
// Visual system derived from the supplied Routa template deck.
pptx.theme = {
  headFontFace: "Aptos Display",
  bodyFontFace: "Aptos",
  lang: "zh-CN",
};

const W = 13.333;
const H = 7.5;

const C = {
  bg: "0F172A",
  bgSoft: "111C34",
  panel: "1E293B",
  panelAlt: "18253A",
  line: "334155",
  text: "E2E8F0",
  textSoft: "CBD5E1",
  muted: "94A3B8",
  muted2: "B6C6E6",
  blue: "3B82F6",
  amber: "F59E0B",
  emerald: "10B981",
  purple: "A855F7",
  red: "EF4444",
};

let page = 0;

function nextPage() {
  page += 1;
  return page;
}

function addNotes(slide, items) {
  slide.addNotes(["[Sources]", ...items.map(item => `- ${item}`), "[/Sources]"].join("\n"));
}

function addQr(slide, x, y, w = 1.5, h = 1.5, label = "公众号") {
  slide.addShape(pptx.ShapeType.roundRect, {
    x: x - 0.08,
    y: y - 0.08,
    w: w + 0.16,
    h: h + 0.36,
    rectRadius: 0.04,
    fill: { color: C.bgSoft },
    line: { color: C.line, pt: 1 },
    shadow: safeOuterShadow("000000", 0.1, 45, 1, 0.3),
  });
  slide.addText(label, {
    x,
    y: y - 0.02,
    w,
    h: 0.18,
    align: "center",
    fontSize: 9.4,
    bold: true,
    color: C.textSoft,
  });
  slide.addImage({
    path: QR_PATH,
    ...imageSizingContain(QR_PATH, x, y + 0.18, w, h),
  });
}

function setBase(slide, accent = C.amber, bg = C.bg) {
  slide.background = { color: bg };
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: W,
    h: H,
    fill: { color: bg },
    line: { color: bg, transparency: 100 },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: W,
    h: 0.12,
    fill: { color: accent },
    line: { color: accent, transparency: 100 },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.6,
    y: 6.84,
    w: 12.1,
    h: 0.02,
    fill: { color: C.line, transparency: 15 },
    line: { color: C.line, transparency: 100 },
  });
}

function footer(slide, current) {
  slide.addText("Analysised by Phodal with Codex & ChatGPT Slide skill", {
    x: 0.72,
    y: 6.92,
    w: 8.3,
    h: 0.16,
    fontSize: 8,
    color: C.muted2,
  });
  slide.addText(String(current).padStart(2, "0"), {
    x: 11.75,
    y: 6.9,
    w: 0.6,
    h: 0.18,
    fontSize: 8.4,
    bold: true,
    align: "right",
    color: C.muted2,
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 12.38,
    y: 6.91,
    w: 0.11,
    h: 0.11,
    fill: { color: C.amber },
    line: { color: C.amber, transparency: 100 },
  });
}

function header(slide, current, section, title, subtitle, accent = C.amber) {
  setBase(slide, accent);
  slide.addText(section, {
    x: 0.72,
    y: 0.34,
    w: 3.8,
    h: 0.2,
    fontSize: 10.5,
    bold: true,
    color: accent,
  });
  slide.addText(title, {
    x: 0.72,
    y: 0.58,
    w: 9.8,
    h: 0.42,
    fontSize: 24.5,
    bold: true,
    color: C.text,
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.72,
      y: 1.16,
      w: 11.5,
      h: 0.24,
      fontSize: 11.6,
      color: C.muted,
    });
  }
  footer(slide, current);
}

function panel(slide, x, y, w, h, title, body, opts = {}) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.06,
    fill: { color: opts.fill || C.panel },
    line: { color: opts.line || C.line, pt: opts.linePt || 1.1 },
    shadow: safeOuterShadow("000000", 0.12, 45, 1, 0.4),
  });
  if (title) {
    slide.addText(title, {
      x: x + 0.18,
      y: y + 0.12,
      w: w - 0.36,
      h: 0.22,
      fontSize: opts.titleSize || 14.2,
      bold: true,
      color: opts.titleColor || C.text,
    });
  }
  if (body) {
    slide.addText(body, {
      x: x + 0.18,
      y: y + (title ? 0.45 : 0.16),
      w: w - 0.32,
      h: h - (title ? 0.55 : 0.24),
      fontFace: opts.code ? "Menlo" : (opts.fontFace || "Aptos"),
      fontSize: opts.fontSize || (opts.code ? 10.3 : 12.3),
      color: opts.bodyColor || C.text,
      fit: "shrink",
      valign: "top",
      margin: 0,
      breakLine: false,
    });
  }
}

function bullet(items) {
  return items.map(item => `• ${item}`).join("\n");
}

function dividerSlide(current, n, title, body, accent = C.blue, rightText = "") {
  const slide = pptx.addSlide();
  slide.background = { color: C.panel };
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 6.0,
    h: H,
    fill: { color: C.bg },
    line: { color: C.bg, transparency: 100 },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 6.0,
    y: 0,
    w: W - 6.0,
    h: H,
    fill: { color: accent },
    line: { color: accent, transparency: 100 },
  });
  slide.addText("Section", {
    x: 1.12,
    y: 1.1,
    w: 1.4,
    h: 0.18,
    fontSize: 10,
    bold: true,
    color: C.amber,
  });
  slide.addText(title, {
    x: 1.12,
    y: 1.5,
    w: 4.25,
    h: 1.1,
    fontSize: 25.5,
    bold: true,
    color: C.text,
  });
  slide.addText(body, {
    x: 1.12,
    y: 3.0,
    w: 4.0,
    h: 0.82,
    fontSize: 12.5,
    color: C.muted,
  });
  slide.addText(String(n).padStart(2, "0"), {
    x: 8.2,
    y: 2.35,
    w: 1.8,
    h: 0.8,
    fontSize: 37,
    bold: true,
    align: "center",
    color: "FFFFFF",
  });
  slide.addText(rightText || "用章节页把问题切开，先讲边界，再讲主链，最后讲实现。", {
    x: 7.5,
    y: 3.6,
    w: 3.2,
    h: 0.78,
    fontSize: 11.2,
    color: "DCEAFE",
    align: "center",
  });
  footer(slide, current);
  addNotes(slide, [TEMPLATE_REFERENCE]);
}

function twoColSlide(current, config) {
  const slide = pptx.addSlide();
  header(slide, current, config.section, config.title, config.subtitle, config.accent || C.amber);
  panel(slide, 0.72, 1.72, 5.88, 4.1, config.leftTitle, bullet(config.leftItems), {
    fill: config.leftFill || C.panel,
    titleColor: config.accent || C.amber,
    fontSize: config.fontSize || 12.4,
  });
  panel(slide, 6.73, 1.72, 5.88, 4.1, config.rightTitle, bullet(config.rightItems), {
    fill: config.rightFill || C.panelAlt,
    titleColor: config.accent || C.amber,
    fontSize: config.fontSize || 12.4,
  });
  if (config.bottom) {
    panel(slide, 0.95, 6.03, 11.1, 0.34, "", config.bottom, {
      fill: C.bgSoft,
      bodyColor: C.muted,
      fontSize: 10.1,
    });
  }
  addNotes(slide, config.sources);
}

function threeCardSlide(current, config) {
  const slide = pptx.addSlide();
  header(slide, current, config.section, config.title, config.subtitle, config.accent || C.blue);
  let x = 0.72;
  for (const card of config.cards) {
    panel(slide, x, 1.78, 4.02, 4.86, card.title, bullet(card.items), {
      fill: card.fill || C.panel,
      line: card.line || C.line,
      titleColor: card.titleColor || (config.accent || C.blue),
      fontSize: 12.1,
    });
    x += 4.18;
  }
  addNotes(slide, config.sources);
}

function chainBox(slide, x, y, w, h, label, accent, fill = C.panel) {
  panel(slide, x, y, w, h, "", label, {
    fill,
    line: accent,
    bodyColor: C.text,
    fontSize: 11.2,
    fontFace: "Aptos Display",
  });
}

function arrow(slide, x, y, w = 0.3, color = C.amber) {
  slide.addShape(pptx.ShapeType.chevron, {
    x,
    y,
    w,
    h: 0.18,
    fill: { color },
    line: { color, transparency: 100 },
  });
}

function sequenceSlide(current, config) {
  const slide = pptx.addSlide();
  header(slide, current, config.section, config.title, config.subtitle, config.accent || C.amber);
  const widths = config.steps.map(step => step.w || 1.78);
  const totalWidth = widths.reduce((sum, width) => sum + width, 0);
  const gap = (11.15 - totalWidth) / Math.max(1, config.steps.length - 1);
  let x = 0.72;
  config.steps.forEach((step, idx) => {
    const width = step.w || 1.78;
    chainBox(slide, x, 1.95, width, 0.82, step.label, step.accent || config.accent || C.amber, step.fill || C.panel);
    if (idx < config.steps.length - 1) {
      arrow(slide, x + width + 0.06, 2.28, Math.max(0.16, gap - 0.12), config.accent || C.amber);
    }
    x += width + gap;
  });
  panel(slide, 0.88, 3.25, 11.65, 2.8, config.detailTitle, bullet(config.details), {
    fill: C.panelAlt,
    titleColor: config.accent || C.amber,
    fontSize: 12.1,
  });
  addNotes(slide, config.sources);
}

function flowSlide(current, config) {
  const slide = pptx.addSlide();
  header(slide, current, config.section, config.title, config.subtitle, config.accent || C.blue);
  config.top.forEach(item => {
    chainBox(slide, item.x, item.y, item.w, item.h, item.label, item.accent || config.accent || C.blue, item.fill || C.panel);
  });
  (config.links || []).forEach(link => {
    if (link.kind === "down") {
      slide.addShape(pptx.ShapeType.chevron, {
        x: link.x,
        y: link.y,
        w: 0.18,
        h: 0.24,
        rotate: 90,
        fill: { color: link.color || config.accent || C.blue },
        line: { color: link.color || config.accent || C.blue, transparency: 100 },
      });
    } else {
      arrow(slide, link.x, link.y, link.w || 0.24, link.color || config.accent || C.blue);
    }
  });
  config.bottom.forEach(item => {
    panel(slide, item.x, item.y, item.w, item.h, item.title, bullet(item.items), {
      fill: item.fill || C.panelAlt,
      titleColor: item.accent || config.accent || C.blue,
      fontSize: item.fontSize || 11.7,
    });
  });
  addNotes(slide, config.sources);
}

function codeDetailSlide(current, config) {
  const slide = pptx.addSlide();
  header(slide, current, config.section, config.title, config.subtitle, config.accent || C.emerald);
  panel(slide, 0.72, 1.72, 5.6, 4.72, config.leftTitle, bullet(config.leftItems), {
    fill: C.panel,
    titleColor: config.accent || C.emerald,
    fontSize: 11.9,
  });
  panel(slide, 6.5, 1.72, 6.12, 2.1, config.codeTitle, config.code, {
    fill: "0B1220",
    line: C.line,
    code: true,
    titleColor: C.textSoft,
    fontSize: 9.8,
  });
  panel(slide, 6.5, 4.0, 6.12, 2.44, config.rightTitle, bullet(config.rightItems), {
    fill: C.panelAlt,
    titleColor: config.accent || C.emerald,
    fontSize: 11.5,
  });
  addNotes(slide, config.sources);
}

function titleSlide() {
  const current = nextPage();
  const slide = pptx.addSlide();
  setBase(slide, C.amber);
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 5.9,
    h: H,
    fill: { color: C.panel },
    line: { color: C.panel, transparency: 100 },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 9.2,
    y: 0,
    w: 4.13,
    h: H,
    fill: { color: C.panel },
    line: { color: C.panel, transparency: 100 },
  });
  slide.addText("Claude Code", {
    x: 0.82,
    y: 0.72,
    w: 3.1,
    h: 0.22,
    fontSize: 15,
    bold: true,
    color: C.text,
  });
  slide.addText("51 万行恢复源码\n架构与实现深潜", {
    x: 0.82,
    y: 1.45,
    w: 6.0,
    h: 1.45,
    fontSize: 28,
    bold: true,
    color: C.text,
  });
  slide.addText("聚焦运行时主链、权限执行与多 Agent 协作三条最关键实现链路。", {
    x: 0.82,
    y: 3.08,
    w: 5.05,
    h: 0.54,
    fontSize: 12.5,
    color: C.muted,
  });
  panel(slide, 0.82, 4.28, 2.2, 1.26, "规模", bullet([
    "约 1,902 个源码文件",
    "`.ts/.tsx` 512,664 行",
  ]), { fill: C.bgSoft, titleColor: C.amber, fontSize: 11.5 });
  panel(slide, 3.16, 4.28, 2.2, 1.26, "结论", bullet([
    "不是聊天 CLI",
    "是终端 Agent Runtime",
  ]), { fill: C.bgSoft, titleColor: C.amber, fontSize: 11.5 });
  const chips = [
    ["Query Loop", C.blue],
    ["Permissions", C.amber],
    ["Agent / Swarm", C.emerald],
    ["MCP / Plugins", C.purple],
  ];
  let cy = 1.35;
  chips.forEach(([label, color]) => {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 9.86,
      y: cy,
      w: 2.0,
      h: 0.5,
      rectRadius: 0.05,
      fill: { color },
      line: { color, transparency: 100 },
    });
    slide.addText(label, {
      x: 9.96,
      y: cy + 0.12,
      w: 1.8,
      h: 0.16,
      align: "center",
      fontSize: 10,
      bold: true,
      color: color === C.amber ? C.bg : "FFFFFF",
    });
    cy += 0.78;
  });
  addQr(slide, 9.95, 5.0, 1.72, 1.72, "公众号");
  footer(slide, current);
  addNotes(slide, [
    TEMPLATE_REFERENCE,
    QR_PATH,
    "README.md",
    "extract-sources.js",
    "local file census via `find`/`wc -l` in repository root",
  ]);
}

function thesisSlide() {
  threeCardSlide(nextPage(), {
    section: "Opening / Thesis",
    title: "先给结论：这套代码的中心不是 UI，而是 runtime orchestration",
    subtitle: "如果把它看成“带几个工具的终端聊天程序”，后面很多设计都会误判。",
    accent: C.blue,
    cards: [
      {
        title: "判断 1",
        items: [
          "核心对象不是 prompt，而是长期会话与 turn loop。",
          "`QueryEngine` 和 `query.ts` 明确分离会话层与单轮层。",
          "工具执行结果会回流到下一轮推理。",
        ],
      },
      {
        title: "判断 2",
        items: [
          "权限系统不是补丁，而是 tool runtime 的主路径之一。",
          "hooks、rules、UI prompt、classifier 会共同参与决策。",
          "这使 Claude Code 更像受控执行器。",
        ],
        fill: C.panelAlt,
      },
      {
        title: "判断 3",
        items: [
          "多 Agent 不是演示特性，而是工程化子系统。",
          "`AgentTool`、`runAgent`、`inProcessRunner`、swarm 形成完整链路。",
          "MCP / skills / commands 则是外部能力接入层。",
        ],
        fill: C.bgSoft,
      },
    ],
    sources: [
      "restored-src/src/QueryEngine.ts",
      "restored-src/src/query.ts",
      "restored-src/src/services/tools/toolExecution.ts",
      "restored-src/src/tools/AgentTool/AgentTool.tsx",
      "restored-src/src/utils/swarm/inProcessRunner.ts",
    ],
  });
}

titleSlide();
thesisSlide();

dividerSlide(nextPage(), 1, "恢复仓库与架构问题", "先确认这是什么代码，再谈分析的可信边界。", C.blue, "从恢复方式、规模与目录地形，反推真正的系统边界。");

twoColSlide(nextPage(), {
  section: "01 / Provenance",
  title: "这不是官方 monorepo，而是从 source map 还原出的高保真快照",
  subtitle: "因此它非常适合做架构与实现分析，但不能假设构建资产、脚手架、测试和内部工具链完整保留。",
  accent: C.blue,
  leftTitle: "恢复方式",
  leftItems: [
    "`extract-sources.js` 读取 `package/cli.js.map` 的 `sources` 与 `sourcesContent`。",
    "把文件逐个写回 `restored-src/`，同时做 webpack 路径清洗。",
    "README 记录恢复文件数为 4,756，来源包版本为 `2.1.88`。",
    "因此分析对象是“编译后快照所映射的源码结构”。",
  ],
  rightTitle: "对分析的影响",
  rightItems: [
    "代码主体、注释、目录边界和绝大多数运行逻辑仍然可信。",
    "缺失的更可能是构建过程、测试框架、仓库自动化与部分资源文件。",
    "对于理解 runtime、tooling、权限和 agent 系统，已足够深。",
    "真正重要的是运行时设计，而不是提取脚本本身。",
  ],
  bottom: "所以我们把它当成“可阅读、可追调用链的运行时快照”。",
  sources: ["README.md", "extract-sources.js", "package/package.json"],
});

threeCardSlide(nextPage(), {
  section: "01 / Scale",
  title: "规模已经指向平台化产品，而不是“小 CLI”",
  subtitle: "从文件数和目录分布看，UI、运行时、工具与扩展层都很重。",
  accent: C.emerald,
  cards: [
    {
      title: "体量",
      items: [
        "`src` 下约 1,902 个源码文件",
        "`.ts/.tsx` 总计 512,664 行",
        "README 记载恢复文件 4,756 个",
      ],
    },
    {
      title: "高频目录",
      items: [
        "`utils` 564",
        "`components` 389",
        "`commands` 207",
        "`tools` 184",
      ],
      fill: C.panelAlt,
    },
    {
      title: "意味着什么",
      items: [
        "终端 UI 是大子系统",
        "Tool/Command 层很厚",
        "复杂度重心在 orchestration",
      ],
      fill: C.bgSoft,
    },
  ],
  sources: [
    "README.md",
    "local file census via `find restored-src/src -name '*.ts' -o -name '*.tsx' | xargs wc -l`",
    "local file census via `rg --files restored-src/src | wc -l`",
  ],
});

twoColSlide(nextPage(), {
  section: "01 / Module Landscape",
  title: "目录地形暴露了几组稳定边界",
  subtitle: "真正该看的不是单个文件，而是这些目录如何形成长期稳定的架构分层。",
  accent: C.purple,
  leftTitle: "运行时主干",
  leftItems: [
    "`entrypoints` / `main.tsx`: 启动、模式分流、初始化编排。",
    "`QueryEngine.ts` / `query.ts`: 会话生命周期与单轮递归 loop。",
    "`tools` / `services/tools`: 模型可用能力与执行框架。",
    "`state` / `hooks`: React UI 与非 UI 运行逻辑共享状态。",
  ],
  rightTitle: "能力与产品层",
  rightItems: [
    "`skills` / `plugins` / `commands` / `services/mcp`: 扩展与集成。",
    "`tools/AgentTool` / `utils/swarm`: 多 Agent runtime。",
    "`ink` / `components` / `cli/print.ts`: 终端 UI 与 headless 输出。",
    "`bridge` / `remote`: 不同 surface 共用同一套 runtime。",
  ],
  bottom: "这些目录不是并列功能点，而是被 Query loop 串起来的多层系统。",
  sources: ["restored-src/src/ directory census from local filesystem"],
});

twoColSlide(nextPage(), {
  section: "01 / Docs vs Source",
  title: "官方文档讲的是产品承诺，源码揭示的是实现机制",
  subtitle: "把 overview 和恢复源码放在一起看，能更快识别哪些说法是真正由架构支撑的。",
  accent: C.blue,
  leftTitle: "Overview 层面的说法",
  leftItems: [
    "Claude Code 在不同 surfaces 上复用相同 engine。",
    "它具备 tools、permissions、MCP、agents 等能力。",
    "终端交互、自动化和协作被统一为一套 agent 工作流。",
    "文档强调的是体验与概念一致性。",
  ],
  rightTitle: "源码层面的证据",
  rightItems: [
    "`entrypoints/cli.tsx` 先做模式分流，再动态载入 `main.js`。",
    "`cli/print.ts`、`bridge/*`、`QueryEngine.ts` 都表明多 surface 共用 runtime。",
    "`toolExecution.ts` + `toolHooks.ts` 把权限做进了执行主路径。",
    "`AgentTool` / `runAgent` / `inProcessRunner` 把 agent 真正运行起来。",
  ],
  bottom: "所以这套系统不是“文档上看起来像 agent”，而是代码上确实按 agent runtime 组织。",
  sources: [
    "https://code.claude.com/docs/en/overview",
    "restored-src/src/entrypoints/cli.tsx",
    "restored-src/src/cli/print.ts",
    "restored-src/src/QueryEngine.ts",
    "restored-src/src/services/tools/toolExecution.ts",
    "restored-src/src/tools/AgentTool/AgentTool.tsx",
  ],
});

threeCardSlide(nextPage(), {
  section: "01 / Architecture",
  title: "总体先抽象为 3 个主层",
  subtitle: "先用三层建立大图，再在后续章节把每一层拆开。",
  accent: C.amber,
  cards: [
    {
      title: "入口层",
      items: [
        "CLI fast-path",
        "main.tsx startup orchestration",
        "bridge / remote ingress",
      ],
    },
    {
      title: "内核层",
      items: [
        "QueryEngine",
        "query.ts recursive turn loop",
        "context / prompt / budget assembly",
      ],
      fill: C.panelAlt,
    },
    {
      title: "执行与扩展层",
      items: [
        "Tool runtime + permissions",
        "MCP / skills / plugins / commands",
        "Agent / swarm / UI surfaces",
      ],
      fill: C.bgSoft,
    },
  ],
  sources: [
    "restored-src/src/entrypoints/cli.tsx",
    "restored-src/src/main.tsx",
    "restored-src/src/QueryEngine.ts",
    "restored-src/src/query.ts",
    "restored-src/src/services/tools/toolExecution.ts",
  ],
});

flowSlide(nextPage(), {
  section: "01 / Architecture Diagram",
  title: "顶层模块关系图",
  subtitle: "这一页把目录层级真正串成可讲解的关系，而不是继续列目录名。",
  accent: C.blue,
  top: [
    { x: 0.78, y: 1.9, w: 1.9, h: 0.82, label: "Entrypoints\ncli / bridge / remote", accent: C.blue },
    { x: 3.0, y: 1.9, w: 1.95, h: 0.82, label: "Startup\nmain.tsx + AppState", accent: C.amber },
    { x: 5.28, y: 1.9, w: 2.05, h: 0.82, label: "Core Loop\nQueryEngine + query", accent: C.emerald },
    { x: 7.66, y: 1.9, w: 2.0, h: 0.82, label: "Execution\nTools + Permissions", accent: C.red },
    { x: 9.98, y: 1.9, w: 2.0, h: 0.82, label: "Expansion\nAgents + MCP + Commands", accent: C.purple },
  ],
  links: [
    { x: 2.78, y: 2.24, color: C.blue },
    { x: 5.06, y: 2.24, color: C.blue },
    { x: 7.44, y: 2.24, color: C.blue },
    { x: 9.76, y: 2.24, color: C.blue },
    { kind: "down", x: 10.88, y: 2.95, color: C.purple },
  ],
  bottom: [
    {
      x: 0.9,
      y: 3.42,
      w: 5.42,
      h: 2.38,
      title: "主干路径",
      accent: C.emerald,
      items: [
        "入口层先做模式分流，再落到 startup orchestration。",
        "startup 把状态、扩展层和 runtime 依赖接好后，真正把控制权交给 Query loop。",
        "因此系统中心不是 UI，而是中间的执行核心。",
      ],
    },
    {
      x: 6.48,
      y: 3.42,
      w: 5.42,
      h: 2.38,
      title: "外围层",
      accent: C.purple,
      items: [
        "Tool、Agent、MCP、Command 都围绕 Query loop 组织。",
        "不同 surface 只是在入口和输出面不同，不改变中间执行骨架。",
      ],
    },
  ],
  sources: [
    "restored-src/src/entrypoints/cli.tsx",
    "restored-src/src/main.tsx",
    "restored-src/src/QueryEngine.ts",
    "restored-src/src/query.ts",
    "restored-src/src/services/tools/toolExecution.ts",
    "restored-src/src/tools/AgentTool/AgentTool.tsx",
  ],
});

dividerSlide(nextPage(), 2, "运行时主链", "这部分回答一个关键问题：从用户敲下回车，到 agent 开始递归执行，系统到底怎么串起来。", C.amber, "主链先解释清楚，后面的深潜才不会失焦。");

twoColSlide(nextPage(), {
  section: "02 / Entrypoint",
  title: "`entrypoints/cli.tsx` 是轻量级分发器，而不是业务中心",
  subtitle: "它最重要的代码特征是：尽可能晚地加载 `main.js`。",
  accent: C.amber,
  leftTitle: "实际职责",
  leftItems: [
    "先处理 `--version` 这类零依赖快路径。",
    "把 daemon、bridge、environment-runner 等特殊子命令做早期分流。",
    "只有普通交互路径才动态 import `main.js`。",
    "注释直接说明这样做是为了减少启动时模块评估开销。",
  ],
  rightTitle: "架构意义",
  rightItems: [
    "单二进制承载多个运行模式。",
    "启动时延被明确当成产品目标。",
    "CLI 不只是交互壳，而是 runtime launcher。",
    "这也说明很多能力并不依赖终端 UI 本身。",
  ],
  sources: ["restored-src/src/entrypoints/cli.tsx"],
});

twoColSlide(nextPage(), {
  section: "02 / Startup",
  title: "`main.tsx` 是重量级 startup orchestration",
  subtitle: "如果只想快速建立全局图，这个文件优先级非常高。",
  accent: C.blue,
  leftTitle: "它初始化什么",
  leftItems: [
    "配置、鉴权、用户信息、模型与 feature gates。",
    "MCP、plugins、skills、policy limits 等扩展能力。",
    "LSP、teleport、render、session restore、analytics。",
    "最终把 AppState、UI 和 query runtime 接好。",
  ],
  rightTitle: "说明什么",
  rightItems: [
    "这已经是平台产品的初始化复杂度。",
    "代码里有大量并发预取、prefetch 和 latency 注释。",
    "真正的系统边界在 startup orchestration 就已暴露。",
    "很多子系统虽然分文件，但由 `main.tsx` 负责编排。",
  ],
  sources: ["restored-src/src/main.tsx"],
});

twoColSlide(nextPage(), {
  section: "02 / State & Input",
  title: "UI 层和 runtime 通过统一状态与统一输入队列耦合",
  subtitle: "这一步决定了 REPL、bridge、headless、attachments 最后能否走同一条主链。",
  accent: C.emerald,
  leftTitle: "状态层",
  leftItems: [
    "`AppStateProvider` 暴露 React 订阅接口，同时保留 `getState/setState` 给非 React 代码。",
    "权限上下文、task 状态、MCP 状态、voice/mailbox 都能挂到主 store。",
    "终端 UI 不是独立状态机，而是共享 runtime 状态的一个 surface。",
  ],
  rightTitle: "输入层",
  rightItems: [
    "`handlePromptSubmit.ts` 把输入归一成 `QueuedCommand`。",
    "`processUserInput()` 再把 slash command、bash input、图片等统一编入流程。",
    "这样 command surface 和模型 turn loop 才能保持一条主链。",
  ],
  sources: [
    "restored-src/src/state/AppState.tsx",
    "restored-src/src/state/AppStateStore.js",
    "restored-src/src/utils/handlePromptSubmit.ts",
    "restored-src/src/utils/processUserInput/processUserInput.ts",
  ],
});

twoColSlide(nextPage(), {
  section: "02 / Command Surface",
  title: "Slash command 与 Bash mode 都是主链入口，不是边角功能",
  subtitle: "命令面和 shell 面被做成一等入口，说明系统预设用户会显式控制 agent。",
  accent: C.purple,
  leftTitle: "Slash command",
  leftItems: [
    "`processSlashCommand.tsx` 解析命令、参数和上下文。",
    "命令结果可直接转成 message 序列回注对话。",
    "支持 `context: fork` 的命令把工作下放给 sub-agent。",
    "skills 在很多场景下最终会下沉为 command。",
  ],
  rightTitle: "Bash mode",
  rightItems: [
    "`processBashCommand.tsx` 先把原始 shell 输入包装成 `<bash-input>` message。",
    "同时更新前台 JSX 进度 UI，再继续进入统一消息链。",
    "shell 不是外挂，而是 Claude Code 的核心工作面之一。",
    "这也是 BashTool 设计复杂度很高的原因。",
  ],
  sources: [
    "restored-src/src/utils/processUserInput/processSlashCommand.tsx",
    "restored-src/src/commands.ts",
    "restored-src/src/utils/processUserInput/processBashCommand.tsx",
    "restored-src/src/tools/BashTool/BashTool.tsx",
  ],
});

sequenceSlide(nextPage(), {
  section: "02 / Runtime Sequence",
  title: "主执行链时序图",
  subtitle: "这一页用一条链把前面几个文件真正连起来。",
  accent: C.amber,
  steps: [
    { label: "CLI\nentrypoint", accent: C.amber },
    { label: "main.tsx\nstartup", accent: C.blue },
    { label: "handlePromptSubmit /\nprocessUserInput", accent: C.emerald, w: 2.12 },
    { label: "QueryEngine\nsubmitMessage", accent: C.blue, w: 1.96 },
    { label: "query.ts\nloop", accent: C.purple },
    { label: "toolExecution /\nagent runtime", accent: C.red, w: 1.95 },
  ],
  detailTitle: "链路解释",
  details: [
    "用户输入并不会直接打到模型，而是先进入 command/input 归一层。",
    "`QueryEngine` 负责会话级状态，`query.ts` 负责单轮递归执行。",
    "tool runtime 的输出会被重新拼回消息，形成下一轮递归的输入。",
    "bridge、headless、SDK 不是重写一套逻辑，而是复用这条主链。",
  ],
  sources: [
    "restored-src/src/entrypoints/cli.tsx",
    "restored-src/src/main.tsx",
    "restored-src/src/utils/handlePromptSubmit.ts",
    "restored-src/src/utils/processUserInput/processUserInput.ts",
    "restored-src/src/QueryEngine.ts",
    "restored-src/src/query.ts",
    "restored-src/src/services/tools/toolExecution.ts",
  ],
});

flowSlide(nextPage(), {
  section: "02 / Startup Flow",
  title: "启动编排流程图",
  subtitle: "这页单独把 `main.tsx` 的初始化编排抽出来，方便讲清 startup 为什么这么重。",
  accent: C.amber,
  top: [
    { x: 0.82, y: 1.92, w: 1.8, h: 0.8, label: "Config /\nAuth", accent: C.amber },
    { x: 2.92, y: 1.92, w: 1.9, h: 0.8, label: "Feature Gates /\nModels", accent: C.blue },
    { x: 5.12, y: 1.92, w: 1.9, h: 0.8, label: "MCP / Plugins /\nSkills", accent: C.purple },
    { x: 7.32, y: 1.92, w: 1.9, h: 0.8, label: "Session Restore /\nLSP / Teleport", accent: C.emerald },
    { x: 9.52, y: 1.92, w: 2.0, h: 0.8, label: "Render App /\nWire Runtime", accent: C.red },
  ],
  links: [
    { x: 2.7, y: 2.25, color: C.amber },
    { x: 4.9, y: 2.25, color: C.amber },
    { x: 7.1, y: 2.25, color: C.amber },
    { x: 9.3, y: 2.25, color: C.amber },
  ],
  bottom: [
    {
      x: 0.92,
      y: 3.48,
      w: 11.0,
      h: 2.28,
      title: "为什么值得单独讲",
      accent: C.amber,
      items: [
        "`main.tsx` 不是简单做一次配置加载，而是在应用启动阶段把 model、feature、扩展层、恢复逻辑与 UI surface 一起接起来。",
        "这正是平台化产品和“小型工具脚本”的差异所在。",
      ],
    },
  ],
  sources: ["restored-src/src/main.tsx"],
});

dividerSlide(nextPage(), 3, "QueryEngine / query.ts 深潜", "这部分回答第二个核心问题：Claude Code 的 agent loop 究竟怎么落在代码上。", C.blue, "重点不是‘发一次 API 请求’，而是怎样维持一整个会话。");

twoColSlide(nextPage(), {
  section: "03 / QueryEngine",
  title: "`QueryEngine` 是会话对象，不是 request wrapper",
  subtitle: "代码注释已经明确写出：one QueryEngine per conversation。",
  accent: C.blue,
  leftTitle: "关键字段",
  leftItems: [
    "`config`: 当前会话的运行时配置。",
    "`mutableMessages`: 整个会话累积消息。",
    "`abortController`: 终止当前 turn 或整个会话。",
    "`permissionDenials` / `totalUsage` / `readFileState`: 权限、成本、文件缓存。",
  ],
  rightTitle: "关键职责",
  rightItems: [
    "`submitMessage()` 启动新一轮 turn，同时复用会话上下文。",
    "把 SDK/headless 场景所需的状态管理从 REPL 抽出来。",
    "封装 orphaned permission、skill discovery、session persistence 等会话级行为。",
    "最终把实际递归工作下沉给 `query()`。",
  ],
  sources: ["restored-src/src/QueryEngine.ts"],
});

codeDetailSlide(nextPage(), {
  section: "03 / QueryEngine Internals",
  title: "`submitMessage()` 的真正价值是“包住 query loop 的外层生命周期”",
  subtitle: "这一层负责的事情很多，但它们都不是 token 级生成逻辑。",
  accent: C.blue,
  leftTitle: "外层生命周期动作",
  leftItems: [
    "清理 `discoveredSkillNames`，重设 cwd，准备 session persist。",
    "包装 `canUseTool`，把拒绝事件记录成 SDK 可见的 permission denial。",
    "构造 `ToolUseContext`，把 app state、commands、agents、mcp 等打包进去。",
    "迭代 `query()` 的产出，再转换成 SDK messages、usage、status 更新。",
  ],
  codeTitle: "关键代码位点",
  code: [
    "class QueryEngine {",
    "  private mutableMessages: Message[]",
    "  private permissionDenials: SDKPermissionDenial[]",
    "  private totalUsage: NonNullableUsage",
    "",
    "  async *submitMessage(...) {",
    "    const wrappedCanUseTool = async (...) => { ... }",
    "    for await (const message of query({...})) { ... }",
    "  }",
    "}",
  ].join("\n"),
  rightTitle: "为什么要分这一层",
  rightItems: [
    "会话状态与单轮递归状态的职责不同。",
    "headless/SDK 需要稳定 API，但 REPL 内部实现可以继续演化。",
    "这层把成本统计、权限拒绝记录、session replay 这些横切关注点集中起来。",
  ],
  sources: ["restored-src/src/QueryEngine.ts"],
});

twoColSlide(nextPage(), {
  section: "03 / query.ts Config",
  title: "`buildQueryConfig()` 先把 query 级别的不可变配置快照下来",
  subtitle: "这页讲的是 `query.ts` 开头为什么先构造 config，而不是一路直接读全局状态。",
  accent: C.blue,
  leftTitle: "源码里快照了什么",
  leftItems: [
    "`sessionId`。",
    "`streamingToolExecution`、`emitToolUseSummaries`、`isAnt`、`fastModeEnabled` 等 gates。",
    "这些值在一次 `query()` 调用内保持稳定，不跟随后续外部状态漂移。",
    "注释明确说这是为了未来把 step 提纯成 `(state, event, config)` reducer。",
  ],
  rightTitle: "设计意义",
  rightItems: [
    "减少 query loop 中途读取全局状态带来的漂移问题。",
    "把 tree-shaking 边界与真正的运行时配置边界分开。",
    "说明作者在为更纯的 step/state machine 结构预留演化空间。",
  ],
  sources: ["restored-src/src/query/config.ts"],
});

flowSlide(nextPage(), {
  section: "03 / query.ts Loop",
  title: "`query.ts` 才是 agent loop 的递归核心",
  subtitle: "这一页不是概念图，而是对应源码里的真实循环骨架。",
  accent: C.blue,
  top: [
    { x: 0.82, y: 1.9, w: 2.05, h: 0.82, label: "buildQueryConfig\nmessages + prompts", accent: C.blue },
    { x: 3.15, y: 1.9, w: 1.85, h: 0.82, label: "call model\nstream deltas", accent: C.blue },
    { x: 5.28, y: 1.9, w: 1.95, h: 0.82, label: "collect\nassistant blocks", accent: C.blue },
    { x: 7.51, y: 1.9, w: 1.95, h: 0.82, label: "runTools /\nStreamingToolExecutor", accent: C.red },
    { x: 9.74, y: 1.9, w: 2.05, h: 0.82, label: "append tool results\ncheck continue", accent: C.emerald },
  ],
  links: [
    { x: 2.94, y: 2.24, color: C.blue },
    { x: 5.07, y: 2.24, color: C.blue },
    { x: 7.3, y: 2.24, color: C.blue },
    { x: 9.53, y: 2.24, color: C.blue },
    { kind: "down", x: 10.7, y: 2.95, color: C.emerald },
  ],
  bottom: [
    {
      x: 0.92,
      y: 3.45,
      w: 5.35,
      h: 2.34,
      title: "源码信号",
      accent: C.blue,
      items: [
        "`toolUseBlocks` 是循环是否继续的关键退出信号。",
        "stop_reason=`tool_use` 不可靠，因此流式过程中显式收集 block。",
        "Tool results 被编码成新的 user/attachment messages 回注。",
        "needsFollowUp / maxTurns / stop hooks 共同控制递归边界。",
      ],
    },
    {
      x: 6.5,
      y: 3.45,
      w: 5.45,
      h: 2.34,
      title: "设计含义",
      accent: C.emerald,
      items: [
        "模型输出不是终点，而是下一步执行计划。",
        "工具结果不是副作用，而是下一轮推理输入。",
        "这就是 Claude Code 作为 agent runtime 的真正核心。",
      ],
    },
  ],
  sources: ["restored-src/src/query.ts"],
});

sequenceSlide(nextPage(), {
  section: "03 / Turn Sequence",
  title: "单轮执行时序图",
  subtitle: "把一轮 turn 拆成更细的时序，方便讲明 `QueryEngine`、`query.ts` 和 tool runtime 的职责边界。",
  accent: C.blue,
  steps: [
    { label: "submitMessage", accent: C.blue, w: 1.65 },
    { label: "build config /\ncontexts", accent: C.emerald, w: 1.9 },
    { label: "stream model", accent: C.blue, w: 1.45 },
    { label: "collect tool_use", accent: C.red, w: 1.7 },
    { label: "run tools", accent: C.red, w: 1.35 },
    { label: "append results", accent: C.emerald, w: 1.6 },
    { label: "continue / stop", accent: C.purple, w: 1.65 },
  ],
  detailTitle: "讲解口径",
  details: [
    "`submitMessage()` 负责 turn 外侧生命周期，`query.ts` 负责 turn 内部状态机。",
    "只要出现 tool use，本轮就不会停在“生成答案”，而会切入执行并准备下一轮。",
    "这张图适合在汇报时解释 Claude Code 为什么天然是 agent，而不是 chat wrapper。",
  ],
  sources: ["restored-src/src/QueryEngine.ts", "restored-src/src/query.ts"],
});

codeDetailSlide(nextPage(), {
  section: "03 / Streaming",
  title: "流式阶段不是简单吐字，而是在构建可执行结构",
  subtitle: "`query.ts` 里真正重要的是 assistant stream 如何变成 tool-use-aware 的结构化消息。",
  accent: C.emerald,
  leftTitle: "流式处理做了什么",
  leftItems: [
    "增量消费 `stream_event`，分别更新 UI、统计和 assistant blocks。",
    "显式维护 `assistantMessages`、`toolResults`、`toolUseBlocks`。",
    "如果 feature gate 打开，会启用 `StreamingToolExecutor`。",
    "一旦检测到 tool use，就不是“结束输出”，而是“切入执行阶段”。",
  ],
  codeTitle: "关键变量",
  code: [
    "const assistantMessages = []",
    "const toolResults = []",
    "const toolUseBlocks = []",
    "let needsFollowUp = false",
    "",
    "let streamingToolExecutor =",
    "  useStreamingToolExecution",
    "    ? new StreamingToolExecutor(...)",
    "    : null",
  ].join("\n"),
  rightTitle: "为什么要这么设计",
  rightItems: [
    "UI 流、tool 流、usage 流并行存在。",
    "这样既能保留实时交互，又不会失去 agent loop 的控制权。",
    "这也是 `query.ts` 复杂度远高于普通 SDK wrapper 的原因。",
  ],
  sources: ["restored-src/src/query.ts", "restored-src/src/services/tools/StreamingToolExecutor.js"],
});

twoColSlide(nextPage(), {
  section: "03 / Fallback & Recovery",
  title: "`query.ts` 还处理 fallback、withheld error 和 orphan 清理",
  subtitle: "这部分不是锦上添花，而是长时任务稳定性的关键。",
  accent: C.emerald,
  leftTitle: "流式恢复机制",
  leftItems: [
    "prompt-too-long、media-size、max-output-tokens 这类错误会先被 withheld，等 recovery 逻辑判定是否能自救。",
    "如果发生 streaming fallback，会给旧 assistant message 发 tombstone，并清空旧的 toolUse / toolResult 暂存。",
    "随后重建 `StreamingToolExecutor`，避免旧 tool_use_id 泄漏进 retry。",
  ],
  rightTitle: "源码级含义",
  rightItems: [
    "runtime 在显式处理“不完整 thinking / 不完整 tool use / fallback 重试”这些脏状态。",
    "这也是 `yieldMissingToolResultBlocks()`、`stripSignatureBlocks()`、fallback warning message 会出现的背景。",
    "`query.ts` 的职责并不是“问模型”，而是“维护一个可持续迭代的执行回路”。",
  ],
  sources: ["restored-src/src/query.ts"],
});

twoColSlide(nextPage(), {
  section: "03 / Budgets & Continuation",
  title: "`query.ts` 还负责预算、续跑、压缩与回退模型",
  subtitle: "单轮循环并不只是‘执行工具’，它还承担大量运行时治理职责。",
  accent: C.purple,
  leftTitle: "治理机制",
  leftItems: [
    "`taskBudget` 用于整个 agentic turn 的 API 预算控制。",
    "current turn token budget / output tokens 会动态计算。",
    "遇到上下文膨胀时，会触发 compact / microcompact / snip replay。",
    "必要时会使用 fallback model 或 continuation 计数。",
  ],
  rightTitle: "对产品的意义",
  rightItems: [
    "系统不是把模型当无限资源使用。",
    "长任务需要 runtime 主动维持上下文可持续性。",
    "这让 coding session 能在真实大工程里跑得更久。",
    "也是它能承担 agent task 的基础设施条件。",
  ],
  sources: [
    "restored-src/src/query.ts",
    "restored-src/src/services/compact/autoCompact.js",
    "restored-src/src/services/compact/microCompact.js",
  ],
});

twoColSlide(nextPage(), {
  section: "03 / Responsibility Split",
  title: "`QueryEngine` 与 `query.ts` 的分工很清晰",
  subtitle: "这一点值得特别讲，因为它是整个系统可演进性的关键。",
  accent: C.blue,
  leftTitle: "QueryEngine 负责",
  leftItems: [
    "会话级状态与 SDK/headless 接口。",
    "权限拒绝记录、usage 汇总、message replay。",
    "session persistence、orphaned permission、skill discovery 等外围生命周期。",
  ],
  rightTitle: "`query.ts` 负责",
  rightItems: [
    "当前 turn 的 prompt / context / config 组装。",
    "模型流式调用、tool use 收集、工具执行、继续或结束。",
    "预算与 compact 决策，直到本轮稳定收敛。",
  ],
  bottom: "这种拆法让“会话对象”和“单轮状态机”都能保持独立复杂度。",
  sources: ["restored-src/src/QueryEngine.ts", "restored-src/src/query.ts"],
});

dividerSlide(nextPage(), 4, "Tool Execution / Permissions 深潜", "这一章解释 Claude Code 最像“受控执行器”的地方：模型提出操作，runtime 决定能不能执行、怎么执行。", C.amber, "权限不是外围 UI，而是工具执行主路径的一部分。");

twoColSlide(nextPage(), {
  section: "04 / Tool Model",
  title: "Tool 抽象把能力、描述、权限与调用统一起来",
  subtitle: "模型看到的是 tool schema，但 runtime 看到的是更重的执行对象。",
  accent: C.amber,
  leftTitle: "Tool 对象包含",
  leftItems: [
    "名字、输入 schema、描述函数、call 实现。",
    "`requiresUserInteraction` 等权限相关信号。",
    "tool permission context 与 agent/task 相关上下文。",
    "progress 事件与 hook 交互能力。",
  ],
  rightTitle: "Registry 侧做的事",
  rightItems: [
    "`tools.ts` 汇总 built-in tools、MCP tools 和 agent tools。",
    "最终暴露给模型的是当前 permission mode 下可见的 tool pool。",
    "Tool 不只是函数，而是可被治理的能力单元。",
  ],
  sources: ["restored-src/src/Tool.ts", "restored-src/src/tools.ts"],
});

flowSlide(nextPage(), {
  section: "04 / Tool Runtime",
  title: "`toolExecution.ts` 执行流程图",
  subtitle: "这一页对应的是真正跑一次 tool use 时的主路径。",
  accent: C.amber,
  top: [
    { x: 0.74, y: 1.88, w: 1.9, h: 0.82, label: "zod input\nvalidate", accent: C.amber },
    { x: 2.96, y: 1.88, w: 1.9, h: 0.82, label: "run PreToolUse\nhooks", accent: C.purple },
    { x: 5.18, y: 1.88, w: 2.08, h: 0.82, label: "resolve hook /\nrule / UI decision", accent: C.red },
    { x: 7.6, y: 1.88, w: 1.88, h: 0.82, label: "tool.call\nwith progress", accent: C.emerald },
    { x: 9.82, y: 1.88, w: 2.02, h: 0.82, label: "post hooks /\nmessage injection", accent: C.blue },
  ],
  links: [
    { x: 2.74, y: 2.23, color: C.amber },
    { x: 4.96, y: 2.23, color: C.amber },
    { x: 7.38, y: 2.23, color: C.amber },
    { x: 9.6, y: 2.23, color: C.amber },
  ],
  bottom: [
    {
      x: 0.9,
      y: 3.38,
      w: 5.35,
      h: 2.44,
      title: "源码关键信号",
      accent: C.amber,
      items: [
        "`streamedCheckPermissionsAndCallTool()` 把进度与最终结果并到一个 async iterable。",
        "`checkPermissionsAndCallTool()` 里先做 schema 校验，再进入 hook + permission 流。",
        "tool span / analytics / tracing 都在这条主路径上埋点。",
      ],
    },
    {
      x: 6.48,
      y: 3.38,
      w: 5.45,
      h: 2.44,
      title: "这意味着",
      accent: C.emerald,
      items: [
        "工具执行不是黑盒函数调用，而是一条治理链。",
        "权限、hooks、用户修改、analytics 都会改变最终输入与行为。",
        "这也是为什么 tool runtime 能支撑真正的 coding agent。",
      ],
    },
  ],
  sources: ["restored-src/src/services/tools/toolExecution.ts"],
});

twoColSlide(nextPage(), {
  section: "04 / Pre Hooks",
  title: "`runPreToolUseHooks()` 的返回类型，本身就是一套控制协议",
  subtitle: "如果只把 hook 当成“执行一个脚本”，就会低估它在主链里的地位。",
  accent: C.purple,
  leftTitle: "它能返回什么",
  leftItems: [
    "`message`: 把 hook 进度或附件直接注入 UI / transcript。",
    "`hookPermissionResult`: 直接给出 allow / ask / deny。",
    "`hookUpdatedInput`: 只改输入，不改权限决议。",
    "`preventContinuation`、`stopReason`、`additionalContext`、`stop`: 改写后续控制流。",
  ],
  rightTitle: "这意味着",
  rightItems: [
    "Pre hook 不只是策略判断器，还是消息注入器和控制流改变器。",
    "tool runtime 因此天然支持企业策略、包装式交互、动态附加上下文。",
    "真正排查某个 tool 为什么没按预期执行，必须先看这里。",
  ],
  sources: ["restored-src/src/services/tools/toolHooks.ts"],
});

flowSlide(nextPage(), {
  section: "04 / Permission Tree",
  title: "权限决策树",
  subtitle: "这一页专门把 `hook -> rule -> canUseTool -> call` 的优先级画出来。",
  accent: C.red,
  top: [
    { x: 0.88, y: 1.94, w: 1.85, h: 0.78, label: "Pre hook\nreturned?", accent: C.purple },
    { x: 3.18, y: 1.94, w: 1.8, h: 0.78, label: "allow /\nask / deny", accent: C.red },
    { x: 5.43, y: 1.94, w: 1.95, h: 0.78, label: "rule check\noverride?", accent: C.amber },
    { x: 7.83, y: 1.94, w: 1.9, h: 0.78, label: "canUseTool\nprompt?", accent: C.blue },
    { x: 10.18, y: 1.94, w: 1.6, h: 0.78, label: "tool.call", accent: C.emerald },
  ],
  links: [
    { x: 2.96, y: 2.24, color: C.red },
    { x: 5.22, y: 2.24, color: C.red },
    { x: 7.62, y: 2.24, color: C.red },
    { x: 9.97, y: 2.24, color: C.red },
  ],
  bottom: [
    {
      x: 0.94,
      y: 3.46,
      w: 11.0,
      h: 2.32,
      title: "关键点",
      accent: C.red,
      items: [
        "hook 的 allow 不是最终裁决，deny/ask 规则仍可能覆盖它。",
        "只有在 rule check 没有继续要求 deny/ask 时，hook allow 才能直接放行。",
        "因此这不是单层权限系统，而是多层叠加的决策树。",
      ],
    },
  ],
  sources: [
    "restored-src/src/services/tools/toolHooks.ts",
    "restored-src/src/services/tools/toolExecution.ts",
  ],
});

codeDetailSlide(nextPage(), {
  section: "04 / PreTool Hooks",
  title: "PreToolUse hooks 会在权限判断前先介入",
  subtitle: "这使工具执行支持外部策略、输入修正、拦截与摘要化说明。",
  accent: C.purple,
  leftTitle: "主路径细节",
  leftItems: [
    "`runPreToolUseHooks()` 会返回 stop/info/updatedInput 等结果。",
    "hook 既可能直接 deny，也可能 allow 并注入 `updatedInput`。",
    "工具执行层还会统计 hook 数量和耗时，并在特定用户类型下显示摘要。",
    "因此 hook 不是旁路机制，而是第一层策略注入点。",
  ],
  codeTitle: "位点",
  code: [
    "for await (const result of runPreToolUseHooks(...)) {",
    "  if (result.type === 'stop') ...",
    "  if (result.updatedInput) processedInput = ...",
    "}",
  ].join("\n"),
  rightTitle: "设计后果",
  rightItems: [
    "权限结果不再只是 UI prompt 的返回值。",
    "外部规则、headless wrapper、企业策略都能在这里改变行为。",
    "也因此调试工具执行时，必须先看 hooks 再看 `tool.call()`。",
  ],
  sources: [
    "restored-src/src/services/tools/toolExecution.ts",
    "restored-src/src/services/tools/toolHooks.ts",
  ],
});

codeDetailSlide(nextPage(), {
  section: "04 / Permission Resolution",
  title: "`resolveHookPermissionDecision()` 暴露了权限优先级",
  subtitle: "这是权限系统最值得读的函数之一。",
  accent: C.red,
  leftTitle: "它的决策顺序",
  leftItems: [
    "如果 hook `allow`，先看这个工具是否仍要求交互，或当前上下文是否强制 `canUseTool`。",
    "若无需再次交互，再跑 `checkRuleBasedPermissions()`，deny/ask 规则仍可覆盖 hook allow。",
    "如果 hook `deny`，直接拒绝。",
    "如果没有 hook 决策或 hook=`ask`，再进入常规 `canUseTool()` 流程。",
  ],
  codeTitle: "位点",
  code: [
    "if (hookPermissionResult?.behavior === 'allow') {",
    "  const ruleCheck = await checkRuleBasedPermissions(...)",
    "  if (ruleCheck === null) return hookPermissionResult",
    "  if (ruleCheck.behavior === 'deny') return ruleCheck",
    "  return await canUseTool(...)",
    "}",
  ].join("\n"),
  rightTitle: "为什么重要",
  rightItems: [
    "它说明 hook 并不能完全跳过规则系统。",
    "权限不是单点裁决，而是 hook、规则、交互 prompt 三层叠加。",
    "这也是系统能同时支持本地规则、企业策略和用户交互的原因。",
  ],
  sources: ["restored-src/src/services/tools/toolHooks.ts"],
});

twoColSlide(nextPage(), {
  section: "04 / Post Hooks",
  title: "`runPostToolUseHooks()` / failure hooks 负责把执行结果再加工一次",
  subtitle: "也就是说，`tool.call()` 返回后，结果还可能被 hook 继续改写、阻断或补充。",
  accent: C.red,
  leftTitle: "成功路径上的 post hook",
  leftItems: [
    "可以产出额外 attachment/message。",
    "可以 `preventContinuation`，直接阻止 query loop 继续向前。",
    "对 MCP tool 还可以 `updatedMCPToolOutput`，即直接改写输出。",
    "出现 blockingError / execution error 时，也会转成 hook 级 attachment。",
  ],
  rightTitle: "失败路径上的 failure hook",
  rightItems: [
    "`runPostToolUseFailureHooks()` 会拿到 `error` 与 `isInterrupt`。",
    "因此失败也能被策略化处理，而不只是抛错结束。",
    "从 runtime 角度看，工具执行的成功与失败都被统一纳入 hook 协议。",
  ],
  sources: ["restored-src/src/services/tools/toolHooks.ts"],
});

sequenceSlide(nextPage(), {
  section: "04 / Hook Lifecycle",
  title: "Hook 生命周期时序图",
  subtitle: "适合在讲解时把 pre / call / post / failure 这四段连接起来。",
  accent: C.purple,
  steps: [
    { label: "validate", accent: C.amber, w: 1.25 },
    { label: "pre hooks", accent: C.purple, w: 1.45 },
    { label: "permission\nresolve", accent: C.red, w: 1.6 },
    { label: "tool.call", accent: C.emerald, w: 1.3 },
    { label: "post hooks", accent: C.blue, w: 1.45 },
    { label: "failure hooks", accent: C.red, w: 1.55 },
    { label: "query loop\nnext turn", accent: C.emerald, w: 1.65 },
  ],
  detailTitle: "这张图强调",
  details: [
    "hooks 不是只出现在工具调用前，它们贯穿工具成功和失败两条路径。",
    "因此 hook 更接近 runtime protocol，而不是普通扩展点。",
  ],
  sources: ["restored-src/src/services/tools/toolHooks.ts", "restored-src/src/services/tools/toolExecution.ts"],
});

twoColSlide(nextPage(), {
  section: "04 / Permission Modes",
  title: "Permission mode 是策略切换器，而不是单个 bool",
  subtitle: "`PermissionMode.ts` 把不同模式映射到外部可见语义与 UI 表示。",
  accent: C.amber,
  leftTitle: "源码里定义的模式",
  leftItems: [
    "`default`、`plan`、`acceptEdits`、`bypassPermissions`、`dontAsk`。",
    "在特定 feature 下还有 `auto`。",
    "每个 mode 都有 title、shortTitle、symbol、color、external 映射。",
    "所以 permission mode 同时服务于策略、UI 与对外接口。",
  ],
  rightTitle: "规则与文件系统",
  rightItems: [
    "规则字符串通过 `permissionRuleParser.ts` 解析，例如 `Bash(npm install)`。",
    "文件系统权限检查在 `utils/permissions/filesystem.ts` 中深入处理 working dir、读写范围与建议。",
    "shell 规则匹配则落在 `shellRuleMatching.ts`。",
    "权限本质上是 mode + rules + path/shell analysis 的组合。",
  ],
  sources: [
    "restored-src/src/utils/permissions/PermissionMode.ts",
    "restored-src/src/utils/permissions/permissionRuleParser.ts",
    "restored-src/src/utils/permissions/filesystem.ts",
    "restored-src/src/utils/permissions/shellRuleMatching.ts",
  ],
});

twoColSlide(nextPage(), {
  section: "04 / Call & Result",
  title: "真正的 `tool.call()` 发生在权限决议之后，但事情还没有结束",
  subtitle: "Claude Code 还会继续把结果变成可追踪、可后处理、可回注的消息。",
  accent: C.emerald,
  leftTitle: "call 前后发生什么",
  leftItems: [
    "执行前会回填/修正 `callInput`，尤其是文件路径类输入。",
    "`tool.call()` 得到 progress 回调，继续转成 SDK/UI 可见事件。",
    "执行耗时会进入 tracing 与 usage 统计。",
    "用户修改输入与 classifier 决策也会被带入上下文。",
  ],
  rightTitle: "结果如何回到主链",
  rightItems: [
    "权限拒绝时会生成 stop message 和 denial hooks。",
    "成功时会拼装 tool result message，继续送回 query loop。",
    "随后还会运行 post-tool hooks / failure hooks。",
    "因此工具执行结束不等于一次 turn 结束。",
  ],
  sources: ["restored-src/src/services/tools/toolExecution.ts"],
});

dividerSlide(nextPage(), 5, "AgentTool / Swarm 深潜", "这一章解释多 Agent 为什么不是装饰功能，而是 runtime 的自然延伸。", C.emerald, "主 agent 只是第一个 agent；系统从一开始就允许它再生成更多 agent。");

twoColSlide(nextPage(), {
  section: "05 / AgentTool",
  title: "`AgentTool` 是模型可见的“创建子代理”接口",
  subtitle: "在 schema 层它像普通 tool，在 runtime 层它会生成一个新的 query loop。",
  accent: C.emerald,
  leftTitle: "call 参数暴露的能力",
  leftItems: [
    "`prompt`、`subagent_type`、`description`、`run_in_background`、`mode`、`isolation`、`cwd`。",
    "既支持单个子代理，也支持 `team_name + name` 触发多 agent teammate spawn。",
    "会根据 coordinator mode、permission mode、agent filtering 调整行为。",
  ],
  rightTitle: "这说明什么",
  rightItems: [
    "子代理不是 UI 层按钮，而是模型可直接调用的工具。",
    "所以 multi-agent 是 query loop 的内生能力，而不是外部 orchestration shell。",
    "这也是后面 `runAgent()` 设计成通用生成器的背景。",
  ],
  sources: ["restored-src/src/tools/AgentTool/AgentTool.tsx"],
});

codeDetailSlide(nextPage(), {
  section: "05 / runAgent",
  title: "`runAgent()` 会重新构造一条子代理 query loop",
  subtitle: "这个函数本质上就是“生成子代理运行时”的工厂。",
  accent: C.emerald,
  leftTitle: "它先做什么",
  leftItems: [
    "根据父级 permission mode 与 override 计算 agent model。",
    "创建 agentId，必要时设置 transcript 子目录与 Perfetto trace hierarchy。",
    "构造 `initialMessages`，并对 forked context 过滤 incomplete tool calls。",
    "根据 agent 类型裁剪 `claudeMd`、`gitStatus` 等上下文，降低 token 开销。",
  ],
  codeTitle: "位点",
  code: [
    "export async function* runAgent({...}) {",
    "  const resolvedAgentModel = getAgentModel(...)",
    "  const initialMessages = [...contextMessages, ...promptMessages]",
    "  const [baseUserContext, baseSystemContext] = await Promise.all([...])",
    "  for await (const message of query({...})) { ... }",
    "}",
  ].join("\n"),
  rightTitle: "关键判断",
  rightItems: [
    "子代理并不是沿用父代理的所有上下文和规则。",
    "系统会基于 agent type 做瘦身、替换、隔离与 transcript 分组。",
    "这是规模化使用子代理时必须做的 token 与治理优化。",
  ],
  sources: ["restored-src/src/tools/AgentTool/runAgent.ts"],
});

twoColSlide(nextPage(), {
  section: "05 / Built-in Agents",
  title: "built-in agents 不是死名单，而是 feature-gated 的 agent registry",
  subtitle: "Explore、Plan、Guide、Verification 是否出现，都和入口、环境、实验开关有关。",
  accent: C.blue,
  leftTitle: "builtInAgents.ts 暴露的事实",
  leftItems: [
    "非交互 SDK 场景可通过环境变量禁用所有 built-in agents。",
    "coordinator mode 打开时，会转向 `coordinator/workerAgent.js` 提供 agent 列表。",
    "Explore/Plan/Verification 都受 feature 与 GrowthBook 开关控制。",
    "Code Guide agent 只在非 SDK entrypoint 下加入。",
  ],
  rightTitle: "架构含义",
  rightItems: [
    "built-in agents 是产品策略层，不是硬编码常量表。",
    "它们跟入口模式、用户类型、实验流量和权限模式深度耦合。",
    "这也解释了为何 agent runtime 要独立成体系，而不是塞进 UI 逻辑里。",
  ],
  sources: [
    "restored-src/src/tools/AgentTool/builtInAgents.ts",
    "restored-src/src/tools/AgentTool/built-in/exploreAgent.ts",
  ],
});

codeDetailSlide(nextPage(), {
  section: "05 / In-Process Runner",
  title: "`inProcessRunner.ts` 证明 swarm 不是口号，而是真实运行时",
  subtitle: "它把 `runAgent()` 包成 in-process teammate runner，并补上共享终端所需的桥接逻辑。",
  accent: C.red,
  leftTitle: "额外承担的职责",
  leftItems: [
    "通过 AsyncLocalStorage/teammate context 做上下文隔离。",
    "把进度更新和 AppState 写回 leader 可见状态。",
    "在完成后给 leader 发 idle notification。",
    "支持 plan mode approval flow、abort cleanup 与 mailbox permission response。",
  ],
  codeTitle: "源码开头就写明了",
  code: [
    "In-process teammate runner",
    "- context isolation",
    "- progress tracking and AppState updates",
    "- idle notification to leader",
    "- plan mode approval flow support",
    "- cleanup on completion or abort",
  ].join("\n"),
  rightTitle: "重点机制",
  rightItems: [
    "`createInProcessCanUseTool()` 会优先尝试 leader 的 ToolUseConfirm bridge。",
    "bridge 不可用时，再退化到 mailbox permission sync。",
    "这意味着 subagent 也能共享主界面的权限交互，而不是自己绕开。",
  ],
  sources: ["restored-src/src/utils/swarm/inProcessRunner.ts"],
});

twoColSlide(nextPage(), {
  section: "05 / Permission Bridge",
  title: "`createInProcessCanUseTool()` 是 teammate 权限桥",
  subtitle: "这个函数把 worker 的 ask 权限请求转接回 leader 的 UI 或 mailbox。",
  accent: C.red,
  leftTitle: "标准路径：leader UI bridge",
  leftItems: [
    "先跑 `hasPermissionsToUseTool()`，allow/deny 直接透传。",
    "若是 bash 且 classifier 可自动批准，会先等待 classifier 结果。",
    "仍需 ask 时，优先把请求塞进 leader 的 `ToolUseConfirm` queue。",
    "允许时还会把 permission updates 写回 leader 的共享 context，并 `preserveMode`。",
  ],
  rightTitle: "退化路径：mailbox sync",
  rightItems: [
    "bridge 不可用时，会创建 permission request，发到 leader mailbox。",
    "worker 端轮询自己的 mailbox，等待 approved/rejected 响应。",
    "因此 swarm 的权限交互即使脱离共享终端，也不会失效。",
  ],
  sources: ["restored-src/src/utils/swarm/inProcessRunner.ts"],
});

sequenceSlide(nextPage(), {
  section: "05 / Worker Permission Sequence",
  title: "子代理权限申请时序图",
  subtitle: "这页把 worker ask 权限时 leader、UI bridge、mailbox 的关系讲清楚。",
  accent: C.red,
  steps: [
    { label: "worker\nhasPermissions", accent: C.red, w: 1.45 },
    { label: "ask?", accent: C.amber, w: 0.95 },
    { label: "leader UI\nqueue", accent: C.blue, w: 1.45 },
    { label: "or mailbox\nrequest", accent: C.purple, w: 1.45 },
    { label: "leader\nresponds", accent: C.emerald, w: 1.35 },
    { label: "worker\nresumes", accent: C.red, w: 1.35 },
  ],
  detailTitle: "关键讲点",
  details: [
    "共享终端存在时，优先复用 leader 的 ToolUseConfirm UI。",
    "没有 bridge 时，再退化为 mailbox request/response。",
    "因此 worker 不会绕开权限系统，而是复用或桥接回主权限系统。",
  ],
  sources: ["restored-src/src/utils/swarm/inProcessRunner.ts"],
});

twoColSlide(nextPage(), {
  section: "05 / Swarm Mechanics",
  title: "swarm 的运行机制建立在 mailbox、task 与 permission sync 上",
  subtitle: "也就是说，团队协作并不是神秘黑盒，而是明确的数据交换与状态同步协议。",
  accent: C.purple,
  leftTitle: "运行机制",
  leftItems: [
    "leader / teammate 之间通过 mailbox 交换消息与状态。",
    "task 系统负责 claim、list、update 和输出持久化。",
    "permissionSync 把权限请求和响应同步到团队上下文。",
    "必要时还会持久化 transcript、permission update 与 task output。",
  ],
  rightTitle: "为什么这很重要",
  rightItems: [
    "说明多 Agent 已经是可恢复、可追踪、可治理的子系统。",
    "不是简单并发调用模型，而是带状态的一组协作实体。",
    "这也是为什么 swarm 目录下会有一整套 helpers、locks、mailbox 与 bridge。",
  ],
  sources: [
    "restored-src/src/utils/swarm/inProcessRunner.ts",
    "restored-src/src/utils/swarm/permissionSync.ts",
    "restored-src/src/utils/teammateMailbox.ts",
    "restored-src/src/utils/tasks.ts",
  ],
});

twoColSlide(nextPage(), {
  section: "05 / Idle Loop",
  title: "`waitForNextPromptOrShutdown()` 把 teammate 变成持续存活的协作实体",
  subtitle: "这也是 in-process teammate 和一次性 background task 最大的差异。",
  accent: C.emerald,
  leftTitle: "轮询逻辑",
  leftItems: [
    "每 500ms 检查内存里的 pending user messages。",
    "随后查 mailbox，优先处理 shutdown request，再处理 team lead 消息。",
    "如果没有消息，还会尝试 claim 团队任务列表里的可领任务。",
    "整个循环只有在 abort 或模型批准 shutdown 后才退出。",
  ],
  rightTitle: "架构含义",
  rightItems: [
    "teammate 不是一次性函数调用，而是持续存活、可接收多轮 prompt 的 actor。",
    "mailbox + task list + idle notification 一起组成了 swarm 的最小协作协议。",
    "这也是源码里会出现 leader / teammate / task owner 这些显式身份的原因。",
  ],
  sources: ["restored-src/src/utils/swarm/inProcessRunner.ts"],
});

flowSlide(nextPage(), {
  section: "05 / Idle State Diagram",
  title: "teammate 空闲循环状态图",
  subtitle: "这页适合说明 why subagent is an actor, not a one-shot function.",
  accent: C.emerald,
  top: [
    { x: 0.88, y: 1.92, w: 1.7, h: 0.8, label: "idle", accent: C.emerald },
    { x: 2.98, y: 1.92, w: 1.95, h: 0.8, label: "check pending\nmessages", accent: C.blue },
    { x: 5.33, y: 1.92, w: 1.85, h: 0.8, label: "poll mailbox", accent: C.purple },
    { x: 7.58, y: 1.92, w: 1.9, h: 0.8, label: "claim team\n task?", accent: C.amber },
    { x: 9.88, y: 1.92, w: 1.8, h: 0.8, label: "run prompt /\nshutdown", accent: C.red },
  ],
  links: [
    { x: 2.76, y: 2.24, color: C.emerald },
    { x: 5.11, y: 2.24, color: C.emerald },
    { x: 7.36, y: 2.24, color: C.emerald },
    { x: 9.66, y: 2.24, color: C.emerald },
    { kind: "down", x: 10.68, y: 2.96, color: C.red },
  ],
  bottom: [
    {
      x: 0.94,
      y: 3.48,
      w: 11.0,
      h: 2.26,
      title: "信息点",
      accent: C.emerald,
      items: [
        "teammate 会优先处理 shutdown request 和 team lead 消息，再处理 peer chatter。",
        "如果没人发消息，它还会主动尝试 claim task list 里的可用任务。",
        "这就是源码里 teammate 像 actor system 的原因。",
      ],
    },
  ],
  sources: ["restored-src/src/utils/swarm/inProcessRunner.ts"],
});

flowSlide(nextPage(), {
  section: "05 / Agent Runtime Diagram",
  title: "Agent runtime 关系图",
  subtitle: "这一页把 AgentTool 之后到底发生什么画成一张图。",
  accent: C.emerald,
  top: [
    { x: 0.82, y: 1.82, w: 1.88, h: 0.8, label: "Parent Query\n(tool call)", accent: C.emerald },
    { x: 3.02, y: 1.82, w: 1.98, h: 0.8, label: "AgentTool\nspawn request", accent: C.emerald },
    { x: 5.32, y: 1.82, w: 1.88, h: 0.8, label: "runAgent\nbuild child loop", accent: C.blue },
    { x: 7.52, y: 1.82, w: 2.0, h: 0.8, label: "inProcessRunner /\nbackground path", accent: C.red },
    { x: 9.84, y: 1.82, w: 1.88, h: 0.8, label: "query.ts\nchild turn loop", accent: C.purple },
  ],
  links: [
    { x: 2.8, y: 2.16, color: C.emerald },
    { x: 5.1, y: 2.16, color: C.emerald },
    { x: 7.3, y: 2.16, color: C.emerald },
    { x: 9.62, y: 2.16, color: C.emerald },
  ],
  bottom: [
    {
      x: 0.9,
      y: 3.42,
      w: 5.4,
      h: 2.46,
      title: "共享部分",
      accent: C.blue,
      items: [
        "共享 query loop、tool runtime、usage 统计、session 构造方式。",
        "子代理照样会进入 permissions、hooks 与 tracing。",
        "因此 child agent 不是特判执行器，而是复用主内核。",
      ],
    },
    {
      x: 6.48,
      y: 3.42,
      w: 5.42,
      h: 2.46,
      title: "特有部分",
      accent: C.red,
      items: [
        "额外的 agent id、transcript、worktree、teammate context。",
        "leader bridge / mailbox / permission sync。",
        "built-in agent registry 与 feature-gated spawn policy。",
      ],
    },
  ],
  sources: [
    "restored-src/src/tools/AgentTool/AgentTool.tsx",
    "restored-src/src/tools/AgentTool/runAgent.ts",
    "restored-src/src/utils/swarm/inProcessRunner.ts",
    "restored-src/src/query.ts",
  ],
});

dividerSlide(nextPage(), 6, "扩展层与多 Surface", "最后回到外围系统：能力从哪里来，为什么 terminal / bridge / SDK 可以共用同一套引擎。", C.purple, "这部分让架构闭环：内核之外的扩展与输出面如何接上来。");

twoColSlide(nextPage(), {
  section: "06 / MCP",
  title: "MCP 是外部能力接入层，而不是内部工具系统的替代品",
  subtitle: "从源码看，它被做成‘把外部 server 映射成 runtime 可用能力’的协议层。",
  accent: C.purple,
  leftTitle: "MCP 客户端侧职责",
  leftItems: [
    "建立 server 连接，管理缓存、配置和资源发现。",
    "把外部 tools / commands / resources 映射进本地 runtime。",
    "处理 elicitation、错误上报和 logging-safe metadata。",
    "最终仍要进入本地的 Tool/Command surface。",
  ],
  rightTitle: "架构边界",
  rightItems: [
    "MCP 不是 query loop，本质是 external capability bridge。",
    "它和 skills/plugins/commands 是互补关系，不是同义词。",
    "外部能力进来后，仍要接受本地 permissions 与 tool runtime 治理。",
  ],
  sources: [
    "restored-src/src/services/mcp/client.ts",
    "restored-src/src/services/mcp/types.js",
  ],
});

twoColSlide(nextPage(), {
  section: "06 / Skills & Plugins",
  title: "Skill、Plugin、Command 三层必须分开看",
  subtitle: "这三层经常被混淆，但在源码里边界很清楚。",
  accent: C.purple,
  leftTitle: "三层区别",
  leftItems: [
    "Plugin 管安装、来源、缓存、manifest 和分发。",
    "Skill 管工作流模板与经验封装，经常最终转成 command。",
    "Command 是用户显式入口，也是 slash command 的执行对象。",
    "MCP 则是另一条把外部能力拉进来的协议通道。",
  ],
  rightTitle: "它们最后如何汇合",
  rightItems: [
    "模型真正可见的是 tool pool 和 command surface。",
    "用户真正操作的是命令、UI 交互和 agent runtime。",
    "所以这些扩展层最终都要折叠到共享 runtime 中。",
  ],
  sources: [
    "restored-src/src/utils/plugins/pluginLoader.ts",
    "restored-src/src/skills/loadSkillsDir.ts",
    "restored-src/src/commands.ts",
    "restored-src/src/services/mcp/client.ts",
  ],
});

flowSlide(nextPage(), {
  section: "06 / Extension Diagram",
  title: "扩展层汇合关系图",
  subtitle: "把 Plugin / Skill / Command / MCP 如何汇合到 tool surface 画清楚。",
  accent: C.purple,
  top: [
    { x: 0.88, y: 1.92, w: 1.7, h: 0.8, label: "Plugin", accent: C.purple },
    { x: 2.98, y: 1.92, w: 1.7, h: 0.8, label: "Skill", accent: C.emerald },
    { x: 5.08, y: 1.92, w: 1.7, h: 0.8, label: "Command", accent: C.blue },
    { x: 7.18, y: 1.92, w: 1.7, h: 0.8, label: "MCP", accent: C.amber },
    { x: 9.28, y: 1.92, w: 2.2, h: 0.8, label: "Shared Tool /\nCommand Surface", accent: C.red },
  ],
  links: [
    { x: 2.76, y: 2.24, color: C.purple },
    { x: 4.86, y: 2.24, color: C.purple },
    { x: 6.96, y: 2.24, color: C.purple },
    { x: 9.06, y: 2.24, color: C.purple },
  ],
  bottom: [
    {
      x: 0.94,
      y: 3.46,
      w: 11.0,
      h: 2.3,
      title: "讲解重点",
      accent: C.purple,
      items: [
        "这几层不是并列展示概念，最后都会被折叠成共享的工具面和命令面。",
        "因此用户看到的是统一 runtime，扩展来源只是在背后不同。",
      ],
    },
  ],
  sources: [
    "restored-src/src/utils/plugins/pluginLoader.ts",
    "restored-src/src/skills/loadSkillsDir.ts",
    "restored-src/src/commands.ts",
    "restored-src/src/services/mcp/client.ts",
    "restored-src/src/tools.ts",
  ],
});

twoColSlide(nextPage(), {
  section: "06 / Surfaces",
  title: "终端 UI、headless/SDK、bridge/remote 共享一套引擎",
  subtitle: "这正是官方 overview 里“same engine across surfaces”的源码落点。",
  accent: C.blue,
  leftTitle: "本地 surface",
  leftItems: [
    "`ink/components/App.tsx` 与 AppState 负责终端交互。",
    "`cli/print.ts` 负责 headless/SDK 的 structured output。",
    "它们都不是独立业务实现，而是同一 runtime 的不同展示面。",
  ],
  rightTitle: "远程 surface",
  rightItems: [
    "`bridgeMain.ts`、`initReplBridge.ts`、`bridgeUI.ts` 把远端消息重新注入本地队列。",
    "remote/bridge 共享 QueryEngine、query.ts 与 tools/agents。",
    "所以不同入口之间最本质的差异是 ingress/egress，不是推理内核。",
  ],
  sources: [
    "restored-src/src/ink/components/App.tsx",
    "restored-src/src/cli/print.ts",
    "restored-src/src/bridge/bridgeMain.ts",
    "restored-src/src/bridge/initReplBridge.ts",
    "restored-src/src/bridge/bridgeUI.ts",
    "https://code.claude.com/docs/en/overview",
  ],
});

flowSlide(nextPage(), {
  section: "06 / Surface Diagram",
  title: "多 Surface 关系图",
  subtitle: "从产品形态回看，真正共享的是中间 runtime，而不是某一个 UI 组件。",
  accent: C.blue,
  top: [
    { x: 0.72, y: 1.9, w: 2.0, h: 0.82, label: "Terminal REPL\nInk + AppState", accent: C.blue },
    { x: 3.02, y: 1.9, w: 2.0, h: 0.82, label: "Headless / SDK\ncli/print.ts", accent: C.blue },
    { x: 5.32, y: 1.9, w: 2.0, h: 0.82, label: "Bridge / Remote\nsession ingress", accent: C.blue },
    { x: 7.62, y: 1.9, w: 2.06, h: 0.82, label: "Shared Runtime\nQueryEngine + query", accent: C.emerald },
    { x: 9.98, y: 1.9, w: 2.06, h: 0.82, label: "Tools / Agents /\nMCP / Commands", accent: C.purple },
  ],
  links: [
    { x: 2.8, y: 2.24, color: C.blue },
    { x: 5.1, y: 2.24, color: C.blue },
    { x: 7.4, y: 2.24, color: C.blue },
    { x: 9.76, y: 2.24, color: C.blue },
  ],
  bottom: [
    {
      x: 0.92,
      y: 3.42,
      w: 5.4,
      h: 2.34,
      title: "对外观测到的差异",
      accent: C.blue,
      items: [
        "terminal 更强调交互 UI 与权限弹窗。",
        "headless/SDK 更强调结构化输出与可集成性。",
        "bridge/remote 更强调消息 ingress 与会话同步。",
      ],
    },
    {
      x: 6.48,
      y: 3.42,
      w: 5.42,
      h: 2.34,
      title: "对源码真正重要的共性",
      accent: C.emerald,
      items: [
        "都复用 QueryEngine / query.ts / tool runtime / agent runtime。",
        "差异主要发生在入口分流和输出通道。",
        "这也是整体架构能够长期演进的原因。",
      ],
    },
  ],
  sources: [
    "restored-src/src/entrypoints/cli.tsx",
    "restored-src/src/cli/print.ts",
    "restored-src/src/bridge/bridgeMain.ts",
    "restored-src/src/QueryEngine.ts",
    "restored-src/src/query.ts",
  ],
});

threeCardSlide(nextPage(), {
  section: "Closing / Characteristics",
  title: "从工程风格上看，这套代码有 3 个鲜明特征",
  subtitle: "这些特征可以帮助你快速判断它和一般 AI 工具项目的区别。",
  accent: C.amber,
  cards: [
    {
      title: "1. 强 runtime 心智",
      items: [
        "会话对象和单轮循环分开",
        "权限、budget、compaction 都在主路径",
        "大量异步生成器与事件流",
      ],
    },
    {
      title: "2. 强产品工程化",
      items: [
        "终端 UI、bridge、remote 共存",
        "feature gates 与实验体系深入代码",
        "MCP / plugin / skill / command 边界明确",
      ],
      fill: C.panelAlt,
    },
    {
      title: "3. 强治理能力",
      items: [
        "permissions/hook/rules/classifier 叠加",
        "subagent 也受统一治理",
        "session/task/transcript 可追踪",
      ],
      fill: C.bgSoft,
    },
  ],
  sources: [
    "restored-src/src/query.ts",
    "restored-src/src/services/tools/toolExecution.ts",
    "restored-src/src/tools/AgentTool/runAgent.ts",
    "restored-src/src/utils/swarm/inProcessRunner.ts",
  ],
});

twoColSlide(nextPage(), {
  section: "Closing / Reading Order",
  title: "如果继续读源码，建议按这条路径推进",
  subtitle: "这样可以先建立全局图，再逐步下钻，不会在细节里迷失。",
  accent: C.emerald,
  leftTitle: "第一轮：建模系统",
  leftItems: [
    "先读 `entrypoints/cli.tsx`、`main.tsx`。",
    "再读 `QueryEngine.ts` 与 `query.ts`，建立主链模型。",
    "补看 `Tool.ts`、`tools.ts` 理解 tool surface。",
    "到这里你已经能解释 70% 的系统行为。",
  ],
  rightTitle: "第二轮：攻克复杂度",
  rightItems: [
    "读 `services/tools/toolExecution.ts` + `toolHooks.ts`。",
    "再读 `tools/AgentTool/*`、`utils/swarm/*`。",
    "最后看 `services/mcp`、`skills`、`plugins` 与 `cli/print.ts`。",
    "这条顺序能最大化减少“只见树木不见森林”的问题。",
  ],
  sources: [
    "restored-src/src/entrypoints/cli.tsx",
    "restored-src/src/main.tsx",
    "restored-src/src/QueryEngine.ts",
    "restored-src/src/query.ts",
    "restored-src/src/services/tools/toolExecution.ts",
    "restored-src/src/tools/AgentTool/AgentTool.tsx",
  ],
});

twoColSlide(nextPage(), {
  section: "Closing / Final Judgment",
  title: "最后判断",
  subtitle: "一句话总结：Claude Code 的核心创新不是“会调工具”，而是把终端工作流、权限治理、扩展层和多 Agent 协作统一到一个 runtime 里。",
  accent: C.amber,
  leftTitle: "架构结论",
  leftItems: [
    "这是终端 Agent Runtime，不是聊天 CLI。",
    "核心是 Query loop、Tool runtime、Permission system 与 Agent runtime。",
    "MCP / skills / plugins / commands 是围绕这个内核组织的扩展层。",
  ],
  rightTitle: "对 AI agent 设计的启发",
  rightItems: [
    "真正可用的 agent 系统必须把 permissions/budget/replay 做进主链。",
    "多 agent 要可追踪、可恢复、可治理，不能只是并发调用模型。",
    "不同 surfaces 共用同一引擎，才能让产品与平台同时成立。",
  ],
  sources: [
    "restored-src/src/QueryEngine.ts",
    "restored-src/src/query.ts",
    "restored-src/src/services/tools/toolExecution.ts",
    "restored-src/src/tools/AgentTool/runAgent.ts",
    "https://code.claude.com/docs/en/overview",
  ],
});

threeCardSlide(nextPage(), {
  section: "Appendix / Key Files",
  title: "关键源码文件索引",
  subtitle: "这页可以直接当作二次阅读导航。",
  accent: C.blue,
  cards: [
    {
      title: "主链",
      items: [
        "`entrypoints/cli.tsx`",
        "`main.tsx`",
        "`QueryEngine.ts`",
        "`query.ts`",
      ],
    },
    {
      title: "执行",
      items: [
        "`Tool.ts`",
        "`tools.ts`",
        "`services/tools/toolExecution.ts`",
        "`services/tools/toolHooks.ts`",
      ],
      fill: C.panelAlt,
    },
    {
      title: "多 Agent / 扩展",
      items: [
        "`tools/AgentTool/*`",
        "`utils/swarm/*`",
        "`services/mcp/*`",
        "`skills/*`, `plugins/*`",
      ],
      fill: C.bgSoft,
    },
  ],
  sources: [
    "restored-src/src/entrypoints/cli.tsx",
    "restored-src/src/main.tsx",
    "restored-src/src/QueryEngine.ts",
    "restored-src/src/query.ts",
    "restored-src/src/services/tools/toolExecution.ts",
    "restored-src/src/tools/AgentTool/AgentTool.tsx",
  ],
});

threeCardSlide(nextPage(), {
  section: "Appendix / Glossary",
  title: "用这 3 组词汇记住整套系统",
  subtitle: "这也是给听众做信息压缩的最好方式。",
  accent: C.purple,
  cards: [
    {
      title: "Conversation vs Turn",
      items: [
        "`QueryEngine` = conversation owner",
        "`query.ts` = turn loop",
        "两层职责不要混",
      ],
    },
    {
      title: "Capability vs Control",
      items: [
        "Tool/MCP/Plugin 提供能力",
        "Permission/Hook/Budget 提供控制",
        "两者都在主链里",
      ],
      fill: C.panelAlt,
    },
    {
      title: "Parent vs Child Agent",
      items: [
        "`AgentTool` 触发生成",
        "`runAgent` 构造 child runtime",
        "`swarm` 负责协作机制",
      ],
      fill: C.bgSoft,
    },
  ],
  sources: [
    "restored-src/src/QueryEngine.ts",
    "restored-src/src/query.ts",
    "restored-src/src/services/tools/toolExecution.ts",
    "restored-src/src/tools/AgentTool/runAgent.ts",
    "restored-src/src/utils/swarm/inProcessRunner.ts",
  ],
});

{
  const current = nextPage();
  const slide = pptx.addSlide();
  header(slide, current, "Closing / QR", "公众号", "把二维码放在结尾页，便于你直接拿去汇报或对外分享。", C.amber);
  panel(slide, 1.0, 1.86, 4.6, 3.9, "后续交流", bullet([
    "如果继续扩展这份 deck，可以把 `query.ts`、`toolHooks.ts`、`inProcessRunner.ts` 单独拆成分享。",
    "也可以继续做“Claude Code 与 Codex / Cursor / Cline”的实现对比版。",
    "这页保留二维码，适合直接作为结尾页。",
  ]), {
    fill: C.panel,
    titleColor: C.amber,
    fontSize: 12.2,
  });
  addQr(slide, 7.45, 1.98, 3.15, 3.15, "扫码关注");
  panel(slide, 6.8, 5.48, 4.5, 0.58, "", "Analysised by Phodal with Codex & ChatGPT Slide skill", {
    fill: C.bgSoft,
    bodyColor: C.muted2,
    fontSize: 10.5,
  });
  addNotes(slide, [QR_PATH]);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  await pptx.writeFile({ fileName: OUT_FILE });
  console.log(OUT_FILE);
})();
