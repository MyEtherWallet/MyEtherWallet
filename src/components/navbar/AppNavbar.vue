<template>
  <header
    :class="[
      // Height on the header so the scrolled border sits inside the 76px.
      'h-19 w-full border-b bg-background-alternative transition-colors',
      scrolled ? 'border-border-default' : 'border-transparent',
    ]"
  >
    <div
      class="flex h-full w-full items-center justify-between gap-3 px-4 sm:px-5"
    >
      <!-- Left: hamburger (compact) + logo + links (desktop) -->
      <div class="flex min-w-0 items-center gap-2 sm:gap-3">
        <AppBtnIcon
          icon="bars-3"
          :label="t('menu.open-menu')"
          :aria-expanded="menuOpen"
          class="xl:hidden"
          @click="emit('toggle-menu')"
        />
        <router-link :to="{ name: ROUTES_MAIN.HOME.NAME }" class="shrink-0">
          <img
            src="@/assets/images/mew/logo-header.webp"
            :alt="t('home')"
            width="280"
            height="96"
            class="hidden h-12 w-35 object-contain xl:block"
          />
          <img
            src="@/assets/images/access/portfolio_icon.webp"
            :alt="t('home')"
            width="100"
            height="100"
            class="size-10 xl:hidden"
          />
        </router-link>
        <!-- 36 + the 12 gap = Figma's 48 from the logo edge -->
        <nav
          :aria-label="t('menu.main')"
          class="ml-9 hidden items-center gap-2 xl:flex"
        >
          <slot name="links" />
        </nav>
      </div>
      <!-- Right: search + wallet area + actions -->
      <div class="flex shrink-0 items-center gap-2 sm:gap-4">
        <slot name="search" />
        <slot v-if="walletSaved" name="wallet" />
        <AppBaseButton
          v-else
          size="medium"
          data-testid="navbar-log-in"
          @click="emit('log-in')"
        >
          <!-- Below 450 the wording is the short one: a long translation
               (Spanish) would crush the logo and the hamburger. -->
          <span class="max-[450px]:hidden">
            {{ t('access_wallet.social.title') }}
          </span>
          <span class="min-[450px]:hidden">
            {{ t('access_wallet.social.title_short') }}
          </span>
        </AppBaseButton>
        <div v-if="$slots.actions" class="flex items-center gap-2">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import { ROUTES_MAIN } from '@/router/routeNames'

/**
 * Navbar (design library, Figma 1078:1485). Responsive app bar: desktop
 * (≥ xl/1280) shows the logo wordmark and the links; compact (< 1280) swaps in
 * the hamburger and the logo mark. Content spans the full window width at
 * every size, like the previous header (Figma caps it at 1440; product kept
 * full width, MEW-2463).
 *
 * Without a saved wallet the wallet area is one "Log in/Sign Up" button at
 * every width (Figma Onboarding 1963:156148). It replaced the separate Create
 * and Connect buttons: logging in covers both. Below 450 it uses the short
 * label, which a translation shortens only if its full one doesn't fit there.
 *
 * The navbar owns layout only. Links, search, the saved-wallet trigger and the
 * notifications/settings actions come in through slots, because each of those
 * ships its own popup today. `#links` takes AppNavLinks; `#wallet` takes the
 * AppAddressSelector trigger. The hamburger and the button only emit; the
 * layout owns what they open.
 */
defineProps<{
  /** Wallet saved? (Figma axis): true renders `#wallet`, false the button. */
  walletSaved: boolean
  /** Hamburger state, mirrored to aria-expanded. */
  menuOpen?: boolean
  /** Page scrolled past the top: shows the bottom border. */
  scrolled?: boolean
}>()

const emit = defineEmits<{
  'toggle-menu': []
  'log-in': []
}>()

const { t } = useI18n()
</script>
