import { afterEach, describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { nextTick } from 'vue'
import PrivyEmailCode from '@/modules/access/components/privy/PrivyEmailCode.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: {
    en: {
      access_wallet: {
        social: { code: { description: 'Please check {email} for a code' } },
      },
    },
  },
})

let wrapper: VueWrapper | undefined
const mountCode = (props: Record<string, unknown> = {}) => {
  wrapper = mount(PrivyEmailCode, {
    attachTo: document.body,
    props: {
      email: 'ada@example.com',
      status: 'default',
      resendIn: 0,
      locked: false,
      ...props,
    },
    global: { plugins: [i18n] },
  })
  return wrapper
}
afterEach(() => wrapper?.unmount())

const cells = (w: VueWrapper) => w.findAll('input')
const typeCode = async (w: VueWrapper, code: string) => {
  await cells(w)[0].trigger('paste', {
    clipboardData: { getData: () => code },
  })
}
const resend = (w: VueWrapper) => w.get('[data-testid="resend-code"]')

describe('PrivyEmailCode', () => {
  it('tells the user which address the code was sent to', () => {
    expect(mountCode().text()).toContain(
      'Please check ada@example.com for a code',
    )
  })

  it('puts the cursor in the first box when the screen opens', async () => {
    const w = mountCode()
    await nextTick()

    expect(document.activeElement).toBe(cells(w)[0].element)
  })

  it('keeps the email address and the code out of session replay', () => {
    const w = mountCode()

    expect(
      w.get('[data-testid="code-sent-to"]').attributes('data-private'),
    ).toBeDefined()
    expect(w.get('[role="group"]').attributes('data-private')).toBeDefined()
  })

  it('blocks typing while a code is being checked', () => {
    const w = mountCode({ busy: true })

    expect(cells(w)[0].attributes('disabled')).toBeDefined()
  })

  it('submits the code as soon as the sixth digit is entered', async () => {
    const w = mountCode()

    await typeCode(w, '123456')

    expect(w.emitted('complete')).toEqual([['123456']])
  })

  it('shows the incorrect-code message, clears the boxes and refocuses the first', async () => {
    const w = mountCode()
    await typeCode(w, '123456')

    await w.setProps({ status: 'error' })
    await nextTick()

    expect(w.text()).toContain('access_wallet.social.code.incorrect')
    expect(cells(w).map(c => (c.element as HTMLInputElement).value)).toEqual([
      '',
      '',
      '',
      '',
      '',
      '',
    ])
    expect(document.activeElement).toBe(cells(w)[0].element)
  })

  it('shows success and keeps the entered code', async () => {
    const w = mountCode()
    await typeCode(w, '123456')

    await w.setProps({ status: 'success' })

    expect(w.text()).toContain('access_wallet.social.code.success')
    expect((cells(w)[5].element as HTMLInputElement).value).toBe('6')
    expect(w.find('[data-testid="resend-code"]').exists()).toBe(false)
  })

  it('asks for a new code and blocks typing when attempts ran out', () => {
    const w = mountCode({ status: 'error', locked: true })

    expect(w.text()).toContain('access_wallet.social.code.too_many')
    expect(cells(w)[0].attributes('disabled')).toBeDefined()
  })

  it('emits resend when the cooldown is over', async () => {
    const w = mountCode()

    await resend(w).trigger('click')

    expect(w.emitted('resend')).toHaveLength(1)
  })

  it('disables resend and shows the countdown during the cooldown', () => {
    const w = mountCode({ resendIn: 12 })

    expect(resend(w).attributes('disabled')).toBeDefined()
    expect(resend(w).text()).toContain('access_wallet.social.code.resend_in')
  })
})
