// ThemeRegistry — generic factory for pluggable variant collections.
//
// Per design.md D26 / D28 (future Theme Registry abstraction). The pattern is
// reusable for any "name → variant" collection: hero styles, card variants,
// button styles, etc. Each style system calls createThemeRegistry<T>() with
// its own variant type T, registering components under lowercase string names
// plus a list of reserved (declared-but-unimplemented) names.
//
// Future "Theme Registry" can compose multiple registries (hero, card, ...)
// under a single facade. Today this module provides the primitive.

export interface ThemeRegistryConfig<T> {
  /** Human-readable name used in warning messages ("hero", "card", ...). */
  name: string
  /** Active variants, keyed by lowercase string name. */
  variants: Record<string, T>
  /** Variants declared for future implementation; resolve to fallback + warning. */
  reserved?: string[]
  /** Returned for missing/unknown/reserved names. */
  fallback: T
}

export interface ThemeRegistry<T> {
  readonly name: string
  readonly variants: Readonly<Record<string, T>>
  readonly reserved: ReadonlyArray<string>
  readonly fallback: T

  /** Resolve a name to a variant. Falls back gracefully with a warning. */
  lookup(query: string | undefined): T

  /** Active variant names. */
  list(): string[]

  /** Reserved (declared-but-unimplemented) variant names. */
  listReserved(): string[]

  /** All known names (active + reserved). */
  listAll(): string[]

  /** True if name is reserved (declared but not yet implemented). */
  isReserved(query: string | undefined): boolean

  /** True if name has an active implementation. */
  has(query: string | undefined): boolean
}

export function createThemeRegistry<T>(
  config: ThemeRegistryConfig<T>,
): ThemeRegistry<T> {
  const { name, variants, reserved = [], fallback } = config

  if (!fallback) {
    throw new Error(
      `[themeRegistry] '${name}' registry requires a fallback variant`,
    )
  }

  const variantKeys = new Set(Object.keys(variants))
  const reservedSet = new Set(reserved.map((r) => r.toLowerCase()))

  function normalize(query: string | undefined): string {
    return (query ?? "").toLowerCase().trim()
  }

  return {
    name,
    variants,
    reserved,
    fallback,

    lookup(query) {
      const n = normalize(query)
      if (!n) return fallback
      if (variants[n]) return variants[n]
      if (reservedSet.has(n)) {
        console.warn(
          `[theme:${name}] '${n}' is reserved for a future phase; falling back to '${Object.keys(variants)[0] ?? "fallback"}'`,
        )
      } else if (!variantKeys.has(n)) {
        console.warn(
          `[theme:${name}] unknown variant '${n}'; falling back to '${Object.keys(variants)[0] ?? "fallback"}'`,
        )
      }
      return fallback
    },

    list() {
      return Object.keys(variants)
    },

    listReserved() {
      return [...reserved]
    },

    listAll() {
      return [...Object.keys(variants), ...reserved]
    },

    isReserved(query) {
      return reservedSet.has(normalize(query))
    },

    has(query) {
      return variantKeys.has(normalize(query))
    },
  }
}