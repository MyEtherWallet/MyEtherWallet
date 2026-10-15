<script setup lang="ts">
/**
 * Pagination (Figma: MEW Web App — Design Library › Pagination, component set
 * 1074:3108). Moves between pages of a long list or table with previous/next
 * icon buttons. `v-model` is the 1-based page; the buttons disable at the
 * bounds, so a single page renders with both disabled (callers `v-if` it away
 * if they prefer). Breakpoint is responsive at `md`, not a prop.
 *
 * Gap is 12/20 rather than Figma's 16/24 because AppDivider is an 8px slot with
 * the rule centred: the line-to-row distance still lands on 16/24.
 *
 * @example <AppPagination v-model="page" :total-pages="pages" variant="alternative" />
 */
import { useI18n } from 'vue-i18n'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import AppDivider from '@/components/divider/AppDivider.vue'
import { PAGINATION_DIVIDER, type PaginationVariant } from './types'

const page = defineModel<number>({ required: true })
const props = withDefaults(
  defineProps<{
    totalPages: number
    variant?: PaginationVariant
    /** Overrides the "Showing page X of Y" copy. */
    label?: (page: number, total: number) => string
  }>(),
  { variant: 'default' },
)

const { t } = useI18n()

const go = (n: number) => {
  const next = Math.min(Math.max(n, 1), props.totalPages)
  if (next !== page.value) page.value = next
}
</script>

<template>
  <nav
    :aria-label="t('common.pagination')"
    class="flex w-full flex-col gap-3 md:gap-5"
  >
    <AppDivider :variant="PAGINATION_DIVIDER[variant]" />
    <div class="flex items-center gap-3">
      <p
        class="min-w-0 flex-1 text-text-sm text-text-default md:text-text-base"
        aria-live="polite"
      >
        {{
          label
            ? label(page, totalPages)
            : t('common.showing_page', { current: page, total: totalPages })
        }}
      </p>
      <AppBtnIcon
        variant="filled"
        size="l"
        :label="t('common.previous_page')"
        :disabled="page <= 1"
        @click="go(page - 1)"
      >
        <AppIcon name="chevron-left" variant="filled" size="m" />
      </AppBtnIcon>
      <AppBtnIcon
        variant="filled"
        size="l"
        :label="t('common.next_page')"
        :disabled="page >= totalPages"
        @click="go(page + 1)"
      >
        <AppIcon name="chevron-right" variant="filled" size="m" />
      </AppBtnIcon>
    </div>
  </nav>
</template>
