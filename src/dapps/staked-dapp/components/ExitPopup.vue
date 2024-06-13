<template>
  <mew-popup
    max-width="690px"
    :show="openExitModal"
    :has-buttons="false"
    :has-body-content="true"
    title="Exit stake and withdraw"
    :left-btn="leftBtn"
  >
    <div>
      <div class="mb-5 mew-heading-4 text-center pa-4 success-container">
        You are exiting validator
        <a
          :href="selectedValidator.url"
          target="_blank"
          rel="noopener noreferrer"
          >#{{ selectedValidator.validator_index }}</a
        >
        and will receive {{ selectedValidator.totalBalanceETH }} ETH to
        <b>{{ withdrawalAddress }}</b>
      </div>
      <div class="mew-body mb-5">
        Your validator will be terminated and your staked ETH will be withdrawn.
        After this is completed, you will no longer be earning staking rewards
        on Ethereum. Any currently accumulated rewards will be automatically
        deposited to your designated withdrawal address. The amount of time
        until staking rewards and the full withdrawn stake appear in your wallet
        depends on the Ethereum withdrawal queue and can not be influenced by
        MEW.
      </div>
      <div class="pb-5">
        <div class="mew-caption">
          Sign message requesting Staked.us to exit your validator(s) from the
          network:
        </div>
        <code>
          {{ message }}
        </code>
      </div>
      <div v-if="loadingButton || exitFinished" class="pb-5">
        <div class="d-flex align-center pa-2 mb-2 loaders-container">
          <div class="mr-2">
            <v-progress-circular
              v-if="loadingSign"
              indeterminate
              color="primary"
              size="32"
              width="2"
            />
            <v-icon
              v-if="!loadingSign"
              size="24"
              color="greenPrimary"
              class="pa-1"
            >
              mdi-checkbox-marked-circle
            </v-icon>
          </div>
          <div>
            {{ loadingSign ? 'Signing message' : 'Message signed' }}
          </div>
        </div>
        <div class="d-flex align-center pa-2 loaders-container">
          <div class="mr-2">
            <v-progress-circular
              v-if="loadingStakedCall"
              indeterminate
              color="primary"
              size="32"
              width="2"
            />
            <v-icon
              v-if="!loadingStakedCall"
              size="24"
              color="greenPrimary"
              class="pa-1"
            >
              mdi-checkbox-marked-circle
            </v-icon>
          </div>
          <div>
            {{
              loadingStakedCall ? 'Sending to Staked.us' : 'Sent to Staked.us'
            }}
          </div>
        </div>
        <div v-if="!loadingSign && !loadingStakedCall" class="mt-3">
          Successfully started exit & withdrawal process! Please check
          <a
            :href="`${validatorUrl}${selectedValidator.validator_index}`"
            target="_blank"
            rel="noopener noreferrer"
            >#{{ selectedValidator.validator_index }}</a
          >
          for up to date status.
        </div>
      </div>
      <div class="mb-2 text-center d-flex align-center justify-center">
        <mew-button
          v-if="loadingSign && loadingStakedCall"
          :title="btnTitle"
          btn-size="xlarge"
          :loading="loadingButton"
          :disabled="loadingButton"
          @click.native="btnMethod"
        />
        <mew-button
          v-else
          :title="btnTitle"
          btn-size="xlarge"
          :disabled="loadingSign || loadingStakedCall"
          @click.native="btnMethod"
        />
      </div>
    </div>
  </mew-popup>
</template>

<script setup>
import { defineProps, ref, computed } from 'vue';
import { isEmpty } from 'lodash';
import { toHex } from 'web3-utils';

import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import networkConfig from '../handlers/configNetworkTypes';

import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useStakedStore } from '../store';

// injections
const { network } = useGlobalStore();
const { instance, address } = useWalletStore();
const { addWithdrawalValidatorIndex } = useStakedStore();

// props
const props = defineProps({
  openExitModal: {
    type: Boolean,
    default: false
  },
  closeModal: {
    type: Function,
    default: () => {}
  },
  selectedValidator: {
    type: Object,
    default: () => {}
  }
});

// data
const loadingButton = ref(false);
const loadingSign = ref(true);
const loadingStakedCall = ref(true);
const exitFinished = ref(false);

// computed
const validatorUrl = computed(() => {
  return networkConfig.network[network.value.type.name].url;
});
/**
 * returns the challenge to be signed by the user
 */
const message = computed(() => {
  return JSON.stringify({
    intentToExit:
      'I am signing this message and requesting that Staked exit the following validators from the network',
    validatorIndexes: [props.selectedValidator.validator_index],
    address: address.value
  });
});
/**
 * @returns object
 * Returns the left button config for
 * mew popup
 */
const leftBtn = computed(() => {
  return {
    text: 'Cancel',
    color: 'basic',
    method: modalClose
  };
});
const btnMethod = computed(() => {
  if (loadingSign.value && loadingStakedCall.value) {
    return signAndExit;
  }
  return modalClose;
});
const btnTitle = computed(() => {
  if (loadingSign.value && loadingStakedCall.value) {
    return 'Sign & Exit';
  }
  return 'Close';
});
const withdrawalAddress = computed(() => {
  return isEmpty(props.selectedValidator)
    ? '0x'
    : `0x${props.selectedValidator.withdrawal_credentials.substring(
        24,
        props.selectedValidator.withdrawal_credentials.length
      )}`;
});

// methods
const modalClose = () => {
  localReset();
  props.closeModal();
};
const localReset = () => {
  loadingButton.value = false;
  loadingSign.value = true;
  loadingStakedCall.value = true;
  exitFinished.value = false;
};
const signAndExit = async () => {
  loadingButton.value = true;
  try {
    const signature = await instance.value.signMessage(message, address.value);
    const parsedSignature = toHex(signature);
    loadingSign.value = false;
    const challenge = Buffer.from(
      '\u{19}Ethereum Signed Message:\n' +
        message.value.length.toString() +
        message.value
    ).toString('hex');

    const headerDomain =
      network.value.type.name === 'ETH' ? 'mainnet' : 'staging';
    const submitEndpoint = `https://${headerDomain}.mewwallet.dev/v2/stake/exit`;
    await fetch(submitEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        address: address.value,
        challenge: challenge.toString('hex'),
        signature: parsedSignature
      })
    }).then(res => {
      if (res.ok) {
        loadingStakedCall.value = false;
        loadingButton.value = false;
        exitFinished.value = true;
        addWithdrawalValidatorIndex(props.selectedValidator.validator_index);
        return;
      }
      res.json().then(jsonres => {
        Toast(jsonres.error ? jsonres.error : jsonres.msg, {}, ERROR);
        localReset();
      });
    });
  } catch (e) {
    Toast(e, {}, ERROR);
    localReset();
  }
};
</script>

<style lang="scss" scoped>
.loaders-container {
  border: 1px solid var(--v-greenPrimary-base);
  border-radius: 5px;
}
.success-container {
  @extend .loaders-container;
  background-color: #f2fafa;
}
</style>
