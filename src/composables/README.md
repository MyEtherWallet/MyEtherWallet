# Composables

This directory contains composition functions shared by multiple feature modules.
Feature-specific composition functions belong under
`src/modules/<feature>/composables/` instead.

## Placement

- Put a composable in `src/composables/` when it is used across feature modules
  and its API is not coupled to one module's domain.
- Put a feature-specific composable in
  `src/modules/<feature>/composables/`.
- Put shared pure functions in `src/utils/`.
- Put pure functions, constants, and configuration used by one feature in
  `src/modules/<feature>/common/`.
- Do not place a file in a `composables/` directory merely because a composable
  calls it. Production files in these directories must export at least one
  composition function.

## Naming and state ownership

- Name composition functions `use[Feature]` and their files after the exported
  function, for example `useMaxAmount.ts`.
- A composable owns the reactive state it mutates and returns that state to its
  caller. It never writes to a ref declared by its caller.
- Shared cross-component state belongs in a Pinia store, not in module-level
  `ref()`, `reactive()`, or `shallowRef()` declarations.
- Local state may be created inside a composable invocation when each consumer
  should receive an independent instance.

## Current inventory

| Location | Composition functions | Open placement issues |
| --- | --- | --- |
| `src/composables/` | `useAccountBalances`, `useAccountSwitch`, `useAddAccount`, `useAddressInput`, `useAppBreakpoints`, `useAppTabs`, `useAssetDescription`, `useBlockedContent`, `useCurrency`, `useDetectedAddress`, `useEmailSubscription`, `useFetchMewApi`, `useFetchMewWalletApi`, `useFetchWatchlist`, `useFormPristine`, `useImageContrastTextColor`, `useInFocusInput`, `useMaxAmount`, `useNumericInput`, `usePaginate`, `usePortfolio24hChange`, `useQR`, `useRefreshBalances`, `useWalletFlowRoute`, `useWalletList` | None. The pure-helper files moved out, and both module-level-state offenders are gone: `useSwap` became `stores/swapStore.ts`, `useTradingRestriction` was absorbed into `stores/globalStore.ts`. |
| `modules/access/composables/` | `useConnectWallet` | None. |
| `modules/global_search/composables/` | `useGlobalSearch` | None. State and fetching moved to `stores/globalSearchStore.ts`; what remains is the router-dependent half. |
| `modules/perps/composables/` | `useCursorPaginate`, `usePerpsActive`, `usePerpsAuth`, `usePerpsBalance`, `usePerpsContracts`, `usePerpsDepositsWithdrawals`, `usePerpsFills`, `usePerpsMarkPrices`, `usePerpsMarkets`, `usePerpsOrders`, `usePerpsPortfolioGraph`, `usePerpsPortfolioSummary`, `usePerpsPositions`, `usePerpsRestriction`, `usePerpsStatus`, `usePerpsToasts`, `usePerpsTradeForm` | `usePerpsAuth` still holds ~16 module-level reactive declarations (token/session, plus the shared balance and portfolio-summary caches), and `usePerpsTradeForm` holds the `leverage` singleton. `usePerpsWsLifecycle.ts` still exports no `use*` function. |
| `modules/purchase/composables/` | `usePurchaseAmount`, `usePurchaseCompatibility`, `useQuoteCountdown`, `useTextScaler` | None. |
| `modules/swap/composables/` | `useSwapAnalytics`, `useSwapExecution`, `useSwapForm`, `useSwapGasFee`, `useSwapModule`, `useSwapQuote`, `useSwapTokens`, `useSwapValidation` | None. |
| `modules/trade/composables/` | `useMarketStatus`, `useTrade`, `useTradeExecution`, `useTradeForm`, `useTradeModule`, `useTradeQuote`, `useTradeTokens`, `useTradeValidation` | None. The five pure helpers moved to `modules/trade/common/`. |

## State ownership status

Where shared state that used to sit in module-level `ref()`s now lives. In every
case the `use*` function was kept as a thin adapter, so call sites did not
change:

