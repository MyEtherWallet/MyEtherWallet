import { captureException } from '@sentry/vue'
import Configs from '@/configs'
import { perpsTags, type PerpsFeature } from '@/sentry/constants'
import { isUserRejectionError } from '@/utils/walletUtils'
import { PerpsHttpError, PerpsServiceUnavailableError } from './sdk/client'

const isDevMode = Configs.IS_DEV_MODE

/**
 * Errors that are already handled elsewhere and are pure noise in Sentry:
 *  - user rejections (EIP-1193 4001 / "rejected"/"denied"/…) — the user chose
 *    to cancel; nothing is broken.
 *  - `PerpsServiceUnavailableError` — the outage is already surfaced by the
 *    status banner, and gating it stops one report per gated endpoint.
 *  - 401s — the re-auth path (`onUnauthorized`) already reacts to these.
 */
export const isPerpsNoise = (e: unknown): boolean => {
  if (isUserRejectionError(e)) return true
  if (e instanceof PerpsServiceUnavailableError) return true
  if (e instanceof PerpsHttpError && e.status === 401) return true
  return false
}

interface CapturePerpsOptions {
  /** Short human-readable title shown at the top of the Sentry extra block. */
  title: string
  /** Extra context — ids, amounts (as strings), http status. Never PII/secrets. */
  extra?: Record<string, unknown>
}

/**
 * Single entry point for reporting a perps failure to Sentry. Tags it with
 * `module:perps` + `feature:<feature>`, gates out known-noise errors, and in dev
 * logs to the console instead — so the ~30 perps call sites don't each repeat
 * the dev-branch and noise-gate boilerplate.
 */
export const capturePerps = (
  feature: PerpsFeature,
  e: unknown,
  { title, extra }: CapturePerpsOptions,
): void => {
  if (isPerpsNoise(e)) return
  if (isDevMode) {
    console.error(`[perps:${feature}] ${title}`, e)
    return
  }
  captureException(e, {
    ...perpsTags(feature),
    extra: {
      title,
      errorMessage:
        (e instanceof Error ? e.message : String(e ?? '')) || 'Unknown error',
      ...extra,
    },
  })
}
