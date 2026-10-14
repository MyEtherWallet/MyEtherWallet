import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import i18n from '@/i18n'
import type { RwaRewardItem, RwaStatus } from '@/mew_api/schemaRwaRewards'

const status = ref<RwaStatus>('default')
const activeReward = ref<RwaRewardItem | null>(null)
const isClaiming = ref(false)
const canRegisterTrade = ref(true)
const canRetryTrade = ref(true)
const qualificationAmount = ref('250')
const isRoundTwoActive = ref(false)
const hasRoundTwo = ref(true)
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
      canRegisterTrade,
      canRetryTrade,
      qualificationAmount,
      isRoundTwoActive,
      hasRoundTwo,
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

const isWatchOnly = ref(false)
vi.mock('@/stores/walletStore', async () => {
  const { defineStore } = await import('pinia')
  return { useWalletStore: defineStore('wallet', () => ({ isWatchOnly })) }
})
const openAccessDialog = vi.fn()
vi.mock('@/stores/accessStore', () => ({
  useAccessStore: () => ({ openAccessDialog }),
}))

const { trackRewardsAndOffersEvent, trackHoldRewardsHomeBannerEvent } =
  vi.hoisted(() => ({
    trackRewardsAndOffersEvent: vi.fn(),
    trackHoldRewardsHomeBannerEvent: vi.fn(),
  }))
vi.mock('@/analytics', () => ({
  analytics: { trackRewardsAndOffersEvent, trackHoldRewardsHomeBannerEvent },
  HoldRewardsHomeBannerEvent: {
    SHOWN: 'Hold_Rewards_Home_Banner_Shown',
    DISMISSED: 'Hold_Rewards_Home_Banner_Dismissed',
  },
  RerwadsAndOffersEvent: {
    CLICKED_CTA: 'Clicked_Reward_Offer_CTA',
    CLICKED_MORE_INFO: 'Clicked_Reward_Offer_More_Info',
  },
}))

import RwaHomeBanner from '@/modules/rwa_rewards/RwaHomeBanner.vue'

const reward = (over: Partial<RwaRewardItem> = {}) =>
  ({
    uuid: 'entry-1',
    id: 'rwa:AAL',
    chain_id: 1,
    qualification_timestamp: new Date(
      Date.now() + 9 * 86_400_000,
    ).toISOString(),
    ...over,
  }) as RwaRewardItem

const BANNER = '[data-test="rwa-home-banner"]'
const PRIMARY = '[data-test="rwa-home-banner-primary"]'
const SECONDARY = '[data-test="rwa-home-banner-secondary"]'
const DISMISS = '[data-test="rwa-home-banner-dismiss"]'

let mounted: ReturnType<typeof mount>[] = []
const mountBanner = () => {
  const w = mount(RwaHomeBanner, {
    global: { plugins: [i18n], directives: { ripple: {} } },
  })
  mounted.push(w)
  return w
}
const flat = (w: ReturnType<typeof mountBanner>) =>
  w.text().replace(/\s+/g, ' ')

