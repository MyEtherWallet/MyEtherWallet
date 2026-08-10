import { ref, watch, effectScope } from 'vue'
import { BUILDER_CODE, perpsClient } from '../configs'
import { useWalletStore } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'
import type { PerpsBalance, PortfolioSummary } from '../sdk/types'
import { usePerpsToasts } from '@/modules/perps/composables/usePerpsToasts'
import { decrypt, encrypt } from '@/utils/crypto'
import { WalletType } from '@/providers/types'
import { perpsWs } from '../sdk/ws'
import { ensurePerpsWsLifecycle } from './usePerpsWsLifecycle'
import {
  usePerpsRestriction,
  resolvePerpsRestricted,
} from './usePerpsRestriction'
import { analytics, PerpsSignInEvent, PerpsEventSource } from '@/analytics'
import { isUserRejectionError } from '@/utils/walletUtils'

const STORAGE_KEY_TOKEN = 'perps_auth_token'
const STORAGE_KEY_ACCOUNT = 'perps_auth_account'
// Absolute Unix-second expiry per stored token, index-aligned with the token
// array above, so a switch to a wallet whose token has expired falls through to
// a fresh signed login instead of silently restoring a dead token.
const STORAGE_KEY_EXPIRATION = 'perps_auth_expiration'
// Treat a token as expired slightly before its real deadline so it can't lapse
// mid-request right after we restore it.
const TOKEN_EXPIRY_BUFFER_SECS = 60

function getStoredArray<T = string>(key: string): T[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) ?? '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// Missing/malformed expiry → not-expired: pre-existing sessions stored before
// expiry tracking keep working, and the server's 401 → onUnauthorized path still
// catches a genuinely dead legacy token. Only a known, elapsed expiry blocks a
// silent restore.
function isTokenExpired(expirationSecs: unknown): boolean {
  if (typeof expirationSecs !== 'number' || !Number.isFinite(expirationSecs) || expirationSecs <= 0) {
    return false
  }
  return Date.now() / 1000 >= expirationSecs - TOKEN_EXPIRY_BUFFER_SECS
}

const token = ref<string | null>(null)
const accountId = ref<string | null>(null)
const isAuthenticating = ref(false)
const isRestoringAuth = ref(false)
const authError = ref<string | null>(null)
const refreshKey = ref(0)
const showSigningPrompt = ref(false)
const signingMessage = ref<string | null>(null)
const isHardwareWalletSigning = ref(false)
const isWaitingForConfirm = ref(false)

// Post-transaction poll. After a deposit/withdrawal the on-chain broadcast and
// backend settlement are asynchronous, so a single refresh isn't enough — the
// balance/history won't reflect the pending transfer yet. We bump refreshKey on
// an interval for a bounded window so every data composable (balance, deposits,
// withdrawals, fills, summary) re-fetches until the transfer settles, even if
// the WS push is missed. Kicking it off again restarts the window.
const POST_TX_POLL_INTERVAL_MS = 20_000 // 20s
const POST_TX_POLL_DURATION_MS = 120_000 // 2 min
let _postTxPollTimer: ReturnType<typeof setInterval> | null = null
let _postTxPollStop: ReturnType<typeof setTimeout> | null = null

let _authRestored = false
let _currentAddress: string | null = null
// Bumped on every wallet switch (and by clearAuth) to fence in-flight restores.
// `tryRestoreAuth` awaits the region check and one or two decrypts, and the
// wallet can change under any of them; a run whose generation is no longer the
// current one has been superseded and must not touch auth or client state.
let _restoreGeneration = 0
let _resolveSign: (() => void) | null = null
let _rejectSign: ((reason?: unknown) => void) | null = null

function _waitForSignConfirmation(): Promise<void> {
  return new Promise((resolve, reject) => {
    _resolveSign = resolve
    _rejectSign = reject
  })
}
let _walletWatcherRegistered = false
// Detached scope so the walletAddress watcher survives the unmount of whichever
// component first called usePerpsAuth(). Without it the watcher is owned by that
// component's setup scope and Vue disposes it on unmount (route / side-panel
// change) — after which the `_walletWatcherRegistered` guard permanently blocks
// re-registration, so a later address switch A→B never resets the token and the
// UI keeps serving account A's positions/balance/history.
const _walletWatcherScope = effectScope(true)

