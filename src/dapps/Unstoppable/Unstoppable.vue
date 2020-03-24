<template>
  <div class="unstoppable-container">
    <back-button v-show="!orderNumber" />
    <router-view
      :domain-name="domainName"
      :domain-price="domainPrice"
      :check-domain="checkDomain"
      :domain-name-err="domainNameErr"
      :loading="loading"
      :account="account"
      :web3="web3"
      :email="email"
      :copied-to-clipboard="copiedToClipboard"
      :order-number="orderNumber"
      :set-order-number="setOrderNumber"
      @domainNameChange="updateDomainName"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BackButton from '@/layouts/InterfaceLayout/components/BackButton';
import { Toast } from '@/helpers';
import { get } from '@/helpers/httpRequests';

export default {
  components: {
    'back-button': BackButton
  },
  data() {
    return {
      domainName: '',
      domainPrice: 0,
      domainNameErr: false,
      loading: false,
      orderNumber: 0,
      email: 'mew@unstoppabledomains.com'
    };
  },
  computed: {
    ...mapState('main', ['web3', 'network', 'account'])
  },
  mounted() {
    this.$nextTick(() => {
      this.setup();
    });
  },
  methods: {
    setup() {
      this.domainNameErr = false;
      this.loading = false;
      this.domainPrice = 0;
      this.registrarTLD = 'crypto';
    },
    copiedToClipboard() {
      Toast.responseHandler(this.$t('common.copied'), Toast.INFO);
    },
    parsedTld() {
      if (this.parsedHostName().length) {
        const hasTld = this.domainName.lastIndexOf('.');
        return hasTld > -1
          ? this.domainName.substr(hasTld + 1, this.domainName.length)
          : this.registrarTLD;
      }
      return '';
    },
    label() {
      return this.domainName.replace(`.${this.registrarTLD}`, '');
    },
    updateDomainName(value) {
      try {
        this.domainName =
          value.replace(`.${this.registrarTLD}`, '') + `.${this.registrarTLD}`;
        if (
          this.label() &&
          (!/^[a-z\d-]+$/.test(this.label()) ||
            this.label().startsWith('xn--') ||
            this.label().startsWith('0x'))
        ) {
          throw Error('Domain contains invalid characters');
        }
      } catch (e) {
        Toast.responseHandler(e, Toast.WARN);
        this.domainNameErr = true;
        return;
      }
      if (this.label() && this.label().length < 6) {
        this.domainNameErr = true;
      } else {
        this.domainNameErr = false;
      }
    },
    setOrderNumber(orderNumber) {
      this.orderNumber = orderNumber;
    },
    async checkDomain() {
      this.loading = true;
      try {
        const { domain } = await get(
          `https://unstoppabledomains.com/api/v1/resellers/myetherwallet/domains/${this.domainName}`
        );
        if (domain.reselling && domain.reselling.price) {
          this.domainPrice = domain.reselling.price;
          this.$router.push({ path: 'unstoppable/buy' });
        } else {
          const toastText = this.$t('unstoppable.toast.domain-unavailable', {
            domain: this.domainName
          });
          Toast.responseHandler(toastText, Toast.WARN);
        }
      } catch (e) {
        const toastText = this.$t('unstoppable.error.something-went-wrong');
        Toast.responseHandler(toastText, Toast.ERROR);
      }
      this.loading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'Unstoppable.scss';
</style>