describe('RwaHomeBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    document.body.innerHTML = '<div id="app"></div>'
    setActivePinia(createPinia())
    status.value = 'default'
    activeReward.value = null
    isClaiming.value = false
    canRegisterTrade.value = true
    canRetryTrade.value = true
    isRoundTwoActive.value = false
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
    it('promotes the combined reward and the qualifying trade', () => {
      const banner = mountBanner()
      const text = flat(banner)
      expect(text).toContain('Get up to 25 USDC')
      expect(text).toContain('Trade $250 or more, hold it, earn rewards')
      expect(banner.get(PRIMARY).text()).toBe('Trade $250+')
      expect(banner.get(SECONDARY).text()).toBe('More info')
    })

    it('opens the trade panel from the primary CTA', async () => {
      const banner = mountBanner()
      await banner.get(PRIMARY).trigger('click')
      expect(openPanel).toHaveBeenCalledWith('trade')
    })

    it('opens the offer modal from "More info"', async () => {
      const banner = mountBanner()
      await banner.get(SECONDARY).trigger('click')
      expect(openModal).toHaveBeenCalledTimes(1)
    })

    it('stays out of the page when the season takes no new trades', () => {
      canRegisterTrade.value = false
      expect(mountBanner().find(BANNER).exists()).toBe(false)
    })

    it('stays out of the page for a restricted region', () => {
      isTradingRestrictedInRegion.value = true
      expect(mountBanner().find(BANNER).exists()).toBe(false)
    })
  })

  describe('holding', () => {
    it('counts the remaining days of the first hold toward its reward', () => {
      status.value = 'holding'
      activeReward.value = reward()
      const banner = mountBanner()
      const text = flat(banner)
      expect(text).toContain('Hold for 9 more days')
      expect(text).toContain('You are 9 days away from 10 USDC')
      expect(banner.get(SECONDARY).text()).toBe('Check progress')
      // Nothing to claim yet.
      expect(banner.find(PRIMARY).exists()).toBe(false)
    })

    it('counts the bonus hold toward the bonus reward', () => {
      status.value = 'holding'
      isRoundTwoActive.value = true
      rewardAmountLabel.value = '15 USDC'
      activeReward.value = reward({
        round: 2,
        qualification_timestamp: new Date(
          Date.now() + 12 * 86_400_000,
        ).toISOString(),
      })
      const text = flat(mountBanner())
      expect(text).toContain('Hold for 12 more days')
      expect(text).toContain('You are 12 days away from 15 USDC')
    })

    it('opens the offer modal from "Check progress"', async () => {
      status.value = 'holding'
      activeReward.value = reward()
      await mountBanner().get(SECONDARY).trigger('click')
      expect(openModal).toHaveBeenCalledTimes(1)
    })
  })

  describe('claimable', () => {
    it('points the first reward at the bonus that follows', () => {
      status.value = 'earned'
      activeReward.value = reward({ is_qualified: true })
      const banner = mountBanner()
      const text = flat(banner)
      expect(text).toContain("Here's your reward")
      expect(text).toContain('Keep holding to get 15 USDC more in 21 days')
      expect(banner.get(PRIMARY).text()).toBe('Claim 10 USDC')
    })

    it('sums both holds when the bonus is claimable', () => {
      status.value = 'earned'
      isRoundTwoActive.value = true
      rewardAmountLabel.value = '15 USDC'
      activeReward.value = reward({ round: 2, is_qualified: true })
      const banner = mountBanner()
      expect(flat(banner)).toContain('You held for 35 days total')
      expect(banner.get(PRIMARY).text()).toBe('Claim 15 USDC')
    })

    it('claims the active reward', async () => {
      status.value = 'earned'
      const entry = reward({ is_qualified: true })
      activeReward.value = entry
      await mountBanner().get(PRIMARY).trigger('click')
      expect(claim).toHaveBeenCalledWith(entry)
    })

    it('sends a watch-only address to log in', async () => {
      status.value = 'earned'
      isWatchOnly.value = true
      activeReward.value = reward({ is_qualified: true })
      await mountBanner().get(PRIMARY).trigger('click')
      expect(openAccessDialog).toHaveBeenCalledTimes(1)
      expect(claim).not.toHaveBeenCalled()
    })
  })

  describe('terminal states', () => {
    it('offers a fresh trade after a lost round 1', () => {
      status.value = 'lost'
      activeReward.value = reward({ is_disqualified: true })
      const banner = mountBanner()
      expect(flat(banner)).toContain("Didn't hold long enough")
      expect(banner.get(PRIMARY).text()).toBe('Trade again')
    })

    it('states the loss without a CTA after a lost round 2', () => {
      status.value = 'lost'
      isRoundTwoActive.value = true
      canRetryTrade.value = false
      activeReward.value = reward({ round: 2, is_disqualified: true })
      const banner = mountBanner()
      expect(flat(banner)).toContain("Didn't hold long enough")
      expect(banner.find(PRIMARY).exists()).toBe(false)
      expect(banner.find(SECONDARY).exists()).toBe(false)
    })

    it('offers a fresh trade after an expired round 1', () => {
      status.value = 'expired'
      activeReward.value = reward({ is_qualified: true })
      const banner = mountBanner()
      expect(flat(banner)).toContain('Reward expired')
      expect(banner.get(PRIMARY).text()).toBe('Trade again')
    })

    it('keeps out of the page once a reward is claimed', () => {
      status.value = 'claimed'
      activeReward.value = reward({ status: 'CLAIMED' })
      expect(mountBanner().find(BANNER).exists()).toBe(false)
    })

    it('keeps out of the page for a blocked wallet', () => {
      status.value = 'banned'
      expect(mountBanner().find(BANNER).exists()).toBe(false)
    })
  })

  describe('dismissal', () => {
    it('hides the banner and remembers it', async () => {
      status.value = 'holding'
      activeReward.value = reward()
      const banner = mountBanner()
      await banner.get(DISMISS).trigger('click')
      expect(banner.find(BANNER).exists()).toBe(false)
      // A fresh mount stays hidden for the same moment.
      expect(mountBanner().find(BANNER).exists()).toBe(false)
    })

    it('does not hide the next moment in the campaign', async () => {
      status.value = 'holding'
      activeReward.value = reward()
      const banner = mountBanner()
      await banner.get(DISMISS).trigger('click')
      expect(banner.find(BANNER).exists()).toBe(false)

      // The hold completes: this is new news, so it must surface.
      status.value = 'earned'
      await banner.vm.$nextTick()
      expect(banner.find(BANNER).exists()).toBe(true)
      expect(flat(banner)).toContain("Here's your reward")
    })

    it('keeps each round separate when dismissed', async () => {
      status.value = 'holding'
      activeReward.value = reward()
      const banner = mountBanner()
      await banner.get(DISMISS).trigger('click')
      expect(banner.find(BANNER).exists()).toBe(false)

      // The bonus hold is a different entry, so it is not covered.
      isRoundTwoActive.value = true
      activeReward.value = reward({ uuid: 'round-2-uuid', round: 2 })
      await banner.vm.$nextTick()
      expect(banner.find(BANNER).exists()).toBe(true)
    })

    it('reports the dismissal with its round', async () => {
      status.value = 'holding'
      isRoundTwoActive.value = true
      activeReward.value = reward({ round: 2 })
      await mountBanner().get(DISMISS).trigger('click')
      expect(trackHoldRewardsHomeBannerEvent).toHaveBeenCalledWith(
        'Hold_Rewards_Home_Banner_Dismissed',
        { status: 'holding', round: 2 },
      )
    })
  })

  describe('analytics', () => {
    it('reports one impression per banner moment', () => {
      status.value = 'holding'
      activeReward.value = reward()
      mountBanner()
      expect(trackHoldRewardsHomeBannerEvent).toHaveBeenCalledWith(
        'Hold_Rewards_Home_Banner_Shown',
        { status: 'holding', round: 1 },
      )
    })

    it('reports nothing when there is no banner to show', () => {
      status.value = 'claimed'
      activeReward.value = reward({ status: 'CLAIMED' })
      mountBanner()
      expect(trackHoldRewardsHomeBannerEvent).not.toHaveBeenCalled()
    })

    it('tags a banner CTA with the round', async () => {
      status.value = 'earned'
      isRoundTwoActive.value = true
      activeReward.value = reward({ round: 2, is_qualified: true })
      await mountBanner().get(PRIMARY).trigger('click')
      expect(trackRewardsAndOffersEvent).toHaveBeenCalledWith(
        'Clicked_Reward_Offer_CTA',
        expect.objectContaining({
          cta: 'claim',
          round: 2,
          location: 'home_banner',
        }),
      )
    })
  })
})