// Data composables (positions, balance, summary, portfolio graph) register a
// callback here so auth teardown — sign-out AND account switch — can wipe their
// singleton caches synchronously and directly, instead of depending on a
// per-composable `watch(token)` being alive at that moment. Showing a previous
// account's balances/positions is a correctness/trust bug, so the reset must not
// hinge on watcher liveness or on the WS pushing a fresh snapshot.
const _dataResetHandlers = new Set<() => void>()
export function onPerpsAuthReset(fn: () => void): () => void {
  _dataResetHandlers.add(fn)
  return () => {
    _dataResetHandlers.delete(fn)
  }
}
function resetPerpsData() {
  for (const fn of _dataResetHandlers) {
    try {
      fn()
    } catch {
      // a failing reset handler must not block the others
    }
  }
}

async function tryRestoreAuth(address: string, generation: number) {
  // A restore started for address A must be abandoned the moment the wallet
  // switches to B: resuming would install A's token while B is connected, so
  // the user is silently signed into the previous account and every data
  // composable serves A's balance/positions. `isStale()` is checked after every
  // await, before any state is mutated.
  const isStale = () => generation !== _restoreGeneration

  // Perps is hard-blocked in restricted regions: a token stored before the user
  // travelled (or before the flag flipped) must not silently sign them back in,
  // otherwise the signed-in portfolio renders where the blocked state belongs.
  //
  // Awaits the resolved check rather than reading `isPerpsRestricted`, which
  // defaults to `true`. This runs from an `immediate: true` watcher at app boot,
  // so reading the unresolved ref would skip the restore for a legitimate user —
  // and since the watcher only re-fires on an address *change*, they would stay
  // signed out for the rest of the session.
  const restricted = await resolvePerpsRestricted()
  if (isStale()) return
  if (restricted) {
    _authRestored = false
    return
  }
  const storedTokens: string[] = getStoredArray(STORAGE_KEY_TOKEN)
  const storedAccounts: string[] = getStoredArray(STORAGE_KEY_ACCOUNT)
  const storedExpirations: number[] = getStoredArray<number>(STORAGE_KEY_EXPIRATION)
  for (let i = 0; i < storedTokens.length; i++) {
    let decryptedToken: string
    try {
      decryptedToken = await decrypt(storedTokens[i], address)
    } catch {
      if (isStale()) return
      _authRestored = false
      // token belongs to a different address, try next
      continue
    }
    if (isStale()) return
    // This entry belongs to `address`. Only restore it while it is still valid —
    // an expired token must fall through so the caller prompts for a fresh
    // signature rather than silently restoring a token the API would 401.
    if (isTokenExpired(storedExpirations[i])) {
      _authRestored = false
      break
    }
    // Decrypt the account id *before* installing anything, so the token, the
    // client, the socket and accountId all land in one synchronous block. Doing
    // it the other way round leaves half of A's session behind when the wallet
    // switches during this await.
    let decryptedAccount: string | null = null
    let accountFailed = false
    try {
      decryptedAccount = storedAccounts[i]
        ? await decrypt(storedAccounts[i], address)
        : null
    } catch {
      accountFailed = true
    }
    if (isStale()) return
    token.value = decryptedToken
    perpsClient.setToken(decryptedToken)
    perpsWs.login(decryptedToken)
    accountId.value = accountFailed ? null : decryptedAccount
    _authRestored = !accountFailed
    break
  }
}

async function clearAuth() {
  const store = useWalletStore()
  const { wallet } = storeToRefs(store)
  token.value = null
  accountId.value = null
  perpsClient.setToken(null)
  perpsWs.logout()
  resetPerpsData()
  // Cancel any in-flight post-transaction poll so it doesn't keep bumping
  // refreshKey (and refetching) for a signed-out / switched-away account.
  if (_postTxPollTimer) {
    clearInterval(_postTxPollTimer)
    _postTxPollTimer = null
  }
  if (_postTxPollStop) {
    clearTimeout(_postTxPollStop)
    _postTxPollStop = null
  }
  // Reset module-scope guards so a subsequent Sign In click is not silently
  // blocked by a stale auth-restored flag from a previous session.
  _authRestored = false
  _currentAddress = null
  // Fence any restore still in flight for the same reason a wallet switch does:
  // a sign-out (or a 401 via onUnauthorized) landing mid-restore must not be
  // undone by that restore reinstating the token we just cleared.
  _restoreGeneration++
  isAuthenticating.value = false

  if (!wallet.value) return;
  const storedTokens = getStoredArray(STORAGE_KEY_TOKEN)
  const storedAccId = getStoredArray(STORAGE_KEY_ACCOUNT)
  const storedExp = getStoredArray<number>(STORAGE_KEY_EXPIRATION)

  const address = await wallet.value!.getAddress();
  const results = await Promise.all(
    storedTokens.map(async (eToken: string, i: number) => {
      try {
        await decrypt(eToken, address)
        return null
      } catch {
        return {
          token: eToken,
          account: storedAccId[i] ?? null,
          exp: storedExp[i] ?? 0,
        }
      }
    }),
  )
  const kept = results.filter(Boolean) as {
    token: string
    account: string | null
    exp: number
  }[]

  localStorage.setItem(STORAGE_KEY_TOKEN, JSON.stringify(kept.map(e => e.token)))
  localStorage.setItem(STORAGE_KEY_ACCOUNT, JSON.stringify(kept.map(e => e.account)))
  localStorage.setItem(STORAGE_KEY_EXPIRATION, JSON.stringify(kept.map(e => e.exp)))
}

