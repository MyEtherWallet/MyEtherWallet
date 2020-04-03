<template lang="html">
  <div class="claim-pending-container">
    <div class="copy-container">
      <h3>
        {{ $t('unstoppable.transfer-pending') }}
      </h3>
      <h5 class="middle-copy">
        {{ $t('unstoppable.domain-transferring-one') }}
        <b>{{ ' ' + domainName + ' ' }}</b>
        {{
          $t('unstoppable.domain-transferring-two', {
            address: address
          })
        }}
      </h5>
      <h5>
        {{ $t('unstoppable.manage-on-one') + ' ' }}
        <a
          href="https://unstoppabledomains.com"
          target="_blank"
          rel="noopener noreferrer"
          >unstoppabledomains.com</a
        >
        <br />
        {{ ' ' + $t('unstoppable.manage-on-two') }}
      </h5>
      <br />
      <h5 v-show="txHash">
        {{ $t('unstoppable.view-transfer-transaction') + ' ' }}
        <a :href="etherscanLink" target="_blank" rel="noopener noreferrer"
          >Etherscan</a
        >
      </h5>
      <div class="spinner-container">
        <i class="fa fa-spinner fa-spin" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    domainName: {
      type: String,
      default: ''
    },
    account: {
      type: Object,
      default: function() {}
    },
    orderNumber: {
      type: Number,
      default: 0
    },
    email: {
      type: String,
      default: ''
    }
  },
  data() {
    return { txHash: '' };
  },
  computed: {
    address() {
      return this.account.address;
    },
    etherscanLink() {
      return 'https://etherscan.io/tx/' + this.txHash;
    }
  },
  beforeMount() {
    if (!this.domainName || !this.email || !this.orderNumber) {
      this.$router.push('/interface/dapps/unstoppable');
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      fetch(
        `https://unstoppabledomains.com/api/v1/resellers/myetherwallet/users/${this.email}/orders/${this.orderNumber}`
      )
        .then(resp => {
          if (resp.ok) {
            return resp.json();
          }
        })
        .then(({ order }) => {
          if (order && order.items) {
            for (const item of order.items) {
              if (item.blockchain && item.blockchain.txHash) {
                this.txHash = item.blockchain.txHash;
              }
              if (item.blockchain && item.blockchain.status === 'MINED') {
                this.$router.push('/interface/dapps/unstoppable/completed');
              }
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    }, 5000);
  },
  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ClaimPendingContainer.scss';
</style>
