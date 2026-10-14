import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import i18n from '@/i18n'
import type { RwaRewardItem, RwaStatus } from '@/mew_api/schemaRwaRewards'

const status = ref<RwaStatus>('default')
const activeReward = ref<RwaRewardItem | null>(null)
const seasonEnd = ref<string | null>(
  new Date(Date.now() + 7 * 86_400_000).toISOString(),
)
const canRegisterTrade = ref(true)
const canRetryTrade = ref(true)
const isCampaignEnded = ref(false)
const isUnderReview = ref(false)
const isClaiming = ref(false)
const qualificationAmount = ref('250')
const isRoundTwoActive = ref(false)
const holdTotalDays = ref(14)
const rewardAmountLabel = ref<string | null>('10 USDC')
const totalRewardAmountLabel = ref<string | null>('25 USDC')
const openModal = vi.fn()
const claim = vi.fn()

vi.mock('@/stores/holdingsStore', async () => {
  const { defineStore } = await import('pinia')
  return {
    useHoldingsStore: defineStore('holdingsStore', () => ({
      status,
      activeReward,
      seasonEnd,
      canRegisterTrade,
      canRetryTrade,
      isCampaignEnded,
      isUnderReview,
      isClaiming,
      qualificationAmount,
      isRoundTwoActive,
      holdTotalDays,
      rewardAmountLabel,
      totalRewardAmountLabel,
      openModal,
      claim,
    })),
  }
})