perpsClient.setOnUnauthorized(() => {
  clearAuth()
})
perpsWs.setOnUnauthorized(() => {
  clearAuth()
})

export function usePerpsAuth() {
  const store = useWalletStore()
  const { wallet, isWalletConnected, walletAddress } = storeToRefs(store)
  const { isPerpsRestricted } = usePerpsRestriction()

  // Register the walletAddress watcher exactly once for the lifetime of the
  // module, inside a detached effectScope so it outlives the caller component's
  // unmount (see `_walletWatcherScope` above). Re-registering after a sign-out
  // would race with `clearAuth()`'s localStorage filtering — the fresh
  // watcher's `immediate: true` fire would call `tryRestoreAuth` against the
  // unfiltered localStorage and re-hydrate the token we just cleared.
  if (!_walletWatcherRegistered) {
    _walletWatcherRegistered = true
    _walletWatcherScope.run(() => {
      watch(
        walletAddress,
        async address => {
          if (!address || address === _currentAddress) return
          _currentAddress = address
          // Claim this restore attempt. Anything still in flight for the
          // previous address is now stale and will bail out on its next check.
          const generation = ++_restoreGeneration
          // Flip synchronously — before the await — so a same-tick auto-login
          // watcher (ViewPerps) can see a restore is in flight and hold off on
          // prompting for a signature until we know whether the new wallet has a
          // valid stored token.
          isRestoringAuth.value = true
          token.value = null
          accountId.value = null
          perpsClient.setToken(null)
          perpsWs.logout()
          resetPerpsData()
          try {
            await tryRestoreAuth(address, generation)
          } finally {
            // Only the current attempt owns these. A superseded run finishing
            // late must not clear the in-flight flag out from under the newer
            // restore, nor bump refreshKey for a no-longer-connected account.
            if (generation === _restoreGeneration) isRestoringAuth.value = false
          }
          if (generation === _restoreGeneration && token.value) {
            refreshKey.value++
          }
        },
        { immediate: true },
      )
    })
  }

  async function login(source?: PerpsEventSource) {
    // Hard block: no challenge, no signature prompt, no token. Gated here rather
    // than at each call site so every entry point — banner CTA, ViewPerps
    // auto-login on wallet switch, market-list actions — is covered by one check.
    //
    // Reads the ref rather than awaiting `resolvePerpsRestricted()` on purpose:
    // the CTA's disabled state derives from the same ref, so the two can never
    // disagree, and keeping this synchronous preserves the atomicity of the
    // guard below (an `await` here would let two same-tick clicks both get past
    // `isAuthenticating` before it is set).
    if (isPerpsRestricted.value) return
    if (isRestoringAuth.value || _authRestored || isAuthenticating.value || isWaitingForConfirm.value) return
    if (!wallet.value || !isWalletConnected.value) {
      authError.value = 'Wallet not connected'
      return
    }
    analytics.trackPerpsSignInEvent(PerpsSignInEvent.CLICKED, { source })
    isAuthenticating.value = true
    authError.value = null
    let walletTypeStr: string | undefined
    try {
      const address = await wallet.value.getAddress()
      const challenge = await perpsClient.getLoginChallenge({
        walletAddress: address,
        chainId: '1',
      })
      const walletType = wallet.value.getWalletType()
      walletTypeStr = walletType
      const isInjected = walletType === WalletType.WAGMI || walletType === WalletType.INJECTED

      if (!isInjected) {
        isHardwareWalletSigning.value = walletType === WalletType.LEDGER || walletType === WalletType.TREZOR
        signingMessage.value = challenge.result.message
        isWaitingForConfirm.value = true
        showSigningPrompt.value = true
        isAuthenticating.value = false

        await _waitForSignConfirmation()

        isWaitingForConfirm.value = false
        isAuthenticating.value = true
      }

      const signature = await wallet.value.SignMessage({
        message: challenge.result.message,
      })
      const complete = await perpsClient.completeLoginChallenge({
        id: challenge.result.id,
        signature,
        builderCode: BUILDER_CODE
      })
      token.value = complete.result.token
      accountId.value = complete.result.accountId

      perpsClient.setToken(token.value)
      perpsWs.login(token.value)

      const storedTokens = getStoredArray(STORAGE_KEY_TOKEN)
      const storedAccId = getStoredArray(STORAGE_KEY_ACCOUNT)
      const storedExp = getStoredArray<number>(STORAGE_KEY_EXPIRATION)

      // Drop any existing entries for this address so re-login doesn't accumulate stale tokens.
      const filterResults = await Promise.all(
        storedTokens.map(async (eToken: string, i: number) => {
          try {
            await decrypt(eToken, address)
            return null
          } catch {
            return {
              token: eToken,
              account: storedAccId[i] ?? null,
              exp: storedExp[i] ?? 0,
            }
          }
        }),
      )
      const kept = filterResults.filter(Boolean) as {
        token: string
        account: string | null
        exp: number
      }[]

      const encryptedToken = await encrypt(token.value, address)
      const encryptedAcc = await encrypt(accountId.value, address)

      localStorage.setItem(STORAGE_KEY_TOKEN, JSON.stringify([...kept.map(e => e.token), encryptedToken]))
      localStorage.setItem(STORAGE_KEY_ACCOUNT, JSON.stringify([...kept.map(e => e.account), encryptedAcc]))
      localStorage.setItem(STORAGE_KEY_EXPIRATION, JSON.stringify([...kept.map(e => e.exp), complete.result.expirationSecs]))

      await perpsClient.acceptAgreement({
        termsVersion: 1,
        privacyVersion: 1,
      })
      analytics.trackPerpsSignInEvent(PerpsSignInEvent.SUCCESS, { source })
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Authentication failed'
      if (isUserRejectionError(e)) {
        analytics.trackPerpsSignInEvent(PerpsSignInEvent.CANCEL, { source })
      } else {
        authError.value = errorMessage
        analytics.trackPerpsSignInErrorEvent(PerpsSignInEvent.ERROR, {
          source,
          errorMessage,
          walletType: walletTypeStr,
        })
      }
    } finally {
      showSigningPrompt.value = false
      signingMessage.value = null
      isHardwareWalletSigning.value = false
      isWaitingForConfirm.value = false
      isAuthenticating.value = false
    }
  }

  function confirmSign() {
    _resolveSign?.()
    _resolveSign = null
    _rejectSign = null
  }

  function cancelSign() {
    _rejectSign?.(new Error('cancelled'))
    _resolveSign = null
    _rejectSign = null
  }

  function logout() {
    clearAuth()
  }

  function triggerRefresh() {
    refreshKey.value++
  }

  function stopPostTxPoll() {
    if (_postTxPollTimer) {
      clearInterval(_postTxPollTimer)
      _postTxPollTimer = null
    }
    if (_postTxPollStop) {
      clearTimeout(_postTxPollStop)
      _postTxPollStop = null
    }
  }

  // Refresh immediately, then keep polling every 20s for 2 minutes so a pending
  // deposit/withdrawal settles into the balance/history without the user having
  // to refresh manually. Restarts the window if called again mid-poll.
  function startPostTxPoll() {
    triggerRefresh()
    stopPostTxPoll()
    _postTxPollTimer = setInterval(() => {
      if (token.value) refreshKey.value++
    }, POST_TX_POLL_INTERVAL_MS)
    _postTxPollStop = setTimeout(stopPostTxPoll, POST_TX_POLL_DURATION_MS)
  }

  return {
    token,
    accountId,
    isAuthenticating,
    isRestoringAuth,
    authError,
    isWalletConnected,
    login,
    logout,
    refreshKey,
    triggerRefresh,
    startPostTxPoll,
    showSigningPrompt,
    signingMessage,
    isHardwareWalletSigning,
    isWaitingForConfirm,
    confirmSign,
    cancelSign,
  }
}

