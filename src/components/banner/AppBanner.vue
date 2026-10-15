<template>
  <AppBannerBase
    v-if="isVisible"
    :role="spec.role"
    :title="title"
    :description="description"
    :dismissible="dismissible"
    @close="onClose"
  >
    <template #icon>
      <AppIconContainer :icon="spec.icon" :tone="spec.tone" />
      <span class="sr-only">{{ $t(`common.banner_type.${type}`) }}</span>
    </template>
    <template v-if="$slots.default" #default><slot /></template>
    <template v-if="$slots.actions" #actions><slot name="actions" /></template>
  </AppBannerBase>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppBannerBase from '@/components/banner/AppBannerBase.vue'
import AppIconContainer from '@/components/icon_container/AppIconContainer.vue'
import { BANNER_TYPE_SPEC, type BannerType } from '@/components/banner/types'

/**
 * Banner (design library, Figma 3740:42238): inline feedback at the top of a
 * page or section. `type` only swaps the status icon and the live-region role;
 * the container is grey for every type. The type word is read out (sr-only)
 * before the title so meaning never rests on colour.
 *
 * Visibility is `v-model` (default true). Dismissing hides it locally; bind
 * the model to persist the dismissal. Actions are caller-supplied
 * `AppBaseButton size="small"`s; the banner only lays them out.
 *
 * @example
 * <AppBanner type="warning" :title="t('x.title')" :description="t('x.body')" />
 * @example
 * <AppBanner v-model="showNotice" dismissible :description="t('x.body')">
 *   <template #actions>
 *     <AppBaseButton size="small" @click="addNetwork">Add network</AppBaseButton>
 *   </template>
 * </AppBanner>
 */
const props = withDefaults(
  defineProps<{
    type?: BannerType
    title?: string
    description?: string
    dismissible?: boolean
  }>(),
  { type: 'info', title: undefined, description: undefined },
)
const emit = defineEmits<{ close: [] }>()
const isVisible = defineModel<boolean>({ default: true })

const spec = computed(() => BANNER_TYPE_SPEC[props.type])

const onClose = () => {
  isVisible.value = false
  emit('close')
}
</script>
