export default (urlString: string) => {

  let url
  try {
    url = new URL(urlString)
  } catch {
    return false
  }
  return url.protocol === 'http:' || url.protocol === 'https:'
}