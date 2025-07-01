import Configs from '@/configs'
const isDevMode = import.meta.env.DEV

export const fetchWithRetry = async <T>(
  url: RequestInfo,
  options?: RequestInit,
  retries: number = 3,
  delay: number = 1000,
): Promise<T> => {
  try {
    const _url = `${Configs.MEW_API_URL}${url}` // Ensure the URL is prefixed with the base URL

    const fetchOptions: RequestInit = {
      mode: 'cors' as RequestMode,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
    const mergedOptions = { ...fetchOptions, ...options }

    const response = await fetch(_url, mergedOptions)
    // Check for retryable status codes ( 5xx errors)
    if (!response.ok && response.status >= 500 && retries > 0) {
      if (isDevMode) {
        console.error(
          `Fetch failed for ${url}. responce : ${response}. Retrying... Attempts left: ${retries}`,
        )
      }

      await new Promise(resolve => setTimeout(resolve, delay))
      return fetchWithRetry(url, options, retries - 1, delay * 2) // Exponential backoff
    }

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Fetch failed')
    }

    return (await response.json()) as T // Assuming JSON response
  } catch (error) {
    if (isDevMode) {
      console.error(`No retrys left ${url}:`, error)
    }
    throw error // No retries left, re-throw the error
  }
}
