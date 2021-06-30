<template>
  <div>
    <div v-if="validators.length === 0">
      You currently are not staking any eth.
    </div>
    <div v-if="validators.length > 0"></div>
  </div>
</template>

<script>
// const types = ['pending', 'deposited', 'active', 'created', 'exited'];
export default {
  components: {
    // exitedPopup
  },
  props: {
    validators: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  methods: {
    // getUrl(key) {
    //   return (
    //     configNetworkTypes.network[this.network.type.name].url + '0x' + key
    //   );
    // },
    //   details(info) {
    //     const details = [
    //       {
    //         label: this.$tc('dappsStaked.validator', 1),
    //         info: '0x' + info.validator_key
    //       },
    //       {
    //         label: this.$t('dappsStaked.staked'),
    //         info: info.amount + ' ' + this.$t('common.currency.eth')
    //       }
    //     ];
    //     // pending && deposited
    //     if (
    //       info.status.toLowerCase() === types[0] ||
    //       info.status.toLowerCase() === types[1]
    //     ) {
    //       details.push(
    //         {
    //           label: this.$t('dappsStaked.estimated-activation-timestamp'),
    //           info: info.queue
    //             ? moment(info.estimated_activation_timestamp).format(
    //                 'MM/DD/YYYY hh:mm:ss'
    //               )
    //             : ''
    //         },
    //         {
    //           label: this.$t('dappsStaked.validators-infront'),
    //           info: info.queue
    //             ? new BigNumber(info.queue.total).minus(info.queue.position)
    //             : ''
    //         },
    //         {
    //           label: this.$t('dappsStaked.validators-back'),
    //           info: info.queue
    //             ? info.queue.position === 0
    //               ? 0
    //               : info.queue.position - 1
    //             : ''
    //         }
    //       );
    //     }
    //     // activated
    //     if (info.status.toLowerCase() === types[2]) {
    //       details.push(
    //         {
    //           label: this.$t('dappsStaked.activation-timestamp'),
    //           info: moment(info.activation_timestamp).format(
    //             'MM/DD/YYYY hh:mm:ss'
    //           )
    //         },
    //         {
    //           label: this.$t('dappsStaked.apr'),
    //           info: this.getApr(info) + '%'
    //         },
    //         {
    //           label: this.$t('dappsStaked.earnings'),
    //           info:
    //             this.getEarnings(info.balance, info.amount) +
    //             ' ' +
    //             this.$t('common.currency.eth')
    //         }
    //       );
    //     }
    //     // exited
    //     if (info.status.toLowerCase() === types[4]) {
    //       details.push({
    //         label: this.$t('dappsStaked.activation-timestamp'),
    //         info: moment(info.activation_timestamp).format('MM/DD/YYYY hh:mm:ss')
    //       });
    //     }
    //     return details;
    //   },
    //   getApr(info) {
    //     const now = moment.utc();
    //     const activated = moment.utc(info.activation_timestamp);
    //     const daysActive = now.diff(activated, 'days');
    //     const percentIncrease = new BigNumber(
    //       this.getEarnings(info.balance, info.amount).div(info.amount)
    //     );
    //     const percentIncreasePerDay = percentIncrease / daysActive;
    //     const apr = percentIncreasePerDay * 365;
    //     return new BigNumber(apr).times(100).toFixed(4);
    //   },
    //   getEarnings(balance, amount) {
    //     return new BigNumber(this.convertToEth1(balance)).minus(amount);
    //   },
    //   convertToEth1(balance) {
    //     return new BigNumber(balance).div(new BigNumber(10).pow(9)).toFixed(4);
    //   },
    //   getExpandedClasses(idx, status) {
    //     if (this.isExpanded(idx)) {
    //       if (status.toLowerCase() === types[0]) {
    //         return 'pending-expanded';
    //       }
    //       if (status.toLowerCase() === types[1]) {
    //         return 'deposited-expanded';
    //       }
    //       if (status.toLowerCase() === types[2]) {
    //         return 'active-expanded';
    //       }
    //       if (status.toLowerCase() === types[4]) {
    //         return 'exited-expanded';
    //       }
    //     }
    //   },
    //   isExpanded(idx) {
    //     return this.expanded === idx;
    //   },
    //   expand(idx, status) {
    //     if (status.toLowerCase() === types[4] && !this.isExpanded(idx)) {
    //       this.$refs.exitedPopup.$refs.exitedPopup.show();
    //     }
    //     this.expanded = this.expanded !== idx ? idx : '';
    //   },
    //   truncate(str) {
    //     return str.slice(0, 4) + '...' + str.slice(str.length - 4, str.length);
    //   },
    //   getBadgeClass(status) {
    //     if (status.toLowerCase() === types[0]) {
    //       return 'pending-badge';
    //     }
    //     if (status.toLowerCase() === types[1]) {
    //       return 'deposited-badge';
    //     }
    //     if (status.toLowerCase() === types[2]) {
    //       return 'active-badge';
    //     }
    //     if (status.toLowerCase() === types[4]) {
    //       return 'exited-badge';
    //     }
    //   },
    //   getContainerClass(status) {
    //     if (status.toLowerCase() === types[0]) {
    //       return 'pending-container';
    //     }
    //     if (status.toLowerCase() === types[1]) {
    //       return 'deposited-container';
    //     }
    //     if (status.toLowerCase() === types[2]) {
    //       return 'active-container';
    //     }
    //     if (status.toLowerCase() === types[4]) {
    //       return 'exited-container';
    //     }
    //   }
  }
};
</script>

<style lang="scss" scoped>
.staked-status {
  .title {
    color: #003b48;
    font-size: 18px;
    font-weight: 600;
    padding: 30px 40px 10px 40px;
  }
  .no-validators {
    padding: 30px 40px 0 40px;
  }
  a {
    color: #003b48 !important;
    font-weight: normal;
  }
  .validator-container {
    border-radius: 4px;
    color: #003b48;
    cursor: pointer;
    flex-direction: column;
    font-weight: 600;
    margin: 20px 40px;
    .top-row {
      align-items: center;
      justify-content: space-between;
      padding: 15px 20px;
      width: 100%;
      .badge-container {
        align-items: center;
        @media all and (max-width: 625px) {
          align-items: baseline;
          flex-direction: column;
        }
      }
      &.pending-expanded {
        border-bottom: 1px solid #f5a623;
      }
      &.active-expanded {
        border-bottom: 1px solid #05c0a5;
      }
      &.deposited-expanded {
        border-bottom: 1px solid #5a78f0;
      }
      &.exited-expanded {
        border-bottom: 1px solid #ff445b;
      }
      .badge {
        color: #fff;
        font-weight: normal;
        padding: 10px;
        text-transform: capitalize;
        width: 100px;
        @media all and (max-width: 625px) {
          margin-left: 0 !important;
          margin-top: 15px;
        }
      }
      .pending-badge {
        background-color: #f5a623;
      }
      .active-badge {
        background-color: #05c0a5;
      }
      .deposited-badge {
        background-color: #5a78f0;
      }
      .exited-badge {
        background-color: #ff445b;
      }
      .right-container {
        align-items: center;
        justify-content: center;
      }
    }
    .more-info {
      background: #fff;
      cursor: text;
      flex-direction: column;
      .queue-speed {
        font-style: italic;
        padding: 15px 20px;
      }
      .more-info-row {
        flex-direction: row;
        justify-content: space-between;
        padding: 15px 20px;
        span {
          width: 100%;
        }
        .info-text {
          word-break: break-all;
          font-weight: normal;
          text-align: right;
        }
      }
      .more-info-border {
        border-bottom: 1px solid #efefef;
      }
    }
  }

  .pending-container {
    border: 1px solid #f5a623;
    background-color: #fff6e6;
  }

  .active-container {
    background-color: #f2fafa;
    border: 1px solid #05c0a5;
  }

  .deposited-container {
    background-color: #f9fafe;
    border: 1px solid #5a78f0;
  }

  .exited-container {
    background-color: #fff8f9;
    border: 1px solid #ff445b;
  }
}
</style>