// Shared singleton state for balance polling
const _sharedBalance = ref<PerpsBalance | null>(null)
const _sharedBalanceLoading = ref(false)
let _balanceInitialized = false
let _sharedFetchBalance: (() => Promise<void>) | null = null

export function usePerpsBalance() {
  const { token, refreshKey } = usePerpsAuth()
  const balance = _sharedBalance
  const loading = _sharedBalanceLoading

  if (!_balanceInitialized) {
    _balanceInitialized = true
    ensurePerpsWsLifecycle()

    async function fetchBalance() {
      if (!token.value) {
        balance.value = null
        return
      }
      loading.value = true
      try {
        const res = await perpsClient.getPerpsBalance()
        balance.value = res.result
      } catch {
        balance.value = null
      } finally {
        loading.value = false
      }
    }

    _sharedFetchBalance = fetchBalance

    // Poll the balance while the user is connected. The WS `balancePerps` push
    // keeps it live during active use, but a periodic refetch guards against
    // dropped/missed WS frames so the balance never drifts stale for long.
    function poll() {
      if (token.value) {
        void fetchBalance()
      } else {
        balance.value = null
      }
    }

    onPerpsAuthReset(() => {
      balance.value = null
      loading.value = false
    })

    const perpsToasts = usePerpsToasts()
    // Detached scope so these singleton watchers survive the unmount of the
    // first component that calls usePerpsBalance() — otherwise they die on
    // route/panel change and, guarded by `_balanceInitialized`, never
    // re-register, so an account switch A→B stops clearing/refetching balance.
    effectScope(true).run(() => {
      watch(
        token,
        (now, prev) => {
          if (prev && !now) {
            balance.value = null
          }
          if (now) void fetchBalance()
        },
        { immediate: true },
      )

      watch(refreshKey, () => {
        if (token.value) void fetchBalance()
      })

      perpsWs.subscribe<PerpsBalance>('balancePerps', (rows) => {
        // Ignore pushes while signed out / mid wallet-switch: the socket can
        // still be authenticated as the previous account until logout/login
        // round-trips, and an in-flight frame would otherwise repopulate the
        // just-cleared balance with the old wallet's value.
        if (!token.value) return
        if (rows.length === 0) return
        balance.value = rows[0]
      })

      watch(
        () => _sharedBalance.value?.underLiquidation,
        (current, previous) => {
          if (current === true && previous === false) {
            perpsToasts.toastLiquidationInitiated()
          }
        },
        { immediate: false },
      )
    })

    setInterval(poll, 60_000) // refresh every 1 minute
  }

  return { balance, loading, refetch: _sharedFetchBalance! }
}

