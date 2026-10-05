import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import i18n from '@/i18n'
import type {
  RwaInfoResponse,
  RwaRewardItem,
  RwaRound2State,
  RwaStatus,
} from '@/mew_api/schemaRwaRewards'

const isModalOpen = ref(true)
const seasonEnd = ref<string | null>(
  new Date(Date.now() + 8 * 86_400_000).toISOString(),
)
const status = ref<RwaStatus>('default')
const activeReward = ref<RwaRewardItem | null>(null)
const info = ref<RwaInfoResponse | null>(null)
const isClaiming = ref(false)
const isCampaignFull = ref(false)
const isCampaignEnded = ref(false)
const isUnderReview = ref(false)
const isRegionBlocked = ref(false)
const canRetryTrade = ref(true)
const qualificationAmount = ref('250')
const isRoundTwoActive = ref(false)
const round2Status = ref<RwaRound2State | null>('NOT_ELIGIBLE')
const holdTotalDays = ref(14)
const hasRoundTwo = ref(true)
const round1HoldDays = ref(14)
const round2HoldDays = ref<number | null>(21)
const round1RewardAmountLabel = ref<string | null>('10 USDC')
const round2RewardAmountLabel = ref<string | null>('15 USDC')
const totalRewardAmountLabel = ref<string | null>('25 USDC')
const rewardAmountLabel = ref<string | null>('10 USDC')
const openModal = vi.fn()
const closeModal = vi.fn()
const claim = vi.fn()

vi.mock('@/stores/holdingsStore', async () => {
  const { defineStore } = await import('pinia')
  return {
    useHoldingsStore: defineStore('holdingsStore', () => ({
      isModalOpen,
      seasonEnd,
      status,
      activeReward,
      info,
      isClaiming,
      isCampaignFull,
      isCampaignEnded,
      isUnderReview,
      isRegionBlocked,
      canRetryTrade,
      qualificationAmount,
      isRoundTwoActive,
      round2Status,
      holdTotalDays,
      hasRoundTwo,
      round1HoldDays,
      round2HoldDays,
      round1RewardAmountLabel,
      round2RewardAmountLabel,
      totalRewardAmountLabel,
      rewardAmountLabel,
      openModal,
      closeModal,
      claim,
    })),
  }
})

const openPanel = vi.fn()
vi.mock('@/stores/walletMenuStore', () => ({
  useWalletMenuStore: () => ({ openPanel }),
}))

const isWatchOnly = ref(false)
vi.mock('@/stores/walletStore', async () => {
  const { defineStore } = await import('pinia')
  return { useWalletStore: defineStore('wallet', () => ({ isWatchOnly })) }
})
const openAccessDialog = vi.fn()
vi.mock('@/stores/accessStore', () => ({
  useAccessStore: () => ({ openAccessDialog }),
}))

const { trackRewardsAndOffersEvent } = vi.hoisted(() => ({
  trackRewardsAndOffersEvent: vi.fn(),
}))
vi.mock('@/analytics', () => ({
  analytics: { trackRewardsAndOffersEvent },
  RerwadsAndOffersEvent: {
    CLICKED_CTA: 'Clicked_Reward_Offer_CTA',
    CLICKED_MORE_INFO: 'Clicked_Reward_Offer_More_Info',
  },
}))

vi.mock('@intercom/messenger-js-sdk', () => ({ show: vi.fn() }))

import RwaRewardModal from '@/modules/rwa_rewards/RwaRewardModal.vue'

// The real dialog teleports and traps focus; the modal's own content is what
// matters here.
const AppDialogStub = {
  props: { isOpen: { type: Boolean, default: false } },
  template: '<div v-if="isOpen"><slot name="content" /></div>',
}

const reward = (over: Partial<RwaRewardItem> = {}) =>
  ({
    uuid: 'entry-1',
    id: 'rwa:AAL',
    chain_id: 1,
    qualifying_amount: '0x1',
    start_timestamp: new Date(Date.now() - 4 * 86_400_000).toISOString(),
    qualification_timestamp: new Date(
      Date.now() + 10 * 86_400_000,
    ).toISOString(),
    ...over,
  }) as RwaRewardItem

let mounted: ReturnType<typeof mount>[] = []
const mountModal = () => {
  const w = mount(RwaRewardModal, {
    global: {
      plugins: [i18n],
      directives: { ripple: {} },
      stubs: { AppDialog: AppDialogStub },
    },
  })
  mounted.push(w)
  return w
}
const flat = (w: ReturnType<typeof mountModal>) => w.text().replace(/\s+/g, ' ')

