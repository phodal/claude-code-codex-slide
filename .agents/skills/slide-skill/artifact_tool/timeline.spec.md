# Timeline spec

## Overview

`timeline` family 用来表达按时间推进、按阶段分层或按工作流交接的内容。它和 `process` 很接近，但更强调**时间刻度、阶段边界与计划跨度**。

## Variant catalog

| Variant | 用途 | 关键构件 | Source slides |
| --- | --- | --- | --- |
| `personal_journey` | 用时间点串联个人经历或 onboarding 旅程 | 横向里程碑 + 标签 | 30 |
| `year_milestones` | 年份时间轴 | 年份节点 + 事件标签 | 63, 65, 84 |
| `timeline_with_workstreams` | 同一时间轴上叠加多个产品/项目 | 多层条带 + 时间基线 | 64, 68 |
| `month_or_week_plan` | 周/月行动计划 | 表格或分段列 | 66, 73 |
| `program_inception_roadmap` | 从评估到执行的路线图 | 上层策略块 + 下层 delivery workstreams | 67 |
| `now_next_later` | 0–6 / 6–18 / 18+ 月路线图 | 三列时间段头 + 跨列能力条 | 69 |
| `handoff_flow` | 从 request 到 start work 的交接流 | 水平流程 + duration 标签 | 70 |
| `iteration_plan` | iteration / inception / UAT 计划 | 顶部时间块 + 底部 streams | 71 |
| `extended_numbered_process` | 编号步骤跨长路径展开 | 编号点 + 大量说明文本 | 72 |
| `high_level_roadmap` | 流程与 stream 的粗粒度展开 | Inception / Delivery / orchestration bands | 74 |
| `maturity_stages` | 分阶段演进 | Stage 1/2/3 条带 + 上升趋势 | 95 |

## Canonical structure

```yaml
timeline:
  variant: now_next_later
  time_buckets:
    - { label: "Now", range: "0 - 6 months" }
    - { label: "Next", range: "6 - 18 months" }
    - { label: "Later", range: "18+ months" }
  lanes: []
  milestones: []
  bars: []
```

## Pattern notes

### `year_milestones`

- 基线要稳定、年份间距尽量均匀
- 事件说明尽量短；长描述宜拆到旁注或二级标签

### `timeline_with_workstreams`

- 用不同高度区分不同 streams 或能力层
- 同一事件如果跨多个时间段，用横条而不是重复节点

### `now_next_later`

- 顶部用圆角矩形做时间桶头
- 底部用五边形短条做能力/主题条
- 条带可跨多个时间桶，但文案必须非常短

### `handoff_flow`

- 每个节点是动作名，连接线上方可放时间成本（如 1–3 days）
- 避免每个节点都写完整句；一句话说明放在页面底部或侧边

### `maturity_stages`

- Stage 条带通常位于底部
- 上方内容沿斜坡或上升路径摆放，强调成熟度递增

## Recommended schema

```yaml
timeline:
  variant: year_milestones
  axis:
    kind: linear
    labels: [1993, 1996, 2000, 2001, 2004, 2005, 2010, 2014, 2017, 2019, 2021]
  events:
    - year: 1993
      title: Thoughtworks incorporated
    - year: 2001
      title: First continuous integration server
```

## Source coverage

30, 63–74, 84, 95
