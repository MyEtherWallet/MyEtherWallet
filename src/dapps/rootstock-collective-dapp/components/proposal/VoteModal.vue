<template>
  <div>
    <mew-popup
      max-width="690px"
      :show="openVoteModal"
      :has-buttons="false"
      :has-body-content="true"
      :title="modalTitle"
      :left-btn="leftBtn"
    >
      <v-sheet
        max-width="600px"
        color="transparent"
        class="px-1 py-1 py-md-1 mx-auto"
      >
        <div class="mb-1">
          <form @submit.prevent="voteProposal">
            <v-row class="mx-0">
              <v-col class="pr-0" cols="12">
                <mew-input
                  v-model="address"
                  :value="address"
                  :disabled="true"
                  :has-clear-btn="true"
                  :label="$t('rootstockCollective.proposal.wallet')"
                  :placeholder="$t('rootstockCollective.proposal.wallet')"
                  class="mr-3 flex-grow-1"
                />
              </v-col>

              <v-col class="pr-0" cols="12">
                <mew-input
                  :value="myVotingPower"
                  disabled="true"
                  :has-clear-btn="true"
                  :label="$t('rootstockCollective.proposal.votingPower')"
                  :placeholder="$t('rootstockCollective.proposal.votingPower')"
                  class="mr-3 flex-grow-1"
                />
              </v-col>

              <v-col class="pr-0" cols="12">
                <mew-select
                  v-model="provider"
                  :has-filter="false"
                  :label="$t('rootstockCollective.proposal.voteType')"
                  :items="providers"
                  normal-dropdown
                  class="mr-3 flex-grow-1 mb-4"
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
                    :disabled="txLoading"
                    :loading="txLoading"
                    :has-full-width="false"
                    :title="$t('rootstockCollective.proposal.voteProposal')"
                    @click.native="voteProposal"
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
import { BigNumber } from 'ethers';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';

export default {
  name: 'VoteModal',
  props: {
    openVoteModal: {
      default: false,
      type: Boolean
    },
    myVotingPower: {
      default: '',
      type: String
    },
    resetVoteModal: {
      type: Function,
      default: () => {}
    },
    govContract: {
      default: () => {},
      type: Object
    },
    proposalId: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      msg: '',
      errorMsg: '',
      txLoading: false,
      modalTitle: 'Vote Proposal',
      provider: '',
      providers: [{ name: 'Against' }, { name: 'For' }, { name: 'Abstain' }]
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
    this.msg = '';
  },
  methods: {
    modalClose() {
      this.resetVoteModal();
    },
    async voteProposal() {
      try {
        this.txLoading = true;
        this.errorMsg = '';

        const hasVoted = await this.govContract.hasVoted(
          this.proposalId,
          this.address
        );

        if (!hasVoted) {
          // can vote proposal
          const VOTES_MAP = {
            against: 0,
            for: 1,
            abstain: 2
          };

          const vote = VOTES_MAP[this.provider.name.toLowerCase()];
          const pid = BigNumber.from(this.proposalId).toBigInt();
          const tx = await this.govContract.castVote(pid, vote);

          await tx.wait();

          this.txLoading = false;
          this.$emit('onVoteDone', tx, vote);
        } else {
          this.txLoading = false;
          this.errorMsg = 'You already voted for this proposal!';
        }
      } catch (e) {
        this.txLoading = false;
        this.errorMsg = 'Staking RIF Tx failed!';
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
