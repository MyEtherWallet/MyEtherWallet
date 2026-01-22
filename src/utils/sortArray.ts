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
  return [...array].sort((a, b) => {
    const valueA = Number(a[key])
    const valueB = Number(b[key])

    const isANaN = isNaN(valueA)
    const isBNaN = isNaN(valueB)

    if (isANaN && isBNaN) return 0
    if (isANaN) return 1
    if (isBNaN) return -1

    if (order === 'asc') {
      return valueA - valueB
    } else {
      return valueB - valueA
    }
  })
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

    if (order === 'desc') {
      return valueA.localeCompare(valueB)
    } else {
      return valueB.localeCompare(valueA)
    }
  })
}
