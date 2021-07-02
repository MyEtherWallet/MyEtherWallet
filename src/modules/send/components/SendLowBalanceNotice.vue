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
            <v-row dense class="info-container border-radius--5px pa-2 pa-sm-3">
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
import { Toast, INFO } from '@/modules/toast/handler/handlerToast';
import { mapGetters } from 'vuex';

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
  computed: {
    ...mapGetters('global', ['isEthNetwork'])
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