| Was | Now | Notes |
| --- | --- | --- |
| `useSwap` | `stores/swapStore.ts` | |
| `useTradingRestriction` | `stores/globalStore.ts` | Two sources of truth with opposite defaults collapsed into one that fails closed. |
| `useGlobalSearch` | `stores/globalSearchStore.ts` | Also stops two `useFetchMewApi()` instances being constructed at import time. |
| `usePerpsStatus` | `stores/perpsStatusStore.ts` | The refcounted poll stays in the composable — it is per-consumer, keyed on `onScopeDispose`. |
| `usePerpsMarkets` | `stores/perpsMarketsStore.ts` | |
| `usePerpsContracts` | `stores/perpsContractsStore.ts` | Split from markets so a markets-only consumer does not also fetch contracts: a store is created on first use, and that is what makes the activation lazy. |
| `usePerpsMarkPrices` | `stores/perpsMarkPricesStore.ts` | Split for the same reason. |
| `usePerpsPositions` | `stores/perpsPositionsStore.ts` | |
| `usePerpsPortfolioGraph` | `stores/perpsPortfolioStore.ts` | Named for the portfolio so `usePerpsAuth`'s balance and summary caches have a home when it is migrated. |

Two things stay in the composable when the rest of a migration moves: anything
needing a caller's setup context (`useRouter()`, and `ensurePerpsWsLifecycle()`,
which reaches for `useRoute()`), and anything genuinely per-consumer.

Store setup is the once-per-app scope these files were emulating with
`effectScope(true)` plus an `initialized` flag, so those pairs were deleted
rather than moved. `onPerpsAuthReset` registrations were *not* folded into token
watchers: that callback exists so auth teardown wipes caches synchronously,
without depending on watcher flush timing.

Remaining: `usePerpsAuth` and the `usePerpsTradeForm` leverage singleton.

## Phase 0 audit notes (historical)

Recorded on `feat/v7-develop` at `2fccbe3569`, before the Swap and Trade
reorganization. Kept as a record of that audit — several items below have since
been addressed:

- The identified pure helper files have no Vue reactivity and are not
  composables. The two module-specific composables are outside their expected
  directories, and the Trade barrel exports five of the six Trade composables.
- `useTradeTokens` returns `getDefaultFromToken`, which no caller consumes, and
  `isSellingTradableAsset`, which is only needed internally.
- Token-list balance and price hydration is implemented in `useSwap`,
  `ModuleSwap.vue`, and `useTradeTokens`. The implementations are similar but
  not identical: the shared Swap path freezes results, and the destination-token
  path hydrates only when source and destination networks match.
- Swap and Trade repeat the same development-console/production-Sentry reporting
  structure. The nested development branch in `useTradeQuote` is unreachable.
- Swap, Trade, and Send duplicate pristine-form state and dirty detection. Their
  watched fields differ, so the implementations have the same intent rather
  than an identical watcher signature.
- Swap and Trade define the same wallet-address-or-donation-address computed
  value.
- `useSwap` has singleton-like shared state, detached watchers, and in-flight
  initialization bookkeeping and should be a Pinia store. It currently has
  eight module-level refs, not seven. There are four runtime `useSwap()` callers;
  additional files import only its token types.
- Trading restriction still has two sources of truth with opposite defaults.
  The global-store source is now fetched from `App.vue` as well as Trade and
  other consumers, so it is no longer true that users must visit Trade first.
  The cold-load bug remains a race: `useSwap` initializes before the app's
  mounted restriction fetch and does not reactively re-filter destination lists
  when the global restriction value changes.
- `ModuleSwap.vue` is 1,703 lines with a 1,442-line script block;
  `ModuleTrade.vue` is 1,005 lines with a 622-line script block.
- The Trade composable option bags currently contain 12 fields for
  `useTradeQuote`, 10 for `useTradeValidation`, 8 for `useTradeTokens`, and 8 for
  `useTradeExecution`, rather than 11/9/8/7. They accept and mutate caller-owned
  refs including `toAmount`, `generalError`, and `isLoadingQuote`.
- `useMarketStatus` already returns `isTradingSessionOpen`, but still accepts an
  `onMarketOpen` callback used only to reload tradable assets.
- Both `useTradeQuote` and `useTradeExecution` declare `wallet: Ref<any>`.
- Trade's percentage implementation still reserves a hard-coded `0.005` native
  token for a 100% amount, while Swap and Send use the fee-aware `useMaxAmount`.
- The broader claim that only two composables contain module-level reactive state
  is not accurate. `useGlobalSearch` and multiple out-of-scope Perps composables
  do as well. This task addresses the Swap and trading-restriction instances and
  leaves Perps for its dedicated follow-up.
- `usePerpsTradeForm.ts` is 1,854 lines. `usePaginate` has eight consumers and is
  offset-based; `useCursorPaginate` is Perps-only and cursor-based. They remain
  intentionally separate.
