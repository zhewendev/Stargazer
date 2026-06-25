# Hero Illustration Variants

Stargazer 的 Hero 区域支持可插拔的 SVG 插画变体。每个变体是 `src/components/heroStyles/` 下的一个组件，通过 `heroStyle` frontmatter 字段选用。

---

## 可用变体

### `mountain`（默认）

山峦线条插画。Lapis Cafe 风格，克制、单色、不抢文字。

**适用场景:** 所有页面，默认值。

**使用:**
```yaml
heroStyle: mountain
```

---

## 如何添加新变体

1. 在 `src/components/heroStyles/` 下创建新组件文件（如 `Ocean.tsx`）
2. 实现 `HeroStyleComponent` 接口：

```tsx
import type { HeroStyleProps } from "./index"

export function OceanStyle({ palette, seed, height }: HeroStyleProps) {
  return (
    <svg viewBox={`0 0 800 ${height}`} ...>
      {/* SVG content using palette colors */}
    </svg>
  )
}
```

3. 在 `src/components/heroStyles/index.ts` 的 `heroVariants` 中注册：

```ts
const heroVariants = {
  mountain: MountainStyle,
  ocean: OceanStyle,   // 新增
}
```

4. 在 frontmatter 中使用：

```yaml
heroStyle: ocean
```

无需修改 Hero.tsx 或 HubHero.tsx。

---

## 预留变体

以下是已声明但尚未实现的变体名称，用于将来扩展：

| 名称 | 用途 | 状态 |
|------|------|------|
| `graph` | 知识图谱主题插画（Phase C） | 预留 |

---

## HeroStyleProps 接口

每个变体组件接收以下 props：

```ts
interface HeroStyleProps {
  palette: {
    accent: string          // CSS var(--accent-primary)
    text: string            // CSS var(--text-primary)
    muted: string           // CSS var(--text-muted)
    surface: string         // CSS var(--surface-canvas)
    surfaceElevated: string // CSS var(--surface-elevated)
  }
  seed: string   // 确定性种子（页面 slug），同 seed = 同构图
  height: number // 目标高度（Home: 260px, Hub: 130px）
}
```
