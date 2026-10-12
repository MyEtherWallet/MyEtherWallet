import { describe, it, expect, vi, afterEach } from 'vitest'

// `BUILD_MODE` is resolved at module load, so each case re-imports the module
// with a fresh env.
const loadBuildMode = async () => {
  vi.resetModules()
  const { default: configs } = await import('@/configs')
  return configs.BUILD_MODE
}

describe('configs BUILD_MODE', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('defaults to dev when VITE_BUILD_MODE is unset', async () => {
    vi.stubEnv('VITE_BUILD_MODE', '')
    expect(await loadBuildMode()).toBe('dev')
  })

  it('uses a valid VITE_BUILD_MODE override', async () => {
    vi.stubEnv('VITE_BUILD_MODE', 'production')
    expect(await loadBuildMode()).toBe('production')
  })

  it('rejects an unknown VITE_BUILD_MODE instead of silently running as dev', async () => {
    vi.stubEnv('VITE_BUILD_MODE', 'prod')
    await expect(loadBuildMode()).rejects.toThrow(
      'Invalid VITE_BUILD_MODE "prod": expected one of production, dev',
    )
  })
})
