import { captureException } from '@sentry/vue'
import Configs from '@/configs'

interface ModuleErrorTag {
  tags: {
    module: string
  }
}

interface ReportModuleErrorOptions {
  tag: ModuleErrorTag
  title: string
  error: unknown
  expected?: boolean
  extra?: Record<string, unknown>
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) return error.message
  if (typeof error === 'string' && error) return error
  if (error && typeof error === 'object') {
    const candidate = error as { message?: unknown; details?: unknown }
    if (typeof candidate.message === 'string' && candidate.message) {
      return candidate.message
    }
    if (typeof candidate.details === 'string' && candidate.details) {
      return candidate.details
    }
  }
  return 'Unknown error'
}

export function reportModuleError({
  tag,
  title,
  error,
  expected = false,
  extra = {},
}: ReportModuleErrorOptions): void {
  if (Configs.IS_DEV_MODE) {
    console.error(title, error)
    return
  }
  if (expected) return

  captureException(error, {
    ...tag,
    extra: {
      title,
      errorMessage: getErrorMessage(error),
      ...extra,
    },
  })
}
