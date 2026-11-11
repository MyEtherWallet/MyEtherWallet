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
        <template v-else>
          <!-- max-[550px]:hidden, not hidden: the button's own inline-flex beats it -->
          <AppBaseButton
            type="secondary"
            surface="alternative"
            size="medium"
            class="max-[550px]:hidden"
            @click="emit('create-wallet')"
          >
            <span class="xl:max-2xl:hidden">{{
              t('common.create_wallet')
            }}</span>
            <span class="hidden xl:max-2xl:inline">
              {{ t('common.create_wallet_short') }}
            </span>
          </AppBaseButton>
          <AppBaseButton
            size="medium"
            class="max-[550px]:hidden"
            @click="emit('connect-wallet')"
          >
            <span class="xl:max-2xl:hidden">{{ t('connect_wallet') }}</span>
            <span class="hidden xl:max-2xl:inline">
              {{ t('common.connect_wallet_short') }}
            </span>
          </AppBaseButton>
          <!-- Below 550: Connect opens a menu with both CTAs -->
          <AppPopUpMenu
            :placeholder="t('connect_wallet')"
            location="right"
            teleport
            menu-radius-class="rounded-16"
            class="min-[550px]:hidden"
          >
            <template #menu-button="{ toggleMenu }">
              <AppBaseButton
                size="medium"
                aria-haspopup="menu"
                data-testid="navbar-wallet-menu"
                @click="toggleMenu"
              >
                {{ t('common.connect_wallet_short') }}
                <template #trailing>
                  <AppIcon name="chevron-down" variant="filled" size="xs" />
                </template>
              </AppBaseButton>
            </template>
            <template #menu-content="{ toggleMenu }">
              <AppBtnGroup
                orientation="vertical"
                data-testid="navbar-wallet-menu-ctas"
                class="w-60"
              >
                <AppBaseButton
                  type="secondary"
                  surface="alternative"
                  size="medium"
                  @click="onMenuSelect('create-wallet', toggleMenu)"
                >
                  {{ t('common.create_wallet') }}
                </AppBaseButton>
                <AppBaseButton
                  size="medium"
                  @click="onMenuSelect('connect-wallet', toggleMenu)"
                >
                  {{ t('connect_wallet') }}
                </AppBaseButton>
              </AppBtnGroup>
            </template>
          </AppPopUpMenu>
        </template>
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
import AppBtnGroup from '@/components/AppBtnGroup.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import { ROUTES_MAIN } from '@/router/routeNames'

/**
 * Navbar (design library, Figma 1078:1485). Responsive app bar: desktop
 * (≥ xl/1280) shows the logo wordmark, the links and the Create + Connect CTAs;
 * compact (< 1280) swaps in the hamburger and the logo mark. Content spans
 * the full window width at every size, like the previous header (Figma caps
 * it at 1440; product kept full width, MEW-2463).
 *
 * The navbar owns layout only. Links, search, the saved-wallet trigger and the
 * notifications/settings actions come in through slots, because each of those
 * ships its own popup today. `#links` takes AppNavLinks; `#wallet` takes the
 * AppAddressSelector trigger. The hamburger and the CTAs only emit; the
 * layout owns what they open.
 *
 * Between 1280 and 1440 the full row doesn't fit, so the CTAs drop "wallet".
 * Below 550 both give way to one "Connect" that opens a menu with the two CTAs.
 */
defineProps<{
  /** Wallet saved? (Figma axis): true renders `#wallet`, false the CTAs. */
  walletSaved: boolean
  /** Hamburger state, mirrored to aria-expanded. */
  menuOpen?: boolean
  /** Page scrolled past the top: shows the bottom border. */
  scrolled?: boolean
}>()

const emit = defineEmits<{
  'toggle-menu': []
  'create-wallet': []
  'connect-wallet': []
}>()

const { t } = useI18n()

const onMenuSelect = (
  event: 'create-wallet' | 'connect-wallet',
  close: () => void,
): void => {
  close()
  if (event === 'create-wallet') emit('create-wallet')
  else emit('connect-wallet')
}
</script>
