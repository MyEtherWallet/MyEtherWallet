# MyEtherWallet v7 — Agent Onboarding Guide

## Quick Facts

- **Framework:** Vue 3.5 + TypeScript + Vite 7
- **State:** Pinia (Composition API stores)
- **Styling:** Tailwind CSS 4 with custom MEW theme
- **Package manager:** pnpm (Node >= v22.11.0, pnpm >= 10.28.2)
- **Testing:** Vitest (unit), Nightwatch (E2E)
- **Dev server:** `pnpm dev` → https://localhost:8080

---

## CRITICAL: Reusable Components First

**Before creating any new component, check `/src/components/` first.**

The project has a curated set of `App*` primitives. Duplicating them wastes effort and creates inconsistency. See the full inventory below.

---

## Project Structure

```
src/
├── components/       # ← SHARED UI COMPONENTS — check here before creating new ones
├── modules/          # Feature modules (access, swap, send, trade, portfolio, ...)
├── stores/           # Pinia stores (28 files)
├── router/           # Vue Router 4
├── providers/        # Wallet implementations (Ethereum, Bitcoin, Hardware)
├── composables/      # Shared composition functions
├── mew_api/          # API client & generated OpenAPI types
├── analytics/        # Amplitude events & tracking
├── i18n/             # 17 locales
├── directives/       # Custom Vue directives (v-ripple)
├── utils/            # Utility functions
├── views/            # Page-level route components
├── types/            # Global TypeScript types
├── assets/           # Images, fonts, styles
├── configs.ts        # App configuration constants
└── providers.ts      # Provider injection keys
```

### Path Aliases (vite.config.ts + tsconfig.app.json)

| Alias           | Resolves to          | Notes                       |
| --------------- | -------------------- | --------------------------- |
| `@`             | `src/`               | Universal fallback          |
| `@components`   | `src/components/`    | Prefer over `@/components/` |
| `@assets`       | `src/assets/`        | Prefer over `@/assets/`     |
| `@view-default` | `src/views/default/` |                             |
| `@view-wallet`  | `src/views/wallet/`  |                             |

> `@modules` exists in vite.config.ts but is **not** in tsconfig, so avoid it — use `@/` for module imports.

---

## Reusable Components Inventory (`/src/components/`)

### Buttons

| Component             | Purpose                                                    |
| --------------------- | ---------------------------------------------------------- |
| `AppBaseButton.vue`   | Primary button — use as the base for all clickable actions |
| `AppBtnText.vue`      | Text-only button (no background)                           |
| `AppBtnIcon.vue`      | Icon-only button                                           |
| `AppBtnIconClose.vue` | Close/dismiss icon button                                  |
| `AppBtnGroup.vue`     | Container to group related buttons                         |
| `AppBtnCopy.vue`      | Button that copies text to clipboard                       |

### Inputs & Forms

| Component                | Purpose                                     |
| ------------------------ | ------------------------------------------- |
| `AppInput.vue`           | Base text input                             |
| `AppTextField.vue`       | Extended text field with label/error slots  |
| `AppSearchInput.vue`     | Input with search icon                      |
| `AppSelect.vue`          | Dropdown select                             |
| `AppTokenSelect.vue`     | Token-aware dropdown (shows logos, symbols) |
| `AppToggle.vue`          | Toggle switch (boolean)                     |
| `AppEnterAmount.vue`     | Amount input with token/fiat context        |
| `AppSwapEnterAmount.vue` | Swap-specific amount input                  |

### Modals & Overlays

| Component             | Purpose                         |
| --------------------- | ------------------------------- |
| `AppDialog.vue`       | Full modal dialog with backdrop |
| `AppSheet.vue`        | Bottom sheet / side panel       |
| `AppViewAsDialog.vue` | View-as / impersonation dialog  |
| `AppPopUpMenu.vue`    | Contextual popup menu           |
| `AppTooltip.vue`      | Hover tooltip                   |

### Token & Wallet Display

