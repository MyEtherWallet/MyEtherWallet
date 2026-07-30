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

The inventory below describes the code before the Swap and Trade composable
reorganization. It is a migration map, not an endorsement of every current
location.

| Location | Composition functions | Placement issues found by the audit |
| --- | --- | --- |
| `src/composables/` | `useAddressInput`, `useAppBreakpoints`, `useAppTabs`, `useCurrency`, `useEmailSubscription`, `useFetchMewApi`, `useFetchWatchlist`, `useImageContrastTextColor`, `useInFocusInput`, `useMaxAmount`, `useNumericInput`, `usePaginate`, `useQR`, `useSwap`, `useTradingRestriction`, `useWalletList` | `mewApiFetchError.ts` and `swapInitError.ts` contain only pure helpers. `useSwap` and `useTradingRestriction` contain module-level reactive state. |
| `modules/access/composables/` | `useConnectWallet` | None found. |
| `modules/global_search/composables/` | `useGlobalSearch` | Contains module-level shared reactive state and should eventually be audited for Pinia ownership. |
| `modules/perps/composables/` | `useCursorPaginate`, `usePerpsActive`, `usePerpsAuth`, `usePerpsBalance`, `usePerpsContracts`, `usePerpsDepositsWithdrawals`, `usePerpsFills`, `usePerpsMarkPrices`, `usePerpsMarkets`, `usePerpsOrders`, `usePerpsPortfolioGraph`, `usePerpsPortfolioSummary`, `usePerpsPositions`, `usePerpsToasts`, `usePerpsTradeForm` | Perps is explicitly outside this reorganization. `usePerpsWsLifecycle.ts` does not export a `use*` function, and several Perps files contain module-level reactive state; handle those in a separate audit. |
| `modules/purchase/composables/` | `usePurchaseAmount`, `usePurchaseCompatibility`, `useTextScaler` | None found. |
| `modules/trade/composables/` | `useMarketStatus`, `useTradeExecution`, `useTradeQuote`, `useTradeTokens`, `useTradeValidation` | Five pure-helper files are misplaced: `announcementSchedule.ts`, `expectedTradeError.ts`, `marketSession.ts`, `tradeSession.ts`, and `transientRpcError.ts`. The barrel omits `useTrade`. |
| Outside a `composables/` directory | `modules/trade/useTrade.ts`, `modules/rwa_rewards/useCountdown.ts` | Both are module-specific composables and should move into their module's `composables/` directory. |
| `modules/swap/` | None local | Swap behavior is concentrated in `ModuleSwap.vue` and the shared `useSwap` singleton-like composable. |

## Phase 0 audit notes

Verified on `feat/v7-develop` at `2fccbe3569` before beginning the
reorganization:

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
