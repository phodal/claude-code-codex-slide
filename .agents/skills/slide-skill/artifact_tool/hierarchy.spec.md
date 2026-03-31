# Hierarchy spec

## Overview

`hierarchy` family 关注组织、角色、能力与层级结构。它不一定是严格的 org chart，也包括价值树、成长路径和团队能力构成。

## Variant catalog

| Variant | 用途 | 关键构件 | Source slides |
| --- | --- | --- | --- |
| `value_tree` | 从 vision → goal → bet → initiative → pod 展开 | 树状分层节点 | 13–15, 33 |
| `operating_model` | 呈现组织与 Thoughtworks 角色关系 | 中心组织块 + 周边能力块 | 27, 28 |
| `tech_org` | 呈现技术组织层级 | 垂直层级框 | 29 |
| `role_or_journey_steps` | 人员旅程或面试阶段 | 顺序节点 / 步骤卡 | 31 |
| `team_structure` | functional vs cross-functional 对比 | 两栏组织模式 | 32 |
| `collaboration_roles` | 多角色协作地图 | 角色列 + ceremony/event rows | 34 |
| `polyglot_roles` | 多技能角色分布 | 中心角色 + 周边角色点 | 35 |
| `capability_matrix` | 团队能力范围 | 能力列表 / 团队边界说明 | 36 |
| `growth_path` | 成长路径与技能簇 | 中心路径 + 周边 skill nodes | 37–39 |
| `role_cards` | 核心角色说明卡 | 一列或两列 role card | 40–42 |
| `org_chart` | 标准组织图 | 容器面板 + 人员卡 + 连线 | 61 |

## Canonical structure

```yaml
hierarchy:
  variant: value_tree
  levels:
    - vision
    - goal
    - bet
    - initiative
    - pod
  nodes: []
  connectors: []
  annotations: []
```

## Pattern notes

### `value_tree`

- 顶部单一 `Vision`
- 中层扩散成多个 `Goal`
- 再向下分化为 `Bet`、`Initiative`、`POD`
- 适合用自上而下、轻分叉结构，不宜画成过于复杂的真实树图

### `operating_model`

- 中心通常是 `Organisation`
- 四周是 portfolio leaders / staffing / client principal / other capabilities
- 连线可以省略，靠位置关系表达归属

### `collaboration_roles`

- 这是“结构化表格 + 角色说明”的混合图，不是纯表格
- 横向用 ceremony 或 interaction，纵向用角色
- 角色说明块要保持统一宽度

### `growth_path`

- 中间是核心路径或主角色
- 周围是能力节点，常呈蜂窝或密集散点分布
- 适合表达“现在 → 下一步”或“核心 → 邻近能力”

### `org_chart`

- 上层 leader 卡片在中线附近
- 下层成员卡片等宽，靠细线连接
- 一页可容纳两个并列团队

## Recommended schema

```yaml
hierarchy:
  variant: org_chart
  clusters:
    - title: Lorem ipsum team led by
      leader:
        name: Name Name
        role: Role/Title
      members:
        - { name: Name Name, role: Role/Title }
        - { name: Name Name, role: Role/Title }
```

## Source coverage

13–15, 27–29, 31–42, 61
