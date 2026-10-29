<script setup lang="ts">
// Preview for the Button Group design-library component (MEW-2441) at
// /dev/button-group. Matches Figma component set 1762:1095: buttons on the
// grey default surface, so the secondary uses surface="alternative" (white).
import AppBaseButton from '@components/AppBaseButton.vue'
import AppBtnGroup from '@components/AppBtnGroup.vue'
</script>

<template>
  <div class="mx-auto flex max-w-4xl flex-col gap-12 p-8">
    <header class="flex flex-col gap-1">
      <h1 class="text-heading-lg">Button Group</h1>
      <p class="text-text-sm text-text-subtle">
        Visual grouping of related Button instances, arranged horizontally or
        vertically to communicate that the actions belong together.
      </p>
    </header>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Orientation</h2>
      <div
        class="flex flex-wrap items-start gap-10 rounded-12 border border-border-default bg-background-default p-6"
      >
        <div class="flex flex-col gap-2">
          <p class="text-text-sm text-text-subtle">Horizontal</p>
          <div class="w-[341px]">
            <AppBtnGroup>
              <AppBaseButton type="secondary" surface="alternative">
                Button
              </AppBaseButton>
              <AppBaseButton>Button</AppBaseButton>
            </AppBtnGroup>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-text-sm text-text-subtle">Vertical</p>
          <div class="w-[341px]">
            <AppBtnGroup orientation="vertical">
              <AppBaseButton type="secondary" surface="alternative">
                Button
              </AppBaseButton>
              <AppBaseButton>Button</AppBaseButton>
            </AppBtnGroup>
          </div>
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4">
      <h2 class="text-label-base">Show third button (horizontal only)</h2>
      <div
        class="rounded-12 border border-border-default bg-background-default p-6"
      >
        <div class="w-[341px]">
          <AppBtnGroup>
            <AppBaseButton type="tertiary">Button</AppBaseButton>
            <AppBaseButton type="secondary" surface="alternative">
              Button
            </AppBaseButton>
            <AppBaseButton>Button</AppBaseButton>
          </AppBtnGroup>
        </div>
      </div>
    </section>
  </div>
</template>
