<template>
  <div>

    <div class="">
      LOADING
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle';
import InterfaceBottomText from '@/components/InterfaceBottomText';
import Blockie from '@/components/Blockie';

export default {
  components: {
    'interface-container-title': InterfaceContainerTitle,
    'interface-bottom-text': InterfaceBottomText,
    blockie: Blockie
  },
  props: {},
  data() {
    return {
      title: 'stufff',
      desc: 'things',
      supported: true
    };
  },
  computed: {},
  async mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'MakerHome';
</style>
