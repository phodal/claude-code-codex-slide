# Chart spec

## Overview

`chart` family 在这套 deck 中主要不是“真实数据绑定图表”，而是**用 shape 画出的说明性图表**。因此应优先关注构成和标签逻辑，而不是 Excel 图表对象。

## Variant catalog

| Variant | 用途 | 关键构件 | Source slides |
| --- | --- | --- | --- |
| `adoption_distribution` | 创新采用生命周期 | 分段曲线 / 区域 + 百分比标签 | 24 |
| `test_pyramid` | 测试层次说明 | 金字塔 / 分层块 + 左右注释 | 86 |
| `test_pyramid_vs_ice_cream_cone` | 反模式对比 | 左右两组测试层级 | 87 |
| `pie_template_single` | 单饼图占位模板 | 饼图图片 + 标签 + 说明栏 | 103 |
| `pie_template_double` | 双饼图模板 | 左右并排两个饼图 | 104 |
| `pie_template_with_copy` | 饼图 + 旁边能力说明 | 饼图 + 右侧文本列 | 105 |
| `pie_palette_reference` | 颜色切片参考 | 多个 pie section 样例 | 106 |

## Canonical structure

```yaml
chart:
  variant: test_pyramid
  levels:
    - E2E via GUI
    - E2E subcutaneous
    - Integration with platform
    - Other integration categories
    - Unit tests
  overlays:
    - Exploratory (manual)
    - Maintenance costs
    - Business value
```

## Pattern notes

### `adoption_distribution`

- 五段分布：Innovators / Early adopters / Early majority / Late majority / Laggards
- 百分比要放在每一段上方，避免挤进曲线内部

### `test_pyramid`

- 重点不是“精确几何”，而是层次从上到下越宽
- 左侧/右侧注释分别解释测试价值与维护成本

### `test_pyramid_vs_ice_cream_cone`

- 左右对照必须语义完全可比
- 一个是 anti-pattern，一个是 ideal pyramid，标题必须说清对比关系

### `pie_template_*`

- 源 deck 用图片占位，而不是原生 chart object
- 标签和说明应围绕饼图排布，不要压在图上
- 同一页饼图最多两个；更多时可拆页

## Recommended schema

```yaml
chart:
  variant: pie_template_double
  charts:
    - { x: 0.93, y: 1.76, w: 3.14, h: 2.97 }
    - { x: 5.93, y: 1.76, w: 3.14, h: 2.97 }
  labels:
    - Label
    - Label
    - Label
```

## Source coverage

24, 86, 87, 103–106