| Component                  | Purpose                             |
| -------------------------- | ----------------------------------- |
| `AppTokenLogo.vue`         | Token icon with fallback            |
| `AppTokenSymbol.vue`       | Formatted token symbol text         |
| `AppBlockie.vue`           | Ethereum address blockie avatar     |
| `AppWalletCard.vue`        | Wallet summary card                 |
| `AppAssetInfoHeader.vue`   | Asset detail header (price, change) |
| `AppSwapSelectedToken.vue` | Selected token chip for swap UI     |

### Transaction Utilities

| Component            | Purpose               |
| -------------------- | --------------------- |
| `AppSelectTxFee.vue` | Gas/fee tier selector |

### Feedback & Status

| Component                   | Purpose                               |
| --------------------------- | ------------------------------------- |
| `AppNoChainBalance.vue`     | Empty state when chain has no balance |
| `AppNotRecommended.vue`     | Warning banner for risky actions      |
| `AppNeedHelp.vue`           | Help/support call-to-action           |
| `AppMewWalletBanner.vue`    | MEW wallet promotional banner         |
| `AppSubscribeToUpdates.vue` | Newsletter/update subscription        |

### Multi-Step Flows

| Component                | Purpose                     |
| ------------------------ | --------------------------- |
| `AppStepper.vue`         | Step progress indicator     |
| `AppStepDescription.vue` | Description text for a step |

### Data Visualization

| Component            | Purpose                     |
| -------------------- | --------------------------- |
| `ChartPrice.vue`     | Price line chart (Chart.js) |
| `TableSparkline.vue` | Inline sparkline for tables |

### Share

| Component            | Purpose                         |
| -------------------- | ------------------------------- |
| `AppShareButton.vue` | Native share / copy link button |

### Subfolders

**`address_book/`**

- `AddressBookDialog.vue` — full address book modal
- `AddressBookItem.vue` — single address row
- `AddAddress.vue` — add new address form
- `AddressInput.vue` — address field with ENS resolution

**`app_slide_group/`**

- `AppSlideGroup.vue` — horizontal scroll container
- `AppSlideItem.vue` — individual slide card

**`core_layouts/`** (shell components — not reused in features)

- `TheAppLayout.vue`, `TheHeader.vue`, `TheAppSideMenu.vue`
- `LayoutWallet.vue`, `MenuListItem.vue`
- `WelcomeDialog.vue`, `TheGdprBanner.vue`
- `TheNotificationsPopup.vue`, `TheSettingsPopup.vue`
- `wallet/` → `TheAddressMenu.vue`, `TheCurrentNetwork.vue`, `TheDepositDialog.vue`, `ThePaperWallet.vue`

**`select_chain/`**

- `SelectChainBtn.vue`, `SelectChainDialog.vue`, `SelectChainForApp.vue`

**`tabs/`**

- `AppTabs.vue` — tabbed interface
- `AppTabsSimple.vue` — simplified tabs without panels

**`transitions/`**

- `ExpandTransition.vue` — height expand/collapse animation

---

## Naming Conventions

| Thing                  | Convention                              | Example                             |
| ---------------------- | --------------------------------------- | ----------------------------------- |
| Reusable components    | `App[Name].vue`                         | `AppButton.vue`                     |
| Layout shells          | `The[Name].vue`                         | `TheHeader.vue`                     |
| Module entry points    | `Module[Feature].vue`                   | `ModuleAccessWallet.vue`            |
| Feature sub-components | `[Name].vue`                            | `DerivationPath.vue`                |
| TypeScript files       | camelCase                               | `walletStore.ts`                    |
| Folders                | snake_case                              | `core_layouts/`, `app_slide_group/` |
| Stores                 | `use[Feature]Store` hook                | `useWalletStore`                    |
| Composables            | `use[Feature]`                          | `useFetchMewApi`                    |
| Route names            | exported constants from `routeNames.ts` | `ROUTES.SWAP`                       |

---

## Module Structure

Each feature lives in `src/modules/[feature]/`:

