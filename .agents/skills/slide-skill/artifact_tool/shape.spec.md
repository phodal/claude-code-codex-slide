# Shape spec

## Overview

这套 deck 的图形语言非常稳定。按实际统计，最常见的对象类型是：

- Auto shape：713
- Text box：571
- Freeform：410
- Placeholder：295
- Group：233
- Line：189
- Picture：149
- Table：13

最常见的几何形状是：

- Rectangle：329
- Oval：134
- Pentagon：89
- Rounded rectangle：47
- Arc：38
- Isosceles triangle：28
- Chevron：25

## Primitive inventory

| Primitive | 几何/对象 | 语义 | 典型尺寸（in） | Source slides |
| --- | --- | --- | --- | --- |
| `title_placeholder` | placeholder/text | 页标题 | 约 9.19 x 0.63 | 几乎全 deck |
| `page_marker` | placeholder/text | 右下角页码标记 | 0.60 x 0.43 | 几乎全 deck |
| `narrative_block` | text box / placeholder | 说明文案 | 3.5–4.3 宽 | 5, 13, 18, 45, 79, 109 |
| `panel_rect` | rectangle | 背景面板 / 容器 | 2.0–5.0 宽 | 13, 69, 79, 89 |
| `card_rect` | rectangle | 团队/角色/说明卡片 | 1.5 x 0.45 到 2.5 x 1.0 | 5, 61, 95 |
| `token_circle` | oval | 编号、节点、风险点 | 0.24–0.35 | 17, 89 |
| `cluster_circle` | oval | Venn / onion / overlap | 1.35–5.63 | 9, 44–47, 94 |
| `stage_bar` | pentagon | 阶段、能力条、路线条 | 高度常见 0.32–0.41 | 8, 69, 95 |
| `band_pill` | rounded rectangle | now / next / later 等时间段 | 高度约 0.44 | 69 |
| `triangle_wedge` | isosceles triangle | diamond / iceberg / directional shape | 2.84 x 1.93 或更大 | 6, 7, 119 |
| `arc_ring` | arc | Venn 交集、框架边界 | 1.3 左右 | 45 |
| `chevron` | chevron | 流程推进 / step | 变长 | 49, 71 |
| `connector_line` | line | 连接、分支、时间轴 | 细线，通常无箭头或极轻箭头 | 6, 34, 61, 70, 117 |
| `stat_tile` | text only / rect+text | KPI 数字块 | 0.8–1.8 宽 | 81–83 |
| `logo_tile` | picture | client/resource logo | 按网格分配 | 76–79 |
| `table_square` | table | 风险矩阵、图表底板 | 3.281 x 3.281 反复出现 | 17, 18, 45, 89, 99 |

## Common configs

### Title and page marker

```yaml
title_placeholder:
  x: 0.40
  y: 0.40
  w: 9.19
  h: 0.63
  text_style: headline

page_marker:
  x: 9.27
  y: 5.10
  w: 0.60
  h: 0.43
  text_style: caption
```

### Stage bar

```yaml
stage_bar:
  geometry: pentagon
  x: 0.48
  y: 2.57
  w: 1.49
  h: 0.32
  fill: wave_blue | flamingo_pink | turmeric_yellow | jade_green | sapphire_blue | amethyst_purple
  text_style: label_small
```

### Token circle

```yaml
token_circle:
  geometry: oval
  x: 0.40
  y: 1.36
  w: 0.24
  h: 0.24
  fill: wave_blue
  text_style: token_number
```

### Organogram card

```yaml
person_card:
  geometry: rect
  x: 1.10
  y: 3.50
  w: 1.53
  h: 0.45
  fill: white
  line: thin
  text:
    title: Name Name
    subtitle: Role/Title
```

### Venn node

```yaml
venn_node:
  geometry: oval
  x: 6.73
  y: 2.22
  w: 1.55
  h: 1.55
  fill: mist_grey | brand_color
  text_style: label_center
```

## Grouping rules

- 交互关系复杂时，源 deck 常把多个 shape 先组合成 `group`，再进行整体摆放。
- 概念主图常由“底板 + 线 + 标签”三层组成，连线通常在最底层。
- 表格在这套 deck 里多被当作**绘图底板**，而不是数据表。
- 图片主要用于地图、logo wall、资源卡片和饼图占位。

## Authoring rules

- 先放容器，再放节点，最后放线和标签。
- 文字尽量短；复杂解释放到左侧 narrative block，而不是塞进节点。
- 节点内部优先居中；列表类说明优先左对齐。
- 若一个图里需要超过 8 个节点，优先改成多层或分栏，而不是继续缩小字号。

## Source coverage

跨页通用，重点参考：5–7, 13, 17, 45, 61, 69, 81–83, 89, 94, 95, 103, 119
