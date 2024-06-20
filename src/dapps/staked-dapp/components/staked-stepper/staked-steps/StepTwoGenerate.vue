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
          :has-full-width="vuetify.breakpoint.smAndDown"
          btn-size="xlarge"
          class="d-block ma-2"
          title="Back"
          btn-style="outline"
          @click.native="onBack"
        />
        <mew-button
          :has-full-width="vuetify.breakpoint.smAndDown"
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

<script setup>
import { ref, defineAsyncComponent, onMounted, computed } from 'vue';
import { useAmplitude } from '@/core/composables/amplitude';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useVuetify } from '../composables/vuetify';

const ModuleAddressBook = defineAsyncComponent(() =>
  import('@/modules/address-book/ModuleAddressBook')
);

// emits
const emit = defineEmits(['onContinue']);

// injections/use
const { trackDapp } = useAmplitude();
const { network } = useGlobalStore();
const { address } = useWalletStore();
const vuetify = useVuetify();

// data
const eth2Address = ref('');
const isValidAddress = ref(false);
const downloadedKeystore = ref(false);
const link = ref({});

// computed
const currencyName = computed(() => {
  return network.value.type.currencyName;
});
const buttonText = computed(() => {
  return downloadedKeystore.value
    ? 'Next: upload your keystore file'
    : 'Review & stake';
});

// mounted
onMounted(() => {
  createAddress();
});

// methods
const setAddress = (addr, isValidAddress) => {
  eth2Address.value = addr;
  isValidAddress.value = isValidAddress;
};
/**
 * Create Eth2 Address
 */
const createAddress = async () => {
  eth2Address.value = address.value;
  isValidAddress.value = false;
};
/**
 * Emits back to go to previous step
 */
const onBack = () => {
  emit('back');
};
/**
 * Emits onContinue to go to next step
 * if skipped @returns true means do not need to generate
 * a new keystore
 */
const onContinue = skipped => {
  trackDapp('StakedSetWithdrawalAddress');
  emit('onContinue', {
    onStep: 2,
    isSkipped: skipped,
    address: eth2Address
  });
  URL.revokeObjectURL(link.value.href);
};
</script>
