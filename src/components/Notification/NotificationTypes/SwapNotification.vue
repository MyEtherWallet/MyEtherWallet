<template lang="html">
  <div class="notification-header">
    <div class="notification-type-status">
      <p class="type">Swap</p>
      <p class="status status-processing">(Processing)</p>
    </div>
    <div class="time-date">
      <p>13:20:23</p>
      <p>04/05/2018</p>
      <div class="expender-icon">
        <i aria-hidden="true" class="fa fa-angle-down"></i>
        <i aria-hidden="true" class="fa fa-angle-up"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import store from 'store';

export default {
  props: {
    expand: {
      type: Function,
      default: function() {}
    },
    details: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      unreadCount: 0
    };
  },
  computed: {
    ...mapGetters({
      notifications: 'notifications',
      wallet: 'wallet'
    }),
    dateString() {
      if (this.notice !== {}) {
        return new Date(this.notice.timestamp).toLocaleDateString(
          this._i18n.locale.replace('_', '-')
        );
      }
      return '';
    }
  },
  watch: {
    notifications() {
      this.countUnread();
    }
  },
  methods: {
    emitShowDetails() {
      this.$emit('showDetails', this.notice);
    },
    convertToGwei(value) {
      return unit.fromWei(value, 'Gwei');
    },
    convertToEth(value) {
      return unit.fromWei(value, 'ether');
    },
    getFiatValue(value) {
      return new BigNumber(this.convertToEth(value))
        .multipliedBy(new BigNumber(this.ethPrice))
        .decimalPlaces(2)
        .toFixed();
    }
  }
};
</script>

<style lang="scss" scoped>
@import './Notification.scss';
</style>
