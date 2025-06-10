import { ref, type Ref, unref } from 'vue'
import {
  createFetch,
  useTimeoutFn,
  useTimeoutPoll,
  type EventHookOn,
} from '@vueuse/core'
import Configs from '@/configs'
export type FetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
const isDevMode = import.meta.env.DEV

export const useFetchMewApi = <T>(
  _url: Ref<string> | string,
  _method: FetchMethod = 'GET',
  _body: object | null = null,
  _opts: {
    _immediate?: boolean,
    _poll?: number,
    _noRetry?: boolean,
  } = {
      _immediate: true,
      _poll: 0,
      _noRetry: false,
    }
): {
  data: Ref<T | null>
  isLoading: Ref<boolean>
  isActivePolling: Ref<boolean>
  resumePoll: () => void
  pausePoll: () => void
  execute: () => Promise<void>
  retryCount: Ref<number>
  delay: Ref<number>
  retryIsPending: Ref<boolean>
  startRetry: () => void
  stopRetry: () => void
  useMEWFetch: ReturnType<typeof createFetch>
  onFetchResponse: EventHookOn<Response>
} => {
  const fillOptions = Object.assign({}, {
    _immediate: true,
    _poll: 0,
    _noRetry: false,
  }, _opts)
  const retryCount = ref(0)
  const isLoading = ref(false)
  const data: Ref<T | null> = ref(null)

  /**
   * @description
   * 1. Handles errors and retries the request if the orignal request fails.
   * 3. Uses a timeout to retry the request after a specified delay.
   * 4. The number of retries is limited to 3.
   */
  const delay = ref(1000)
  const {
    isPending: retryIsPending,
    start: startRetry,
    stop: stopRetry,
  } = useTimeoutFn(
    () => {
      if (isDevMode) {
        console.log('Retrying Fetch: ', unref(_url))
      }
      retryCount.value++
      delay.value = delay.value + 1000
      execute()
    },
    delay.value,
    { immediate: false },
  )

  const fetchOptions: RequestInit = {
    mode: 'cors' as RequestMode,
    method: _method,
    body: _body ? JSON.stringify(_body) : null,
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
      afterFetch(ctx) {
        data.value = ctx.data as T
        isLoading.value = false
        if ((fillOptions._poll ?? 0) > 0 && !isActivePolling.value) {
          resumePoll()
        }
        delay.value = 1000
        return ctx.data
      },
      onFetchError: e => {
        console.log(e)
        if (isDevMode) {
          console.error(e)
        }
        if (fillOptions._noRetry) return e
        if (isActivePolling.value) {
          pausePoll()
        }
        if (retryIsPending.value) {
          stopRetry()
        }
        if (retryCount.value < 3) {
          startRetry()
        } else {
          console.error('Failed to fetch after retrying 3 times')
        }
        return e
      },
    },
    fetchOptions,
  })

  const { execute, onFetchResponse } = useMEWFetch(_url, {
    immediate: fillOptions._immediate,
    refetch: true, //  Will trigger another request on url change
  }).json()

  const {
    isActive: isActivePolling,
    resume: resumePoll,
    pause: pausePoll,
  } = useTimeoutPoll(execute, fillOptions._poll ?? 0, {
    immediate: false,
  })

  return {
    data,
    isLoading,
    isActivePolling,
    resumePoll,
    pausePoll,
    execute,
    retryCount,
    delay,
    retryIsPending,
    startRetry,
    stopRetry,
    useMEWFetch,
    onFetchResponse,
  }
}
