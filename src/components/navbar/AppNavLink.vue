<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import AppIcon from '@/components/icon/AppIcon.vue'
import { NAV_LINK_CLASS } from './types'

/**
 * NavLink (design library, Figma 575:3434). The Navbar's section item: a pill
 * with Default / Hover / Selected looks and an optional trailing chevron for
 * items that open a menu. With `to` it renders a router link that is Selected
 * while its route or one of its child routes is active; without `to` it is a
 * button (menu trigger).
 * `selected` overrides the route match, so a parent can mark a section active
 * for routes the link doesn't cover. `aria-current="page"` stays on the link
 * whose route is the exact current page, not on its ancestor sections. Figma's `Show pointer` is a design
 * annotation of the hover cursor, so it has no prop.
 *
 * @example <AppNavLink :to="{ name: ROUTES_MAIN.HOME.NAME }" :label="t('home')" />
 * @example <AppNavLink label="More" dropdown :expanded="open" @click="open = !open" />
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    label?: string
    /** Navigating link; omit for a menu trigger. */
    to?: RouteLocationRaw
    /** Explicit Selected state; wins over the route match. */
    selected?: boolean
    /** Trailing chevron + menu-trigger semantics (Figma `Show dropdown`). */
    dropdown?: boolean
    /** `aria-expanded` of a dropdown trigger. */
    expanded?: boolean
    /** Match the route exactly instead of by prefix. */
    exact?: boolean
  }>(),
  {
    label: undefined,
    to: undefined,
    selected: undefined,
    dropdown: false,
    expanded: false,
    exact: false,
  },
)

const isSelected = (routeActive: boolean) => props.selected ?? routeActive

const linkClass = (routeActive: boolean) => [
  NAV_LINK_CLASS.base,
  isSelected(routeActive) ? NAV_LINK_CLASS.selected : NAV_LINK_CLASS.rest,
]
</script>

<template>
  <RouterLink
    v-if="to"
    v-slot="{ href, navigate, isActive, isExactActive }"
    :to="to"
    custom
  >
    <a
      v-bind="$attrs"
      data-testid="nav-link"
      :href="href"
      :class="linkClass(exact ? isExactActive : isActive)"
      :aria-current="isExactActive ? 'page' : undefined"
      :aria-haspopup="dropdown ? 'menu' : undefined"
      :aria-expanded="dropdown ? expanded : undefined"
      @click="navigate"
    >
      <span class="px-1"
        ><slot>{{ label }}</slot></span
      >
      <AppIcon v-if="dropdown" name="chevron-down" variant="filled" size="s" />
    </a>
  </RouterLink>

  <button
    v-else
    v-bind="$attrs"
    type="button"
    data-testid="nav-link"
    :class="linkClass(false)"
    :aria-haspopup="dropdown ? 'menu' : undefined"
    :aria-expanded="dropdown ? expanded : undefined"
  >
    <span class="px-1"
      ><slot>{{ label }}</slot></span
    >
    <AppIcon v-if="dropdown" name="chevron-down" variant="filled" size="s" />
  </button>
</template>
