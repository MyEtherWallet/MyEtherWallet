<template>
  <mew-overlay
    title="Send NFT"
    :show-overlay="onNftSend"
    right-btn-text="Close"
    :back="send"
    :close="send"
  >
    <template #mewOverlayBody>
      <v-card
        min-width="600"
        class="mt-5 d-flex align-center flex-column justify-center pa-5"
      >
        <img
          height="200"
          :src="nft.image ? nft.image : getImageUrl(nft)"
          alt="Crypto Kitty"
        />
        <div class="ma-5">{{ nft.name }}</div>
        <module-address-book @setAddress="setAddress" />
        <mew-expand-panel
          ref="expandPanel"
          class="full-width"
          is-toggle
          has-dividers
          :panel-items="expandPanel"
        >
          <template #panelBody1>
            <div class="d-flex justify-space-between px-5 border-bottom pb-5">
              <div class="mew-body font-weight-medium d-flex align-center">
                {{ $t('sendTx.tx-fee') }}
                <mew-tooltip class="ml-1" text="" />
              </div>
              <i18n path="sendTx.cost-eth-usd" tag="div">
                <span slot="eth">{{ txDetails.txFeeEth }}</span>
                <span slot="usd">{{ txDetails.txFeeUsd }}</span>
              </i18n>
            </div>
            <div>
              <mew-input
                :value="customGasLimit"
                :disabled="true"
                :label="$t('common.gas.limit')"
                placeholder=""
              />
            </div>

            <mew-input
              v-model="data"
              :label="$t('sendTx.add-data')"
              :disabled="true"
              placeholder=" "
              class="mt-10 mb-n5"
            />
          </template>
        </mew-expand-panel>
        <mew-button
          :has-full-width="false"
          btn-style="outline"
          title="Confirm & send"
          btn-size="large"
          :disabled="disabled"
          @click.native="send(nft)"
        />
      </v-card>
    </template>
  </mew-overlay>
</template>

<script>
import ModuleAddressBook from '@/modules/address-book/ModuleAddressBook';

export default {
  components: {
    ModuleAddressBook
  },
  props: {
    txDetails: {
      default: () => {
        return {};
      },
      type: Object
    },
    nft: {
      default: () => {
        return {};
      },
      type: Object
    },
    onNftSend: {
      default: false,
      type: Boolean
    },
    getImageUrl: {
      default: () => {
        return;
      },
      type: Function
    },
    send: {
      default: () => {
        return;
      },
      type: Function
    },
    setAddress: {
      default: () => {
        return;
      },
      type: Function
    },
    disabled: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      expandPanel: [
        {
          name: this.$t('common.advanced'),
          subtext: this.$t('sendTx.data-gas')
        }
      ]
    };
  }
};
</script>
