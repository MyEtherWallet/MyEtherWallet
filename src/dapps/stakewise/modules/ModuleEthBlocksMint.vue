<template>
  <div class="pt-5 pb-13 px-3 pa-sm-15">aaa</div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'ModuleEthBlocksMint',
  components: {},
  computed: {
    ...mapState('wallet', ['blockNumber'])
  }
};
</script>

<style lang="scss" scoped></style>
