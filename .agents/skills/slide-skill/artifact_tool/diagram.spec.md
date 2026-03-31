# Diagram spec

## Overview

这套 deck 可以抽象为一个统一的 diagram DSL。每一页都可以拆成四层：

1. **frame**：画布、标题区、页码标记、安全区。
2. **layout**：左右分栏、全画布、矩阵、时间轴、卡片网格等。
3. **primitives**：矩形、圆、五边形、圆角矩形、三角形、弧形、连线、图片、表格。
4. **semantics**：流程、层级、关系、矩阵、图表、地图、资源展示。

## Canonical object model

```yaml
diagram:
  family: process | timeline | hierarchy | relationship | matrix | chart | map | gallery
  variant: string
  title: string
  subtitle: string?
  narrative: string?
  canvas:
    ratio: 16:9
    width_in: 10
    height_in: 5.625
  frame:
    title_band: { x: 0.40, y: 0.40, w: 9.19, h: 0.63 }
    page_marker: { x: 9.27, y: 5.10, w: 0.60, h: 0.43 }
    content_safe: { x: 0.40, y: 1.15, w: 9.20, h: 3.85 }
  layout:
    mode: title_only | intro_plus_diagram | split_50_50 | left_copy_right_visual | full_canvas | matrix_square | timeline_bands | card_grid
    columns: []
    rows: []
    layers: []
  nodes: []
  connectors: []
  annotations: []
  legend: []
  assets: []
```

## Family registry

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


## Variant selection guide

| 需求 | 选 family | 常见 variant |
| --- | --- | --- |
| 表达从发现到交付、从输入到输出的推进关系 | process | `double_diamond`, `iterative_delivery`, `testing_pipeline`, `thin_slices` |
| 表达时间、阶段、计划、路线图 | timeline | `year_timeline`, `now_next_later`, `transition_plan`, `roadmap_bands` |
| 表达组织、角色、团队、能力树 | hierarchy | `operating_model`, `org_chart`, `value_tree`, `growth_path` |
| 表达重叠、边界、概念关系、平台分层 | relationship | `venn`, `segments`, `onion`, `ownership_loop`, `iceberg` |
| 表达风险、优先级、收益、坐标比较 | matrix | `risk_matrix`, `quadrant_map`, `comparison_matrix`, `benefit_curve` |
| 表达分布、构成、测试金字塔、饼图 | chart | `adoption_curve`, `test_pyramid`, `pie_template` |
| 表达地域与全球分布 | map | `footprint_map`, `region_labels_map` |
| 展示客户 logo、资源卡片、图标、图库入口 | gallery | `logo_wall`, `publication_cards`, `icon_grid`, `resource_cards` |

## Deck-level invariants

- 标题几乎总在左上，页码标记几乎总在右下。
- 视觉重心偏左；解释性正文经常位于左侧，图形位于右侧。
- 常见画面构成是**一块主图 + 少量解释文本**，而不是密集表格。
- 主要几何形是矩形、圆、五边形、圆角矩形、弧形、等腰三角形、chevron。
- 装饰性阴影很少；更依赖纯色块、线条和留白。
- 同一页通常只使用 2–4 个主色，其余用白色或浅灰作背景。

## Source coverage

本 spec 作为总入口，覆盖全 deck，尤其是以下跨家族页面：

- 版式与结构：1–4, 26, 43, 60, 62, 75, 80, 85, 88, 90, 102, 107, 122
- 公共资源：123–128
- 各图形家族详情请转到对应 spec 文件
