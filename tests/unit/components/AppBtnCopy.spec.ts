import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (k: string) => k }) }))
vi.mock('@sentry/vue', () => ({ captureException: vi.fn() }))

import AppBtnCopy from '@/components/AppBtnCopy.vue'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'

const mountBtn = () =>
  mount(AppBtnCopy, {
    props: { copyValue: '0x62b90221419b3de8bc3082d8411ae203c9d988ab' },
    global: { mocks: { $t: (k: string) => k } },
  })

describe('AppBtnCopy', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
  })

  it('confirms the copy with a design-library success toast carrying the value', async () => {
    await mountBtn().get('button').trigger('click')
    await flushPromises()

    const [toast] = useToastStore().messages
    expect(toast).toMatchObject({
      type: ToastType.Success,
      text: 'common.copied_to_clipboard',
      textSecondary: '0x62b90221419b3de8bc3082d8411ae203c9d988ab',
    })
  })
})
