import { ref, computed, type Ref } from 'vue'
import type { PaginatedResponse } from '../sdk/types'

export function useCursorPaginate<T>(
  fetcher: (opts: {
    limit: number
    cursor?: string
  }) => Promise<PaginatedResponse<T>>,
  pageSize: number,
) {
  const items = ref<T[]>([]) as Ref<T[]>
  const loading = ref(false)
  const currentPage = ref(0)
  const cursorStack = ref<(string | undefined)[]>([undefined])
  const nextCursor = ref<string | undefined>(undefined)

  async function fetchPage(cursor: string | undefined) {
    loading.value = true
    try {
      const res = await fetcher({ limit: pageSize, cursor })
      items.value = res.result ?? []
      nextCursor.value = res.pageInfo?.nextCursor
    } catch {
      items.value = []
      nextCursor.value = undefined
    } finally {
      loading.value = false
    }
  }

  async function refetch() {
    cursorStack.value = [undefined]
    currentPage.value = 0
    await fetchPage(undefined)
  }

  async function nextPage() {
    if (!nextCursor.value) return
    cursorStack.value.push(nextCursor.value)
    currentPage.value += 1
    await fetchPage(nextCursor.value)
  }

  async function prevPage() {
    if (currentPage.value === 0) return
    cursorStack.value.pop()
    currentPage.value -= 1
    const cursor = cursorStack.value[cursorStack.value.length - 1]
    await fetchPage(cursor)
  }

  function reset() {
    items.value = []
    cursorStack.value = [undefined]
    currentPage.value = 0
    nextCursor.value = undefined
  }

  const hasNext = computed(() => !!nextCursor.value)
  const hasPrev = computed(() => currentPage.value > 0)

  return {
    items,
    loading,
    currentPage,
    hasNext,
    hasPrev,
    nextPage,
    prevPage,
    refetch,
    reset,
  }
}
