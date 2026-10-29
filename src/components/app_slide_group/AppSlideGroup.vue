<template>
  <div class="static -mx-1 w-full flex flex-col">
    <div
      class="flex flex-wrap overflow-hidden relative before:content-['_'] after:content-['_']"
      :class="{
        'before:absolute before:left-0 before:top-0 before:h-full before:w-5 before:bg-gradient-to-r before:from-background-default before:to-transparent before:z-[1]  before:pointer-events-none':
          canScrollStart && !edgeNav,
        'after:absolute after:right-0 after:top-0 after:h-full after:w-5 after:bg-gradient-to-l after:from-background-default after:to-transparent  after:pointer-events-none  after:z-[1]':
          canScrollEnd && !edgeNav,
        'order-2': paginateLocation === 'top',
      }"
    >
      <div
        class="basis-full w-full flex items-center gap-2 md:gap-4 relative overflow-auto snap-x py-1 px-1 no-scrollbar scroll-m-6"
        ref="scrollContainer"
      >
        <div
          v-for="(item, index) in totalItems"
          :key="`scroll-item-${index}`"
          :id="`scroll-item-${index}`"
          :class="
            edgeNav
              ? 'w-full flex justify-center snap-center md:block md:w-[80%] md:justify-start md:snap-start md:scroll-ml-6'
              : 'w-[80%] snap-start scroll-ml-6'
          "
        >
          <app-slide-item
            :item-index="index"
            @change:item-visible="setVisibility"
          >
            <slot :name="`item-${index}`" />
          </app-slide-item>
        </div>
      </div>

      <AppScrollFade
        v-if="edgeNav && canScrollStart"
        side="left"
        :label="$t('common.previous_page')"
        @click="scrollToPreviousGroup"
      />
      <AppScrollFade
        v-if="edgeNav && canScrollEnd"
        side="right"
        :label="$t('common.next_page')"
        @click="scrollToNextGroup"
      />
    </div>
    <div
      v-if="!edgeNav || title"
      class="flex items-center justify-end"
      :class="[paginateLocation === 'top' ? 'order-1 mb-1' : '']"
    >
      <h2 v-if="title" class="text-s-20 font-bold ml-4 mr-auto">{{ title }}</h2>

      <app-btn-icon
        v-if="!allIsVisible && !edgeNav"
        :label="$t('common.previous_page')"
        class="ml-auto"
        @click="scrollToPreviousGroup"
      >
        <AppIcon name="chevron-left" variant="filled" size="xxs" />
      </app-btn-icon>
      <app-btn-icon
        v-if="!allIsVisible && !edgeNav"
        class="-mr-2"
        :label="$t('common.next_page')"
        @click="scrollToNextGroup"
      >
        <AppIcon name="chevron-right" variant="filled" size="xxs" />
      </app-btn-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppSlideItem from './AppSlideItem.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import AppScrollFade from '@/components/scroll_fade/AppScrollFade.vue'
import { useScrollEdges } from '@/components/scroll_fade/useScrollEdges'
import {
  computed,
  ref,
  useTemplateRef,
  nextTick,
  watch,
  type PropType,
} from 'vue'
import { useElementBounding } from '@vueuse/core'
import BigNumber from 'bignumber.js'
const props = defineProps({
  totalItems: {
    type: Number,
    required: true,
  },
  paginateLocation: {
    type: String as PropType<'top' | 'bottom'>,
    required: false,
    default: 'bottom',
  },
  title: {
    type: String,
    required: false,
  },
  /**
   * Opt-in: render design-library ScrollFades (fade + edge-centered prev/next
   * buttons) instead of the narrow fades and bottom-right icon buttons.
   */
  edgeNav: {
    type: Boolean,
    default: false,
  },
})

const scrollContainer = useTemplateRef('scrollContainer')

const { width } = useElementBounding(scrollContainer)

// Edge fades are driven by the actual scroll position (not item visibility):
// a strict 1.0 intersection threshold meant the edge item never counted as
// fully visible at the boundary, so the fade lingered with nothing left to
// scroll. We recompute the edges on scroll AND on mount / resize / item-count
// change — the last is essential because async-loaded items grow scrollWidth
// without resizing the container, so a scroll-only signal would miss them.
const {
  canScrollStart,
  canScrollEnd,
  update: updateEdges,
} = useScrollEdges(scrollContainer)
watch(
  () => props.totalItems,
  () => nextTick(updateEdges),
)

const visibleItems = ref<Set<number>>(new Set<number>())

const setVisibility = (itemIndex: number, isVisible: boolean) => {
  if (isVisible) {
    visibleItems.value.add(itemIndex)
  } else {
    visibleItems.value.delete(itemIndex)
  }
}

const allIsVisible = computed(() => {
  return visibleItems.value.size === props.totalItems
})

const scrollToNextGroup = () => {
  const scrollSize = new BigNumber(width.value).multipliedBy(0.8).toNumber()
  scrollContainer.value?.scrollBy({ left: scrollSize, behavior: 'smooth' })
}

const scrollToPreviousGroup = () => {
  const scrollSize = new BigNumber(width.value).multipliedBy(0.8).toNumber()
  scrollContainer.value?.scrollBy({ left: -scrollSize, behavior: 'smooth' })
}

// Reset the carousel to the first item — used by consumers when the underlying
// item set changes (e.g. a tab switch) so the view doesn't stay mid-scroll.
const scrollToStart = () => {
  scrollContainer.value?.scrollTo({ left: 0, behavior: 'smooth' })
}

defineExpose({ scrollToStart })
</script>
