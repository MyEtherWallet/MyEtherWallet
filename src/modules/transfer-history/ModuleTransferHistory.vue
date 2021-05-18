<template>
  <mew6-white-sheet>
    <div class="px-5 px-lg-3 pt-5">
      <div class="d-flex align-center justify-space-between">
        <span class="mew-heading-2">{{ actualTitle }}</span>
        <mew-button
          btn-style="transparent"
          button-size="small"
          title="EthVM"
          @click.native="() => navigateToEthvm()"
        />
      </div>
    </div>
    <div class="pa-1 history-container">
      <div v-for="(data, key) in actualNotifications" :key="key">
        <mew-notification :notification="data.notification" class="px-0" />
      </div>
    </div>
  </mew6-white-sheet>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import formatNotification from '@/modules/notifications/helpers/formatNotification';

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
    parsedTxNotifications() {
      return this.txNotifications.map(item => {
        const newItem = formatNotification(item, this.network);
        // removes the color from the component
        newItem['notification'].status.value = 'history';
        return newItem;
      });
    },
    parsedSwapNotifications() {
      return this.swapNotifications.map(item => {
        const newItem = formatNotification(item, this.network);
        // removes the color from the component
        newItem['notification'].status.value = 'history';
        return newItem;
      });
    },
    actualNotifications() {
      return !this.isSwap
        ? this.parsedTxNotifications
        : this.parsedSwapNotifications;
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

.history-container {
  max-height: 300px;
  overflow-y: scroll;
}
</style>
