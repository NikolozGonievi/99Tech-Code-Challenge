# Currency Swap

A token swap interface built with React. Users pick two currencies, enter an amount, and see the converted value update in real time before confirming the swap.

Live prices are fetched from an external API. The app deduplicates and caches them, calculates exchange rates on the fly, and simulates executing the swap with a short network delay.

---

## Getting started

```bash
npm install
npm run dev       # dev server at http://localhost:3000
npm run build     # production build
npm test          # unit tests
```

---

## Project structure

```
src/
├── atoms/          # Smallest UI pieces (AmountInput, SubmitButton, TokenIcon, ...)
├── molecules/      # Composed atoms (CurrencyAutocomplete)
├── organisms/      # Full feature sections (SwapCurrenciesForm, Header, Footer)
├── pages/          # Page layouts (SwapCurrenciesPage)
├── api/            # Data fetching and mutations
├── constants/      # Labels, error messages, URLs — nothing magic in the UI
└── theme/          # MUI theme (colors, border-radius, dark/light)
```

The folder naming follows **Atomic Design** — atoms are dumb and reusable, organisms own logic, pages own layout.

---

## How it works

### Fetching prices

Prices come from `https://interview.switcheo.com/prices.json`. The API returns multiple entries per currency (different dates), so the data needs a cleanup step before it's useful.

`useGetPrices` uses **TanStack Query's** `select` option to run this cleanup once per fetch, not on every render:

```ts
select: (data) => {
  // keep only the most recent entry per currency, then sort A→Z
  const seen = new Map<string, TokenPrice>();
  for (const item of data) {
    const existing = seen.get(item.currency);
    if (!existing || new Date(item.date) > new Date(existing.date)) {
      seen.set(item.currency, item);
    }
  }
  return [...seen.values()].sort((a, b) => a.currency.localeCompare(b.currency));
}
```

The result is cached for 60 seconds (configured in `main.tsx`) so navigating around doesn't spam the API.

### Form state

The form is managed by **Formik**. It tracks three fields: `fromCurrency`, `toCurrency`, and `fromAmount`. The `toAmount` is never stored in form state — it's derived on every render from the three real fields plus the price map:

```ts
const toAmount =
  fromAmount && fromPrice && toPrice
    ? ((Number(fromAmount) * fromPrice) / toPrice).toFixed(6)
    : "";
```

This means there's no sync issue between input and output — the output is always correct by construction.

### Validation

**Yup** schema is built inside a `buildValidationSchema(priceMap)` factory so the schema always has access to the latest fetched prices. It's wrapped in `useMemo` so it only rebuilds when the price map changes, not on every keystroke.

Rules:
- `fromCurrency` — required, must be a token the API returned a price for
- `toCurrency` — required, must be a supported token, must differ from `fromCurrency`
- `fromAmount` — required, must be a number, must be > 0, must be ≤ 1,000,000,000

The "is it a real number" check is done as a custom Yup test rather than relying on Yup's built-in `.number()` because the field is typed as a string in the form (to allow partial input like `"0."` without the field snapping).

### Executing the swap

`useSwapCurrencies` wraps the swap function in a **TanStack Query mutation**. The swap function itself is simulated — it waits 1–3 seconds then logs the payload. In a real app you'd replace the body with an API call and the rest of the form/notification logic stays the same.

After a successful swap, **notistack** fires a snackbar with the swap summary, and Formik's `resetForm()` clears everything so the user can start fresh.

### Token icons

Icons are pulled from a public GitHub repository (`Switcheo/token-icons`). The `TokenIcon` component requests the SVG by symbol name and falls back to an MUI `Avatar` showing the first two letters of the symbol if the image 404s. This means unknown tokens still look presentable.

### Theme

The app respects the OS dark/light preference via `useMediaQuery("(prefers-color-scheme: dark)")` and passes the result to MUI's `ThemeProvider`. The custom theme (`src/theme/theme.ts`) defines the purple accent color, background shades for each mode, and component-level overrides (border radius, button styles, etc.).

---

## Libraries used

| Library | Why |
|---|---|
| **React 19** | UI framework |
| **Vite** | Dev server and bundler — fast HMR, no config overhead |
| **TypeScript** | Type safety across the whole codebase |
| **MUI (Material UI) v9** | Component library — handles layout, inputs, dark mode theming |
| **Formik** | Form state, touched tracking, and submission lifecycle |
| **Yup** | Declarative validation schema with custom test support |
| **TanStack Query v5** | Server state — caching, deduplication, loading/error states |
| **Axios** | HTTP client for the prices API |
| **notistack** | Stackable snackbar notifications |
| **Jest + ts-jest** | Unit testing for the validation schema |

---

## Testing

The test suite covers the Yup validation schema in isolation (`validation.test.ts`). It doesn't mount any React component — just calls `buildValidationSchema(priceMap).validate(values)` directly, which makes the tests fast and deterministic.

```bash
npm test              # run once
npm run test:watch    # watch mode
npm run test:coverage # coverage report
```