const stepText = (w: ReturnType<typeof mountModal>, kind: string) =>
  w.get(`[data-test="rwa-step-${kind}"]`).text().replace(/\s+/g, ' ')

describe('RwaRewardModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = '<div id="app"></div>'
    setActivePinia(createPinia())
    isModalOpen.value = true
    status.value = 'default'
    activeReward.value = null
    info.value = null
    isClaiming.value = false
    isCampaignFull.value = false
    isCampaignEnded.value = false
    isUnderReview.value = false
    isRegionBlocked.value = false
    canRetryTrade.value = true
    isRoundTwoActive.value = false
    round2Status.value = 'NOT_ELIGIBLE'
    holdTotalDays.value = 14
    hasRoundTwo.value = true
    round2HoldDays.value = 21
    round1RewardAmountLabel.value = '10 USDC'
    round2RewardAmountLabel.value = '15 USDC'
    totalRewardAmountLabel.value = '25 USDC'
    rewardAmountLabel.value = '10 USDC'
    isWatchOnly.value = false
  })

  afterEach(() => {
    mounted.forEach(w => w.unmount())
    mounted = []
  })

  it('headlines the combined reward for both rounds', () => {
    expect(flat(mountModal())).toContain('Hold and get up to 25 USDC')
  })

  it('always shows all five steps, so the bonus is never hidden', () => {
    status.value = 'holding'
    activeReward.value = reward()
    const modal = mountModal()
    for (const kind of ['trade', 'hold1', 'claim1', 'hold2', 'claim2']) {
      expect(modal.find(`[data-test="rwa-step-${kind}"]`).exists(), kind).toBe(
        true,
      )
    }
  })

  it('shows only the round-1 steps on a single-round season', () => {
    hasRoundTwo.value = false
    round2HoldDays.value = null
    const modal = mountModal()
    expect(modal.find('[data-test="rwa-step-hold2"]').exists()).toBe(false)
    expect(modal.find('[data-test="rwa-step-claim2"]').exists()).toBe(false)
  })

  describe('offer', () => {
    it('invites the qualifying trade from step 1', async () => {
      const modal = mountModal()
      expect(stepText(modal, 'trade')).toContain(
        'Make a qualifying trade of $250 or more',
      )
      const cta = modal.get('[data-test="rwa-modal-trade"]')
      expect(cta.text()).toBe('Trade $250+')
      await cta.trigger('click')
      expect(openPanel).toHaveBeenCalledWith('trade')
      expect(closeModal).toHaveBeenCalled()
    })

    it('replaces the CTA with the reason when the season is closed', () => {
      status.value = 'campaignFull'
      isCampaignFull.value = true
      const modal = mountModal()
      expect(modal.find('[data-test="rwa-modal-trade"]').exists()).toBe(false)
      expect(flat(modal)).toContain('Fully claimed')
    })
  })

  describe('holding', () => {
    it('counts down the active hold and lists the bonus ahead', () => {
      status.value = 'holding'
      activeReward.value = reward()
      const modal = mountModal()
      expect(stepText(modal, 'hold1')).toContain('Hold your trade for 14 days')
      expect(stepText(modal, 'hold1')).toContain('10 days left')
      expect(stepText(modal, 'hold2')).toContain(
        'Hold your trade for 21 more days',
      )
    })

    it('warns about selling only during the bonus hold', () => {
      status.value = 'holding'
      activeReward.value = reward()
      expect(flat(mountModal())).not.toContain(
        'Selling before then forfeits the reward.',
      )

      isRoundTwoActive.value = true
      holdTotalDays.value = 21
      activeReward.value = reward({ round: 2 })
      expect(flat(mountModal())).toContain(
        'Selling before then forfeits the reward.',
      )
    })
  })

  describe('claiming', () => {
    it('puts a claim button on the reward card when round 1 is claimable', async () => {
      status.value = 'earned'
      activeReward.value = reward({
        is_qualified: true,
        expiration_timestamp: new Date(
          Date.now() + 6 * 86_400_000,
        ).toISOString(),
      })
      const modal = mountModal()
      expect(stepText(modal, 'claim1')).toContain('10 USDC')
      expect(stepText(modal, 'claim1')).toContain('Expires in')
      await modal.get('[data-test="rwa-modal-claim"]').trigger('click')
      expect(claim).toHaveBeenCalledWith(activeReward.value)
    })

    it('claims the bonus against the round-2 entry', async () => {
      status.value = 'earned'
      isRoundTwoActive.value = true
      rewardAmountLabel.value = '15 USDC'
      const entry = reward({ uuid: 'round-2-uuid', round: 2 })
      activeReward.value = entry
      const modal = mountModal()
      expect(stepText(modal, 'claim2')).toContain('15 USDC')
      await modal.get('[data-test="rwa-modal-claim"]').trigger('click')
      expect(claim).toHaveBeenCalledWith(entry)
    })

    it('sends a watch-only address to log in', async () => {
      status.value = 'earned'
      isWatchOnly.value = true
      activeReward.value = reward({ is_qualified: true })
      const modal = mountModal()
      expect(modal.get('[data-test="rwa-modal-claim"]').text()).toBe(
        'Connect wallet to claim',
      )
      await modal.get('[data-test="rwa-modal-claim"]').trigger('click')
      expect(openAccessDialog).toHaveBeenCalledTimes(1)
      expect(claim).not.toHaveBeenCalled()
    })
  })

  describe('terminal states', () => {
    it('offers a retry inside the failed hold step for round 1', async () => {
      status.value = 'lost'
      activeReward.value = reward({ is_disqualified: true })
      const modal = mountModal()
      const retry = modal.get('[data-test="rwa-modal-trade-again"]')
      expect(retry.text()).toBe('Trade again')
      await retry.trigger('click')
      expect(openPanel).toHaveBeenCalledWith('trade')
    })

    it('offers no retry after a lost bonus round', () => {
      status.value = 'lost'
      isRoundTwoActive.value = true
      activeReward.value = reward({ round: 2, is_disqualified: true })
      expect(
        mountModal().find('[data-test="rwa-modal-trade-again"]').exists(),
      ).toBe(false)
    })

    it('marks the reward card expired when the window closed', () => {
      status.value = 'expired'
      activeReward.value = reward({ is_qualified: true })
      const modal = mountModal()
      expect(stepText(modal, 'claim1')).toContain('Reward expired')
      expect(modal.find('[data-test="rwa-modal-claim"]').exists()).toBe(false)
    })

    it('points at the wider programme once both rounds are paid', async () => {
      status.value = 'claimed'
      isRoundTwoActive.value = true
      activeReward.value = reward({ round: 2, status: 'CLAIMED' })
      const modal = mountModal()
      const cta = modal.get('[data-test="rwa-modal-discover"]')
      expect(cta.text()).toBe('Discover more rewards')
      const open = vi.spyOn(window, 'open').mockImplementation(() => null)
      await cta.trigger('click')
      expect(open).toHaveBeenCalledWith(
        'https://myetherwallet.com/rewards',
        '_blank',
        'noopener',
      )
      open.mockRestore()
    })

    it('keeps that CTA away while a bonus round is still open', () => {
      status.value = 'claimed'
      round2Status.value = 'PENDING'
      activeReward.value = reward({ status: 'CLAIMED' })
      expect(
        mountModal().find('[data-test="rwa-modal-discover"]').exists(),
      ).toBe(false)
    })
  })

  describe('round-2 notices', () => {
    it('explains an exhausted pool after the first claim', () => {
      status.value = 'claimed'
      round2Status.value = 'UNAVAILABLE'
      activeReward.value = reward({ status: 'CLAIMED' })
      expect(flat(mountModal())).toContain(
        "A bonus round isn't available for this wallet",
      )
    })

    it('explains a bonus round still being opened', () => {
      status.value = 'claimed'
      round2Status.value = 'ELIGIBLE'
      activeReward.value = reward({ status: 'CLAIMED' })
      expect(flat(mountModal())).toContain('being set up')
    })
  })

  describe('footer', () => {
    it('counts down to the season end and links the terms', () => {
      const modal = mountModal()
      expect(flat(modal)).toContain('Ends in')
      const terms = modal.get('[data-test="rwa-modal-terms"]')
      expect(terms.text()).toBe('Terms & conditions')
      expect(terms.attributes('href')).toBe('https://myetherwallet.com/rewards')
      expect(terms.attributes('target')).toBe('_blank')
    })

    it('drops the countdown once the season has ended', () => {
      isCampaignEnded.value = true
      expect(flat(mountModal())).not.toContain('Ends in')
    })

    it('drops the countdown when the season has no end date', () => {
      seasonEnd.value = null
      expect(flat(mountModal())).not.toContain('Ends in')
    })
  })

  it('tags modal CTAs with the active round', async () => {
    status.value = 'earned'
    isRoundTwoActive.value = true
    activeReward.value = reward({ round: 2 })
    const modal = mountModal()
    await modal.get('[data-test="rwa-modal-claim"]').trigger('click')
    expect(trackRewardsAndOffersEvent).toHaveBeenCalledWith(
      'Clicked_Reward_Offer_CTA',
      expect.objectContaining({ cta: 'claim', round: 2 }),
    )
  })
})
