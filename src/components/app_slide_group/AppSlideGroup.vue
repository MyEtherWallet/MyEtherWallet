<template>
  <div class="static -mx-1 w-full flex flex-col">
    <div
      class="flex flex-wrap overflow-hidden relative before:content-['_'] after:content-['_']"
      :class="{
        'before:absolute before:left-0 before:top-0 before:h-full before:w-5 before:bg-gradient-to-r before:from-appBackground before:to-transparent before:z-[1]  before:pointer-events-none':
          blurFront && !edgeNav,
        'after:absolute after:right-0 after:top-0 after:h-full after:w-5 after:bg-gradient-to-l after:from-appBackground after:to-transparent  after:pointer-events-none  after:z-[1]':
          blurEnd && !edgeNav,
        'before:absolute before:left-0 before:top-0 before:h-full before:w-16 before:bg-gradient-to-r before:from-appBackground before:to-transparent before:z-[1] before:pointer-events-none':
          blurFront && edgeNav,
        'after:absolute after:right-0 after:top-0 after:h-full after:w-16 after:bg-gradient-to-l after:from-appBackground after:to-transparent after:pointer-events-none after:z-[1]':
          blurEnd && edgeNav,
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

      <!-- Edge-centered circular nav buttons (opt-in via edgeNav) -->
      <button
        v-if="edgeNav && blurFront"
        type="button"
        :aria-label="$t('common.previous_page')"
        class="absolute left-1 top-1/2 z-[2] flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.12)] transition hover:shadow-md"
        @click="scrollToPreviousGroup"
      >
        <ChevronLeftIcon class="size-5" />
      </button>
      <button
        v-if="edgeNav && blurEnd"
        type="button"
        :aria-label="$t('common.next_page')"
        class="absolute right-1 top-1/2 z-[2] flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.12)] transition hover:shadow-md"
        @click="scrollToNextGroup"
      >
        <ChevronRightIcon class="size-5" />
      </button>
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
        <ChevronLeftIcon class="w-4 h-4" />
      </app-btn-icon>
      <app-btn-icon
        v-if="!allIsVisible && !edgeNav"
        class="-mr-2"
        :label="$t('common.next_page')"
        @click="scrollToNextGroup"
      >
        <ChevronRightIcon class="w-4 h-4" />
      </app-btn-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppSlideItem from './AppSlideItem.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'
import { computed, ref, useTemplateRef, type PropType } from 'vue'
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
   * Opt-in: render circular edge-centered prev/next buttons (over the fades)
   * instead of the default bottom-right icon buttons.
   */
  edgeNav: {
    type: Boolean,
    default: false,
  },
})

const scrollContainer = useTemplateRef('scrollContainer')

const { width } = useElementBounding(scrollContainer)

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

const blurFront = computed(() => {
  return !visibleItems.value.has(0)
})
const blurEnd = computed(() => {
  return !visibleItems.value.has(props.totalItems - 1)
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
