# Relationship spec

## Overview

`relationship` family 用来表达概念之间的重叠、边界、包裹、循环或平台关系。它比 `hierarchy` 更少关注“谁属于谁”，更多关注“彼此如何相交”。

## Variant catalog

| Variant | 用途 | 关键构件 | Source slides |
| --- | --- | --- | --- |
| `business_tech_overlap` | 表达 business 与 tech 的边界变化 | 圆 / 矩形 / 中间交叠区 | 9, 11 |
| `three_mindsets` | 三元关系 | 三个主节点 + 中心解释 | 44 |
| `venn` | 重叠关系 | 圆、弧、交集标签 | 45–47, 93 |
| `segments` | 花瓣 / 分段关系 | 环绕式分区 | 91, 92 |
| `onion` | 同心层级与规划粒度 | 多层椭圆环 | 94 |
| `framework_map` | 能力/影响因子框架 | 中心框架 + 周边影响因子 | 96 |
| `ownership_loop` | 体验—洞察—决策—行动闭环 | 环路 + 箭头 + 旁注 | 99 |
| `capability_levers` | 可扩展性与投入杠杆关系 | 斜轴/阶梯 + 描述列表 | 116 |
| `integrated_design_iceberg` | 上层用户体验 / 下层平台能力 | 大三角/冰山结构 + 旁注 | 119 |
| `culture_clusters` | 文化主题簇 | 标题 + 多个能力簇列表 | 121 |

## Canonical structure

```yaml
relationship:
  variant: venn
  nodes:
    - { id: a, label: Agile software development }
    - { id: b, label: Continuous delivery methods }
    - { id: c, label: Lean learning principles }
  intersections:
    - { of: [a, b, c], label: Insight and decisions as products }
  outer_context:
    - Enterprise questions
```

## Pattern notes

### `business_tech_overlap`

- 可用多个并列圆表示时代变化，也可用中间融合区表示边界模糊
- 文案通常短，重在整体关系而不是细节

### `venn`

- deck 中既有标准重叠，也有以弧形和中心圆组合的“伪 Venn”
- 交集区文字要尽量短，否则会破坏几何清晰度

### `segments`

- 适合表示 4–8 个互补能力
- 比 Venn 更强调“围绕一个主题分工”，不是“彼此交叠”

### `onion`

- 由大到小表达从战略到日的规划尺度
- 标签最好统一置于中轴线上，避免读者找不到对应层级

### `ownership_loop`

- 适合中心环路 + 左右标签
- “data flows / artifacts / decision” 这一类词放在环路附近最清晰

### `integrated_design_iceberg`

- 上层只放用户可见内容
- 下层容量更大，用于承载平台、API、演进策略等说明
- 典型构件是大三角 + 水平水线 + 左右解释

## Recommended schema

```yaml
relationship:
  variant: onion
  layers:
    - Strategy
    - Portfolio
    - Product
    - Release
    - Iteration
    - Day
  center_alignment: true
```

## Source coverage

9, 11, 44–47, 91–94, 96, 99, 116, 119, 121
