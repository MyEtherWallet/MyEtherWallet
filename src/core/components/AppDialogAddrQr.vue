<template>
  <app-modal :show="showQr" :close="closeQr" :has-buttons="false" width="560px">
    <template #dialogBody>
      <div class="mew-heading-2 text-center mt-6 mb-9">
        My public address to receive funds
      </div>
      <div class="container-qr mx-auto">
        <div class="d-flex align-start justify-start container-qr-info pa-1">
          <qr-code :data="address" :height="116" :width="116" />
          <div class="pl-3">
            <div class="d-flex align-center justify-start mb-2">
              <mew-blockie
                :address="address"
                width="22px"
                height="22px"
                class="inline-block"
              />
              <div class="pl-1 mew-body font-weight-bold inline-block">
                My Main Account
              </div>
            </div>
            <div class="d-block monospace titlePrimary-text container-qr--addr">
              {{ getChecksumAddressString }}
            </div>
            <mew-button
              title="Copy"
              color-theme="primary"
              btn-size="xsmall"
              btn-style="transparent"
              class="ml-n4"
              @click.native="copyAddress"
            />
            <v-row class="pa-0 ma-0 align-start justify-start mt-2">
              <div
                v-for="i in ensDomains"
                :key="i"
                class="pa-1 searchText--text container-qr--addr"
              >
                {{ i }}
              </div>
            </v-row>
          </div>
        </div>
        <v-row class="px-2 py-1 ma-0 align-center justify-start mt-3 mb-6">
          <div class="textPrimary--text">
            To receive ETH from another account, send ETH from that account to
            this address.
          </div>
        </v-row>
      </div>
    </template>
  </app-modal>
</template>

<script>
import AppModal from './AppModal.vue';
import clipboardCopy from 'clipboard-copy';
import { Toast, INFO } from '@/modules/toast/handler/handlerToast';
import { mapState } from 'vuex';
import { toChecksumAddress } from '@/core/helpers/addressUtils';

export default {
  components: {
    AppModal
  },
  props: {
    closeQr: {
      type: Function,
      default: () => {}
    },
    showQr: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapState('wallet', ['address']),
    getChecksumAddressString() {
      return toChecksumAddress(this.address);
    },
    ensDomains() {
      return [
        'olchik.eth',
        'olchikmew.eth',
        'olchik.crypto',
        'oclhikmew.crypto',
        'crazypersonwithalongensname.eth',
        'anothersuperlongnamethatsomeonemigthavelalalalalalalalalala.eth',
        'helloworld.ens'
      ];
    }
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
.container-qr {
  max-width: 340px;
  .container-qr-info {
    border: 1px solid var(--v-boxShadow-base);
    border-radius: 8px;
  }
  .container-qr--addr {
    overflow-wrap: break-word;
    max-width: 200px;
  }
}
</style>
