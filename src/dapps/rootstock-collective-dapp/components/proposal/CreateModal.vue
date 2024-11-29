<template>
  <div>
    <mew-popup
      max-width="690px"
      :show="openCreateModal"
      :has-buttons="false"
      :has-body-content="true"
      :title="modalTitle"
      :left-btn="leftBtn"
    >
      <v-sheet
        max-width="600px"
        color="transparent"
        class="px-3 py-1 py-md-1 mx-auto"
      >
        <div class="mb-5">
          <form @submit.prevent="oncreateProposal">
            <v-row class="mx-0">
              <v-col class="pr-0" cols="12">
                <mew-input
                  v-model="title"
                  :rules="validateTitle"
                  :value="title"
                  :has-clear-btn="true"
                  :label="$t('rootstockCollective.proposal.proposalNameField')"
                  :placeholder="
                    $t(
                      'rootstockCollective.proposal.proposalNameFieldPlaceholder'
                    )
                  "
                  class="mr-3 flex-grow-1"
                />
              </v-col>

              <v-col class="pr-0" cols="12">
                <mew-text-area
                  v-model="description"
                  :rules="validateDesc"
                  style="width: 100%"
                  :has-clear-btn="true"
                  :label="$t('rootstockCollective.proposal.proposalDescField')"
                  :placeholder="
                    $t(
                      'rootstockCollective.proposal.proposalDescFieldPlaceholder'
                    )
                  "
                  class="flex-grow-1 pr-3 mr-3"
                />
              </v-col>

              <v-col class="pr-0" cols="12">
                <mew-input
                  v-model="transferTo"
                  :rules="validateTransferTo"
                  :value="transferTo"
                  :has-clear-btn="true"
                  :label="
                    $t('rootstockCollective.proposal.proposalTransferField')
                  "
                  :placeholder="
                    $t(
                      'rootstockCollective.proposal.proposalTransferFieldPlaceholder'
                    )
                  "
                  class="mr-3 flex-grow-1"
                />
              </v-col>

              <v-col class="pr-0" cols="12">
                <mew-select
                  v-model="provider"
                  :rules="validateProvider"
                  :has-filter="false"
                  :label="$t('rootstockCollective.proposal.selectAsset')"
                  :items="providers"
                  normal-dropdown
                  class="mr-3 flex-grow-1 mb-4"
                />
              </v-col>
              <v-col class="pr-0" cols="12">
                <mew-input
                  v-model="amount"
                  :rules="validateAmount"
                  :value="amount"
                  :has-clear-btn="true"
                  :label="$t('rootstockCollective.proposal.amount')"
                  :placeholder="$t('rootstockCollective.proposal.amount')"
                  class="mr-3 flex-grow-1"
                />
              </v-col>
            </v-row>
            <v-row class="mx-0">
              <v-col class="pl-0" cols="12">
                <div class="align-right">
                  <div v-if="txLoading" class="pl-3 mt-2 text-primary mb-1">
                    Please wait few seconds...
                  </div>
                  <mew-button
                    :disabled="txLoading || disabled"
                    :loading="txLoading"
                    :has-full-width="false"
                    :title="$t('rootstockCollective.proposal.createProposal')"
                    @click.native="oncreateProposal"
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
import {
  encodeTreasuryTransfer,
  encodeTreasuryERC20Transfer,
  createProposal
} from '../../handlers/helpers/proposals';
import {
  getTreasuryAddress,
  getRIFAddress
} from '../../handlers/helpers/contracts';
import { isAmountValid } from '../../handlers/helpers/utils';
import { isAddress } from '@/core/helpers/addressUtils.js';

export default {
  name: 'CreateModal',
  props: {
    openCreateModal: {
      default: false,
      type: Boolean
    },
    resetCreateModal: {
      type: Function,
      default: () => {}
    },
    govContract: {
      default: () => {},
      type: Object
    },
    stRifContract: {
      default: () => {},
      type: Object
    }
  },
  data() {
    return {
      msg: '',
      title: '',
      description: ' ',
      amount: '',
      errorMsg: '',
      txLoading: false,
      modalTitle: 'Create Proposal',
      transferTo: '',
      provider: '',
      providers: [{ name: 'RIF' }, { name: 'RBTC' }]
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
    },
    disabled() {
      return (
        !this.title ||
        !this.description ||
        !isAddress(this.transferTo) ||
        !this.provider ||
        !isAmountValid(this.amount, 0, 100000000)
      );
    },
    validateTitle() {
      return [!!this.title || `Title is required`];
    },
    validateDesc() {
      return [!!this.description || `Description is required`];
    },
    validateProvider() {
      return [!!this.provider || `Asset type is required`];
    },
    validateTransferTo() {
      return [isAddress(this.transferTo) || `A valid address is required`];
    },
    validateAmount() {
      return [isAmountValid(this.amount, 0, 100000000) || 'Amount not valid'];
    }
  },
  mounted() {
    this.msg = '';
  },
  methods: {
    modalClose() {
      this.resetCreateModal();
    },
    async oncreateProposal() {
      try {
        this.txLoading = true;
        this.errorMsg = '';
        const rifAddress = getRIFAddress(this.network.type.chainID);
        const treasuryAddress = getTreasuryAddress(this.network.type.chainID);
        const proposalThreshhold = await this.govContract.proposalThreshold();
        const threshold = ethers.utils.formatUnits(proposalThreshhold, 18);
        const stRifBalance = await this.stRifContract.balanceOf(this.address);
        const formattedSTRIFBalance = ethers.utils.formatUnits(
          stRifBalance,
          18
        );

        if (formattedSTRIFBalance > threshold) {
          // can create proposal
          let calldata;

          if (this.provider.name === 'RBTC') {
            calldata = encodeTreasuryTransfer(this.transferTo, this.amount);
          } else {
            calldata = encodeTreasuryERC20Transfer(
              this.transferTo,
              this.amount,
              rifAddress
            );
          }

          const { proposal } = createProposal(
            [calldata],
            `${this.title};${this.description}`,
            treasuryAddress
          );

          const tx = await this.govContract.propose(...proposal);

          await tx.wait();

          this.txLoading = false;
          this.$emit('onCreateDone', tx);
        } else {
          this.txLoading = false;
          this.errorMsg =
            'Not enough STRIF balance to create this proposal! Please stake more RIF tokens to create proposal!';
        }
      } catch (e) {
        this.txLoading = false;
        this.errorMsg = 'Create proposal Tx failed!';
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
.api-error {
  color: #ff445b;
  font-size: 12px;
}
</style>
