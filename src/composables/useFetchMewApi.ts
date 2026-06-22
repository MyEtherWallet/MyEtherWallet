import { ref, type Ref } from 'vue'
import { createFetch, useTimeoutPoll } from '@vueuse/core'
import Configs from '@/configs'
import { captureException } from '@sentry/vue'

export type FetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
const isDevMode = import.meta.env.DEV

export interface FetchMewAPIResponse {
  isActivePolling: Ref<boolean>
  resumePoll: () => void
  pausePoll: () => void
  retryCount: Ref<number>
  useMEWFetch: ReturnType<typeof createFetch>
}
export const useFetchMewApi = (
  _poll: number = 0,
  _hasRetry: boolean = true,
): FetchMewAPIResponse => {
  const retryCount = ref(0)
  const url = ref('')
  const delay = ref(1000)

  type ExecuteFunction = (throwOnFailed?: boolean) => Promise<any>
  const execute = ref<ExecuteFunction | null>(null)

  const fetchOptions: RequestInit = {
    mode: 'cors' as RequestMode,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }

  /**
   * @description
   * 1. Handles errors and retries the request if the orignal request fails.
   * 2. Uses a timeout to retry the request after a specified delay.
   * 3. The number of retries is limited to 3.
   * 4. The delay is increased by 1 second for each retry.
   * 5. The delay is reset to 1 second after a successful request.
   */
  const useMEWFetch = createFetch({
    baseUrl: Configs.MEW_API_URL,
    options: {
      beforeFetch: ctx => {
        url.value = ctx.url
      },
      afterFetch(ctx) {
        execute.value = ctx.execute as ExecuteFunction
        if (_poll > 0 && !isActivePolling.value) {
          resumePoll()
        }
        delay.value = 1000
        retryCount.value = 0
        return ctx
      },
      updateDataOnError: true,
      onFetchError: async ctx => {
        const { data, error, execute, response } = ctx
        if (isDevMode) {
          console.error('Fetch Error: ', data, error)
        }
        // `ctx.error` from useFetch is an Error/DOMException object (name
        // "AbortError"), not a string, when a request is aborted (refetch on
        // input change, navigation, unmount, timeout). The old `typeof string`
        // guard never matched, so aborts were needlessly retried 3x and then
        // reported to Sentry as noise. Detect the abort from structured signals
        // (name / known cancel code) rather than a loose message substring,
        // which could swallow genuine errors that merely contain "abort".
        const isAbortError =
          (error instanceof DOMException && error.name === 'AbortError') ||
          (error instanceof Error &&
            ((error as Error & { code?: string }).name === 'AbortError' ||
              (error as Error & { code?: string }).code === 'ERR_CANCELED')) ||
          (typeof error === 'string' && error.includes('AbortError'))
        if (isAbortError) {
          delete ctx.error
          return ctx
        }
        if (isActivePolling.value) {
          pausePoll()
        }
        // If the request fails,  retry the request
        const isNetworkError = !response
        const isServerError = response?.status && response.status >= 500
        if (_hasRetry && retryCount.value < 3 && (isNetworkError || isServerError)) {
          retryCount.value++
          // wait for delay
          await new Promise(resolve => setTimeout(resolve, delay.value))
          delay.value = delay.value + 1000

          // useFetch's execute() resolves to fetchResponse | null, not the
          // { error, data } ctx shape @vueuse destructures from the
          // onFetchError return value. Returning it caused a null destructure
          // crash when the retry chain also failed. Trigger the retry and
          // return ctx so the caller always sees a valid object.
          await execute()
          return ctx
        } else {
          if (isDevMode) {
            console.error('Failed to fetch. URL: ', url.value)
          }
          if (!isDevMode) {
            captureException(ctx.error)
          }
          ctx.error = data?.message || 'Unknown Error. Failed to fetch.'
          retryCount.value = 0
          delay.value = 1000
          return ctx
        }
      },
    },
    fetchOptions,
  })

  const {
    isActive: isActivePolling,
    resume: resumePoll,
    pause: pausePoll,
  } = useTimeoutPoll(
    () => {
      if (isDevMode) {
        console.log('Polling: ', url.value)
      }

      if (execute.value !== null) {
        execute.value(true)
      }
    },
    _poll,
    {
      immediate: false,
    },
  )

  return {
    isActivePolling,
    resumePoll,
    pausePoll,
    retryCount,
    useMEWFetch,
  }
}
