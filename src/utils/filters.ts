export const truncate = (value: string, length: number): string => {
  if (!value) return '';
  value = value.toString();
  return value.length > length ? value.substring(0, length) + '...' : value;
}
