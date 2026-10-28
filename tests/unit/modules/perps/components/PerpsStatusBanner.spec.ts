import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, computed } from 'vue'
import { createI18n } from 'vue-i18n'
import enPerps from '@/i18n/locales/perps/en.json'
import enCommon from '@/i18n/locales/common/en.json'
import AppBanner from '@/components/banner/AppBanner.vue'

const statusCode = ref<number | null>(null)
const isPerpsRestricted = ref(false)

vi.mock('@/modules/perps/composables/usePerpsStatus', () => ({
  usePerpsStatus: () => ({
    statusCode,
    isServiceUnavailable: computed(
      () => statusCode.value !== null && statusCode.value >= 500,
    ),
    isLoadingStatus: ref(false),
    refetch: vi.fn(),
  }),
}))

vi.mock('@/modules/perps/composables/usePerpsRestriction', () => ({
  usePerpsRestriction: () => ({
    isPerpsRestricted,
    perpsHelpUrl: 'https://help.example.test/restrictions',
  }),
}))

// Real strings, so a renamed or missing key fails the test instead of silently
// rendering the key path.
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en: { ...enCommon, ...enPerps } },
})

const mountBanner = async () => {
  const PerpsStatusBanner = (
    await import('@/modules/perps/components/PerpsStatusBanner.vue')
  ).default
  return mount(PerpsStatusBanner, { global: { plugins: [i18n] } })
}

describe('PerpsStatusBanner', () => {
  beforeEach(() => {
    statusCode.value = null
    isPerpsRestricted.value = false
  })

  it('renders nothing before the first response', async () => {
    const banner = await mountBanner()
    expect(banner.findComponent(AppBanner).exists()).toBe(false)
  })

  it('renders nothing on 200', async () => {
    statusCode.value = 200
    const banner = await mountBanner()
    expect(banner.findComponent(AppBanner).exists()).toBe(false)
  })

  it('renders nothing on 429', async () => {
    statusCode.value = 429
    const banner = await mountBanner()
    expect(banner.findComponent(AppBanner).exists()).toBe(false)
  })

  it('announces the outage on 500', async () => {
    statusCode.value = 500
    const banner = await mountBanner()

    expect(banner.find('[role="alert"]').exists()).toBe(true)
    expect(banner.text()).toContain(enPerps.perps.status.unavailable)
  })

  it('is a warning banner', async () => {
    statusCode.value = 500
    const banner = await mountBanner()

    const appBanner = banner.getComponent(AppBanner)
    expect(appBanner.props('type')).toBe('warning')
    expect(appBanner.props('description')).toBe(
      enPerps.perps.status.unavailable,
    )
  })

  it('yields to the jurisdiction block, which outranks service availability', async () => {
    statusCode.value = 500
    isPerpsRestricted.value = true
    const banner = await mountBanner()

    expect(banner.findComponent(AppBanner).exists()).toBe(false)
  })
})
