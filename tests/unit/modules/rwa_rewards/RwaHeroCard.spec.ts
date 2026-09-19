import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import i18n from '@/i18n'
import type { RwaRewardItem, RwaStatus } from '@/mew_api/schemaRwaRewards'

// ---------------------------------------------------------------------------
// Store doubles. The real holdingsStore imports walletStore, which pulls in the
// hw-wallet/Ledger chain — unresolvable under jsdom. Every ref here is
// module-level so a test can set the state before mounting.
// ---------------------------------------------------------------------------
const status = ref<RwaStatus>('default')
const activeReward = ref<RwaRewardItem | null>(null)
const isClaiming = ref(false)
const isHoldOfferDismissed = ref(false)
const isCampaignFull = ref(false)
const isUnderReview = ref(false)
const canRegisterTrade = ref(true)
const qualificationAmount = ref('250')
const isRoundTwoActive = ref(false)
const holdTotalDays = ref(14)
const hasRoundTwo = ref(true)
const round1HoldDays = ref(14)
const round2HoldDays = ref<number | null>(21)
const totalHoldDays = ref(35)
const rewardAmountLabel = ref<string | null>('10 USDC')
const round1RewardAmountLabel = ref<string | null>('10 USDC')
const round2RewardAmountLabel = ref<string | null>('15 USDC')
const totalRewardAmountLabel = ref<string | null>('25 USDC')
const openModal = vi.fn()
const claim = vi.fn()

vi.mock('@/stores/holdingsStore', async () => {
  const { defineStore } = await import('pinia')
  return {
    useHoldingsStore: defineStore('holdingsStore', () => ({
      status,
      activeReward,
      isClaiming,
      isHoldOfferDismissed,
      isCampaignFull,
      isUnderReview,
      canRegisterTrade,
      qualificationAmount,
      isRoundTwoActive,
      holdTotalDays,
      hasRoundTwo,
      round1HoldDays,
      round2HoldDays,
      totalHoldDays,
      rewardAmountLabel,
      round1RewardAmountLabel,
      round2RewardAmountLabel,
      totalRewardAmountLabel,
      openModal,
      claim,
    })),
  }
})

const isTradingRestrictedInRegion = ref(false)
vi.mock('@/stores/globalStore', async () => {
  const { defineStore } = await import('pinia')
  return {
    useGlobalStore: defineStore('globalStore', () => ({
      isTradingRestrictedInRegion,
    })),
  }
})

const openPanel = vi.fn()
vi.mock('@/stores/walletMenuStore', () => ({
  useWalletMenuStore: () => ({ openPanel }),
}))

// RwaClaimCard consumes both; mocking the modules keeps the Ledger chain out.
const isWatchOnly = ref(false)
vi.mock('@/stores/walletStore', async () => {
  const { defineStore } = await import('pinia')
  return {
    useWalletStore: defineStore('wallet', () => ({ isWatchOnly })),
  }
})
const openAccessDialog = vi.fn()
vi.mock('@/stores/accessStore', () => ({
  useAccessStore: () => ({ openAccessDialog }),
}))

