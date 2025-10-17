import { computed, ref, type Ref, unref } from 'vue'

export const usePaginate = <T>(
  arrayToPaginate: Ref<T[]> | T[],
  perPage: number,
) => {
  const currentPage = ref(0)

  const totalPages = computed(() => {
    const paginate = unref(arrayToPaginate)
    return Math.ceil(paginate.length / perPage)
  })
  const paginatedArray = computed<T[]>(() => {
    const start = currentPage.value * perPage
    const paginate = unref(arrayToPaginate)
    return paginate.slice(start, start + perPage)
  })

  const nextPage = () => {
    if ((currentPage.value + 1) * perPage < unref(arrayToPaginate).length) {
      currentPage.value += 1
    }
  }

  const prevPage = () => {
    if (currentPage.value > 0) {
      currentPage.value -= 1
    }
  }

  return {
    currentPage,
    paginatedArray,
    totalPages,
    nextPage,
    prevPage,
  }
}
