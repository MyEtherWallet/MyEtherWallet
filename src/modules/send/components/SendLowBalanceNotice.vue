<template>
  <div>
    <app-modal
      :show="openQR"
      :close="closeQR"
      :has-buttons="false"
      width="400px"
    >
      <template #dialogBody>
        <app-addr-qr />
      </template>
    </app-modal>
    <v-row class="pa-2 selectHeaderBg border-radius--5px">
      <v-col cols="12">
        <v-row align-content="center" justify="space-around">
          <v-col cols="12" class="pb-0">
            <p class="font-weight-bold ma-0">
              <v-icon class="black--text mew-body">
                mdi-information-outline
              </v-icon>
              Your {{ currencyName }} balance is too low
            </p>
          </v-col>
          <v-col cols="12" sm="6">
            <div class="mew-body textBlack2--text">
              Every transaction requires a small amount of
              {{ currencyName }} to execute. Even if you have tokens to swap,
              when your {{ currencyName }} balance is close to zero, you won't
              be able to send anything until you fund your account.
            </div>
          </v-col>
          <v-col cols="12" sm="6" class="d-flex flex-column">
            <div
              class="mew-body primary--text font-weight-medium cursor--pointer"
              @click="openBarcodeModal"
            >
              Transfer {{ currencyName }} from another account
            </div>
            <br />
            <a
              v-if="isEthNetwork"
              class="mew-body font-weight-medium"
              href="https://ccswap.myetherwallet.com/#/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Buy {{ currencyName }}
            </a>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import clipboardCopy from 'clipboard-copy';
import AppModal from '@/core/components/AppModal';
import AppAddrQr from '@/core/components/AppAddrQr';
import { Toast, INFO } from '@/modules/toast/handler/handlerToast';
import { mapGetters } from 'vuex';

export default {
  components: {
    AppModal,
    AppAddrQr
  },
  props: {
    address: {
      type: String,
      default: ''
    },
    currencyName: {
      type: String,
      default: 'ETH'
    }
  },
  data() {
    return {
      openQR: false
    };
  },
  computed: {
    ...mapGetters('global', ['isEthNetwork'])
  },
  methods: {
    copyAddress() {
      clipboardCopy(this.address);
      Toast(`Copied ${this.address} successfully!`, {}, INFO);
    },
    openBarcodeModal() {
      this.openQR = true;
    },
    closeQR() {
      this.openQR = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-caption {
  color: var(--v-captionPrimary);
}

.address-overflow {
  word-break: break-all;
}

.info-container {
  border: 1px solid var(--v-basicOutlineActive-base);
}
</style>