vi.mock('@/stores/rewardsStore', async () => {
  const { defineStore } = await import('pinia')
  const { ref: r } = await import('vue')
  return {
    useRewardsStore: defineStore('rewards', () => ({
      minSpendTrade: r('50'),
      isBanned: r(false),
      isEligible: r(true),
      eligibilityV2: r(null),
      tradeMarketClosed: r(false),
      tradeClaimed: r(false),
      tradeNoRewards: r(false),
      tradeRemainingCount: r(null),
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

// Self-fetches the legacy rewards info on mount.
vi.mock('@/modules/rwa_rewards/RwaTradeInfoModal.vue', () => ({
  default: { props: ['isOpen'], template: '<div />' },
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

import RwaRewardsSection from '@/modules/rwa_rewards/RwaRewardsSection.vue'

const reward = (over: Partial<RwaRewardItem> = {}) =>
  ({
    uuid: 'entry-1',
    id: 'rwa:AAL',
    chain_id: 1,
    qualification_timestamp: new Date(
      Date.now() + 4 * 86_400_000,
    ).toISOString(),
    ...over,
  }) as RwaRewardItem

let mounted: ReturnType<typeof mount>[] = []
const HOLD = '[data-test="rwa-offer-card-hold"]'

const mountSection = () => {
  const w = mount(RwaRewardsSection, {
    global: { plugins: [i18n], directives: { ripple: {} } },
  })
  mounted.push(w)
  return w
}
const holdCard = () => {
  const card = mountSection().get(HOLD)
  return {
    card,
    text: card.text().replace(/\s+/g, ' '),
    cardStatus: card.attributes('data-status'),
    buttons: card.findAll('button'),
  }
}

describe('RwaRewardsSection — hold card', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = '<div id="app"></div>'
    setActivePinia(createPinia())
    // jsdom has no ResizeObserver; the carousel observes its track.
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    )
    status.value = 'default'
    activeReward.value = null
    canRegisterTrade.value = true
    canRetryTrade.value = true
    isCampaignEnded.value = false
    isUnderReview.value = false
    isClaiming.value = false
    isRoundTwoActive.value = false
    holdTotalDays.value = 14
    rewardAmountLabel.value = '10 USDC'
    totalRewardAmountLabel.value = '25 USDC'
    isWatchOnly.value = false
  })

  afterEach(() => {
    mounted.forEach(w => w.unmount())
    mounted = []
  })

  it('describes the offer as both rounds combined', () => {
    const { text } = holdCard()
    expect(text).toContain('Hold and get rewarded')
    expect(text).toContain(
      'Trade at least $250 and hold it to get up to 25 USDC',
    )
  })

  it('counts the season down and invites a trade by default', () => {
    const { text, cardStatus, buttons } = holdCard()
    expect(cardStatus).toBe('ongoing')
    expect(text).toContain('Ends in 7 days')
    expect(buttons[0]!.text()).toContain('Trade')
  })

  it('shows the remaining hold and the reward it earns', () => {
    status.value = 'holding'
    activeReward.value = reward()
    const { text, cardStatus, buttons } = holdCard()
    expect(cardStatus).toBe('holding')
    expect(text).toContain('4 more days for 10 USDC')
    expect(buttons[0]!.text()).toContain('Check progress')
  })

  it('names the bonus reward in the badge during round 2', () => {
    status.value = 'holding'
    isRoundTwoActive.value = true
    rewardAmountLabel.value = '15 USDC'
    activeReward.value = reward({ round: 2 })
    expect(holdCard().text).toContain('4 more days for 15 USDC')
  })

  it('opens the offer modal from "Check progress"', async () => {
    status.value = 'holding'
    activeReward.value = reward()
    const { buttons } = holdCard()
    await buttons[0]!.trigger('click')
    expect(openModal).toHaveBeenCalledTimes(1)
    expect(openPanel).not.toHaveBeenCalled()
  })

  it('reports the completed hold in weeks and claims the reward', async () => {
    status.value = 'earned'
    const entry = reward({ is_qualified: true })
    activeReward.value = entry
    const { text, cardStatus, buttons } = holdCard()
    expect(cardStatus).toBe('claimable')
    expect(text).toContain('Held for 2 weeks')
    expect(buttons[0]!.text()).toContain('Claim 10 USDC')
    await buttons[0]!.trigger('click')
    expect(claim).toHaveBeenCalledWith(entry)
  })

  it('reports the longer bonus hold and its own amount', () => {
    status.value = 'earned'
    isRoundTwoActive.value = true
    holdTotalDays.value = 21
    rewardAmountLabel.value = '15 USDC'
    activeReward.value = reward({ round: 2, is_qualified: true })
    const { text, buttons } = holdCard()
    expect(text).toContain('Held for 3 weeks')
    expect(buttons[0]!.text()).toContain('Claim 15 USDC')
  })

  it('falls back to days when the hold is not whole weeks', () => {
    status.value = 'earned'
    holdTotalDays.value = 5
    activeReward.value = reward({ is_qualified: true })
    expect(holdCard().text).toContain('Held for 5 days')
  })

  it('states the reward is claimed and drops the CTA', () => {
    status.value = 'claimed'
    activeReward.value = reward({ status: 'CLAIMED' })
    const { text, cardStatus, buttons } = holdCard()
    expect(cardStatus).toBe('claimed')
    expect(text).toContain('Reward claimed')
    // Nothing left to do on this card but read more.
    expect(buttons).toHaveLength(1)
    expect(buttons[0]!.text()).toBe('More info')
  })

  it('explains a broken hold and offers a fresh trade', async () => {
    status.value = 'lost'
    activeReward.value = reward({ is_disqualified: true })
    const { text, cardStatus, buttons } = holdCard()
    expect(cardStatus).toBe('lost')
    expect(text).toContain("Didn't hold long enough")
    expect(buttons[0]!.text()).toContain('Trade again')
    await buttons[0]!.trigger('click')
    expect(openPanel).toHaveBeenCalledWith('trade')
  })

  it('explains a closed claim window and offers a fresh trade', () => {
    status.value = 'expired'
    activeReward.value = reward({ is_qualified: true })
    const { text, cardStatus, buttons } = holdCard()
    expect(cardStatus).toBe('expired')
    expect(text).toContain('Reward expired')
    expect(buttons[0]!.text()).toContain('Trade again')
  })

  it('offers no retry once the bonus round is terminal', () => {
    status.value = 'lost'
    isRoundTwoActive.value = true
    canRetryTrade.value = false
    activeReward.value = reward({ round: 2, is_disqualified: true })
    const { text, buttons } = holdCard()
    expect(text).toContain("Didn't hold long enough")
    expect(buttons).toHaveLength(1)
    expect(buttons[0]!.text()).toBe('More info')
  })

  it('offers no retry while the season takes no new trades', () => {
    status.value = 'lost'
    canRetryTrade.value = false
    activeReward.value = reward({ is_disqualified: true })
    expect(holdCard().buttons).toHaveLength(1)
  })

  it('lets the review outrank the wallet’s own progress', () => {
    status.value = 'holding'
    isUnderReview.value = true
    activeReward.value = reward()
    const { text, cardStatus } = holdCard()
    expect(cardStatus).toBe('underReview')
    expect(text).toContain('Under review')
  })

  it('keeps an earned reward claimable after the budget runs out', () => {
    status.value = 'earned'
    canRegisterTrade.value = false
    activeReward.value = reward({ is_qualified: true })
    expect(holdCard().cardStatus).toBe('claimable')
  })

  it('tags a carousel CTA with the active round', async () => {
    status.value = 'holding'
    isRoundTwoActive.value = true
    activeReward.value = reward({ round: 2 })
    const { buttons } = holdCard()
    await buttons[0]!.trigger('click')
    expect(trackRewardsAndOffersEvent).toHaveBeenCalledWith(
      'Clicked_Reward_Offer_CTA',
      expect.objectContaining({ campaign: 'hold', round: 2 }),
    )
  })
})
