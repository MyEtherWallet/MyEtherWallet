<template>
  <div class="flex flex-col gap-1 p-1 w-[232px]">
    <button
      data-test="menu-rename"
      type="button"
      class="flex items-center gap-2 p-3 rounded-12 w-full cursor-pointer hover:bg-[#f5f5f5]"
      @click="select('rename')"
    >
      <span
        class="flex-1 text-left font-normal text-s-14 leading-[20px] text-black"
      >
        {{ $t('multi_address.menu.rename') }}
      </span>
      <AppIcon
        name="pencil-square"
        variant="filled"
        size="xxs"
        class="text-black"
      />
    </button>

    <button
      data-test="menu-copy"
      type="button"
      class="flex items-center gap-2 p-3 rounded-12 w-full cursor-pointer hover:bg-[#f5f5f5]"
      @click="select('copy')"
    >
      <span
        class="flex-1 text-left font-normal text-s-14 leading-[20px] text-black"
      >
        {{ $t('multi_address.menu.copy') }}
      </span>
      <AppIcon
        name="clipboard-document"
        variant="filled"
        size="xxs"
        class="text-black"
      />
    </button>

    <button
      data-test="menu-refresh"
      type="button"
      class="flex items-center gap-2 p-3 rounded-12 w-full cursor-pointer hover:bg-[#f5f5f5]"
      @click="select('refresh')"
    >
      <span
        class="flex-1 text-left font-normal text-s-14 leading-[20px] text-black"
      >
        {{ $t('multi_address.menu.refresh') }}
      </span>
      <AppIcon
        name="arrow-path"
        variant="filled"
        size="xxs"
        class="text-black"
      />
    </button>

    <div class="h-px w-full bg-grey-10" />

    <button
      data-test="menu-paper"
      type="button"
      class="flex items-center gap-2 p-3 rounded-12 w-full cursor-pointer hover:bg-[#f5f5f5]"
      @click="select('paper')"
    >
      <span
        class="flex-1 text-left font-normal text-s-14 leading-[20px] text-black"
      >
        {{ $t('multi_address.menu.paper_wallet') }}
      </span>
      <AppIcon name="document" variant="filled" size="xxs" class="text-black" />
    </button>

    <button
      data-test="menu-explorer"
      type="button"
      class="flex items-center gap-2 p-3 rounded-12 w-full cursor-pointer hover:bg-[#f5f5f5]"
      @click="select('explorer')"
    >
      <span
        class="flex-1 text-left font-normal text-s-14 leading-[20px] text-black"
      >
        {{ $t('multi_address.menu.explorer') }}
      </span>
      <AppIcon
        name="arrow-top-right-on-square"
        variant="filled"
        size="xxs"
        class="text-black"
      />
    </button>

    <div class="h-px w-full bg-grey-10" />

    <button
      v-if="kind === 'signing'"
      data-test="menu-disconnect"
      type="button"
      class="flex items-center gap-2 p-3 rounded-12 w-full cursor-pointer hover:bg-[#f5f5f5]"
      @click="select('disconnect')"
    >
      <span
        class="flex-1 text-left font-normal text-s-14 leading-[20px] text-black"
      >
        {{ $t('multi_address.menu.disconnect') }}
      </span>
      <AppIcon
        name="link-slash"
        variant="filled"
        size="xxs"
        class="text-black"
      />
    </button>

    <button
      data-test="menu-remove"
      type="button"
      class="flex items-center gap-2 p-3 rounded-12 w-full cursor-pointer hover:bg-[#f5f5f5]"
      @click="select('remove')"
    >
      <span
        class="flex-1 text-left font-semibold text-s-14 leading-[20px] text-[#e40c58]"
      >
        {{ $t('multi_address.menu.remove') }}
      </span>
      <AppIcon
        name="trash"
        variant="filled"
        size="xxs"
        class="text-[#e40c58]"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import AppIcon from '@/components/icon/AppIcon.vue'

type MenuAction =
  | 'rename'
  | 'copy'
  | 'refresh'
  | 'paper'
  | 'explorer'
  | 'disconnect'
  | 'remove'

const props = withDefaults(
  defineProps<{
    kind: 'signing' | 'watchOnly'
    isActive?: boolean
    toggle?: () => void
  }>(),
  { isActive: false, toggle: undefined },
)

const emit = defineEmits<(e: MenuAction) => void>()

const select = (action: MenuAction): void => {
  emit(action)
  props.toggle?.()
}
</script>
