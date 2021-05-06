<template>
  <mew6-white-sheet>
    <div class="px-5 px-lg-7 py-5">
      <div class="d-flex align-center justify-space-between">
        <span class="mew-heading-2">{{ actualTitle }}</span>
        <mew-button
          btn-style="transparent"
          button-size="small"
          :title="$t('common.more') + '...'"
          @click.native="() => navigateToEthvm()"
        />
      </div>
    </div>
    <div class="pa-3">
      <div v-for="(notification, key) in swapNotifications" :key="key">
        <mew-notification :notification="notification" />
      </div>
    </div>
  </mew6-white-sheet>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
// import BigNumber from 'bignumber.js';
// import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';

export default {
  name: 'ModuleTransferHistory',
  components: {},
  props: {
    isSwap: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapState('wallet', ['web3', 'address']),
    ...mapGetters('global', ['network']),
    ...mapGetters('notifications', ['txNotifications', 'swapNotifications']),
    actualNotifications() {
      return this.isSwap ? this.swapNotifications : this.txNotifications;
    },
    actualTitle() {
      return this.isSwap ? `Swap History` : `Tx History`;
    }
  },
  mounted() {},
  methods: {
    navigateToEthvm() {
      // eslint-disable-next-line
      window.open(`https://www.ethvm.com/address/${this.address}`, '_blank');
    }
  }
};
</script>

<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>