```
modules/send/
├── ModuleSend.vue           # Entry point — rendered from App.vue or a view
├── components/              # Module-specific sub-components
├── composables/             # Module-specific composables
├── types/                   # Local TypeScript types
└── common/                  # Shared helpers, configs within the module
```

**15 feature modules:**
`access`, `create`, `crypto`, `home`, `nft`, `notifications`, `portfolio`, `rewards`, `send`, `stocks`, `swap`, `toast`, `trade`, `buy`, `sell`

Modules are conditionally mounted in `App.vue`. Many render as dialogs (e.g., `ModuleAccessWallet`) controlled by store flags.

---

## State Management (Pinia)

All stores use the Composition API (Setup Store) pattern:

```typescript
// src/stores/walletStore.ts
export const useWalletStore = defineStore('wallet', () => {
  const wallet = ref<WalletInterface | null>(null)
  const tokens = ref<Token[]>([])

  function setWallet(w: WalletInterface) {
    wallet.value = w
  }

  return { wallet, tokens, setWallet }
})
```

**Consuming a store:**

```typescript
import { storeToRefs } from 'pinia'
import { useWalletStore } from '@/stores/walletStore'

const walletStore = useWalletStore()
const { wallet, tokens } = storeToRefs(walletStore) // reactive refs
const { setWallet } = walletStore // actions (no storeToRefs needed)
```

### Key Stores

| Store               | File                | Purpose                            |
| ------------------- | ------------------- | ---------------------------------- |
| `useWalletStore`    | `walletStore.ts`    | Active wallet, balances, tokens    |
| `useChainsStore`    | `chainsStore.ts`    | Available networks, selected chain |
| `useProviderStore`  | `providerStore.ts`  | Web3 provider config               |
| `useAccessStore`    | `accessStore.ts`    | Wallet connection/auth state       |
| `useDialogStore`    | `dialogStore.ts`    | Modal open/close flags             |
| `useToastStore`     | `toastStore.ts`     | Toast notification queue           |
| `useAddressBook`    | `addressBook.ts`    | Saved address entries              |
| `useAnalyticsStore` | `analyticsStore.ts` | Analytics consent & state          |

---

## Component Pattern (Standard)

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useWalletStore } from '@/stores/walletStore'
import AppBaseButton from '@components/AppBaseButton.vue'

const props = defineProps<{
  label: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  submit: [value: string]
}>()

const walletStore = useWalletStore()
const { wallet } = storeToRefs(walletStore)

const localState = ref('')
const computed = computed(() => wallet.value?.address ?? '')
</script>

<template>
  <div>
    <AppBaseButton
      :disabled="props.disabled"
      @click="emit('submit', localState)"
    >
      {{ props.label }}
    </AppBaseButton>
  </div>
</template>
```

---

## API & Data Fetching

### MEW API

```typescript
import { useFetchMewApi } from '@/composables/useFetchMewApi'

// Returns typed response using generated OpenAPI schema
const { data, error, isFetching } = useFetchMewApi('/v1/chains/with-prices')
  .get()
  .json<ChainsRaw>()
```

Types are auto-generated in `src/mew_api/schema.ts` (OpenAPI → TypeScript).
Regenerate with: `pnpm update-api-schema`

### TanStack Query (for complex async data)

```typescript
import { useQuery } from '@tanstack/vue-query'

const { data, isLoading } = useQuery({
  queryKey: ['tokens', address],
  queryFn: () => fetchTokenBalances(address),
})
```

---

## Wallet Provider Architecture

```
src/providers/
├── ethereum/
│   ├── baseEvmWallet.ts      # Base class for all EVM wallets
│   ├── wagmiWallet.ts        # WalletConnect / RainbowKit
│   └── mnemonicToWallet.ts   # Mnemonic → wallet
├── bitcoin/
│   ├── baseBitcoinWallet.ts  # Base class for BTC wallets
│   └── mnemonicToBitcoinWallet.ts
├── hw/                       # Hardware wallet transports (Ledger USB/BLE)
└── common/
    ├── walletInterface.ts    # Base WalletInterface contract
    ├── nameResolver.ts       # ENS / name resolution
    └── watchOnlyWallet.ts    # Watch-only address
