<template>
  <div>
    <app-modal
      :has-buttons="false"
      :close="close"
      :show="show"
      title="My public address to receive funds"
    >
      <template #dialogBody>
        <v-row class="px-12">
          <v-col cols="12">
            <v-row dense class="info-container border-radius--5px pa-2">
              <v-col cols="5">
                <qr-code :data="address" :height="150" :width="150" />
              </v-col>
              <v-col cols="7">
                <div class="d-flex">
                  <mew-blockie :address="address" width="30px" height="30px" />
                  <p class="ma-0 ml-2 mew-heading-3">My main account</p>
                </div>
                <p class="ma-0 address-overflow mew-heading-4">
                  {{ address }}
                </p>
                <div
                  class="mew-heading-4 primary--text cursor--pointer"
                  @click="copyAddress"
                >
                  Copy
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <p class="mew-body modal-caption">
              To receive {{ currencyName }} from another account, send
              {{ currencyName }}
              from that account to this address.
            </p>
          </v-col>
        </v-row>
      </template>
    </app-modal>
    <v-row class="mb-5 pa-2 selectHeaderBg border-radius--5px">
      <v-col cols="12">
        <v-row align-content="center" justify="space-around">
          <v-col cols="12">
            <p class="mew-heading-3 ma-0">
              <v-icon> mdi-information-outline </v-icon>
              Your {{ currencyName }} balance is too low
            </p>
          </v-col>
          <v-col cols="6">
            <p class="mew-body">
              Every transaction requires a small amount of
              {{ currencyName }} to execute. Even if you have tokens to swap,
              when your {{ currencyName }} balance is close to zero, you won't
              be able to send anything until you fund your account.
            </p>
          </v-col>
          <v-col cols="6" class="d-flex flex-column">
            <div
              class="mew-body primary--text cursor--pointer"
              @click="openBarcodeModal"
            >
              Transfer {{ currencyName }} from another account
            </div>
            <br />
            <a
              class="mew-body"
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
import { Toast, INFO } from '@/modules/toast/handler/handlerToast';
export default {
  components: {
    AppModal
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
      show: false
    };
  },
  methods: {
    copyAddress() {
      clipboardCopy(this.address);
      Toast(`Copied ${this.address} successfully!`, {}, INFO);
    },
    openBarcodeModal() {
      this.show = true;
    },
    close() {
      this.show = false;
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
