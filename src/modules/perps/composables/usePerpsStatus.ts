import { getCurrentScope, onScopeDispose } from 'vue'
import { storeToRefs } from 'pinia'
import { usePerpsStatusStore } from '@/stores/perpsStatusStore'

/**
 * Pings `/status` once, outside any consumer bookkeeping. Kept as a standalone
 * export so callers that only want to refresh the verdict — and the spec — don't
 * have to reach for the store.
 */
export async function fetchPerpsStatus(): Promise<number | null> {
  return usePerpsStatusStore().fetchStatus()
}

/**
 * Availability of the perps service. The state itself lives in
 * `perpsStatusStore`; this adds the per-consumer half the store deliberately
 * does not own.
 *
 * When called from a component (or any active effect scope) the status is
 * refreshed on entry and kept warm on a timer that runs only while at least one
 * consumer is mounted — leaving the perps page stops the polling. Called outside
 * a scope it does a single fetch and never polls.
 */
export function usePerpsStatus() {
  const store = usePerpsStatusStore()
  const { statusCode, isServiceUnavailable, isLoadingStatus } =
    storeToRefs(store)

  if (getCurrentScope()) {
    store.acquire()
    onScopeDispose(() => store.release())
  } else if (statusCode.value === null) {
    void store.fetchStatus()
  }

  return {
    statusCode,
    isServiceUnavailable,
    isLoadingStatus,
    refetch: store.fetchStatus,
  }
}
