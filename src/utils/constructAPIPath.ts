import configs from '@/configs'

const getAPIPath = (path: string) => {
  return `${configs.MEW_API_URL}${path}`
}

export { getAPIPath }
