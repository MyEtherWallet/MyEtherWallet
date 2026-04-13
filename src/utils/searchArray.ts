/**
 * @param array - Array of objects to search
 * @param keys - The key or keys of the object to search by (supports nested keys like 'a.b')
 * @param searchTerm - The term to search for in the specified keys
 * @description Fuzzy search with typo tolerance. Results sorted by relevance:
 * 1. Prefix matches (startsWith)
 * 2. Contains matches (includes)
 * 3. Fuzzy matches (within edit distance threshold)
 */
export const fuzzySearchByKeys = <T>(
  array: T[],
  keys: string | string[],
  searchTerm: string,
): T[] => {
  const searchLC = searchTerm.trim().toLowerCase()
  if (!searchLC) return array
  const keyArray = Array.isArray(keys) ? keys : [keys]

  const prefixMatches: T[] = []
  const containsMatches: T[] = []
  const fuzzyMatches: Array<{ item: T; score: number }> = []
  const seen = new Set<T>()

  const maxDist = searchLC.length <= 3 ? 1 : 2

  array.forEach(item => {
    let bestCategory = 3 // 0=prefix, 1=contains, 2=fuzzy, 3=no match
    let bestScore = Infinity

    keyArray.forEach(key => {
      const value = getNestedValue(item, key)
      if (value === null || value === undefined) return
      const valLC = String(value).toLowerCase()

      if (valLC.startsWith(searchLC)) {
        bestCategory = Math.min(bestCategory, 0)
      } else if (valLC.includes(searchLC)) {
        bestCategory = Math.min(bestCategory, 1)
      } else {
        const candidates = [
          valLC,
          ...valLC.split(/[\s._-]+/).filter(Boolean),
        ]
        const dist = Math.min(
          ...candidates.map(candidate =>
            levenshtein(searchLC, candidate.slice(0, searchLC.length + 2)),
          ),
        )
        if (dist <= maxDist) {
          bestCategory = Math.min(bestCategory, 2)
          bestScore = Math.min(bestScore, dist)
        }
      }
    })

    if (bestCategory < 3 && !seen.has(item)) {
      seen.add(item)
      if (bestCategory === 0) prefixMatches.push(item)
      else if (bestCategory === 1) containsMatches.push(item)
      else fuzzyMatches.push({ item, score: bestScore })
    }
  })

  fuzzyMatches.sort((a, b) => a.score - b.score)
  return [
    ...prefixMatches,
    ...containsMatches,
    ...fuzzyMatches.map(m => m.item),
  ]
}

const getNestedValue = (obj: unknown, path: string): unknown => {
  return path.split('.').reduce((acc: unknown, key: string) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

const levenshtein = (a: string, b: string): number => {
  const m = a.length
  const n = b.length
  const dp: number[] = Array.from({ length: n + 1 }, (_, i) => i)

  for (let i = 1; i <= m; i++) {
    let prev = i - 1
    dp[0] = i
    for (let j = 1; j <= n; j++) {
      const temp = dp[j]
      dp[j] =
        a[i - 1] === b[j - 1]
          ? prev
          : 1 + Math.min(prev, dp[j], dp[j - 1])
      prev = temp
    }
  }
  return dp[n]
}

/**
 *
 * @param array - Array of objects to search
 * @param keys - The key or keys of the object to search by
 * @param searchTerm - The term to search for in the specified keys
 * @description This function searches an array of objects by specified keys and returns an array of unique objects that match the search term.
 * It performs a case-insensitive search and checks if the value starts with or contains the search term.
 * It can handle both single key and multiple keys for searching.
 * Order of the array returned is search begins with, then contains.
 * @returns
 */
export const searchArrayByKeysStr = <T>(
  array: T[],
  keys: keyof T | Array<keyof T>,
  searchTerm: string,
): T[] => {
  const searchLC = searchTerm.toLowerCase()
  const uniqueBegins = new Set<T>()
  const uniqueContains = new Set<T>()
  const keyArray = Array.isArray(keys) ? keys : [keys] // Handle single key or array of keys
  // create array of keys to search with lowerecase
  const arrayLC: Array<Record<string, string>> = array.map(item => {
    const newItem: Record<string, string> = {}
    keyArray.forEach(key => {
      if (item[key]) {
        newItem[key as string] = String(item[key]).toLowerCase()
      }
    })
    return newItem
  })

  //Begins with search
  arrayLC.forEach((item, index) => {
    keyArray.forEach(key => {
      if (item[key as string]) {
        if (item[key as string].startsWith(searchLC)) {
          uniqueBegins.add(array[index])
        } else if (item[key as string].includes(searchLC)) {
          uniqueContains.add(array[index])
        }
      }
    })
  })
  const unique = new Set<T>([...uniqueBegins, ...uniqueContains])
  // Convert Set to Array and return
  return [...unique]
}
