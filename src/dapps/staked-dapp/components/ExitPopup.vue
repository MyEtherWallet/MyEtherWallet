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
          network:z
        </div>
        <code>
          {{ message }}
        </code>
      </div>
      <div v-if="loadingButton" class="pb-5">
        <div class="d-flex align-center pa-2 mb-2 loaders-container">
          <div class="mr-2">
            <v-progress-circular
              v-if="loadingSign"
              indeterminate
              color="primary"
            />
            <div
              v-if="!loadingSign"
              v-lottie="successLottie"
              class="lottie-size"
            />
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
            />
            <div v-if="!loadingStakedCall" v-lottie="successLottie" />
          </div>
          <div>
            {{
              loadingStakedCall ? 'Sending to Staked.us' : 'Sent to Staked.us'
            }}
          </div>
        </div>
      </div>
      <div class="mb-2 text-center d-flex align-center justify-center">
        <mew-button
          title="Sign and Exit"
          btn-size="xlarge"
          :loading="loadingButton"
          :disabled="loadingButton"
          @click.native="signAndExit"
        />
      </div>
    </div>
  </mew-popup>
</template>

<script>
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import { mapState } from 'vuex';
import { toHex } from 'web3-utils';
export default {
  props: {
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
  },
  data() {
    return {
      loadingButton: false,
      loadingSign: true,
      loadingStakedCall: true
    };
  },
  computed: {
    ...mapState('wallet', ['instance', 'address']),
    successLottie() {
      return 'checkmark';
    },
    /**
     * returns the challenge to be signed by the user
     */
    message() {
      return JSON.stringify(
        {
          intentToExit:
            'I am signing this message and requesting that Staked exit the following validators from the network',
          validatorIndexes: [this.selectedValidator.validator_index],
          address: this.address
        },
        null,
        2
      );
    },
    /**
     * @returns object
     * Returns the left button config for
     * mew popup
     */
    leftBtn() {
      return {
        text: 'Cancel',
        color: 'basic',
        method: this.closeModal
      };
    }
  },
  methods: {
    async signAndExit() {
      this.loadingButton = true;
      try {
        const signature = await this.instance.signMessage(
          this.message,
          this.address
        );
        this.loadingSign = false;
        const packedChallenge = toHex(
          '\u0019Ethereum Signed Message:\n' +
            signature.length.toString() +
            signature
        );
      } catch (e) {
        Toast(e, {}, ERROR);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.loaders-container {
  border: 1px solid var(--v-greenPrimary-base);
  border-radius: 5px;
}

.lottie-size {
  width: 32px;
  height: 32px;
}
</style>
