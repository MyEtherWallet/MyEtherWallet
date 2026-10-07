import { describe, it, expect } from 'vitest'
import { ref, type Ref } from 'vue'
import { mount } from '@vue/test-utils'
import i18n from '@/i18n'
import {
  useRewardSteps,
  type RewardStep,
} from '@/modules/rwa_rewards/composables/useRewardSteps'
import type { RwaStatus } from '@/mew_api/schemaRwaRewards'

/** Run a composable inside a component so `useI18n()` has an app context. */
const withSetup = <T>(fn: () => T): T => {
  let result!: T
  mount(
    {
      setup() {
        result = fn()
        return () => null
      },
    },
    { global: { plugins: [i18n] } },
  )
  return result
}

interface Opts {
  status?: RwaStatus
  isRoundTwoActive?: boolean
  hasRoundTwo?: boolean
  round2HoldDays?: number | null
}

const setup = (opts: Opts = {}) => {
  const status = ref<RwaStatus>(opts.status ?? 'default')
  const isRoundTwoActive = ref(opts.isRoundTwoActive ?? false)
  const hasRoundTwo = ref(opts.hasRoundTwo ?? true)
  const round2HoldDays = ref<number | null>(opts.round2HoldDays ?? 21)
  const { steps } = withSetup(() =>
    useRewardSteps({
      status,
      isRoundTwoActive,
      hasRoundTwo,
      round1HoldDays: ref(14),
      round2HoldDays,
      qualificationAmount: ref('250'),
      qualifyingLabel: ref('0.57 NFLXon'),
      round1Label: ref('10 USDC'),
      round2Label: ref('15 USDC'),
    }),
  )
  return { steps, status, isRoundTwoActive, hasRoundTwo }
}

const states = (steps: Ref<RewardStep[]>) => steps.value.map(s => s.state)
const labels = (steps: Ref<RewardStep[]>) => steps.value.map(s => s.label)

describe('useRewardSteps', () => {
  it('always lists both rounds, so the bonus is visible from the start', () => {
    const { steps } = setup({ status: 'default' })
    expect(steps.value.map(s => s.kind)).toEqual([
      'trade',
      'hold1',
      'claim1',
      'hold2',
      'claim2',
    ])
    expect(steps.value.map(s => s.number)).toEqual([1, 2, 3, 4, 5])
  })

  it('drops the round-2 steps on a single-round season', () => {
    const { steps } = setup({ hasRoundTwo: false })
    expect(steps.value.map(s => s.kind)).toEqual(['trade', 'hold1', 'claim1'])
  })

  it('renders the offer copy from the server-driven amounts', () => {
    const { steps } = setup({ status: 'default' })
    expect(labels(steps)).toEqual([
      'Make a qualifying trade of $250 or more',
      'Hold your trade for 14 days',
      'Claim 10 USDC',
      'Hold your trade for 21 more days',
      'Claim 15 USDC',
    ])
    // Nothing has happened yet, so only step 1 carries a CTA.
    expect(steps.value.map(s => s.hasContent)).toEqual([
      true,
      false,
      false,
      false,
      false,
    ])
  })

  it('marks the trade done and the first hold current while holding round 1', () => {
    const { steps } = setup({ status: 'holding' })
    expect(states(steps)).toEqual([
      'done',
      'current',
      'plain',
      'plain',
      'plain',
    ])
    // The done step restates what the wallet actually got.
    expect(steps.value[0]!.label).toBe('You got 0.57 NFLXon')
  })

  it('puts the first claim on the current step when round 1 is claimable', () => {
    const { steps } = setup({ status: 'earned' })
    expect(states(steps)).toEqual(['done', 'done', 'current', 'plain', 'plain'])
    expect(steps.value[1]!.label).toBe('You held your trade for 14 days')
  })

  it('carries the whole first round as done once round 2 is holding', () => {
    const { steps } = setup({ status: 'holding', isRoundTwoActive: true })
    expect(states(steps)).toEqual(['done', 'done', 'done', 'current', 'plain'])
    expect(labels(steps).slice(0, 3)).toEqual([
      'You got 0.57 NFLXon',
      'You held your trade for 14 days',
      'You claimed 10 USDC',
    ])
    expect(steps.value[3]!.label).toBe('Hold your trade for 21 more days')
  })

  it('puts the bonus claim on the current step when round 2 is claimable', () => {
    const { steps } = setup({ status: 'earned', isRoundTwoActive: true })
    expect(states(steps)).toEqual(['done', 'done', 'done', 'done', 'current'])
    expect(steps.value[4]!.label).toBe('Claim 15 USDC')
  })

  it('fails the hold step that was broken, in either round', () => {
    const r1 = setup({ status: 'lost' })
    expect(states(r1.steps)).toEqual([
      'done',
      'failed',
      'plain',
      'plain',
      'plain',
    ])
    const r2 = setup({ status: 'lost', isRoundTwoActive: true })
    expect(states(r2.steps)).toEqual([
      'done',
      'done',
      'done',
      'failed',
      'plain',
    ])
  })

  it('fails the claim step when the window closed, in either round', () => {
    const r1 = setup({ status: 'expired' })
    expect(states(r1.steps)).toEqual([
      'done',
      'done',
      'failed',
      'plain',
      'plain',
    ])
    const r2 = setup({ status: 'expired', isRoundTwoActive: true })
    expect(states(r2.steps)).toEqual(['done', 'done', 'done', 'done', 'failed'])
  })

  it('completes only the first round when round 1 is claimed', () => {
    const { steps } = setup({ status: 'claimed' })
    expect(states(steps)).toEqual(['done', 'done', 'done', 'plain', 'plain'])
    expect(steps.value[2]!.label).toBe('You claimed 10 USDC')
  })

  it('completes the whole timeline when round 2 is claimed', () => {
    const { steps } = setup({ status: 'claimed', isRoundTwoActive: true })
    expect(states(steps)).toEqual(['done', 'done', 'done', 'done', 'done'])
    expect(steps.value[4]!.label).toBe('You claimed 15 USDC')
  })

  it('reacts to a status change without being rebuilt', () => {
    const { steps, status } = setup({ status: 'holding' })
    expect(steps.value[1]!.state).toBe('current')
    status.value = 'earned'
    expect(steps.value[1]!.state).toBe('done')
    expect(steps.value[2]!.state).toBe('current')
  })

  it('reads the round-2 hold length from the server, not a constant', () => {
    // Dev runs a 5-"day" hold; the copy must follow the payload.
    const { steps } = setup({ round2HoldDays: 5 })
    expect(steps.value[3]!.label).toBe('Hold your trade for 5 more days')
  })

  it('uses the singular branch for a one-day hold', () => {
    const { steps } = setup({ round2HoldDays: 1 })
    expect(steps.value[3]!.label).toBe('Hold your trade for 1 more day')
  })
})
