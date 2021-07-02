<template>
  <mew6-white-sheet>
    <div class="px-5 px-lg-3 pt-5">
      <div class="d-flex align-center justify-space-between">
        <span class="mew-heading-2">{{ actualTitle }}</span>
      </div>
    </div>
    <div v-if="actualNotifications.length > 0" class="pa-1 history-container">
      <div v-for="(data, key) in actualNotifications" :key="key">
        <mew-notification :notification="data.notification" class="px-0" />
      </div>
    </div>
    <div v-else class="pa-3 history-container">
      <p>No {{ actualTitle }} found.</p>
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
      return this.txNotifications
        .map(item => {
          return formatNotification(item, this.network);
        })
        .sort(this.sortByDate);
    },
    parsedSwapNotifications() {
      return this.swapNotifications
        .map(item => {
          return formatNotification(item, this.network);
        })
        .sort(this.sortByDate);
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
    sortByDate(a, b) {
      return new Date(b.date) - new Date(a.date);
    },
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
  /**
  * adding this style here until mew-notification is updated with a new prop
  */
  .notification-container {
    background-color: var(--v-white-base) !important;
    border: none !important;
  }
}
</style>
