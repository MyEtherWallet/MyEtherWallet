<template>
  <div class="unstoppable-container">
    <back-button
      v-show="!orderNumber"
      :path="'/interface/dapps/'"
      :title="$t('common.exit-dapp')"
    >
      <template v-slot:center>
        <div class="button-container">
          <b-button
            :class="[
              'action-btn',
              $route.name === 'unstoppableInitialState' ? 'active-btn' : ''
            ]"
            @click="
              () => {
                navigateHeaderButtons('register');
              }
            "
          >
            Register Domain
          </b-button>
          <b-button
            :class="[
              'action-btn',
              $route.name === 'manageInitialState' ? 'active-btn' : ''
            ]"
            @click="
              () => {
                navigateHeaderButtons('manager');
              }
            "
          >
            Manage Domain
          </b-button>
        </div>
      </template>
    </back-button>
    <div class="branding-container">
      <div class="name-container">
        <img
          height="33"
          src="@/assets/images/icons/dapps/unstoppable-blue.png"
          alt="Unstoppable"
        />
        <span>{{ $t('unstoppable.title') }}</span>
      </div>
      <div class="about-text">{{ $t('unstoppable.about-unstoppable') }}</div>
    </div>
    <router-view
      :domain-name="domainName"
      :domain-price="domainPrice"
      :token-id="tokenId"
      :check-domain="checkDomain"
      :domain-name-err="domainNameErr"
      :loading="loading"
      :account="account"
      :web3="web3"
      :email="email"
      :copied-to-clipboard="copiedToClipboard"
      :order-number="orderNumber"
      :set-token-id="setTokenId"
      :set-order-number="setOrderNumber"
      :is-domain-avail="isDomainAvail"
      :set-domain="setDomain"
      @domainNameChange="updateDomainName"
    />
  </div>
</template>

<script>
import '@stripe/stripe-js';
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
      tokenId: '',
      domainPrice: 0,
      domainNameErr: false,
      loading: false,
      orderNumber: 0,
      email: 'mew@unstoppabledomains.com',
      isDomainAvail: {
        checked: false,
        isAvailable: false
      }
    };
  },
  computed: {
    ...mapState('main', ['web3', 'network', 'account']),
    tld() {
      if (!this.domainName) {
        return '';
      }
      const tldPosition = this.domainName.lastIndexOf('.');
      return tldPosition !== -1
        ? this.domainName.substr(tldPosition + 1, this.domainName.length)
        : '';
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setup();
    });
  },
  methods: {
    navigateHeaderButtons(path) {
      if (path === 'register') {
        this.$router.push({ name: `unstoppableInitialState` });
      } else {
        this.$router.push({
          name: `manageInitialState`
        });
      }
    },
    setDomain(domainName) {
      this.domainName = domainName;
      if (domainName !== '') {
        this.$router.push({ name: `manageCrypto` });
      } else {
        this.$router.push({
          name: `manageInitialState`
        });
      }
    },
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

      this.isDomainAvail = {
        checked: false,
        isAvailable: false
      };
    },
    setOrderNumber(orderNumber) {
      this.orderNumber = orderNumber;
    },
    setTokenId(tokenId) {
      this.tokenId = tokenId;
    },
    async checkDomain() {
      this.loading = true;
      try {
        const { domain } = await get(
          `https://unstoppabledomains.com/api/v1/resellers/myetherwallet/domains/${this.domainName}`
        );
        if (domain.reselling && domain.reselling.price) {
          this.domainPrice = domain.reselling.price;
          this.isDomainAvail.isAvailable = true;
          this.isDomainAvail.checked = true;
        } else {
          const toastText = this.$t('unstoppable.toast.domain-unavailable', {
            domain: this.domainName
          });
          this.isDomainAvail.checked = true;
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
