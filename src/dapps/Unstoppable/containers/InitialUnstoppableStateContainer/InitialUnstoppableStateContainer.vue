<template lang="html">
  <div class="initial-state-unstoppable">
    <form class="send-form">
      <div class="title-container">
        <div class="title">
          <span>
            {{ $t('unstoppable.search-domain-prompt') }}
          </span>
        </div>
      </div>
      <div class="the-form">
        <div class="domain-name">
          <input
            v-model="localSearch"
            :class="[searchErr ? 'errored' : '']"
            :placeholder="$t('unstoppable.ph.six-char')"
            type="text"
            name=""
          />
          <span :class="localSearch !== '' ? 'move-right' : ''"
            >.{{ tld }}</span
          >
          <img
            v-if="localSearch !== ''"
            class="close"
            src="@/assets/images/icons/close.png"
            @click="clearInput()"
          />
        </div>
        <div class="submit-button-container">
          <button
            :class="[
              searchErr || localSearch === '' ? 'disabled' : '',
              'submit-button large-round-button-green-filled clickable'
            ]"
            @click.prevent="checkDomain"
          >
            <span v-show="!loading">
              {{ $t('unstoppable.check-domain') }}
            </span>
            <i v-show="loading" class="fa fa-spinner fa-spin" />
          </button>
        </div>
      </div>
      <div class="error-message-container">
        <p v-show="searchErr" class="erroredMsg">
          <span v-if="!isValidLength && localSearch !== ''">
            {{ $t('unstoppable.warning.not-enough-char') }}
          </span>
          <span v-else> {{ $t('unstoppable.warning.invalid-symbol') }} </span>
        </p>
      </div>
    </form>
    <div v-if="cart.length" class="cart-container">
      <span class="cart-left">
        <div>
          <span class="bold">{{ $t('unstoppable.cart') }}:</span>
          {{ cart.length }} {{ $t('unstoppable.items') }}
        </div>
        <div
          v-for="cartItem of cart"
          :key="`${cartItem.label}.${cartItem.extension}`"
          class="cart-items-container"
        >
          <div class="cart-item-row">
            <span
              >{{ cartItem.label }}.{{ cartItem.extension }} - ${{
                cartItem.price
              }}</span
            >
            <img
              class="cart-close"
              src="@/assets/images/icons/close.png"
              @click="removeFromCart(cartItem)"
            />
          </div>
        </div>
        <div class="cart-total-container">
          <span class="bold">{{ $t('unstoppable.total') }}:</span> ${{
            cart.reduce((a, b) => {
              return a + b.price;
            }, 0)
          }}
        </div>
      </span>
      <button class="mid-round-button-green-filled buy-btn" @click="checkout()">
        {{ $t('unstoppable.checkout') }}
      </button>
    </div>
    <div
      v-for="searchResult of searchResults"
      :key="searchResult.label"
      class="results-wrapper"
    >
      <div class="result-wrapper">
        <div v-if="searchResult.first" class="result-title">
          <span>{{ $t('unstoppable.result') }}</span>
        </div>
        <div
          :class="[
            'result-container',
            searchResult.available ? 'avail-container' : 'unavail-container'
          ]"
        >
          <div class="left-container">
            <span class="domain-name">{{ searchResult.label }}.{{ tld }}</span>
            <span v-if="searchResult.available">
              <span class="eth-text"
                >~ {{ convertedEthPrice(searchResult.price) }}
                {{ $t('common.currency.eth') }}</span
              >
              <span class="price-text">(${{ searchResult.price }})</span>
            </span>
          </div>
          <div class="right-container">
            <div
              :class="[
                'title',
                searchResult.available ? 'avail-text' : 'unavail-text'
              ]"
            >
              {{
                searchResult.available
                  ? $t('unstoppable.is-available')
                  : $t('unstoppable.unavailable')
              }}
            </div>
            <button
              v-if="searchResult.available && !isItemInCart(searchResult)"
              class="mid-round-button-green-filled buy-btn"
              @click="addToCart(searchResult)"
            >
              {{ $t('unstoppable.add-to-cart') }}
            </button>
            <button
              v-if="searchResult.available && isItemInCart(searchResult)"
              class="mid-round-button-green-filled buy-btn"
              @click="removeFromCart(searchResult)"
            >
              {{ $t('unstoppable.undo') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <interface-bottom-text
      :link-text="$t('common.help-center')"
      :question="$t('common.have-issues')"
      link="https://howto.xinfin.org/XinFinWallet/features"
    />
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import { mapState } from 'vuex';
import { Toast } from '@/helpers';
import BigNumber from 'bignumber.js';

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText
  },
  props: {
    checkDomain: {
      type: Function,
      default: function () {}
    },
    addItemToCart: {
      type: Function,
      default: function () {}
    },
    removeItemFromCart: {
      type: Function,
      default: function () {}
    },
    searchResults: {
      type: Array,
      default: () => {
        return [];
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    hostName: {
      type: String,
      default: ''
    },
    tld: {
      type: String,
      default: 'crypto'
    },
    cart: {
      type: Array,
      default: () => {
        return [];
      }
    },
    searchErr: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localSearch: this.hostName,
      ethPrice: 0
    };
  },
  computed: {
    ...mapState('main', ['online']),
    isValidLength() {
      return this.localSearch.replace(`.${this.tld}`, '').length >= 6;
    }
  },
  watch: {
    localSearch(newVal) {
      this.$emit('searchChange', newVal);
    },
    search(newVal) {
      this.localSearch = newVal;
    }
  },
  mounted() {
    if (this.online) this.getEthPrice();
  },
  methods: {
    checkout() {
      this.$router.push({ name: 'payWithCrypto' });
    },
    addToCart(item) {
      this.addItemToCart(item);
    },
    removeFromCart(item) {
      this.removeItemFromCart(item);
    },
    isItemInCart(item) {
      return this.cart.map(cartItem => cartItem.label).includes(item.label);
    },
    convertedEthPrice(domainPrice) {
      let ethConvertPrice = 0;
      if (!this.ethPrice) {
        return 'Unknown';
      }
      if (domainPrice > 0) {
        ethConvertPrice = new BigNumber(domainPrice)
          .dividedBy(this.ethPrice)
          .toFixed(8);
      }
      return ethConvertPrice;
    },
    clearInput() {
      this.localSearch = '';
    },
    async getEthPrice() {
      const price = await fetch(
        'https://cryptorates.mewapi.io/ticker?filter=ETH'
      )
        .then(res => {
          return res.json();
        })
        .catch(e => {
          Toast.responseHandler(e, Toast.ERROR);
        });
      this.ethPrice =
        typeof price === 'object' ? price.data.ETH.quotes.USD.price : 0;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'InitialUnstoppableStateContainer.scss';
</style>
