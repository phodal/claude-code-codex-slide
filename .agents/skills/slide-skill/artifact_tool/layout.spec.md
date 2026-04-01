# Layout spec

## Overview

这套 deck 的版式非常一致。即使图形主题不同，布局也主要落在少数几种“框架”里。建议先确定 layout，再填入具体图形。

## Global frame

```yaml
canvas:
  ratio: 16:9
  width_in: 10
  height_in: 5.625

safe_areas:
  title_band:   { x: 0.40, y: 0.40, w: 9.19, h: 0.63 }
  page_marker:  { x: 9.27, y: 5.10, w: 0.60, h: 0.43 }
  content_main: { x: 0.40, y: 1.15, w: 9.20, h: 3.85 }
  bottom_band:  { x: 0.40, y: 4.50, w: 9.20, h: 0.55 }
```

## Layout modes

| Mode | 结构 | 适用 | Source slides |
| --- | --- | --- | --- |
| `section_divider` | 仅标题 | 分章节 | 4, 26, 43, 60, 62, 75, 80, 85, 88, 90, 102, 107, 122 |
| `intro_plus_diagram` | 上标题，下方一段说明 + 主图 | 大多数概念图 | 5, 13, 18, 45, 109 |
| `left_copy_right_visual` | 左侧文案，右侧图形 | 价值树、Venn、publication cards | 13–15, 45, 79 |
| `split_50_50` | 左右半屏 | pie template、resource card、map/stats | 79, 103–105 |
| `full_canvas` | 标题下几乎全部为图形 | timeline、流程板、地图 | 49, 63–74, 81–83 |
| `matrix_square` | 中部固定正方底板 + 标签 | 风险矩阵、quadrant | 17, 89 |
| `timeline_bands` | 上下时间段 / 阶段带 | roadmap、plan | 69, 71, 95 |
| `card_grid` | 多列卡片或 logo 网格 | key roles、logo wall、deckware | 40–42, 76–79, 128 |
| `concentric_center` | 中心节点 + 同心或环形层 | onion / Venn / platform | 44–47, 94, 99 |
| `sidebar_panel` | 主图 + 右侧说明板 | risk matrix、integrated design | 89, 119 |

## Layout recipes

### 1) Intro + diagram

```yaml
layout:
  mode: intro_plus_diagram
  title_band: { x: 0.40, y: 0.40, w: 9.19, h: 0.63 }
  intro:      { x: 0.40, y: 1.13, w: 9.19, h: 0.55 }
  visual:     { x: 0.40, y: 1.75, w: 9.19, h: 3.10 }
```

### 2) Left copy + right visual

```yaml
layout:
  mode: left_copy_right_visual
  left_copy:  { x: 0.40, y: 1.49, w: 3.85, h: 3.74 }
  right_main: { x: 5.00, y: 1.15, w: 4.56, h: 3.50 }
```

### 3) Roadmap bands

```yaml
layout:
  mode: timeline_bands
  time_headers:
    - { x: 0.40, y: 1.16, w: 2.00, h: 0.44, label: "Now" }
    - { x: 2.45, y: 1.16, w: 3.13, h: 0.44, label: "Next" }
    - { x: 5.63, y: 1.16, w: 3.97, h: 0.44, label: "Later" }
  bars_area: { x: 0.40, y: 1.60, w: 9.20, h: 3.30 }
```

### 4) Matrix square

```yaml
layout:
  mode: matrix_square
  square:   { x: 0.83, y: 1.32, w: 3.28, h: 3.28 }
  labels_x: left/right
  labels_y: top/bottom
  sidebar:  { x: 7.50, y: 0.00, w: 2.50, h: 5.63 }  # 可选
```

## Spacing rules

- 主要对象之间通常保持 0.18–0.35 in 的缝隙。
- 多个 KPI 或卡片垂直排列时，行距比列距更紧。
- 时间轴与路线图的条带高度通常一致。
- 右下页码不要侵入主图；高密度页面也保留右下角空白。

## What to avoid

- 不要让正文与主图抢占同一中心区域。
- 不要把标题压到 1 行以下的极小字号；宁可缩短文案。
- 不要为了塞下更多节点而破坏外部留白。
