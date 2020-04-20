<template lang="html">
  <div>
    <div class="confirm-container">
      <div class="domain-header">
        <h4>{{ domainName }}</h4>
        <h4 class="domain-price">${{ domainPrice }}</h4>
      </div>
      <div class="confirm-form-container">
        <div class="confirm-form-field-container">
          <h4 class="confirm-payment-text">
            {{
              $t('unstoppable.confirm-payment', {
                amount: domainPrice,
                domain: domainName
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

export default {
  props: {
    domainName: {
      type: String,
      default: ''
    },
    domainPrice: {
      type: Number,
      default: 0
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
  beforeMount() {
    if (this.domainName === '' || !this.domainPrice || !this.tokenId) {
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
              domains: [
                {
                  name: this.domainName,
                  owner: {
                    address: this.account.address
                  },
                  resolution: {
                    crypto: {
                      ETH: {
                        address: this.account.address
                      }
                    }
                  }
                }
              ],
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
