<template>
  <div class="core--components--app-scroll-block">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.core--components--app-scroll-block {
  overflow-y: auto;
  max-height: 90px;
  padding-right: 12px;
  margin-right: -12px;
}
</style>
