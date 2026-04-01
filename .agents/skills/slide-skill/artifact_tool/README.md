# Presentation Artifact Tool Documentation

This is the official documentation for presentation artifact tool (version `2.2.6`). This library lets you create and edit presentation slides programmatically in Python and export to PowerPoint. Compared to `python-pptx` or `PptxGenJS`, it supports more advanced styling and layout features.

## Quick start

Check [./examples/integrated_example.py](./examples/integrated_example.py) for an in-depth demonstration of common patterns.

Check [./inspect.spec.md](./inspect.spec.md) to understand how to load an existing presentation, understand its content and efficiently modify it.

### Key patterns

- Use `Presentation.create({"slideSize": ...})` to control default slide dimensions.
- Use `presentation.slides.add()` to create slides.
- Use `presentation.slides.insert({"after": ...})` to insert relative to another slide (often the active slide).
- Use `slide.shapes.add({ geometry, position, fill, line })`, `slide.images.add(...)`, `slide.tables.add(...)`, `slide.charts.add(...)` to author content.
- Use `presentation.scripts.run(kind, options)` for high-level “command” edits (great for LLM tool calls).

NOTE: All dimensions must be specified in terms of pixels.

## Feature index

Start with the overall presentation and slide APIs, then drill into content types and styling:

- [`presentation.spec.md`](./presentation.spec.md) — `Presentation` façade, slide collection, export/toProto, scripts.
- [`slide.spec.md`](./slide.spec.md) — `Slide` API, backgrounds, placeholders, notes, export, auto-layout.
- [`layout.spec.md`](./layout.spec.md) — layouts, placeholders, and applying layouts to slides.
- [`master.spec.md`](./master.spec.md) — masters, linking layouts to masters, background refs + color maps.
- [`theme.spec.md`](./theme.spec.md) — theme color schemes and hex maps.
- [`styles.spec.md`](./styles.spec.md) — named text styles and how they flow through text.
- [`rich-text.spec.md`](./rich-text.spec.md) — text blocks, ranges, links, list presets.
- [`shapes.spec.md`](./shapes.spec.md) — shape geometry, fills, strokes, z‑ordering.
- [`fill.spec.md`](./fill.spec.md) — fill/stroke config shapes and color shorthands.
- [`images.spec.md`](./images.spec.md) — images, cropping, contain/cover framing, prompt placeholders.
- [`tables.spec.md`](./tables.spec.md) — tables, merges, and cell text.
- [`charts.spec.md`](./charts.spec.md) — charts, series, axes, legends, mini-chart YAML.
- [`auto-layout.spec.md`](./auto-layout.spec.md) — deterministic layout helpers for arranging shapes within frames.
- [`speaker-notes.spec.md`](./speaker-notes.spec.md) — speaker notes surface and visibility toggles.
- [`inspect.spec.md](./inspect.spec.md) - load an existing presentation, understand its content and make edits.

### Diagram

- `diagram.spec.md`：总览 DSL、家族分类和选型规则
- `shape.spec.md`：视觉原语与构件
- `layout.spec.md`：版式、框架和常用安全区
- `style.spec.md`：颜色、字体、写作和品牌规则
- `process.spec.md`：流程 / 生命周期 / 交付方法类图
- `timeline.spec.md`：时间轴 / 路线图 / 迁移阶段图
- `hierarchy.spec.md`：组织 / 角色 / 能力树 / 成长路径
- `relationship.spec.md`：Venn / onion / overlap / loop / 概念图
- `matrix.spec.md`：矩阵 / 风险 / 收益 / 比较类图
- `chart.spec.md`：饼图 / 分布 / 测试金字塔等
- `map.spec.md`：地图与区域分布图
- `gallery.spec.md`：logo wall / 资源卡片 / icon grid
- `catalog.spec.md`：按页索引与 spec 映射
- `slide-catalog.csv`：机读版索引
- `taxonomy.json`：机读版家族 / 变体摘要


## Family summary

| Family | Spec | Slides | What |
| --- | --- | --- | --- |
| process | process.spec.md | 5–8, 10, 12, 16, 20–23, 25, 48–57, 100, 101, 108–115, 117, 118, 120 | 流程、阶段、循环、交付方法、测试/工程流水线 |
| timeline | timeline.spec.md | 30, 63–74, 84, 95 | 时间轴、路线图、分阶段迁移、周/月/年计划 |
| hierarchy | hierarchy.spec.md | 13–15, 27–29, 31–42, 61 | 组织、角色、能力树、协作关系、成长路径 |
| relationship | relationship.spec.md | 9, 11, 44–47, 91–94, 96, 99, 116, 119, 121 | Venn、分层、重叠、环形、概念模型 |
| matrix | matrix.spec.md | 17–19, 58, 59, 89, 97, 98 | 二维坐标、热区、比较矩阵、收益/风险评估 |
| chart | chart.spec.md | 24, 86, 87, 103–106 | 饼图、分布、测试金字塔、对比图 |
| map | map.spec.md | 81–83 | 地图、区域分布、全球足迹+指标 |
| gallery | gallery.spec.md | 76–79, 126–128 | logo wall、资源卡片、图标/图片网格 |
| style | style.spec.md | 123–125 | 颜色、字体、写作与品牌规则 |
