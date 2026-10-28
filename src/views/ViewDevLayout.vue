<script setup lang="ts">
// Shell for the design-library previews. The sidebar lists the components that
// have a preview page; the selected one renders in the main area via
// <router-view>. Add a row here as each component gains a preview. Never
// registered in production builds — see routesDefault.ts.
const SECTIONS: { title: string; items: { name: string; to: string }[] }[] = [
  {
    title: 'Foundations',
    items: [
      { name: 'Colors', to: '/dev/colors' },
      { name: 'Sizes', to: '/dev/sizes' },
      { name: 'Typography', to: '/dev/typography' },
    ],
  },
  {
    title: 'Components',
    items: [
      { name: 'Action Bar', to: '/dev/action-bar' },
      { name: 'Address Selector', to: '/dev/address-selector' },
      { name: 'Avatar', to: '/dev/avatar' },
      { name: 'Banner', to: '/dev/banner' },
      { name: 'Button', to: '/dev/button' },
      { name: 'Button Group', to: '/dev/button-group' },
      { name: 'Button Icon', to: '/dev/btn-icon' },
      { name: 'Card', to: '/dev/card' },
      { name: 'Cell', to: '/dev/cell' },
      { name: 'Checkbox', to: '/dev/checkbox' },
      { name: 'Chip', to: '/dev/chip' },
      { name: 'Content Group', to: '/dev/content-group' },
      { name: 'Divider', to: '/dev/divider' },
      { name: 'Footer', to: '/dev/footer' },
      { name: 'Icon', to: '/dev/icons' },
      { name: 'InfoCell', to: '/dev/info-cell' },
      { name: 'Input', to: '/dev/input' },
      { name: 'Input Feedback', to: '/dev/input-feedback' },
      { name: 'Input Naked', to: '/dev/input-naked' },
      { name: 'Modal', to: '/dev/modal' },
      { name: 'Navbar', to: '/dev/navbar' },
      { name: 'NavLink', to: '/dev/navlink' },
      { name: 'Pagination', to: '/dev/pagination' },
      { name: 'Picker', to: '/dev/picker' },
      { name: 'Radio Button', to: '/dev/radio' },
      { name: 'ScrollFade', to: '/dev/scroll-fade' },
      { name: 'Searchbar', to: '/dev/searchbar' },
      { name: 'Segmented Control', to: '/dev/segmented-control' },
      { name: 'Slider', to: '/dev/slider' },
      { name: 'Spinner', to: '/dev/spinner' },
      { name: 'Tab Bar', to: '/dev/tab-bar' },
      { name: 'Tab Item', to: '/dev/tab-item' },
      { name: 'Tag', to: '/dev/tag' },
      { name: 'Text Area', to: '/dev/text-area' },
      { name: 'Toast', to: '/dev/toast' },
      { name: 'Toggle', to: '/dev/toggle' },
      { name: 'Tooltip', to: '/dev/tooltip' },
    ],
  },
]
</script>

<template>
  <!-- Fixed to the space below the app header so only the main column scrolls;
       the sidebar stays put. Header is 76px — see AppNavbar. -->
  <div class="flex h-[calc(100dvh-76px)] overflow-hidden bg-background-default">
    <aside
      class="w-56 shrink-0 overflow-y-auto border-r border-border-default bg-white p-4"
    >
      <router-link
        to="/dev"
        class="block text-s-16 font-bold text-text-default mb-4 hoverOpacity"
      >
        Design library
      </router-link>
      <div v-for="s in SECTIONS" :key="s.title" class="mb-4">
        <p
          class="text-s-11 font-bold uppercase text-text-subtle tracking-sp-06 mb-2"
        >
          {{ s.title }}
        </p>
        <nav class="flex flex-col gap-1">
          <router-link
            v-for="c in s.items"
            :key="c.to"
            :to="c.to"
            class="rounded-8 px-3 py-2 text-s-14 text-text-default hoverNoBG transition-colors"
            active-class="bg-background-default-hover font-medium"
          >
            {{ c.name }}
          </router-link>
        </nav>
      </div>
    </aside>
    <main class="flex-1 min-w-0 overflow-auto">
      <router-view />
    </main>
  </div>
</template>
