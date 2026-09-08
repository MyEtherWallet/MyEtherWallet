import { computed, ref, type Ref, unref, watch } from 'vue'

// Use for local arrays with offset/page-number pagination.
export const usePaginate = <T>(
  arrayToPaginate: Ref<T[]> | T[],
  perPage: number | Ref<number>,
) => {
  const currentPage = ref(0)

  const totalPages = computed(() => {
    const paginate = unref(arrayToPaginate)
    const _perPage = unref(perPage)
    const calculated = Math.ceil(paginate.length / _perPage)
    return calculated === 0 ? 1 : calculated
  })
  const paginatedArray = computed<T[]>(() => {
    const _perPage = unref(perPage)
    const start = currentPage.value * _perPage
    const paginate = unref(arrayToPaginate)
    return paginate.slice(start, start + _perPage)
  })

  const nextPage = () => {
    const _perPage = unref(perPage)
    if ((currentPage.value + 1) * _perPage < unref(arrayToPaginate).length) {
      currentPage.value += 1
    }
  }

  const prevPage = () => {
    if (currentPage.value > 0) {
      currentPage.value -= 1
    }
  }
  watch(
    () => totalPages.value,
    () => {
      if (currentPage.value >= totalPages.value && currentPage.value > 0) {
        currentPage.value = 0
      }
    },
  )

  return {
    currentPage,
    paginatedArray,
    totalPages,
    nextPage,
    prevPage,
  }
}
