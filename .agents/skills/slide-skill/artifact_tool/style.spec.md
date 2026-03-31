# Style spec

## Overview

这套 deck 的品牌风格来自 Thoughtworks 的资源页。这里汇总了颜色、字体和文案规则，并补充了从原 deck 中观察到的使用习惯。

## Brand palette

| Name | Hex |
| --- | --- |
| Talc white | `#FFFFFF` |
| Mist grey | `#EDF1F3` |
| Onyx black | `#000000` |
| Wave blue | `#003D4F` |
| Flamingo pink | `#F2617A` |
| Turmeric yellow | `#CC850A` |
| Jade green | `#6B9E78` |
| Sapphire blue | `#47A1AD` |
| Amethyst purple | `#634F7D` |

## Observed fill usage in the deck

根据对象填充的粗略统计，最常见实填颜色依次是：

- `#EDF1F3`
- `#FFFFFF`
- `#F2617A`
- `#634F7D`
- `#47A1AD`
- `#003D4F`
- `#6B9E78`
- `#CC850A`

这说明 deck 非常依赖**浅灰底 + 少量品牌强调色**的组合。

## Typography

资源页明确给出了以下规则：

- Headline：**Bitter Bold**
- Subtitle：**Inter SemiBold**
- Body：**Inter** regular / bold
- 不使用 Inter 的 thin / extra light / light / medium / extra bold / black
- 不使用 Bitter 的 thin / extra light / light / normal / medium / semi bold / extra bold / black

从 deck 实际 run 中也能看到 Inter 是绝对主字体，Bitter 主要用于标题。

## Writing rules

- 公司名写作：`Thoughtworks`
- 使用 US English
- 日期：`Month date, year`
- 文案使用 sentence case
- 单位数数字拼写，双位数以上数字用数字形式
- 尽量使用 `and` 而不是 `&`

## Line / fill treatment

- 依赖色块、边界和留白，不依赖厚重阴影。
- 线条通常较细，作为连接和辅助，不作为主视觉。
- 需要分层时，优先用浅灰底板；需要强调时，再用品牌色。
- `Pie sections` 页明确指出：只有当纯品牌色不够时，才使用 tint。

## Icon / image treatment

- 图标风格要统一、简洁；资源页指向 Remix Icon。
- 图片通常作为辅助资产放在半屏或卡片中，不与大量正文混排。
- logo wall 里 logo 尺寸一致，按网格对齐。

## Default text styles (recommended abstraction)

```yaml
headline:
  font_face: Bitter
  font_weight: bold
  font_size_pt: 24-28

subtitle:
  font_face: Inter
  font_weight: semibold
  font_size_pt: 12-16

body:
  font_face: Inter
  font_weight: regular
  font_size_pt: 8-11

body_emphasis:
  font_face: Inter
  font_weight: bold
  font_size_pt: 8-11

caption:
  font_face: Inter
  font_weight: regular
  font_size_pt: 6-8
```

## Source coverage

123–125
