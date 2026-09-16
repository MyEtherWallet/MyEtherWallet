import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

const developmentOnlyFiles = [
  'src/App.vue',
  'src/components/AppNeedHelp.vue',
  'src/components/AppWalletCard.vue',
  'src/composables/useFetchMewApi.ts',
  'src/composables/useFetchMewWalletApi.ts',
  'src/composables/useRefreshBalances.ts',
  'src/mew_api/fetchWithRetry.ts',
  'src/modules/access/components/wallets_lists/BtnWallet.vue',
  'src/modules/notifications/ModuleNotifications.vue',
]

describe('development-only build gating', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('hides development-only UI in a staging-mode production build', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('MODE', 'staging')
    const { default: AppNeedHelp } = await import(
      '@/components/AppNeedHelp.vue'
    )

    const wrapper = mount(AppNeedHelp, {
      props: { title: 'Help', helpLink: 'https://example.test/help' },
    })

    expect(wrapper.find('a').exists()).toBe(false)
  })

  it('does not infer a development build from a non-production mode name', () => {
    for (const file of developmentOnlyFiles) {
      const source = readFileSync(resolve(file), 'utf8')

      expect(source, file).not.toContain("import.meta.env.MODE !== 'production'")
      expect(source, file).toContain("process.env.NODE_ENV !== 'production'")
    }
  })
})
