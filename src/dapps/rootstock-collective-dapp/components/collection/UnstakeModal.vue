<template>
  <div>
    <mew-popup
      max-width="690px"
      :show="openUnStakingModal"
      :has-buttons="false"
      :has-body-content="true"
      :title="modalTitle"
      :left-btn="leftBtn"
    >
      <v-sheet
        max-width="600px"
        color="transparent"
        class="px-3 py-2 py-md-2 mx-auto"
      >
        <div class="mb-1">
          <form @submit.prevent="unstakeSTRIF">
            <v-row class="mx-0">
              <v-col class="pr-0" cols="12">
                <mew-input
                  :value="stakeAmount"
                  :has-clear-btn="true"
                  :label="
                    $t('rootstockCollective.collective.unstakeInputLabel')
                  "
                  :placeholder="
                    $t('rootstockCollective.collective.unstakeInputPlaceholder')
                  "
                  class="mr-3 flex-grow-1"
                  @input="setStakeAmount"
                />
                <span
                  >Available: {{ Number(strifBalance).toFixed(2) }} stRIF</span
                >
              </v-col>
            </v-row>
            <v-row class="mx-0">
              <v-col class="pl-0" cols="12">
                <div class="align-right">
                  <div v-if="txLoading" class="pl-3 mt-2 text-primary mb-1">
                    Please wait few seconds...
                  </div>
                  <mew-button
                    :loading="txLoading"
                    :disabled="
                      !stakeAmount ||
                      Number(strifBalance) < Number(stakeAmount) ||
                      (stakeAmount &&
                        parseInt(stakeAmount).toString() === 'NaN') ||
                      txLoading
                    "
                    :has-full-width="false"
                    :title="$t('rootstockCollective.collective.unstake')"
                    @click.native="unstakeSTRIF"
                  />
                </div>
                <div class="mt-2 api-error text-danger">{{ errorMsg }}</div>
              </v-col>
            </v-row>
          </form>
        </div>
      </v-sheet>
    </mew-popup>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { ethers } from 'ethers';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';

export default {
  name: 'UnstakingModal',
  props: {
    openUnStakingModal: {
      default: false,
      type: Boolean
    },
    resetUnStakeModal: {
      type: Function,
      default: () => {}
    },
    stRifContract: {
      default: () => {},
      type: Object
    },
    strifBalance: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      errorMsg: '',
      txLoading: false,
      modalTitle: 'Unstake RIF',
      stakeAmount: ''
    };
  },
  computed: {
    ...mapState('wallet', ['balance', 'address', 'web3', 'instance']),
    ...mapGetters('global', ['network']),
    leftBtn() {
      return {
        text: 'Cancel',
        color: 'basic',
        method: this.modalClose
      };
    }
  },
  mounted() {
    this.errorMsg = '';
  },
  methods: {
    setStakeAmount(v) {
      this.stakeAmount = v;
    },
    modalClose() {
      this.resetUnStakeModal();
    },
    async unstakeSTRIF() {
      try {
        this.txLoading = true;
        this.errorMsg = '';
        const rifTx = await this.stRifContract.withdrawTo(
          this.address,
          ethers.utils.parseEther(this.stakeAmount)
        );

        await rifTx.wait();
        this.txLoading = false;
        this.$emit('onUnStakeDone', rifTx);
      } catch (e) {
        this.txLoading = false;
        this.errorMsg = 'withdrawTo RIF Tx failed!';
        Toast(e, ERROR);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.align-right {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.dao-table {
  width: 100%;
  text-align: left;
  .table-header {
    text-align: left;
    th {
      padding: 1rem;
    }
  }

  td {
    padding: 1rem;
  }
}

.api-error {
  color: #ff445b;
  font-size: 12px;
}
.btc-amount {
  position: relative;
  .notes {
    position: absolute;
    right: 21px;
    bottom: 36px;
    font-size: 10px;
    font-style: italic;
  }
}
</style>
