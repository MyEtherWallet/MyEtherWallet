<template lang="html">
  <div>
    <div class="confirm-container">
      <div class="domain-header">
        <div class="items-container">
          <h4
            v-for="cartItem of cart"
            :key="`${cartItem.label}.${cartItem.extension}`"
          >
            {{ cartItem.label + '.' + cartItem.extension }} - ${{
              cartItem.price
            }}
          </h4>
        </div>
        <h4 class="domain-price">${{ cartTotal }}</h4>
      </div>
      <div class="confirm-form-container">
        <div class="confirm-form-field-container">
          <h4 class="confirm-payment-text">
            {{
              $t('unstoppable.confirm-payment', {
                amount: cartTotal,
                numberDomains: cart.length
              })
            }}
          </h4>
          <div class="btn-container">
            <button class="back-btn" @click="goBack()">
              <span>
                {{ $t('common.back') }}
              </span>
            </button>
            <button
              :class="[
                'large-round-button-green-filled clickable confirm-button'
              ]"
              :disabled="loading"
              @click="submit"
            >
              <span v-show="!loading">
                {{ $t('unstoppable.pay') }}
              </span>
              <i v-show="loading" class="fa fa-spinner fa-spin" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import confirmImg from '@/assets/images/icons/domain.svg';
import { mapState } from 'vuex';

export default {
  props: {
    cart: {
      type: Array,
      default: () => {
        return [];
      }
    },
    account: {
      type: Object,
      default: function () {}
    },
    email: {
      type: String,
      default: ''
    },
    setOrderNumber: {
      type: Function,
      default: function () {}
    },
    tokenId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      confirmOptions: {},
      confirmImg,
      publishableKey: 'pk_live_HAPE6Nv5bfhCJYKe6Nfaaj4P',
      token: null,
      charge: null,
      loading: false,
      paymentError: false
    };
  },
  computed: {
    ...mapState('main', ['online']),
    cartTotal() {
      return this.cart.reduce((a, b) => {
        return a + b.price;
      }, 0);
    }
  },
  beforeMount() {
    if (!this.cart.length === '' || !this.cartTotal) {
      this.$router.push('/interface/dapps/unstoppable');
    }
  },
  methods: {
    goBack() {
      this.$router.push('/interface/dapps/unstoppable');
    },
    submit() {
      if (!this.account || !this.account.address) {
        return;
      }
      this.loading = true;
      fetch(
        `https://unstoppabledomains.com/api/v1/resellers/myetherwallet/users/${this.email}/orders`,
        {
          method: 'POST',
          headers: {
            'content-type': 'Application/JSON'
          },
          body: JSON.stringify({
            order: {
              domains: this.cart.map(cartItem => ({
                name: cartItem.label + '.' + cartItem.extension,
                owner: { address: this.account.address },
                resolution: {
                  crypto: { ETH: { address: this.account.address } }
                }
              })),
              payment: {
                type: 'stripe',
                tokenId: this.tokenId
              }
            }
          })
        }
      )
        .then(resp => {
          if (resp.status === 200) {
            return resp.json();
          }
          throw new Error('Failed to submit payment');
        })
        .then(({ order }) => {
          this.setOrderNumber(order.orderNumber);
          this.$router.push('/interface/dapps/unstoppable/claim-pending');
        })
        .catch(() => {
          this.paymentError = true;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ConfirmContainer.scss';
</style>
