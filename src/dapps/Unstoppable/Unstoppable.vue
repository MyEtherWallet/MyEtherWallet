<template>
  <div class="unstoppable-container">
    <back-button
      v-show="!orderNumber"
      :path="
        $route.name === 'manageCrypto'
          ? '/interface/dapps/unstoppable/manage'
          : '/interface/dapps/'
      "
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
            {{ $t('unstoppable.register-domain') }}
          </b-button>
          <b-button
            :class="[
              'action-btn',
              $route.name === 'manageInitialState' ||
              $route.name === 'manageCrypto'
                ? 'active-btn'
                : ''
            ]"
            @click="
              () => {
                navigateHeaderButtons('manager');
              }
            "
          >
            {{ $t('unstoppable.manage-domain') }}
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
      :cart="cart"
      :domains-claimed="domainsClaimed"
      :search="search"
      :search-err="searchErr"
      :domain-name="domainName"
      :search-results="searchResults"
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
      :set-domain="setDomain"
      :set-domains-claimed="setDomainsClaimed"
      :add-item-to-cart="addItemToCart"
      :remove-item-from-cart="removeItemFromCart"
      @searchChange="updateSearch"
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
      search: '',
      searchResults: [],
      cart: [],
      domainsClaimed: [],
      searchErr: false,
      domainName: '',
      tokenId: '',
      domainNameErr: false,
      loading: false,
      orderNumber: 0,
      email: 'mew@unstoppabledomains.com'
    };
  },
  computed: {
    ...mapState('main', ['web3', 'network', 'account']),
    tld() {
      if (!this.search) {
        return '';
      }
      const tldPosition = this.search.lastIndexOf('.');
      return tldPosition !== -1
        ? this.search.substr(tldPosition + 1, this.search.length)
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
    setDomainsClaimed(domainsClaimed) {
      this.domainsClaimed = domainsClaimed;
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
        const hasTld = this.search.lastIndexOf('.');
        return hasTld > -1
          ? this.search.substr(hasTld + 1, this.search.length)
          : this.registrarTLD;
      }
      return '';
    },
    searchLabel() {
      return this.search.replace(`.${this.registrarTLD}`, '');
    },
    updateSearch(value) {
      try {
        this.search =
          value.replace(`.${this.registrarTLD}`, '') + `.${this.registrarTLD}`;
        if (
          this.searchLabel() &&
          (!/^[a-z\d-]+$/.test(this.searchLabel()) ||
            this.searchLabel().startsWith('xn--') ||
            this.searchLabel().startsWith('0x'))
        ) {
          throw Error('Domain contains invalid characters');
        }
      } catch (e) {
        Toast.responseHandler(e, Toast.WARN);
        this.searchErr = true;
        return;
      }
      if (this.searchLabel() && this.searchLabel().length < 6) {
        this.searchErr = true;
      } else {
        this.searchErr = false;
      }
    },
    setOrderNumber(orderNumber) {
      this.orderNumber = orderNumber;
    },
    setTokenId(tokenId) {
      this.tokenId = tokenId;
    },
    addItemToCart(item) {
      this.cart = [
        ...this.cart,
        { price: item.price, label: item.label, extension: item.extension }
      ];
    },
    removeItemFromCart(item) {
      this.cart = this.cart.filter(cartItem => cartItem.label !== item.label);
    },
    async checkDomain() {
      this.loading = true;
      try {
        const { domain } = await get(
          `https://unstoppabledomains.com/api/v1/resellers/myetherwallet/domains/${this.search}`
        );
        const results = [
          {
            price: domain?.reselling?.price,
            label: this.searchLabel(),
            available: domain?.reselling?.price,
            extension: this.registrarTLD,
            first: true
          }
        ];
        const url = `https://unstoppabledomains.com/api/v1/resellers/myetherwallet/domains/variations?domains=["${this.search}"]`;
        const similarities = await fetch(url).then(res => res.json());
        for (const d in similarities) {
          for (const similarity of similarities[d]) {
            if (similarity.extension === this.registrarTLD) {
              if (!results.map(r => r.label).includes(similarity.label)) {
                results.push({
                  label: similarity.label,
                  extension: this.registrarTLD,
                  price: similarity.price / 100,
                  available: true
                });
              }
            }
          }
        }
        this.searchResults = results;
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
