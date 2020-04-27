<template>
  <div class="pt-8">
    <BlockTitle class="mb-1" :text="title" />
    <div class="pa-10">
      <slot />
    </div>
  </div>
</template>

<script>
import BlockTitle from '@/web/components/BlockTitles/BlockTitle3';
export default {
  components: { BlockTitle },
  props: {
    title: { default: '', type: String }
  },
  data() {
    return {};
  }
};
</script>
