import { describe, it, expect, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import AccessDerivationPath from '@/modules/access/components/AccessDerivationPath.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: {} },
})

const PATHS = [
  { label: 'Ethereum', path: "m/44'/60'/0'/0" },
  { label: 'Ledger', path: "m/44'/60'/0'" },
  { label: 'Ethereum Classic', path: "m/44'/61'/0'/0" },
]

let wrapper: VueWrapper | undefined
afterEach(() => wrapper?.unmount())

const mountIt = (allowCustom = false) => {
  wrapper = mount(AccessDerivationPath, {
    props: { paths: PATHS, modelValue: PATHS[0], allowCustom },
    attachTo: document.body,
    global: { plugins: [i18n, createPinia()], stubs: { teleport: true } },
  })
  return wrapper
}
const open = (w: VueWrapper) =>
  w.get('[data-testid="path-trigger"]').trigger('click')
const options = (w: VueWrapper) => w.findAll('[data-testid="path-option"]')
const footerButton = (w: VueWrapper, label: string) =>
  w.findAll('footer button').find(b => b.text() === label)!

describe('AccessDerivationPath', () => {
  it('shows the selected path and lists every path in a modal', async () => {
    const w = mountIt()
    expect(w.get('[data-testid="path-trigger"]').text()).toBe("m/44'/60'/0'/0")
    expect(w.find('[role="dialog"]').exists()).toBe(false)

    await open(w)
    expect(w.get('[role="dialog"]').text()).toContain(
      'derivation_path.select_path',
    )
    expect(options(w)).toHaveLength(3)
    expect(options(w)[0].attributes('aria-selected')).toBe('true')
  })

  it('filters by label or path and closes on pick', async () => {
    const w = mountIt()
    await open(w)
    await w.get('[role="dialog"] input').setValue("61'")
    expect(options(w).map(o => o.text())).toEqual([
      "Ethereum Classicm/44'/61'/0'/0",
    ])

    await options(w)[0].trigger('click')
    expect(w.emitted('update:modelValue')).toEqual([[PATHS[2]]])
    expect(w.find('[role="dialog"]').exists()).toBe(false)
  })

  it('has no Add button unless custom paths are allowed', async () => {
    const w = mountIt()
    await open(w)
    expect(w.find('[data-testid="path-add"]').exists()).toBe(false)
  })

  it('adds a custom path from the label and path inputs', async () => {
    const w = mountIt(true)
    await open(w)
    await w.get('[data-testid="path-add"]').trigger('click')
    expect(w.get('[role="dialog"]').text()).toContain(
      'derivation_path.add_path',
    )
    expect(footerButton(w, 'common.add').attributes('disabled')).toBeDefined()

    const [label, path] = w.findAll('[role="dialog"] input')
    await label.setValue(' Mine ')
    await path.setValue(" m/44'/60'/1'/0 ")
    await footerButton(w, 'common.add').trigger('click')

    expect(w.emitted('add')).toEqual([
      [{ label: 'Mine', path: "m/44'/60'/1'/0" }],
    ])
    expect(w.find('[role="dialog"]').exists()).toBe(false)
  })

  it('rejects an invalid path and a label already in the list', async () => {
    const w = mountIt(true)
    await open(w)
    await w.get('[data-testid="path-add"]').trigger('click')
    const [label, path] = w.findAll('[role="dialog"] input')
    await label.setValue('ledger')
    await path.setValue('m/44/x')
    await footerButton(w, 'common.add').trigger('click')

    expect(w.emitted('add')).toBeUndefined()
    const text = w.get('[role="dialog"]').text()
    expect(text).toContain('derivation_path.label_exists')
    expect(text).toContain('derivation_path.invalid_path')
  })

  it('goes back to the list with Cancel', async () => {
    const w = mountIt(true)
    await open(w)
    await w.get('[data-testid="path-add"]').trigger('click')
    await footerButton(w, 'common.cancel').trigger('click')
    expect(options(w)).toHaveLength(3)
  })
})
