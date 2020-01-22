<template>
  <div class="sign-transaction-container">
    <div class="sign-transaction-header">
      <p>{{ $t('common.confirmation') }}</p>
    </div>
    <div class="sign-transaction-addresses">
      <amount-info-component
        :direction="'from'"
        :address="txParams.from"
        :amount="hexToNumString(txParams.value, 'ether')"
        :currency="
          txParams.tokenSymbol ? txParams.tokenSymbol : network.type.name
        "
      />
      <img src="@/assets/images/icons/arrow-down-blue.svg" />
      <amount-info-component
        :direction="'to'"
        :address="txParams.to"
        :amount="
          txParams.tokenSymbol
            ? hexToNumString(txParams.tokenTransferVal)
            : hexToNumString(txParams.value, 'ether')
        "
        :currency="
          txParams.tokenSymbol ? txParams.tokenSymbol : network.type.name
        "
        :receiver="txParams.tokenTransferTo"
      />
    </div>
    <div :class="[showDetails ? 'add-margin' : '', 'details-container']">
      <div class="details-header-container">
        <p>{{ $t('mewcx.details') }}</p>
        <div class="sliding-switch-white">
          <label class="switch">
            <input
              :checked="showDetails"
              type="checkbox"
              @click="toggleDetails"
            />
            <span class="slider round" />
          </label>
        </div>
      </div>
      <div
        :class="[
          showDetails ? 'shown' : 'hide-box',
          'details-content-container'
        ]"
      >
        <div class="detail-item">
          <span class="title">{{ $t('common.network') }}</span>
          <span class="content"
            >{{ network.type.name }} {{ $t('common.by') }} {{ network.service }}
          </span>
        </div>
        <div class="detail-item">
          <span class="title"> {{ $t('common.gas.string') }} </span>
          <span class="content">
            {{ hexToNumString(txParams.gas) }}
          </span>
        </div>
        <div class="detail-item">
          <span class="title"> {{ $t('common.gas.price') }} </span>
          <span class="content">
            {{ hexToNumString(txParams.gasPrice, 'gwei') }}
          </span>
        </div>
        <div class="detail-item">
          <span class="title"> {{ $t('sendTx.nonce') }} </span>
          <span class="content"> {{ hexToNumString(txParams.nonce) }} </span>
        </div>
        <div class="detail-item">
          <span class="title"> {{ $t('sendTx.data') }} </span>
          <span class="content"> {{ txParams.data }} </span>
        </div>
      </div>
    </div>
    <accept-cancel-buttons
      :func-one="openPasswordModal"
      :func-two="rejectAction"
      text-one="Continue"
      text-two="Reject"
    />
    <password-modal-component
      ref="passwordModal"
      :func="unlockWallet"
      :action-name="'Sign and Send'"
      :loading="loading"
      :error="error"
      @passwordChange="updatePassword"
    />
  </div>
</template>

<script>
import AmountInfoComponent from '../../components/AmountInfoComponent';
import PasswordModalComponent from '../../components/PasswordModalComponent';
import AcceptCancelButtons from '../../components/AcceptCancelButtons';
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import utils from 'web3-utils';
import { Misc } from '@/helpers';
import {
  REJECT_MEW_TX_SIGN,
  MEW_TX_HASH,
  WEB3_SIGN_TX
} from '@/builds/mewcx/cxHelpers/cxEvents';
export default {
  components: {
    'amount-info-component': AmountInfoComponent,
    'password-modal-component': PasswordModalComponent,
    'accept-cancel-buttons': AcceptCancelButtons
  },
  data() {
    return {
      showDetails: false,
      signingKeystore: '',
      wallet: {},
      password: '',
      loading: false,
      error: {}
    };
  },
  computed: {
    ...mapState('main', ['linkQuery', 'web3', 'network']),
    txParams() {
      const {
        nonce,
        gasPrice,
        gas,
        to,
        value,
        data,
        from,
        tokenTransferVal,
        tokenSymbol,
        tokenTransferTo
      } = this.linkQuery;
      const obj = {
        nonce: nonce,
        gasPrice: gasPrice,
        gas: gas,
        to: to,
        value: value === '0x' ? 0x0 : value,
        data: data,
        from: from,
        tokenTransferVal: tokenTransferVal,
        tokenSymbol: tokenSymbol,
        tokenTransferTo: tokenTransferTo
      };

      return obj;
    }
  },
  methods: {
    toggleDetails() {
      this.showDetails = !this.showDetails;
    },
    openPasswordModal() {
      this.$refs.passwordModal.$refs.passwordModal.show();
    },
    updatePassword(e) {
      this.error = {
        msg: '',
        errored: false
      };
      this.password = e;
    },
    hexToNumString(hex, convertTo) {
      if (convertTo) {
        return utils.fromWei(new BigNumber(hex).toString(), convertTo);
      }
      return new BigNumber(hex).toString();
    },
    unlockWallet() {
      const _self = this;
      this.loading = true;
      const payload = {
        signer: _self.txParams.from,
        params: _self.txParams,
        password: this.password
      };
      window.chrome.runtime.sendMessage(
        window.chrome.runtime.id,
        {
          event: WEB3_SIGN_TX,
          payload: payload
        },
        {},
        res => {
          _self.loading = false;
          if (res.hasOwnProperty('error')) {
            _self.error = {
              msg: res.error,
              errored: true
            };

            return;
          }
          if (res.hasOwnProperty('message')) {
            window.chrome.tabs.query(
              { url: `*://*.${Misc.getService(_self.linkQuery.url)}/*` },
              function(tab) {
                const obj = {
                  event: REJECT_MEW_TX_SIGN,
                  payload: res.message
                };
                window.chrome.tabs.sendMessage(tab[0].id, obj);
                window.parent.close();
              }
            );
            return;
          }
          _self.$refs.passwordModal.$refs.passwordModal.hide();
          window.chrome.tabs.query(
            { url: `*://*.${Misc.getService(_self.linkQuery.url)}/*` },
            function(tab) {
              const obj = {
                event: MEW_TX_HASH,
                payload: res
              };
              window.chrome.tabs.sendMessage(tab[0].id, obj);
              window.parent.close();
            }
          );
        }
      );
    },
    rejectAction() {
      const _self = this;
      window.chrome.tabs.query(
        { url: `*://*.${Misc.getService(_self.linkQuery.url)}/*` },
        function(tab) {
          const obj = {
            event: REJECT_MEW_TX_SIGN
          };
          window.chrome.tabs.sendMessage(tab[0].id, obj);
          window.parent.close();
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'SignTxContainer.scss';
</style>
