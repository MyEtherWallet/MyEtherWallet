/**
 * Sorts an array of objects by a specified key.
 * @param array - Array of objects to sort by Number
 * @param key - The key of the object to sort by
 * @param order - The order to sort by, either 'asc' for ascending or 'desc' for descending
 * @returns  sorted array of objects
 */
export const sortObjectArrayNumber = <T>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc',
): T[] => {
  const clone = [...array] // Clone the array to avoid mutating the original
  let flagHasUndefined: boolean = false

  const sorted = clone.sort((a, b) => {
    const valueA = Number(a[key])
    const valueB = Number(b[key])

    if (isNaN(valueA) || isNaN(valueB)) {
      flagHasUndefined = true
      return 0 // If either value is not a number, do not change their order
    }

    if (order === 'desc') {
      return valueA - valueB
    } else {
      return valueB - valueA
    }
  })
  if (flagHasUndefined) {
    const defined = sorted.filter(item => !isNaN(Number(item[key])))
    const undefined = sorted.filter(item => isNaN(Number(item[key])))
    return [...defined, ...undefined]
  }
  return sorted
}

/**
 *
 * @param array - Array of objects to sort by String A-z or Z-a
 * @param key - The key of the object to sort by
 * @param order - The order to sort by, either 'asc' (Z-a) for ascending or 'desc' (A-z) for descending
 * @returns  sorted array of objects
 */
export const sortObjectArrayString = <T>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc',
): T[] => {
  const clone = [...array] // Clone the array to avoid mutating the original array
  return clone.sort((a, b) => {
    const valueA = String(a[key]).toLowerCase()
    const valueB = String(b[key]).toLowerCase()

    if (order === 'asc') {
      return valueA.localeCompare(valueB)
    } else {
      return valueB.localeCompare(valueA)
    }
  })
}
