const HARDENED_OFFSET = 0x80000000

// Matches what hdkey can derive: only the ' hardened marker (it reads "44h" as
// an unhardened 44) and indexes below 2^31 (it throws "Invalid index" above).
const checkCustomPath = (path: string): boolean => {
  const [root, ...segments] = path.trim().split('/')
  return (
    root === 'm' &&
    segments.length > 0 &&
    segments.every(
      segment =>
        /^\d+'?$/.test(segment) && parseInt(segment, 10) < HARDENED_OFFSET,
    )
  )
}

export { checkCustomPath }