// Shared singleton state for portfolio summary
const _sharedSummary = ref<PortfolioSummary | null>(null)
const _sharedSummaryLoading = ref(false)
let _summaryInitialized = false
let _sharedFetchSummary: (() => Promise<void>) | null = null
const _summaryScope = effectScope(true)

export function usePerpsPortfolioSummary() {
  const { token, refreshKey } = usePerpsAuth()
  const summary = _sharedSummary
  const loading = _sharedSummaryLoading

  if (!_summaryInitialized) {
    _summaryInitialized = true

    async function fetchSummary() {
      if (!token.value) {
        summary.value = null
        return
      }
      loading.value = true
      try {
        const res = await perpsClient.getPortfolioSummary()
        summary.value = res.result
      } catch {
        summary.value = null
      } finally {
        loading.value = false
      }
    }

    function poll() {
      if (token.value) {
        fetchSummary()
      } else {
        summary.value = null
      }
    }

    onPerpsAuthReset(() => {
      summary.value = null
    })

    // Detached scope so the watchers outlive the first caller's unmount (see
    // usePerpsBalance above). Without a token watcher the summary only
    // refreshed on the 5-minute interval, so after an account switch A→B it
    // kept showing account A's summary until the next tick.
    _summaryScope.run(() => {
      watch(
        token,
        (now, prev) => {
          if (prev && !now) summary.value = null
          if (now) void fetchSummary()
        },
        { immediate: true },
      )

      watch(refreshKey, () => {
        if (token.value) void fetchSummary()
      })
    })

    setInterval(poll, 300_000) // refresh every 5 minutes

    _sharedFetchSummary = fetchSummary
  }

  return { summary, loading, refetch: _sharedFetchSummary! }
}
