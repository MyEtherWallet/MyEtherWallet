<template>
  <!-- data-private: nothing in here may reach session replay. No word goes
       into an attribute either: attributes are recorded regardless. -->
  <div class="flex flex-col gap-6" data-private>
    <!-- Header: back + centered title -->
    <div class="relative flex min-h-8 items-center justify-center">
      <app-btn-icon
        size="s"
        :label="$t('common.back')"
        class="absolute left-0"
        @click="emit('back')"
      >
        <AppIcon name="chevron-left" size="s" />
      </app-btn-icon>
      <h3 class="text-heading-base text-black">
        {{ $t('settings.recovery_phrase') }}
      </h3>
    </div>

    <!-- Two columns filled top to bottom, left column first. -->
    <ol
      data-test="phrase-grid"
      class="grid grid-flow-col grid-cols-2 gap-x-6 gap-y-2 rounded-16 bg-background-default p-4"
      :style="{ gridTemplateRows: `repeat(${rowCount}, minmax(0, auto))` }"
    >
      <li
        v-for="(word, index) in words"
        :key="index"
        class="flex h-7 items-center gap-3"
      >
        <!-- While hidden the word is not in the page at all: a blur would
             leave it readable in the DOM. -->
        <template v-if="revealed">
          <span data-test="phrase-word" class="flex items-center gap-3">
            <span class="w-6 text-text-sm text-text-subtle">{{
              index + 1
            }}</span>
            <span class="text-text-base text-text-default">{{ word }}</span>
          </span>
        </template>
        <template v-else>
          <span class="w-6 text-text-sm text-text-subtle">{{ index + 1 }}</span>
          <span
            class="h-3 w-20 rounded-full bg-background-default-pressed"
            aria-hidden="true"
          />
        </template>
      </li>
    </ol>

    <app-btn-group :has-padding="false">
      <app-base-button type="secondary" @click="toggle">
        <span class="flex items-center gap-2">
          <AppIcon :name="revealed ? 'eye-slash' : 'eye'" size="s" />
          {{
            revealed ? $t('settings.phrase.hide') : $t('settings.phrase.show')
          }}
        </span>
      </app-base-button>
      <app-base-button type="secondary" @click="copy">
        <span class="flex items-center gap-2">
          <AppIcon name="document-duplicate" size="s" />
          {{
            copied ? $t('settings.phrase.copied') : $t('settings.phrase.copy')
          }}
        </span>
      </app-base-button>
    </app-btn-group>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { analytics } from '@/analytics'
import { AccountSecurityEvent } from '@/analytics/events'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnGroup from '@/components/AppBtnGroup.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppIcon from '@/components/icon/AppIcon.vue'

/**
 * Settings › Recovery Phrase: the words of the connected Privy wallet's
 * recovery phrase, hidden until the user asks to see them. The owner passes
 * the words in and drops them when this screen goes away; nothing here keeps,
 * logs or reports any of them, or how many there are.
 */
const props = defineProps<{
  /** The phrase, one word per entry, in order. */
  words: readonly string[]
}>()

const emit = defineEmits<{
  back: []
}>()

/** How long the Copy button reads "Copied!". */
const COPIED_MS = 2000

const revealed = ref(false)
const copied = ref(false)
let copiedTimer: ReturnType<typeof setTimeout> | undefined

const rowCount = computed(() => Math.ceil(props.words.length / 2))

const toggle = (): void => {
  revealed.value = !revealed.value
  if (revealed.value) {
    void analytics.trackAccountSecurityEvent(
      AccountSecurityEvent.RECOVERY_PHRASE_REVEALED,
    )
  }
}

// Copy works while the words are hidden too, as the design offers it there.
const copy = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(props.words.join(' '))
  } catch {
    return
  }
  copied.value = true
  clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => {
    copied.value = false
  }, COPIED_MS)
  void analytics.trackAccountSecurityEvent(
    AccountSecurityEvent.RECOVERY_PHRASE_COPIED,
  )
}

onBeforeUnmount(() => clearTimeout(copiedTimer))
</script>