// The Zero-MEW-Fees fallback card reads the legacy rewards store.
vi.mock('@/stores/rewardsStore', async () => {
  const { defineStore } = await import('pinia')
  const { ref: r } = await import('vue')
  return {
    useRewardsStore: defineStore('rewards', () => ({
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

// Hoisted: this factory reads the spies eagerly, so they must exist before the
// import graph pulls `@/analytics` in.
const { trackRewardsAndOffersEvent, trackHoldRewardsMainCardEvent } =
  vi.hoisted(() => ({
    trackRewardsAndOffersEvent: vi.fn(),
    trackHoldRewardsMainCardEvent: vi.fn(),
  }))
vi.mock('@/analytics', () => ({
  analytics: { trackRewardsAndOffersEvent, trackHoldRewardsMainCardEvent },
  HoldRewardsMainCardEvent: { MODAL_SHOWN: 'Hold_Rewards_Main_Card_Shown' },
  RerwadsAndOffersEvent: {
    CLICKED_CTA: 'Clicked_Reward_Offer_CTA',
    CLICKED_MORE_INFO: 'Clicked_Reward_Offer_More_Info',
  },
}))

vi.mock('@intercom/messenger-js-sdk', () => ({ show: vi.fn() }))

import RwaHeroCard from '@/modules/rwa_rewards/RwaHeroCard.vue'

const reward = (over: Partial<RwaRewardItem> = {}) =>
  ({
    uuid: 'entry-1',
    id: 'rwa:AAL',
    chain_id: 1,
    start_timestamp: new Date(Date.now() - 4 * 86_400_000).toISOString(),
    qualification_timestamp: new Date(
      Date.now() + 10 * 86_400_000,
    ).toISOString(),
    ...over,
  }) as RwaRewardItem

// `v-ripple` is registered globally by the app, not by the test harness.
const ripple = {}

// Every mount is tracked and torn down: the card runs 1s countdown intervals,
// and a live interval on a discarded tree patches a DOM that no longer exists.
let mounted: ReturnType<typeof mount>[] = []
const mountCard = () => {
  const w = mount(RwaHeroCard, {
    global: { plugins: [i18n], directives: { ripple } },
  })
  mounted.push(w)
  return w
}

/** Rendered text with newlines collapsed — several headlines wrap on `\n`. */
const flat = (w: ReturnType<typeof mountCard>) => w.text().replace(/\s+/g, ' ')

describe('RwaHeroCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // AppTooltip teleports into `#app`; without it the teleport target is null
    // and unmounting the tree throws.
    document.body.innerHTML = '<div id="app"></div>'
    setActivePinia(createPinia())
    status.value = 'default'
    activeReward.value = null
    isClaiming.value = false
    isHoldOfferDismissed.value = false
    isCampaignFull.value = false
    isUnderReview.value = false
    canRegisterTrade.value = true
    isRoundTwoActive.value = false
    holdTotalDays.value = 14
    hasRoundTwo.value = true
    round2HoldDays.value = 21
    totalHoldDays.value = 35
    rewardAmountLabel.value = '10 USDC'
    round1RewardAmountLabel.value = '10 USDC'
    round2RewardAmountLabel.value = '15 USDC'
    totalRewardAmountLabel.value = '25 USDC'
    isTradingRestrictedInRegion.value = false
    isWatchOnly.value = false
  })

  afterEach(() => {
    mounted.forEach(w => w.unmount())
    mounted = []
  })

  describe('default offer', () => {
    it('headlines the combined reward and spells out both rounds', () => {
      const text = flat(mountCard())
      expect(text).toContain('Hold and get up to 25 USDC')
      expect(text).toContain('Trade $250 or more')
      expect(text).toContain('Hold 14 days: get 10 USDC')
      expect(text).toContain('Keep holding 21 more days: get 15 USDC')
    })

    it('labels the CTA with the qualifying amount', () => {
      const card = mountCard()
      expect(card.get('[data-test="rwa-hero-trade"]').text()).toBe(
        'Trade $250+',
      )
    })

    it('falls back to the single-round headline on a one-round season', () => {
      hasRoundTwo.value = false
      round2HoldDays.value = null
      totalRewardAmountLabel.value = '10 USDC'
      const text = flat(mountCard())
      expect(text).toContain('Hold and get 10 USDC')
      expect(text).not.toContain('Keep holding')
      expect(text).toContain('Get rewarded with 10 USDC')
    })

    it('opens the trade panel and the offer modal from its two CTAs', async () => {
      const card = mountCard()
      await card.get('[data-test="rwa-hero-trade"]').trigger('click')
      expect(openPanel).toHaveBeenCalledWith('trade')
      await card.get('[data-test="rwa-hero-more-info"]').trigger('click')
      expect(openModal).toHaveBeenCalledTimes(1)
    })

    it('disables the CTA when the season takes no new trades', () => {
      canRegisterTrade.value = false
      isCampaignFull.value = true
      const card = mountCard()
      expect(card.find('[data-test="rwa-hero-trade"]').exists()).toBe(false)
      expect(card.text()).toContain('Fully claimed')
    })
  })

  describe('holding', () => {
    it('states the active round-1 hold and its reward', () => {
      status.value = 'holding'
      activeReward.value = reward()
      const text = mountCard().text()
      expect(text).toContain('Hold for 14 days.')
      expect(text).toContain('Get 10 USDC.')
      expect(text).toContain('10 days left')
    })

    it('switches to the round-2 length and reward once the bonus runs', () => {
      status.value = 'holding'
      isRoundTwoActive.value = true
      holdTotalDays.value = 21
      rewardAmountLabel.value = '15 USDC'
      activeReward.value = reward({
        round: 2,
        qualification_timestamp: new Date(
          Date.now() + 21 * 86_400_000,
        ).toISOString(),
      })
      const text = mountCard().text()
      expect(text).toContain('Hold for 21 days.')
      expect(text).toContain('Get 15 USDC.')
      expect(text).toContain('21 days left')
    })

    it('renders one chip per hold day', () => {
      status.value = 'holding'
      holdTotalDays.value = 21
      activeReward.value = reward()
      // The tracker grid holds `total` chips.
      expect(mountCard().findAll('.grid > div').length).toBe(21)
    })
  })

  describe('earned', () => {
    it('points round 1 at the bonus that follows the claim', () => {
      status.value = 'earned'
      activeReward.value = reward({ is_qualified: true })
      const text = mountCard().text()
      expect(text).toContain('Congrats!')
      expect(text).toContain("Here's your reward")
      expect(text).toContain(
        'Claim your reward and keep holding to get 15 USDC more in 21 days',
      )
    })

    it('sums both holds when the bonus itself is claimable', () => {
      status.value = 'earned'
      isRoundTwoActive.value = true
      rewardAmountLabel.value = '15 USDC'
      activeReward.value = reward({ round: 2, is_qualified: true })
      expect(mountCard().text()).toContain(
        'You held for 35 days total, claim your well deserved reward',
      )
    })

    it('omits the bonus promise on a single-round season', () => {
      status.value = 'earned'
      hasRoundTwo.value = false
      round2HoldDays.value = null
      activeReward.value = reward({ is_qualified: true })
      const text = mountCard().text()
      expect(text).toContain('Claim your reward before the window closes.')
      expect(text).not.toContain('keep holding')
    })

    it('claims the active reward', async () => {
      status.value = 'earned'
      const entry = reward({ is_qualified: true })
      activeReward.value = entry
      const card = mountCard()
      await card.get('[data-test="rwa-claim-card-button"]').trigger('click')
      expect(claim).toHaveBeenCalledWith(entry)
    })

    it('sends a watch-only address to log in instead of claiming', async () => {
      status.value = 'earned'
      isWatchOnly.value = true
      activeReward.value = reward({ is_qualified: true })
      const card = mountCard()
      await card.get('[data-test="rwa-claim-card-button"]').trigger('click')
      expect(openAccessDialog).toHaveBeenCalledTimes(1)
      expect(claim).not.toHaveBeenCalled()
    })
  })

  describe('claimed', () => {
    it('sends the user to the wider programme once both rounds are paid', async () => {
      status.value = 'claimed'
      isRoundTwoActive.value = true
      activeReward.value = reward({ round: 2, status: 'CLAIMED' })
      const card = mountCard()
      const text = flat(card)
      expect(text).toContain('Discover more rewards')
      expect(text).toContain(
        'You already got 25 USDC from rewards, explore more rewards to keep earning.',
      )
      expect(card.get('[data-test="rwa-hero-explore"]').text()).toBe(
        'Explore all rewards',
      )
    })

    it('confirms the first reward while a bonus round is still open', () => {
      status.value = 'claimed'
      activeReward.value = reward({ status: 'CLAIMED' })
      const text = mountCard().text()
      expect(text).toContain('Reward claimed')
      expect(text).toContain('Your 10 USDC is on its way to your wallet.')
      expect(text).not.toContain('Discover more rewards')
    })
  })

  describe('terminal states', () => {
    it('invites a fresh trade after a lost round 1', () => {
      status.value = 'lost'
      activeReward.value = reward({ is_disqualified: true })
      const card = mountCard()
      expect(card.text()).toContain('Reward lost')
      expect(card.text()).toContain(
        'You lost the reward this time, but you can always try again',
      )
      expect(card.get('[data-test="rwa-hero-trade"]').text()).toBe(
        'Trade $250+',
      )
    })

    it('offers no retry after a lost round 2 — the season is over', () => {
      status.value = 'lost'
      isRoundTwoActive.value = true
      activeReward.value = reward({ round: 2, is_disqualified: true })
      const card = mountCard()
      expect(card.find('[data-test="rwa-hero-trade"]').exists()).toBe(false)
      expect(card.find('[data-test="rwa-hero-more-info"]').exists()).toBe(true)
    })

    it('shows the closed window and a retry after an expired round 1', () => {
      status.value = 'expired'
      activeReward.value = reward({ is_qualified: true })
      const card = mountCard()
      expect(card.text()).toContain('Reward expired')
      expect(card.text()).toContain(
        'The claim window expired, you can always participate again.',
      )
      expect(card.get('[data-test="rwa-hero-trade"]').exists()).toBe(true)
    })

    it('offers no retry after an expired round 2', () => {
      status.value = 'expired'
      isRoundTwoActive.value = true
      activeReward.value = reward({ round: 2, is_qualified: true })
      expect(mountCard().find('[data-test="rwa-hero-trade"]').exists()).toBe(
        false,
      )
    })
  })

  describe('analytics', () => {
    it('reports the round alongside the shared status', () => {
      status.value = 'holding'
      isRoundTwoActive.value = true
      activeReward.value = reward({ round: 2 })
      mountCard()
      expect(trackHoldRewardsMainCardEvent).toHaveBeenCalledWith(
        'Hold_Rewards_Main_Card_Shown',
        { status: 'holding', round: 2 },
      )
    })

    it('tags a CTA click with the round', async () => {
      status.value = 'default'
      const card = mountCard()
      await card.get('[data-test="rwa-hero-trade"]').trigger('click')
      expect(trackRewardsAndOffersEvent).toHaveBeenCalledWith(
        'Clicked_Reward_Offer_CTA',
        expect.objectContaining({ cta: 'trade', round: 1 }),
      )
    })
  })

  it('hands the slot to the fees offer for a restricted region', () => {
    isTradingRestrictedInRegion.value = true
    const text = mountCard().text()
    expect(text).toContain('Zero MEW Fees!')
    expect(text).not.toContain('Hold and get')
  })
})
