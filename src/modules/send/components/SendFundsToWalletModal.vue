<template>
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
    close: {
      type: Function,
      default: () => {}
    },
    show: {
      type: Boolean,
      default: false
    },
    address: {
      type: String,
      default: ''
    },
    currencyName: {
      type: String,
      default: 'ETH'
    }
  },
  methods: {
    copyAddress() {
      clipboardCopy(this.address);
      Toast(`Copied ${this.address} successfully!`, {}, INFO);
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
