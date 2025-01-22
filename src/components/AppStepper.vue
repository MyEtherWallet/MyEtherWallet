<template>
  <div class="w-full">
    <!-- Steps -->
    <div
      :class="['flex items-center w-full px-6', { 'md:mb-8': showStepNumber }]"
      :aria-label="`Step ${activeStep + 1} of ${steps.length}`"
    >
      <div
        v-for="(step, index) in steps"
        :key="index"
        :class="['flex items-center', { grow: index !== steps.length - 1 }]"
        aria-hidden="true"
      >
        <div
          :class="[
            'flex flex-col items-center justify-center md:px-4',
            { 'cursor-pointer': index < activeStep },
          ]"
          @click="backStep(index)"
        >
          <div
            :class="[
              'w-6 h-6 rounded-full  bg-grey-30 flex items-center justify-center relative',
              {
                '!bg-primary': index === activeStep,
              },
              {
                '!bg-white border border-primary border-2': index < activeStep,
              },
            ]"
          >
            <!-- TODO: Add proper icon-->
            <span v-if="index < activeStep" class="text-primary text-xs">
              x
            </span>
            <span v-else class="text-white text-xs">{{ index + 1 }}</span>
            <span
              v-if="showStepNumber"
              :class="[
                'hidden md:block absolute top-8 w-[120px] text-center text-xs lowercase',
                { 'text-info': index > activeStep },
              ]"
              >{{ step }}</span
            >
          </div>
        </div>
        <hr
          v-if="index !== steps.length - 1"
          class="h-px bg-grey-30 border-0 w-full"
        />
      </div>
    </div>
    <!-- Step Content -->
    <Transition name="fade">
      <slot />
    </Transition>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  steps: {
    type: Array as () => string[],
    required: true,
  },
  activeStep: {
    type: Number,
    required: true,
  },
  enableBackStep: {
    type: Boolean,
    default: true,
  },
  showStepNumber: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits<{
  'update:activeStep': [step: number]
}>()

const backStep = (_step: number) => {
  if (
    props.enableBackStep &&
    props.activeStep > 0 &&
    _step < props.activeStep
  ) {
    emit('update:activeStep', _step)
  }
}
</script>
