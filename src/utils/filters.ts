export const truncate = (value: string, length: number): string => {
  if (!value) return ''
  value = value.toString()
  return value.length > length ? value.substring(0, length) + '...' : value
}

export const truncateAddress = (
  value: string,
  startLength: number = 6,
  endLenght: number = 4,
): string => {
  if (!value) return ''
  const start = value.substring(0, startLength)
  const end = value.substring(value.length - endLenght, value.length)
  return `${start}...${end}`
}
