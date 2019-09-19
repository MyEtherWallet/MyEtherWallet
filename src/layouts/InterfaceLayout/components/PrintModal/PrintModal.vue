<template>
  <div class="modal-container">
    <b-modal
      ref="print"
      title="Print Preview"
      hide-footer
      centered
      class="nopadding print-mod"
      size="lg"
    >
      <div id="printContainer" class="print-modal">
        <div class="top-container">
          <div class="left-section">
            <div class="blockie-contianer">
              <div>
                <blockie :address="newAddress" class="blockie" width="50px" height="50px"/>
              </div>
              <div class="text-container">
                <h3>{{ header }}</h3>
                <span>{{ subheader }}</span>
              </div>
            </div>
            <div>
              <h4 class="left-text">
                {{ content.text1 }}
                <span>{{ content.red1 }}</span>
                {{ content.text2 }}
                <span>{{ content.red2 }}</span>
                {{ content.text3 }}
              </h4>
            </div>
            <div class="link-container">
              <p>
                <img height="15px" src="~@/assets/images/icons/support.svg">
                {{ link1 }}
              </p>
              <p>
                <img height="15px" src="~@/assets/images/icons/web-solution-white.svg">
                {{ link2 }}
              </p>
            </div>
          </div>
          <div class="right-section">
            <div class="header-text">
              <b>
                <img src="~@/assets/images/logo-small.png" height="30px">
                {{ mew }}
              </b>
              <span class="header-line"/>
              <span>{{ paper }}</span>
            </div>

            <div class="qr-code-container">
              <qrcode :value="newAddress" :options="{ size: 100 }"/>
              <div class="text-container">
                <h4>{{ myAddress }}</h4>
                <span>
                  {{ newAddress.slice(0, 21) }}
                  <br>
                  {{ newAddress.slice(21, 43) }}
                </span>
              </div>
            </div>
          </div>
          <img src="~@/assets/images/background/404bg.jpg" width="100%" class="floating-img">
        </div>
        <div class="between">
          <div class="text">
            <img height="15px" src="~@/assets/images/icons/scissor.svg"> Cut
            Here
          </div>
          <div class="dash"></div>
        </div>
        <div class="bottom-container">
          <div class="header-container">
            <blockie :address="newAddress" width="55px" height="55px"/>
            <div class="header-content">
              <h3>{{ myAddress }}</h3>
              <p>{{ subheader }}</p>
            </div>
          </div>
          <div class="body-container">
            <h3>
              {{ content.text1 }}
              <span>{{ content.red1 }}</span>
              {{ content.text2 }}
              <span>{{ content.red2 }}</span>
              {{ content.text3 }}
            </h3>
          </div>
          <div class="my-address-container">
            <div class="text-container">
              <h3>{{ myAddress }}</h3>
              <p>{{ newAddress }}</p>
            </div>
            <qrcode :value="newAddress" :options="{ size: 120 }"/>
          </div>
          <div v-if="!wallet.isPubOnly" class="my-priv-container">
            <div class="text-container">
              <h3>{{ myPriv }}</h3>
              <p>{{ wallet.privateKey.toString('hex') }}</p>
            </div>
            <qrcode :value="wallet.privateKey.toString('hex')" :options="{ size: 120 }"/>
          </div>
        </div>
        <div class="footer-container">
          <div class="link-container">
            <p>
              <img height="17px" src="~@/assets/images/icons/support.svg">
              {{ link1 }}
            </p>
            <p>
              <img height="15px" src="~@/assets/images/icons/web-solution.svg">
              {{ link2 }}
            </p>
          </div>
          <div class="logo-container">
            <img src="~@/assets/images/logo.png" height="25px">
            <p class="border-line"></p>
            <p>{{ paper }}</p>
          </div>
        </div>
      </div>
      <div class="button-container">
        <div class="print-button" @click="print">Print</div>
      </div>
    </b-modal>
  </div>
</template>
<script>
import Blockie from '@/components/Blockie';
import printJS from 'print-js';
import html2canvas from 'html2canvas';
import { mapGetters } from 'vuex';

export default {
  components: {
    blockie: Blockie
  },
  props: {
    address: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      header: 'MY XinFin ADDRESS ICON',
      subheader: 'Always look for this icon when sending to this wallet',
      mew: 'XinFin Wallet',
      paper: 'Paper Wallet',
      link1: 'support@xinfin.org',
      link2: 'https://XinFin.Network/#webWallet',
      myAddress: 'MY ADDRESS',
      myPriv: 'MY PRIVATE KEY',
      newAddress: 'xdc' + this.$props.address.substring(2),
      content: {
        text1: 'Please Keep Your Paper Wallet at a',
        text2: 'Place! Please',
        text3: 'Share Your Private Key With Anyone!',
        red1: 'SAFE',
        red2: 'DO NOT'
      }
    };
  },
  computed: {
    ...mapGetters({
      wallet: 'wallet'
    })
  },
  methods: {
    async print() {
      const element = document.getElementById('printContainer');
      const screen = await html2canvas(element, {
        async: true,
        logging: false
      }).then(canvas => {
        return canvas;
      });

      printJS({
        printable: screen.toDataURL('image/png'),
        type: 'image'
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'PrintModal.scss';
</style>
