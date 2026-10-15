import { describe, it, expect } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import AppBannerBase from '@/components/banner/AppBannerBase.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import en from '@/i18n/locales/common/en.json'

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en } })

const mountBase = (
  props: Record<string, unknown> = {},
  slots: Record<string, string> = {},
) =>
  mount(AppBannerBase, {
    props: { description: 'Funds arrive in a few minutes.', ...props },
    slots,
    global: { plugins: [i18n] },
  })

describe('AppBannerBase', () => {
  it('lays out a description-only banner as a single line', () => {
    const w = mountBase()
    expect(w.classes()).toEqual(
      expect.arrayContaining(['items-center', 'py-2', 'min-h-12']),
    )
    expect(w.text()).toContain('Funds arrive in a few minutes.')
  })

  it('switches to the multi-line layout when a title is set', () => {
    const w = mountBase({ title: 'Heads up' })
    expect(w.classes()).toEqual(
      expect.arrayContaining(['items-start', 'py-3', 'min-h-15']),
    )
    expect(w.get('.text-label-base').text()).toBe('Heads up')
  })

  it('switches to the multi-line layout when actions are slotted', () => {
    const w = mountBase({}, { actions: '<button>Retry</button>' })
    expect(w.classes()).toContain('items-start')
    expect(w.get('button').text()).toBe('Retry')
  })

  it('re-derives the layout when actions appear after mount', async () => {
    const show = ref(false)
    const Host = defineComponent({
      components: { AppBannerBase },
      setup: () => ({ show }),
      template: `<AppBannerBase description="Note">
        <template v-if="show" #actions><button>Retry</button></template>
      </AppBannerBase>`,
    })
    const w = mount(Host, { global: { plugins: [i18n] } })
    const root = () => w.getComponent(AppBannerBase)
    expect(root().classes()).toContain('items-center')

    show.value = true
    await nextTick()
    expect(root().classes()).toContain('items-start')
  })

  it('renders the icon slot and lets the default slot replace the description', () => {
    const w = mountBase(
      {},
      { icon: '<i class="status" />', default: '<b>Rich</b> copy' },
    )
    expect(w.find('.status').exists()).toBe(true)
    expect(w.text()).toContain('Rich copy')
    expect(w.text()).not.toContain('Funds arrive')
  })

  it('shows a labelled close button only when dismissible, emitting close', async () => {
    expect(mountBase().findComponent(AppBtnIcon).exists()).toBe(false)

    const w = mountBase({ dismissible: true })
    const close = w.getComponent(AppBtnIcon)
    expect(close.props()).toMatchObject({
      icon: 'x-mark',
      size: 's',
      label: 'Dismiss',
    })
    await close.trigger('click')
    expect(w.emitted('close')).toHaveLength(1)
  })
})
