<template lang="html">
  <div class="claim-pending-container">
    <div class="copy-container">
      <h3>
        {{ $t('unstoppable.transfer-pending') }}
      </h3>
      <h5 v-for="domain in domains" :key="domain.name" class="middle-copy">
        <b>{{ domain.name }}</b>
        {{
          domain.status !== 'MINED'
            ? $t('unstoppable.is-transferring-to-wallet')
            : ''
        }}
        <br />{{ $t('unstoppable.status') }}:
        <b> {{ $t(translateStatus(domain.status)) }}</b>
        <h5 v-show="domain.txHash">
          {{ $t('unstoppable.view-transfer-transaction') + ' ' }}
          <a
            :href="etherscanLink(domain.txHash)"
            target="_blank"
            rel="noopener noreferrer"
            >Etherscan</a
          >
        </h5>
      </h5>
      <h5>
        {{ $t('unstoppable.manage-on-one') + ' ' }}
        <a
          href="https://unstoppabledomains.com"
          target="_blank"
          rel="noopener noreferrer"
          >unstoppabledomains.com</a
        >
        {{ ' ' + $t('unstoppable.manage-on-two') }}
      </h5>
      <br />
      <div class="spinner-container">
        <i class="fa fa-spinner fa-spin" />
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from '@/helpers';
export default {
  props: {
    account: {
      type: Object,
      default: function () {}
    },
    orderNumber: {
      type: Number,
      default: 0
    },
    email: {
      type: String,
      default: ''
    },
    setDomainsClaimed: {
      type: Function,
      default: () => null
    }
  },
  data() {
    return { domains: [] };
  },
  computed: {
    address() {
      return this.account.address;
    }
  },
  beforeMount() {
    if (!this.email || !this.orderNumber) {
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
          const tmp = [];
          if (order && order.items) {
            for (const item of order.items) {
              tmp.push({
                name: item.name,
                status: item?.blockchain?.status,
                txHash: item?.blockchain?.txHash
              });
            }
          }
          this.domains = tmp;
          for (const domainName in tmp) {
            const item = tmp[domainName];
            if (item.status !== 'MINED') {
              return;
            }
          }
          this.setDomainsClaimed(
            this.domains.map(domain => ({
              label: domain.name.split('.')[0],
              extension: domain.name.split('.')[1]
            }))
          );
          this.$router.push('/interface/dapps/unstoppable/completed');
        })
        .catch(err => {
          Toast.responseHandler(err, Toast.ERROR);
        });
    }, 5000);
  },
  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  methods: {
    etherscanLink(txHash) {
      return 'https://etherscan.io/tx/' + txHash;
    },
    translateStatus(status) {
      if (status === 'MINED') {
        return 'unstoppable.confirmed';
      }
      if (status === 'PENDING') {
        return 'unstoppable.pending';
      }
      return 'unstoppable.failed';
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ClaimPendingContainer.scss';
</style>
