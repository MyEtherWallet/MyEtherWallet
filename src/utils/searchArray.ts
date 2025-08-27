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
