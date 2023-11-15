<template>
  <!--
    ===================================================
    Step two: Generate Eth2 Address
    ===================================================
    -->
  <div>
    <div class="mx-auto mb-3" style="max-width: 550px">
      <border-block class="mt-4 pa-3 pa-sm-5">
        <!--
        ===================================================
        Eth2 Address
        ===================================================
        -->
        <div class="overlayBg rounded pa-5">
          <mew-warning-sheet
            class="mb-5"
            title=""
            description="The withdrawal address can only be set once and can never be changed. Please make sure the withdrawal address you are setting is a non-custodial wallet to which you have full access with a recovery phrase or private key. Do NOT use an exchange address or a smart contract wallet."
          />
          <div class="mew-heading-3 mb-3">Your withdrawal address</div>
          <module-address-book
            ref="addressInput"
            class="AddressInput"
            :preselect-curr-wallet-adr="true"
            :currency="currencyName"
            label="Address"
            @setAddress="setAddress"
          />
        </div>
      </border-block>
      <!--
    ======================================================
    Back + Continue buttons
    ======================================================
    -->
      <div
        class="mt-10 d-flex flex-column-reverse flex-md-row align-center justify-center"
      >
        <mew-button
          :has-full-width="$vuetify.breakpoint.smAndDown"
          btn-size="xlarge"
          class="d-block ma-2"
          title="Back"
          btn-style="outline"
          @click.native="onBack"
        />
        <mew-button
          :has-full-width="$vuetify.breakpoint.smAndDown"
          btn-size="xlarge"
          class="d-block ma-2"
          :title="buttonText"
          :disabled="!isValidAddress"
          @click.native="onContinue(false)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    ModuleAddressBook: () => import('@/modules/address-book/ModuleAddressBook')
  },
  data() {
    return {
      eth2Address: '',
      isValidAddress: false,
      downloadedKeystore: false,
      link: {}
    };
  },
  computed: {
    ...mapState('wallet', ['address']),
    ...mapGetters('global', ['network']),
    currencyName() {
      return this.network.type.currencyName;
    },
    buttonText() {
      return this.downloadedKeystore
        ? 'Next: upload your keystore file'
        : 'Review & stake';
    }
  },
  mounted() {
    /**
     * Create Keystore handler
     * then create address, mnemonic
     */
    this.createAddress();
  },
  methods: {
    setAddress(addr, isValidAddress) {
      this.eth2Address = addr;
      this.isValidAddress = isValidAddress;
    },
    /**
     * Create Eth2 Address
     */
    async createAddress() {
      this.eth2Address = this.address;
      this.validAddress = false;
    },
    /**
     * Emits back to go to previous step
     */
    onBack() {
      this.$emit('back');
    },
    /**
     * Emits onContinue to go to next step
     * if skipped @returns true means do not need to generate
     * a new keystore
     */
    onContinue(skipped) {
      this.$emit('onContinue', {
        onStep: 2,
        isSkipped: skipped,
        address: this.eth2Address
      });
      URL.revokeObjectURL(this.link.href);
    }
  }
};
</script>
