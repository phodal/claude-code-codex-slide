# Map spec

## Overview

`map` family 用来表达全球分布、区域覆盖和规模指标。源 deck 里的地图并不追求地理精度，而是偏重“全球足迹 + 区域标签 + KPI”。

## Variant catalog

| Variant | 用途 | 关键构件 | Source slides |
| --- | --- | --- | --- |
| `footprint_hero` | 全球团队能力总览 | 左侧标题/国家列表 + 右侧地图 + KPI | 81 |
| `region_labels_map` | 区域 + 城市列表 + 右上指标 | 地图底图 + 区域标签 + KPI stack | 82, 83 |

## Canonical structure

```yaml
map:
  variant: region_labels_map
  visual:
    type: world_map_silhouette
  regions:
    - name: North America
      cities: [Atlanta, Chicago, New York, San Francisco, Toronto]
    - name: Europe
      cities: [Amsterdam, Barcelona, Berlin, ...]
  stats:
    - { value: "10,500+", label: Employees }
    - { value: 19, label: Countries }
    - { value: 48, label: Offices }
    - { value: "30+", label: Years }
```

## Pattern notes

### `footprint_hero`

- 左上是叙事标题，而不是标准标题占位
- 右上 / 右中是 2x2 KPI block
- 下半部分是国家列表 + 地图示意

### `region_labels_map`

- 地图只是背景；真正承载信息的是区域标签
- 区域标签之间要错位摆放，避免相互遮挡
- KPI 垂直堆叠放在右侧边缘最稳妥

## Recommended layout

```yaml
layout:
  title_block: { x: 0.40, y: 0.40, w: 4.20, h: 1.06 }
  map_area:    { x: 4.00, y: 1.16, w: 5.60, h: 3.90 }
  stats_col:   { x: 8.39, y: 1.27, w: 1.29, h: 2.96 }
  labels_area: { x: 0.40, y: 1.24, w: 7.20, h: 4.08 }
```

## Source coverage

81–83
