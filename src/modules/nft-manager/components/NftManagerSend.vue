<template>
  <mew-overlay
    title="Send NFT"
    :show-overlay="open"
    right-btn-text="Close"
    :back="send"
    :close="send"
  >
    <template #mewOverlayBody>
      <img
        height="200"
        :src="selectedNft.image ? selectedNft.image : imageUrl(selectedNft)"
        alt="Crypto Kitty"
      />
      <div class="ma-5">{{ selectedNft.name }}</div>
      <mew-address-select
        ref="addressSelect"
        class="full-width"
        :value="toAddress"
        :copy-tooltip="$t('common.copy')"
        :save-tooltip="$t('common.save')"
        :enable-save-address="true"
        :label="$t('sendTx.to-addr')"
        :items="addresses"
        :placeholder="$t('sendTx.enter-addr')"
        :success-toast="$t('sendTx.success.title')"
        :is-valid-address="isValidAddress()"
        @input="setAddress"
      />
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
            <div v-show="isEth">
              <i18n path="sendTx.cost-eth-usd" tag="div">
                <span slot="eth">{{ txFeeInETH }}</span>
                <span slot="usd">{{ txFeeInUSD }}</span>
              </i18n>
            </div>
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
        :disabled="validValues"
        @click.native="sendTx(selectedNft)"
      />
    </template>
  </mew-overlay>
</template>

<script>
export default {
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
