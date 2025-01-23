async function copyValue(value: string): Promise<void> {
  await navigator.clipboard.writeText(value)
}

export default copyValue
