<template>
  <div class="extension-browser-action-wrapper">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@import 'ExtensionBrowserActionWrapper.scss';
</style>
