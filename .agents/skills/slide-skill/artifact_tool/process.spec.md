# Process spec

## Overview

`process` family 用来表达推进、迭代、循环、交付与工程方法。这是整套 deck 里数量最多的一类。

## Variant catalog

| Variant | 用途 | 关键构件 | Source slides |
| --- | --- | --- | --- |
| `governance_cadence` | 表示 Daily / Fortnightly / Monthly 节奏 | 三列容器 + 辅助说明卡 + 连线 | 5 |
| `double_diamond` | 表示探索与交付双阶段 | 4 个三角形 / 菱形区、上下说明 | 6, 7 |
| `delivery_funnel` | 表示 discovery → define/design → delivery | 阶段条、节点、连接线 | 8, 22, 23, 108–110 |
| `continuous_loop` | 表示持续交付 / BML 循环 | 环状或闭环标签、阶段点 | 10, 21, 100 |
| `skills_transfer_curve` | 表示能力/质量/成本随时间变化 | 轴线 + 曲线/对比区域 | 12, 20, 48 |
| `value_management_flow` | 表示 outcome / value / governance 之间的机制 | 中心视觉 + 三块说明 | 16 |
| `iterative_delivery_board` | 表示 backlog → team board → demo/retro | 卡片、泳道、编号步骤 | 49 |
| `thin_slice_comparison` | 对比正确/错误的切分方式 | 左右对照、条块分层 | 50–53 |
| `inception_approach` | 说明 inception 的目标/引导方式 | 引语区、目标列、阶段块 | 54–57 |
| `software_delivery_stack` | 总览从 discovery 到 delivery 的模式 | 分层块 + 入口路径 | 101 |
| `core_delivery_methodology` | 讲解 4 个方法论组件 | 单页大标题 + 组件副标题 + 大段正文 | 111–114 |
| `testing_pipeline` | 表示从本地到 CI/CD 的工程流水线 | 纵向/横向步骤、判断点、测试层 | 115, 117, 118, 120 |

## Canonical structure

```yaml
diagram:
  family: process
  variant: double_diamond
  title: Double diamond
  layout:
    mode: intro_plus_diagram
  stages:
    - id: discover
      label: Discover
    - id: define
      label: Define
    - id: design
      label: Design
    - id: deliver
      label: Deliver
  bands:
    - label: Define strategy
    - label: Execute solution
  annotations: []
```

## Pattern notes

### `governance_cadence`

- 横向三列最常见：`Daily`、`Fortnightly`、`Monthly`
- 每列是一个大容器，内部放说明卡或示意图
- 列标题短、正文解释长

### `double_diamond`

- 源 deck 用 4 个等腰三角形拼成双菱形
- 上方/下方常各有一层语义标签：大阶段 + 小阶段
- 适合表达“先发散后收敛”或“build the right thing / build the thing right”

### `continuous_loop`

- 适合 `Plan → Build → Release → Feedback` 或 `Build → Measure → Learn`
- 推荐使用围绕中心的闭环，而不是过长的横向步骤链
- 中心留白可承载概念标题

### `thin_slice_comparison`

- 常见布局是“Not like this / Like this”对照
- 左右两组结构必须视觉相似，差异只体现在切分方式
- 适合用条带和分层色块展示 vertical slice 与 horizontal slice

### `testing_pipeline`

- 适合展示长流程，但必须分成层：本地开发、CI、环境部署、验证、生产
- 判断点（YES/NO）不宜过多；否则读者会失焦
- 测试类型使用分层条带和分组文本，不依赖真实 BPMN 语法

## Recommended PptxGenJS-oriented schema

```yaml
process:
  variant: iterative_delivery_board
  lanes:
    - name: Discover
    - name: Define and design
    - name: Develop
    - name: Test and review
    - name: Deploy
  backlog:
    - Epic
    - User Story
  checkpoints:
    - Showcase
    - Demo
    - Retrospective
  callouts:
    - Delivery Manager
    - Product Manager
    - Team
```

## Source coverage

5–8, 10, 12, 16, 20–23, 25, 48–57, 100, 101, 108–115, 117, 118, 120
