<template>
  <div>
    <div class="connection-request-container">
      <div class="website-logos"></div>
      {{ request }} is trying to access MEW CX. <br />
      Please choose a wallet that you want to connect.
    </div>
    <div class="addresses-container"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Misc } from '@/helpers';
export default {
  computed: {
    ...mapState(['linkQuery']),
    request() {
      const { connectionRequest } = this.linkQuery;
      return Misc.getService(connectionRequest);
    }
  },
  mounted() {
    console.log(this.linkQuery);
  }
};
</script>

<style lang="scss" scoped>
@import 'AccountAccess.scss';
</style>
