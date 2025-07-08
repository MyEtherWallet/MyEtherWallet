import { ref, type Ref } from 'vue'
import { createFetch, useTimeoutPoll } from '@vueuse/core'
import Configs from '@/configs'
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        return ctx
      },
      updateDataOnError: true,
      onFetchError: async ({ data, error, execute, response }) => {
        if (isDevMode) {
          console.log('Fetch Error: ', data, error)
        }
        if (isActivePolling.value) {
          pausePoll()
        }
        // If the request fails,  retry the request
        if (
          _hasRetry &&
          retryCount.value < 3 &&
          response?.status &&
          response?.status >= 500
        ) {
          retryCount.value++
          await new Promise(resolve => setTimeout(resolve, delay.value))
          delay.value = delay.value + 1000

          return execute()
        } else {
          //TODO: change to send this to sentry instead of console
          if (isDevMode) {
            console.error('Failed to fetch. URL: ', url.value)
          }
          // ctx.data = null
          error.value = data.message || 'Unkown Error.Failed to fetch.'

          return error
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
