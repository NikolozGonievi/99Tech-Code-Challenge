# Problem 3 – WalletPage Refactor

## Changes vs. Original Code

### `WalletBalance` Interface
- **Added** `blockchain: string` field — it was referenced throughout the sorting and filtering logic but was missing from the type definition, causing implicit `any` access on a non-existent property.

### `FormattedWalletBalance` Interface
- **Changed** to `extend WalletBalance` instead of duplicating its fields, keeping the type definitions DRY.

### `Props` Type
- **Simplified** the empty `Props` interface (which added nothing beyond `BoxProps`) to a type alias: `type Props = BoxProps`.

### `WalletPage` Component

#### Props destructuring
- **Removed** `children` from the destructured props — it was declared but never used.

#### `getPriority` function
- **Changed** the parameter type from `any` to `string`, restoring type safety.

#### `sortedBalances` — `useMemo`
- **Fixed** undefined variable: the filter was referencing `lhsPriority` (never declared) instead of the locally computed `balancePriority`.
- **Fixed** inverted filter logic: the original kept balances with `amount <= 0`. Corrected to `amount > 0` so only positive balances are shown.
- **Fixed** incomplete sort comparator: when both priorities are equal the comparator fell through with an implicit `undefined` return. Added `return 0` for the equal case.
- **Removed** `prices` from the dependency array — it was not used inside this memo and caused unnecessary recomputations on price updates.

#### `formattedBalances`
- **Wrapped in `useMemo`** — the original computed it on every render with a plain `.map()`, causing redundant work whenever unrelated state changed.

#### `rows`
- **Fixed** source array: the original mapped over `sortedBalances` (no `formatted` field) while passing `balance.formatted` to `WalletRow`, so the prop was always `undefined`. Changed to map over `formattedBalances`.
- **Wrapped in `useMemo`** with `[formattedBalances, prices]` as dependencies to avoid recomputing the JSX on unrelated renders.
- **Replaced `index` key** with `${balance.blockchain}-${balance.currency}` — using array index as `key` on a sorted list causes React to produce incorrect diffs when order changes.

### Return
- **Simplified** the JSX return from a multi-line wrapper to a single line `<div {...rest}>{rows}</div>` — no functional change.
