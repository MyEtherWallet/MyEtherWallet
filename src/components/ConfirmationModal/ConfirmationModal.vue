<template>
  <div class="modal-container">
    <b-modal
      ref="confirmation"
      title="Confirmation"
      hide-footer
      centered
      class="bootstrap-modal-wide balance nopadding">
      <div class="title-sub-text">
        (Total 10 conversions)
      </div>

      <div class="top-block">
        <p><span>Network</span> ETH by myetherapi.com</p>
        <p><span>Gas Price</span> 210000 Gwei(0.00321 ETH=$1.234)</p>
      </div>

      <div class="content-block">
        <div 
          :class="blockOpen ? 'expended' : ''" 
          class="expending-block">
          <div 
            class="coin-block" 
            @click="blockOpen = !blockOpen">
            <div class="side-block left-block">
              <div class="icon">
                <img src="~@/assets/images/currency/eth.svg">
              </div>
              <div class="tx-detail">
                <p class="amount">1.00000 ETH</p>
                <p class="address"><span>From</span> 0xDCEF6857A</p>
              </div>
            </div>
            <div class="center-block">
              <img src="~@/assets/images/icons/right-arrow.svg">
            </div>
            <div class="side-block right-block">
              <div class="icon">
                <img src="~@/assets/images/currency/btc.svg">
              </div>
              <div class="tx-detail">
                <p class="amount">1.00000 ETH</p>
                <p class="address"><span>From</span> 0xDCEF6857A</p>
              </div>
            </div>
            <div class="up-down-arrow">
              <i 
                v-if="!blockOpen" 
                class="fa fa-chevron-down" 
                aria-hidden="true"/>
              <i 
                v-if="blockOpen" 
                class="fa fa-chevron-up" 
                aria-hidden="true"/>
            </div>
          </div><!-- .coin-block -->

          <div class="info-block">
            <ul>
              <li>
                <p class="info-name">Gas limit</p>
                <p>21000</p>
              </li>
              <li>
                <p class="info-name">Max Transaction Fee</p>
                <p>441000 Gwei(0.000441 ETH)</p>
              </li>
              <li>
                <p class="info-name">Nonce</p>
                <p>0</p>
              </li>
              <li>
                <p class="info-name">Data</p>
                <p>None</p>
              </li>
            </ul>
          </div><!-- .info-block -->
        </div><!-- .expending-block -->

        <div class="button-container">
          <botton-with-qrcode buttonname="Confirm and Send" />
        </div>
        <div>
          <bottom-text 
            link-text="Help Center" 
            question="Having issues?" 
            link="/" />
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import ButtonWithQrcode from '@/components/Buttons/ButtonWithQrCode';
import InterfaceBottomText from '@/components/InterfaceBottomText';

export default {
  components: {
    'botton-with-qrcode': ButtonWithQrcode,
    'bottom-text': InterfaceBottomText
  },
  data() {
    return {
      blockOpen: false
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'ConfirmationModal.scss';
</style>
