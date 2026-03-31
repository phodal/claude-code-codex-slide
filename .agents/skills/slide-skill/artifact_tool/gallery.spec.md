# Gallery spec

## Overview

`gallery` family 不强调流程或关系，而强调**资产展示**：客户 logo、出版物、图标、图库入口、资源链接卡片。

## Variant catalog

| Variant | 用途 | 关键构件 | Source slides |
| --- | --- | --- | --- |
| `logo_wall` | 客户 logo 展示 | 大网格 / 分行业分组 | 76, 77 |
| `metric_plus_cards` | 大数字 + 多张内容卡 | KPI 大字 + 2x2 卡片布局 | 78, 79 |
| `icon_grid` | 图标库页 | 均匀网格 + 简短说明 | 126 |
| `image_resource_cards` | 图片库入口 | 3 张资源卡 | 127 |
| `deckware_cards` | 其它 deck 入口 | 3 张 deck 卡片 | 128 |

## Canonical structure

```yaml
gallery:
  variant: metric_plus_cards
  hero_metric:
    value: "100+"
    label: books written
  cards:
    - title: Perspectives
      subtitle: A publication for digital leaders
      cta: Learn more
```

## Pattern notes

### `logo_wall`

- 重点是整齐、对齐、呼吸感
- 不要给单个 logo 过强视觉权重
- 行业分组时，用小标题分区，不要给 logo 加边框

### `metric_plus_cards`

- 左侧可以是 narrative 或 hero number
- 右侧常用 2x2 卡片矩阵
- 每张卡片包含标题、说明和 CTA 三层

### `icon_grid`

- 图标尺寸一致
- 说明文字只出现一次，位于标题下方
- 页面核心是“图标阵列”，不是文本

### `image_resource_cards` / `deckware_cards`

- 每张卡片结构一致
- 图像或缩略图在上，标题与 CTA 在下
- 一页 3 卡最稳妥

## Recommended grid

```yaml
grid:
  columns: 3 | 4
  gap_in: 0.20-0.30
  card:
    header_h: 1.2-1.8
    body_h: 0.8-1.2
```

## Source coverage

76–79, 126–128
