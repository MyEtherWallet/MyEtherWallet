<template>
  <div>
    <b-modal
      ref="confirmCollection"
      :title="`Confirmation (Total of ${unSignedArray.length} transactions)`"
      hide-footer
      centered
      class="bootstrap-modal-wide confirmation-modal nopadding"
    >
      <div class="modal-content">
        <div class="network-info-container">
          <p>
            <span>{{ $t('interface.network') }}</span>
            {{ network.type.name }} by {{ network.service }}
          </p>
          <div>
            <div class="line" />
          </div>
          <p>
            <span>{{ $t('confirmation.txTotal') }}:</span>
            {{ txTotal }}
            {{ network.type.name }}
          </p>
        </div>
        <div class="modal-content-body">
          <div
            v-for="(item, idx) in unSignedArray"
            :key="item.to + idx + item.value"
            class="item"
          >
            <div v-b-toggle.prevent="`accordion${idx}`" class="header">
              <div class="header-item">
                <img :src="network.type.icon ? network.type.icon : ''" />
                <div>
                  <p>
                    - {{ web3.utils.hexToNumberString(item.value) }}
                    <span>{{ network.type.name }}</span>
                  </p>
                  <div>
                    <span>{{ $t('common.from') }}</span>
                    {{ account.address | concatAddr }}
                  </div>
                </div>
              </div>
              <div
                v-show="item.to !== '' && item.to !== undefined"
                class="direction"
              >
                <img src="~@/assets/images/icons/right-arrow.svg" />
              </div>
              <div class="header-item">
                <img :src="network.type.icon ? network.type.icon : ''" />
                <div>
                  <p>
                    + {{ web3.utils.hexToNumberString(item.value) }}
                    <span>{{ network.type.name }}</span>
                  </p>
                  <div>
                    <span>{{ $t('common.to') }}</span>
                    {{ item.to | concatAddr }}
                  </div>
                </div>
              </div>
              <div class="trigger-container">
                <i class="fa fa-lg fa-angle-up" />
                <i class="fa fa-lg fa-angle-down" />
              </div>
            </div>
            <b-collapse :id="`accordion${idx}`" class="body">
              <div class="body-item">
                <span class="item-title">{{ $t('common.gasLimit') }}t</span>
                <span>{{ web3.utils.hexToNumberString(item.gas) }}</span>
              </div>
              <div class="body-item">
                <span class="item-title">{{ $t('common.gasPrice') }}</span>
                <span>
                  {{ web3.utils.fromWei(item.gasPrice, 'gwei') }}
                  Gwei
                </span>
              </div>
              <div class="body-item">
                <span class="item-title">Nonce</span>
                <span>{{ web3.utils.hexToNumberString(item.nonce) }}</span>
              </div>
              <div class="body-item">
                <span class="item-title">{{ $t('common.data') }}</span>
                <span class="data-string">{{ item.input || item.data }}</span>
              </div>
            </b-collapse>
          </div>
        </div>
      </div>
      <div class="submit-button-container">
        <div class="flex-center-align">
          <div class="button-with-helper">
            <div
              v-show="!sending"
              ref="ConfirmAndSendButton"
              :class="[
                allSigned ? '' : 'disabled',
                'submit-button large-round-button-green-filled clickable'
              ]"
              @click="sendBatchTransactions"
            >
              {{ buttonText }}
            </div>
            <div
              v-show="sending"
              class="submit-button large-round-button-green-filled clickable disabled"
            >
              {{ $t('common.waitingForHash') }}
              <i class="fa fa-spinner fa-spin" />
            </div>
            <div class="tooltip-box-2">
              <b-btn id="exPopover9">
                <img class="icon" src="~@/assets/images/icons/qr-code.svg" />
              </b-btn>
              <b-popover
                target="exPopover9"
                triggers="hover focus"
                placement="top"
              >
                <div class="qrcode-contents">
                  <p class="qrcode-title">
                    {{ $t('confirmation.scanQrCode') }}
                  </p>
                  <div class="qrcode-block">
                    <qrcode :options="{ size: 100 }" value="Hello, World!" />
                  </div>
                  <p class="qrcode-helper">What is that?</p>
                </div>
              </b-popover>
            </div>
          </div>
        </div>
        <p class="learn-more">
          Have any issues?
          <a
            href="https:/kb.myetherwallet.com"
            target="_blank"
            rel="noopener noreferrer"
            >Learn more</a
          >
        </p>
      </div>
    </b-modal>
  </div>
</template>
<script>
import AddressBlock from '../AddressBlock';
import { mapGetters } from 'vuex';

export default {
  components: {
    'address-block': AddressBlock
  },
  props: {
    unSignedArray: {
      type: Array,
      default: () => []
    },
    signedArray: {
      type: Array,
      default: () => []
    },
    sendBatchTransactions: {
      type: Function,
      default: () => {}
    },
    sending: {
      type: Boolean,
      default: false
    },
    isHardwareWallet: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      web3: 'web3',
      network: 'network',
      account: 'account'
    }),
    buttonText() {
      if (!this.allSigned && this.isHardwareWallet) {
        return this.$t('confirmation.approveOnDevice');
      }
      return this.$t('common.confirmAndSend');
    },
    allSigned() {
      if (this.signedArray.length === 0) return false;
      for (let i = 0; i < this.signedArray.length; i++) {
        if (
          this.signedArray[i].rawTransaction === '' ||
          this.signedArray[i].rawTransaction === undefined
        )
          return false;
      }
      return true;
    },
    txTotal() {
      if (this.unSignedArray.length > 0) {
        const BN = this.web3.utils.BN;
        let totalGas = new BN();
        this.unSignedArray.forEach(item => {
          totalGas = totalGas.add(
            new BN(item.gasPrice.replace('0x', ''), 'hex').mul(
              new BN(item.gas.replace('0x', ''), 'hex')
            )
          );
        });
        return this.web3.utils.fromWei(totalGas.toString(), 'ether').toString();
      }
      return 0;
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'ConfirmCollectionModal.scss';
</style>