```

All wallets implement `WalletInterface` from `common/walletInterface.ts`.

---

## Routing

```typescript
// src/router/routeNames.ts — always use named routes
import { ROUTES } from '@/router/routeNames'
router.push({ name: ROUTES.SWAP })
```

Route files: `routesDefault.ts`, `routesAccess.ts`, `routesCreate.ts`, `routeTokenInfo.ts`, `routeStockInfo.ts`

Auth guard in `router/index.ts`: unauthenticated users are redirected to `/`.

---

## Internationalization

All user-facing strings must use `vue-i18n`:

```vue
<template>
  <p>{{ $t('common.send') }}</p>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const msg = t('common.confirm')
</script>
```

Translation files are in `src/i18n/` (17 locales). English is the source of truth in `en_US.json`.

---

## Analytics

Track user actions using the Amplitude integration:

```typescript
import { useAnalytics } from '@/analytics'
import { EventCategories } from '@/analytics/events'

const { trackEvent } = useAnalytics()
trackEvent(EventCategories.SWAP_INITIATED, { token: 'ETH', amount: '1.0' })
```

Never log wallet addresses or private keys in analytics events.

---

## Custom Directives

`v-ripple` — registered globally, adds Material-style ripple on click:

```vue
<button v-ripple>Click me</button>
```

---

## BigNumber for Arithmetic

Never use native JS math for token amounts (floating point precision loss):

```typescript
import BigNumber from 'bignumber.js'

const amount = new BigNumber('1.5').multipliedBy('1e18') // wei
const display = amount.dividedBy('1e18').toFixed(4)
```

---

## Development Commands

```bash
pnpm dev            # Start dev server (https://localhost:8080)
pnpm build          # Type-check + build production bundle
pnpm type-check     # vue-tsc type validation only
pnpm lint           # ESLint with auto-fix
pnpm format         # Prettier formatting
pnpm test:unit      # Vitest unit tests
pnpm test:e2e       # Nightwatch E2E tests
```

---

## Git & Branch Conventions

Branch naming (from CONTRIBUTING.md): `type/description`

- `feat/v7-my-feature`
- `fix/v7-MEW-1234-bug-description`
- `refactor/v7-cleanup-swap`

Commits follow Conventional Commits (enforced by commitlint):

- `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`

---

## Key Third-Party Libraries

| Library                            | Use                                                          |
| ---------------------------------- | ------------------------------------------------------------ |
| `viem`                             | Modern Ethereum client (prefer over `web3-eth` for new code) |
| `bignumber.js`                     | All token/financial arithmetic that is user facing           |
| `@tanstack/vue-query`              | Async data fetching with caching                             |
| `@enkryptcom/swap`                 | Swap aggregation (1inch, Uniswap)                            |
| `wagmi` + `@rainbow-me/rainbowkit` | WalletConnect integration                                    |
| `heroicons/vue`                    | Icon set                                                     |
| `vue-chartjs` + `chart.js`         | Charts                                                       |
| `qrcode.vue`                       | QR code display                                              |
| `anime.js`                         | UI animations                                                |
| `bip39`                            | Mnemonic generation/validation                               |

---

## Common Pitfalls

1. **Do not create a new `App*.vue` component** if one already exists — check the table above.
2. **Do not use `vuex`** — the project uses Pinia exclusively.
3. **Do not use `<Options API>`** — all components use `<script setup>` Composition API.
4. **Do not use `this.$store`** — import and call the store hook directly.
5. **Do not hardcode chain IDs** — get them from `useChainsStore`.
6. **Do not use native number/float math** for token values — use `BigNumber`.
7. **Always use named routes** from `routeNames.ts`, not raw path strings.
8. **Always translate** user-facing strings with `$t()` / `t()`.
9. **Always destructure objects** whenever possible, especially when importing stores.
10. **Always use** native JS BN when creating calculations. Bignumber.js for numbers that are user facing.
