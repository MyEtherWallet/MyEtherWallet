<template>
  <div>
    <loading-sign
      loadingmessage1="Loading MakerDAI..."
      loadingmessage2="Please wait for a moment."
    />
  </div>
</template>

<script>
import LoadingSign from '@/components/LoadingSign';

export default {
  components: {
    'loading-sign': LoadingSign
  },
  props: {},
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'MakerHome';
</style>
