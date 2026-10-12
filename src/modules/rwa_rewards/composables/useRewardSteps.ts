import { computed, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { RwaStatus } from '@/mew_api/schemaRwaRewards'

export type RewardStepKind = 'trade' | 'hold1' | 'claim1' | 'hold2' | 'claim2'
export type RewardStepState = 'done' | 'current' | 'failed' | 'plain'

export interface RewardStep {
  kind: RewardStepKind
  number: number
  state: RewardStepState
  label: string
  /** Whether the step expands with a CTA, day grid or reward card. */
  hasContent: boolean
}

interface UseRewardStepsOptions {
  status: Ref<RwaStatus>
  isRoundTwoActive: Ref<boolean>
  hasRoundTwo: Ref<boolean>
  round1HoldDays: Ref<number>
  round2HoldDays: Ref<number | null>
  qualificationAmount: Ref<string>
  /** The qualifying trade, e.g. "0.57 NFLXon"; empty until an entry exists. */
  qualifyingLabel: Ref<string>
  round1Label: Ref<string>
  round2Label: Ref<string>
}

const ROUND_ONE_KINDS: RewardStepKind[] = ['trade', 'hold1', 'claim1']
const ALL_KINDS: RewardStepKind[] = [...ROUND_ONE_KINDS, 'hold2', 'claim2']

/**
 * The campaign timeline as one list of steps — trade, hold, claim, hold again,
 * claim again — with each step's state derived from the shared `status` and
 * which round it belongs to. Every surface renders the same list so the
 * bonus round is always visible, not only once it starts.
 */
export const useRewardSteps = ({
  status,
  isRoundTwoActive,
  hasRoundTwo,
  round1HoldDays,
  round2HoldDays,
  qualificationAmount,
  qualifyingLabel,
  round1Label,
  round2Label,
}: UseRewardStepsOptions) => {
  const { t } = useI18n()

  const kinds = computed(() =>
    hasRoundTwo.value ? ALL_KINDS : ROUND_ONE_KINDS,
  )

  // How far along the timeline the wallet is: the number of finished steps,
  // and the step it is on with how it is going (still open, or failed).
  const progress = computed<{
    completed: number
    active: RewardStepKind | null
    activeState: 'current' | 'failed'
  }>(() => {
    const r2 = isRoundTwoActive.value
    switch (status.value) {
      case 'holding':
        return r2
          ? { completed: 3, active: 'hold2', activeState: 'current' }
          : { completed: 1, active: 'hold1', activeState: 'current' }
      case 'earned':
        return r2
          ? { completed: 4, active: 'claim2', activeState: 'current' }
          : { completed: 2, active: 'claim1', activeState: 'current' }
      case 'lost':
        return r2
          ? { completed: 3, active: 'hold2', activeState: 'failed' }
          : { completed: 1, active: 'hold1', activeState: 'failed' }
      case 'expired':
        return r2
          ? { completed: 4, active: 'claim2', activeState: 'failed' }
          : { completed: 2, active: 'claim1', activeState: 'failed' }
      case 'claimed':
        return {
          completed: r2 ? 5 : 3,
          active: null,
          activeState: 'current',
        }
      default:
        return { completed: 0, active: null, activeState: 'current' }
    }
  })

  const label = (kind: RewardStepKind, done: boolean) => {
    const r1Days = round1HoldDays.value
    const r2Days = round2HoldDays.value ?? 0
    switch (kind) {
      case 'trade':
        return done
          ? t('rwaRewards.step_trade_done', { amount: qualifyingLabel.value })
          : t('rwaRewards.step_trade', { amount: qualificationAmount.value })
      case 'hold1':
        return t(
          done ? 'rwaRewards.step_hold_done' : 'rwaRewards.step_hold',
          { count: r1Days },
          r1Days,
        )
      case 'claim1':
        return t(
          done ? 'rwaRewards.step_claim_done' : 'rwaRewards.step_claim',
          {
            amount: round1Label.value,
          },
        )
      case 'hold2':
        return t(
          done ? 'rwaRewards.step_hold_more_done' : 'rwaRewards.step_hold_more',
          { count: r2Days },
          r2Days,
        )
      case 'claim2':
        return t(
          done ? 'rwaRewards.step_claim_done' : 'rwaRewards.step_claim',
          {
            amount: round2Label.value,
          },
        )
    }
  }

  const steps = computed<RewardStep[]>(() => {
    const { completed, active, activeState } = progress.value
    // Nothing started yet: step 1 carries the trade CTA.
    const isOffer = completed === 0 && active === null
    return kinds.value.map((kind, i) => {
      const state: RewardStepState =
        i < completed ? 'done' : kind === active ? activeState : 'plain'
      return {
        kind,
        number: i + 1,
        state,
        label: label(kind, state === 'done'),
        hasContent:
          (kind === 'trade' && isOffer) ||
          state === 'current' ||
          state === 'failed',
      }
    })
  })

  return { steps }
}
