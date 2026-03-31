# Matrix spec

## Overview

`matrix` family 适合把主题放进二维坐标、比较框架或风险分布中。这类页常借助正方形底板、编号圆点和轴标签来构图。

## Variant catalog

| Variant | 用途 | 关键构件 | Source slides |
| --- | --- | --- | --- |
| `quadrant_map` | 二维坐标上的主题分布 | 正方形底板 + 轴标签 + 编号点 | 17 |
| `metrics_table` | 指标对比 | 上部 narrative + 下部 table | 18, 19 |
| `evidence_circles` | 多来源输入的集合图 | 同心/相邻圆 + 左侧说明 | 58 |
| `wip_vs_time_to_value` | 对比不同排程方式的时间价值 | 三列对照 + 进度块 | 59 |
| `risk_matrix` | 风险概率 × 影响矩阵 | 矩阵底板 + 风险点 + 右侧说明 | 89 |
| `benefit_bubbles` | 价值来源聚类 | 若干圆形能力点围绕中心 | 97 |
| `efficiency_curve` | 时间与效率/工时变化 | 曲线 + 时间分段 | 98 |

## Canonical structure

```yaml
matrix:
  variant: risk_matrix
  x_axis:
    label: Probability
    buckets: [Highly unlikely, Unlikely, Moderately likely, Likely, Highly likely]
  y_axis:
    label: Impact to business
    buckets: [Low, Moderate, Significant, High, Critical]
  points:
    - { id: 1, x: 4, y: 4, label: "1" }
```

## Pattern notes

### `quadrant_map`

- 左右、上下都必须有清晰轴语义
- 编号点与名称列表配合使用，比把长文本直接塞进坐标内更清晰

### `metrics_table`

- 这类页面虽然含表格，但视觉仍然服从品牌版式：标题 + narrative + 表格
- 表格本身尽量简洁，避免过多边框

### `risk_matrix`

- 右侧深色说明板是可选模式，适合放“如何使用该矩阵”的解释
- 风险点用小圆即可；复杂标签放到侧边

### `wip_vs_time_to_value`

- 最重要的是对照关系：同时开始 vs 先做 A 再做 B
- 尽量让每一列结构完全一致，只改颜色和时间结果

### `efficiency_curve`

- 时间段标签在横轴下方，收益/效率趋势作为一条主曲线
- 这类页面适合表达“学习曲线”“效率提升”“成本下降”

## Recommended schema

```yaml
matrix:
  variant: quadrant_map
  square: { x: 4.18, y: 1.17, w: 3.28, h: 3.28 }
  x_axis: { min: Low, max: High }
  y_axis: { min: Low, max: High }
  labels:
    - Recruitment
    - Procure to pay
    - Customer service
```

## Source coverage

17–19, 58, 59, 89, 97, 98
