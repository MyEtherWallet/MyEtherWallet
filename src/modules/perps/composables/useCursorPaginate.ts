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

  async function fetchPage(cursor: string | undefined): Promise<boolean> {
    loading.value = true
    try {
      const res = await fetcher({ limit: pageSize, cursor })
      items.value = res.result ?? []
      nextCursor.value = res.pageInfo?.nextCursor
      return true
    } catch {
      return false
    } finally {
      loading.value = false
    }
  }

  async function refetch() {
    const ok = await fetchPage(undefined)
    if (ok) {
      cursorStack.value = [undefined]
      currentPage.value = 0
    }
  }

  async function nextPage() {
    if (!nextCursor.value) return
    const targetCursor = nextCursor.value
    const ok = await fetchPage(targetCursor)
    if (ok) {
      cursorStack.value.push(targetCursor)
      currentPage.value += 1
    }
  }

  async function prevPage() {
    if (currentPage.value === 0) return
    const candidateStack = cursorStack.value.slice(0, -1)
    const cursor = candidateStack[candidateStack.length - 1]
    const ok = await fetchPage(cursor)
    if (ok) {
      cursorStack.value = candidateStack
      currentPage.value -= 1
    }
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
