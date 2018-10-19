<template>
  <div>
    <b-modal
      ref="confirmCollection"
      :title="`Confirmation (Total of ${signedArray.length} transactions)`"
      hide-footer
      centered
      class="bootstrap-modal-wide confirmation-modal nopadding">
      <div class="modal-content">
        <div class="network-info-container">
          <p>
            <span>Network</span> {{ $store.state.network.type.name }} by {{ $store.state.network.service }}
          </p>
          <div>
            <div class="line"/>
          </div>
          <p>
            <span>Gas Price</span> {{ gasAvg }} Gwei
          </p>
        </div>
        <div class="modal-content-body">
          <div
            v-for="(item, idx) in signedArray"
            :key="item.tx.to+idx+item.tx.value"
            class="item">
            <div
              v-b-toggle.prevent="`accordion${idx}`"
              class="header">
              <div class="header-item">
                <img :src="require(`@/assets/images/currency/${$store.state.network.type.name.toLowerCase()}.svg`)" >
                <div>
                  <p>- {{ $store.state.web3.utils.hexToNumberString(item.tx.value) }} <span>{{ $store.state.network.type.name }}</span></p>
                  <div>
                    <span>From</span> {{ item.tx.from | concatAddr }}
                  </div>
                </div>
              </div>
              <div
                v-show="item.tx.to !== '' && item.tx.to !== undefined"
                class="direction">
                <img src="~@/assets/images/icons/right-arrow.svg">
              </div>
              <div class="header-item">
                <img :src="require(`@/assets/images/currency/${$store.state.network.type.name.toLowerCase()}.svg`)" >
                <div>
                  <p>+ {{ $store.state.web3.utils.hexToNumberString(item.tx.value) }} <span>{{ $store.state.network.type.name }}</span></p>
                  <div>
                    <span>To</span> {{ item.tx.to | concatAddr }}
                  </div>
                </div>
              </div>
              <div class="trigger-container">
                <i class="fa fa-lg fa-angle-up" />
                <i class="fa fa-lg fa-angle-down" />
              </div>
            </div>
            <b-collapse
              :id="`accordion${idx}`"
              class="body">
              <div class="body-item">
                <span class="item-title">Gas Limit</span>
                <span>{{ item.tx.gasPrice }} Gwei</span>
              </div>
              <div class="body-item">
                <span class="item-title">Nonce </span>
                <span>{{ item.tx.nonce }}</span>
              </div>
              <div class="body-item">
                <span class="item-title">Data </span>
                <span class="data-string">{{ item.tx.data }}</span>
              </div>
            </b-collapse>
          </div>
        </div>
      </div>

      <div class="submit-button-container">
        <div class="flex-center-align">
          <div class="button-with-helper">
            <div
              ref="ConfirmAndSendButton"
              :class="[allSigned? '': 'disabled','submit-button large-round-button-green-filled clickable']"
              @click="sendBatchTransactions">
              Confirm and Send
            </div>
            <div class="tooltip-box-2">
              <b-btn id="exPopover9">
                <img
                  class="icon"
                  src="~@/assets/images/icons/qr-code.svg">
              </b-btn>
              <b-popover
                target="exPopover9"
                triggers="hover focus"
                placement="top">
                <div class="qrcode-contents">
                  <p class="qrcode-title">Scan QR code to send/swap instantly</p>
                  <div class="qrcode-block">
                    <qrcode
                      :options="{ size: 100 }"
                      value="Hello, World!"/>
                  </div>
                  <p class="qrcode-helper">What is that?</p>
                </div>
              </b-popover>
            </div>
          </div>
        </div>
        <p class="learn-more">Have any issues? <a href="/">Learn more</a></p>
      </div>
    </b-modal>
  </div>
</template>
<script>
import AddressBlock from '../AddressBlock';
export default {
  components: {
    'address-block': AddressBlock
  },
  props: {
    signedArray: {
      type: Array,
      default: () => []
    },
    sendBatchTransactions: {
      type: Function,
      default: () => {}
    }
  },
  computed: {
    allSigned() {
      for (let i = 0; i < this.signedArray.length; i++) {
        if (
          this.signedArray[i].rawTransaction === '' ||
          this.signedArray[i].rawTransaction === undefined
        )
          return false;
      }
      return true;
    },
    gasAvg() {
      if (this.signedArray.length > 0) {
        let totalGas = 0;
        this.signedArray.forEach(item => {
          totalGas += item.tx.gasPrice;
        });
        const avg = totalGas / this.signedArray.length;
        return this.$store.state.web3.utils
          .fromWei(avg.toString(), 'gwei')
          .toString();
      }
      return 0;
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'ConfirmCollectionModal.scss';
</style>
