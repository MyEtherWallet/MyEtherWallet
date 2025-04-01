<template>
  <div>
    <create-modal
      :open-create-modal="openCreateModal"
      :gov-contract="govContract"
      :st-rif-contract="stRifContract"
      :reset-create-modal="resetCreateModal"
      @onCreateDone="onCreateDone"
    ></create-modal>

    <vote-modal
      :my-voting-power="myVotingPower"
      :open-vote-modal="openVoteModal"
      :gov-contract="govContract"
      :st-rif-contract="stRifContract"
      :reset-vote-modal="resetVoteModal"
      :proposal-id="selectedProposal ? selectedProposal.proposalId : ''"
      @onVoteDone="onVoteDone"
    ></vote-modal>

    <div v-if="selectedProposal">
      <div color="bgWalletBlock" class="py-0 px-0 px-md-0">
        <!--
      =====================================================================================
        Dialog Header
        =====================================================================================
      -->
        <v-card-title class="justify-center py-5 py-md-8">
          <div class="mew-heading-2 text-center pr-6 pr-md-0">
            {{ selectedProposal.titleFull }}
          </div>
          <v-btn
            icon
            :class="
              $vuetify.breakpoint.mdAndUp
                ? 'header-close-icon'
                : 'header-close-icon-mobile'
            "
          >
            <v-icon
              size="x-large"
              color="grey cursor--pointer"
              @click="handleClickX"
            >
              mdi-close
            </v-icon>
          </v-btn>
        </v-card-title>
        <!--
      =====================================================================================
        Dialog Body: Scrollable
      =====================================================================================
      -->
        <v-card-text class="py-3 px-5 px-md-0">
          <slot name="dialogBody">
            <div>
              Proposed by:
              <b class="proposal-heading-value">
                {{ selectedProposal.proposer }}
              </b>
              &nbsp; Created at:
              <b class="proposal-heading-value">
                {{ selectedProposal.timestamp }}
              </b>
              <span v-if="Number(selectedProposal.blocksUntilClosure) > 0">
                &nbsp; Blocks until closure:
                <b class="proposal-heading-value">
                  {{ selectedProposal.blocksUntilClosure }}
                </b>
              </span>
            </div>
          </slot>
        </v-card-text>
        <v-card-text class="py-3 px-5 px-md-0">
          <slot name="dialogBody">
            <div>
              <span class="proposal-headings">Status: </span>
              <b class="proposal-headings proposal-heading-value">{{
                selectedProposal.status
              }}</b
              >,
              <span class="proposal-headings">Snapshot (Taken at block): </span>
              <b class="proposal-headings proposal-heading-value">{{
                selectedProposal.proposalSnapshot
              }}</b>
            </div>
          </slot>
        </v-card-text>
        <v-card-text class="py-3 px-5 px-md-0">
          <slot name="dialogBody">
            <v-row class="pa-0">
              <v-col cols="6" sm="6" class="text-left">
                <b class="proposal-headings mb-2">Description</b>
                <div class="mt-2">{{ selectedProposal.description }}</div>
              </v-col>
              <v-col cols="6" sm="6" class="vote-btn-right">
                <mew-alert
                  v-if="selectedProposal.hasVoted"
                  hide-close-icon
                  class="font-weight-light d-flex justify-space-between align-center mb-4 mt-2"
                >
                  You have successfully cast vote on this proposal ✅
                </mew-alert>
                <mew-button
                  v-if="
                    selectedProposal.status == 'Active' &&
                    !selectedProposal.hasVoted
                  "
                  color-theme="#ff9900"
                  btn-style="outline"
                  btn-size="xlarge"
                  title="Vote on chain"
                  :has-full-width="$vuetify.breakpoint.xs"
                  @click.native="onVoteOpenClick"
                />
                <mew-button
                  v-if="
                    false &&
                    selectedProposal.status == 'Succeeded' &&
                    selectedProposal.proposalNeedsQueuing
                  "
                  color-theme="#ff9900"
                  btn-style="outline"
                  btn-size="xlarge"
                  title="Put on Queue"
                  :has-full-width="$vuetify.breakpoint.xs"
                  @click.native="onProposalNeedsQueuing"
                />
                <mew-button
                  v-if="
                    false &&
                    selectedProposal.status == 'Queued' &&
                    selectedProposal.canProposalBeExecuted
                  "
                  color-theme="#ff9900"
                  btn-style="outline"
                  btn-size="xlarge"
                  title="Execute"
                  :has-full-width="$vuetify.breakpoint.xs"
                  @click.native="onProposalExecute"
                />
                <div
                  v-if="
                    false &&
                    selectedProposal.status == 'Queued' &&
                    !selectedProposal.canProposalBeExecuted
                  "
                >
                  The proposal is not ready to be executed yet. It should be
                  ready on:
                  {{ selectedProposal.proposalEtaHumanDate }}
                </div>
                <br />
                <h3 class="mb-2 proposal-headings">Votes</h3>
                <div class="text-success mt-4 mb-1 vote-box">
                  <b>Votes For: </b
                  ><span>{{ parseInt(selectedProposal.votesVector[1]) }}</span>
                </div>
                <div class="mb-1 vote-box">
                  <b class="text-danger">Against: </b>
                  <span>{{ parseInt(selectedProposal.votesVector[0]) }}</span>
                </div>
                <div class="mb-1 vote-box">
                  <b class="text-info">Abstain: </b>
                  <span>{{ parseInt(selectedProposal.votesVector[2]) }}</span>
                </div>
                <br />

                <h3
                  v-if="
                    selectedProposal.calldatasParsed &&
                    (selectedProposal.calldatasParsed.amount ||
                      selectedProposal.calldatasParsed.to ||
                      selectedProposal.calldatasParsed.foundFunction)
                  "
                  class="mt-2 mb-2 proposal-headings"
                >
                  Actions
                </h3>
                <br />
                <div
                  v-if="
                    selectedProposal.calldatasParsed &&
                    (selectedProposal.calldatasParsed.amount ||
                      selectedProposal.calldatasParsed.to ||
                      selectedProposal.calldatasParsed.foundFunction)
                  "
                  class="actions-box"
                >
                  <div
                    v-if="selectedProposal.calldatasParsed.amount"
                    class="text-info"
                  >
                    <b>Amount: </b>
                    <span
                      >{{ selectedProposal.calldatasParsed.amount }}
                      {{ selectedProposal.calldatasParsed.symbol }}</span
                    >
                  </div>
                  <br />
                  <div
                    v-if="selectedProposal.calldatasParsed.to"
                    class="text-info"
                  >
                    <b>To:</b>
                    <span>{{ selectedProposal.calldatasParsed.to }}</span>
                  </div>
                  <br />
                  <div
                    v-if="selectedProposal.calldatasParsed.foundFunction"
                    class="text-info"
                  >
                    <b>Function: </b>
                    <span>{{
                      selectedProposal.calldatasParsed.foundFunction
                    }}</span>
                  </div>
                </div>
                <br />
                <div v-if="tx" class="text-info text-wrap theme-color">
                  <a :href="tx" target="_blank" class="theme-color">
                    {{ msg }} {{ tx }}
                  </a>
                </div>
              </v-col>
            </v-row>
          </slot>
        </v-card-text>
        <!--
      =====================================================================================
        Dialog Body: Anchored
      =====================================================================================

      =====================================================================================
        Dialog action
      =====================================================================================
      -->
        <v-card-actions class="py-5 py-md-8">
          <v-row class="pa-0" justify="space-around" dense>
            <v-col cols="12" sm="12" class="text-right">
              <mew-button
                btn-style="outline"
                btn-size="xlarge"
                color-theme="#ff9900"
                title="Back to List Proposals"
                :has-full-width="$vuetify.breakpoint.xs"
                @click.native="handleClickX"
              />
            </v-col>
          </v-row>
        </v-card-actions>
      </div>
    </div>
    <div v-if="!selectedProposal">
      <div class="create-btn-right mt-2">
        <h3>
          My Voting Power:
          <span v-if="myVotingPower"> {{ parseInt(myVotingPower) }} </span>
        </h3>
        <mew-button
          class="d-none"
          title="Create Proposal"
          @click.native="onCreateClick"
        ></mew-button>
      </div>
      <div v-if="tx || msg" class="text-center text-primary mt-2 mb-2">
        <div class="text-primary">{{ msg }}</div>
        <a :href="tx" target="_blank">Transaction Hash: {{ tx }}</a>
        <mew-button title="Refresh Proposals" @click.native="init"></mew-button>
      </div>
      <table
        v-if="proposals.length"
        class="dao-table mt-2"
        aria-label="Proposal Information"
      >
        <thead class="table-header">
          <tr>
            <th scope="col">Proposal</th>
            <th scope="col">Quorum Votes</th>
            <th scope="col">Date</th>
            <th scope="col">Time Remaining</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody v-if="!isLoading">
          <tr v-for="proposal in tableDataPaginated" :key="proposal.proposalId">
            <td
              class="proposal-title"
              scope="col"
              @click="onSelectProposal(proposal)"
            >
              {{ proposal.title }}
            </td>
            <td scope="col">
              <div :class="proposal.colorClass">
                {{ proposal.totalVotes }} ({{ proposal.percentage }}%)
              </div>
              <div>Quorum: {{ proposal.quorum }}</div>
            </td>
            <td scope="col">
              {{ proposal.timestamp }}
            </td>
            <td scope="col">{{ proposal.timeRemaining }}</td>
            <td
              scope="col"
              class="cursor-pointer"
              @click="onSelectProposal(proposal)"
            >
              <div :class="proposal.statusClass">{{ proposal.status }}</div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- ==================================================================== -->
      <!-- Pagination for both desktop and mobile -->
      <!-- ==================================================================== -->
      <div class="proposals-pagination">
        <v-pagination
          v-if="pageLength"
          v-model="page"
          active-color="#e56b1a"
          class="mt-6"
          :length="pageLength"
        ></v-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { ethers, BigNumber } from 'ethers';
import {
  fetchProposals,
  convertToTimeRemaining,
  ProposalState,
  ProposalStateClass,
  decodeFunctionData
} from '../../handlers/helpers/proposals';
import { govABI } from '../../handlers/helpers/abi/govAbi';
import { stRifABI } from '../../handlers/helpers/abi/stRifAbi';
import { supportedAbis } from '../../handlers/helpers/abi/supportedAbi';
import {
  getContractAddress,
  ContractType
} from '../../handlers/helpers/contracts';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';

export default {
  name: 'ListProposal',
  components: {
    CreateModal: () => import('./CreateModal'),
    VoteModal: () => import('./VoteModal')
  },
  data() {
    return {
      page: 1,
      itemsPerPage: 10,
      msg: '',
      tx: '',
      openCreateModal: false,
      openVoteModal: false,
      govContract: null,
      stRifContract: null,
      proposals: [],
      selectedProposal: null,
      myVotingPower: null,
      isLoading: false
    };
  },
  computed: {
    ...mapState('wallet', ['balance', 'address', 'web3', 'instance']),
    ...mapGetters('global', ['network']),
    pageLength() {
      return Math.ceil(this.proposals.length / this.itemsPerPage);
    },
    tableDataPaginated() {
      return this.paginate(this.proposals, this.itemsPerPage, this.page);
    }
  },
  mounted() {
    this.msg = '';
    this.init();
  },
  methods: {
    paginate(array, pageSize, pageNumber) {
      this.stylePagination();
      return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
    },
    async onProposalExecute() {
      try {
        const tx = await this.govContract['execute(uint256)'](
          this.selectedProposal.proposalId
        );
        await tx.wait();
        const explorer = this.network.type.blockExplorerTX;
        this.tx = explorer.replace('[[txHash]]', tx.hash);
        this.msg =
          'PROPOSAL execution IN PROCESS: You successfully executed proposal in the Collective.';

        this.init();
      } catch (e) {
        Toast(e, {}, ERROR);
      }
    },
    async onProposalNeedsQueuing() {
      try {
        const tx = await this.govContract['queue(uint256)'](
          this.selectedProposal.proposalId
        );
        await tx.wait();
        const explorer = this.network.type.blockExplorerTX;
        this.tx = explorer.replace('[[txHash]]', tx.hash);
        this.msg =
          'PROPOSAL queuing IN PROCESS: You successfully queued proposal in the Collective.';

        this.init();
      } catch (e) {
        Toast(e, {}, ERROR);
      }
    },
    onVoteOpenClick() {
      this.openVoteModal = true;
    },
    handleClickX() {
      this.selectedProposal = null;
      this.msg = '';
      this.tx = '';
    },
    onSelectProposal(proposal) {
      this.selectedProposal = proposal;
    },
    onCreateDone(tx) {
      this.openCreateModal = false;
      const explorer = this.network.type.blockExplorerTX;
      this.tx = explorer.replace('[[txHash]]', tx.hash);
      this.msg =
        'CREATE PROPOSAL IN PROCESS: You successfully created proposal in the Collective.';

      this.init();
    },
    onVoteDone(tx, vote) {
      this.selectedProposal.hasVoted = true;
      this.selectedProposal.votesVector[vote] =
        Number(this.myVotingPower) +
        Number(this.selectedProposal.votesVector[vote]);
      this.openVoteModal = false;
      const explorer = this.network.type.blockExplorerTX;
      this.tx = explorer.replace('[[txHash]]', tx.hash);

      this.msg = 'Successfully voted on this proposal.';

      this.init();
    },
    resetCreateModal() {
      this.openCreateModal = false;
    },
    resetVoteModal() {
      this.openVoteModal = false;
    },
    onCreateClick() {
      // Proposal creation is disabled from MEW dApp
      this.openCreateModal = false; // Keep it false
    },
    stylePagination() {
      setTimeout(() => {
        const pages = document.querySelectorAll('.v-pagination__item');
        pages.forEach(page => {
          page.style.background = 'white';
        });

        const ele = document.querySelector('.v-pagination__item--active');
        if (ele) {
          // v pagination remove default styles
          ele.classList.remove('primary');
          ele.style.background = '#ff9900';
        }
      }, 0);
    },
    async init() {
      this.isLoading = true;
      const proposalCache = localStorage.getItem(
        `rc_proposals_${this.network.type.chainID}`
      );

      if (proposalCache) {
        try {
          const proposalsJson = JSON.parse(proposalCache);
          this.proposals = proposalsJson;
          this.isLoading = false;
        } catch (_) {
          localStorage.removeItem(`rc_proposals_${this.network.type.chainID}`);
        }
      }

      const strifAddress = getContractAddress(
        ContractType.STRIF,
        this.network.type.chainID
      );
      const DEFAULT_NUMBER_OF_SECONDS_PER_BLOCK = 30;
      const ethersProvider = new ethers.providers.Web3Provider(
        this.web3.currentProvider
      );
      const ethersSigner = ethersProvider.getSigner();
      const latestBlock = await ethersProvider.getBlockNumber();
      const govAddress = getContractAddress(
        ContractType.GOV,
        this.network.type.chainID
      );
      this.stRifContract = new ethers.Contract(
        strifAddress,
        stRifABI,
        ethersSigner
      );
      const vPower = await this.stRifContract.getVotes(
        this.address.toLowerCase()
      );
      this.myVotingPower = ethers.utils.formatUnits(vPower, 18);

      this.govContract = new ethers.Contract(govAddress, govABI, ethersSigner);

      const interfaceDAO = new ethers.utils.Interface(govABI);
      const encodedProposals = await fetchProposals(
        this.network.type.chainID,
        govAddress
      );
      let proposalsList = [];

      this.stylePagination();
      proposalsList = await Promise.all(
        encodedProposals.map(async encodedProposal => {
          try {
            // Decode event data
            const decoded = interfaceDAO.decodeEventLog(
              'ProposalCreated',
              encodedProposal.data,
              encodedProposal.topics.filter(a => a)
            );
            const proposalDeadline = await this.govContract.proposalDeadline(
              decoded.proposalId.toString()
            );

            const [tx] = decoded.calldatas;
            const functions = [
              'withdraw',
              'withdrawERC20',
              'whitelistBuilder',
              'dewhitelistBuilder',
              'removeWhitelistedBuilder',
              'communityApproveBuilder'
            ];

            let foundFunction = '';
            const [rbtcDecoded, rifDecoded] = functions.map(name => {
              try {
                const decodedResponse = supportedAbis
                  .map(abi => {
                    try {
                      return decodeFunctionData(abi, name, tx);
                    } catch (e) {
                      return null;
                    }
                  })
                  .filter(a => a);

                if (decodedResponse.length > 0) {
                  foundFunction = name;
                  return decodedResponse[0];
                }
                return null;
              } catch (_) {
                return null;
              }
            });

            const calldatasParsed = rbtcDecoded || rifDecoded;
            const callDataDisplay = { foundFunction };

            if (calldatasParsed && calldatasParsed.amount) {
              callDataDisplay.amount = ethers.utils.formatUnits(
                calldatasParsed.amount,
                18
              );
              callDataDisplay.symbol = calldatasParsed?.token ? 'RIF' : 'RBTC';
            }

            if (calldatasParsed && calldatasParsed.to) {
              callDataDisplay.to = calldatasParsed.to;
            }

            let blocksUntilClosure = proposalDeadline
              ? Number(proposalDeadline.toString()) - latestBlock
              : 0;

            if (blocksUntilClosure < 0) {
              blocksUntilClosure = 0;
            }
            const votes = await this.govContract.proposalVotes(
              decoded.proposalId.toString()
            );

            const state = await this.govContract.state(
              decoded.proposalId.toString()
            );

            const proposalNeedsQueuing =
              await this.govContract.proposalNeedsQueuing(
                decoded.proposalId.toString()
              );

            const proposalEta = await this.govContract.proposalEta(
              decoded.proposalId.toString()
            );

            const hasVoted = await this.govContract.hasVoted(
              decoded.proposalId.toString(),
              this.address
            );

            const currentTime = Math.floor(Date.now() / 1000);

            const canProposalBeExecuted =
              proposalEta && currentTime >= Number(proposalEta.toString());

            let proposalEtaHumanDate = '';
            if (proposalEta) {
              const proposalEtaMs = Number(proposalEta) * 1000;
              const proposalDate = new Date(proposalEtaMs);
              proposalEtaHumanDate = proposalDate.toLocaleString();
            }

            const proposalSnapshot = await this.govContract.proposalSnapshot(
              decoded.proposalId.toString()
            );
            const quorum = await this.govContract.quorum(
              BigNumber.from(proposalSnapshot.toString()).toBigInt() // block number
            );

            // 0 = against, 1 = forVotes, 2 = abstain
            const votesVector = [
              ethers.utils.formatUnits(votes.againstVotes.toString(), 18),
              ethers.utils.formatUnits(votes.forVotes.toString(), 18),
              ethers.utils.formatUnits(votes.abstainVotes.toString(), 18)
            ];

            const totalVotes = votesVector.reduce(
              (prev, next) => Number(next) + prev,
              0
            );

            let percentage = 0;

            if (
              quorum &&
              Number(ethers.utils.formatUnits(quorum.toString(), 18)) > 0
            ) {
              // Calculate percentage of votes relative to quorum
              percentage =
                (totalVotes /
                  Number(ethers.utils.formatUnits(quorum.toString(), 18))) *
                100;
            }

            let colorClass = 'text-st-error'; // Default to RED (0-49%)
            if (percentage >= 100) {
              colorClass = 'text-st-success';
            } else if (percentage >= 50) {
              colorClass = 'text-st-info';
            }
            const [title, description] = decoded.description.split(';');

            return {
              blocksUntilClosure: blocksUntilClosure,
              proposer: decoded.proposer,
              titleFull: title,
              title: title.length > 20 ? `${title.slice(0, 20)}...` : title,
              description: description,
              proposalId: decoded.proposalId.toString(),
              totalVotes: totalVotes.toFixed(2),
              votesVector: votesVector,
              proposalSnapshot: proposalSnapshot.toString(),
              quorum: Math.floor(
                Number(ethers.utils.formatUnits(quorum.toString(), 18))
              ),
              percentage: percentage.toFixed(2),
              colorClass: colorClass,
              proposalDeadline: proposalDeadline,
              status: ProposalState[state],
              proposalNeedsQueuing: proposalNeedsQueuing,
              canProposalBeExecuted: canProposalBeExecuted,
              proposalEtaHumanDate: proposalEtaHumanDate,
              calldatasParsed: callDataDisplay,
              hasVoted: hasVoted,
              statusClass: ProposalStateClass[state],
              timeRemaining: blocksUntilClosure
                ? convertToTimeRemaining(
                    Number(blocksUntilClosure) *
                      DEFAULT_NUMBER_OF_SECONDS_PER_BLOCK
                  )
                : '-',
              timestampMilli: parseInt(encodedProposal.timeStamp, 16) * 1000,
              timestamp: new Date(
                parseInt(encodedProposal.timeStamp, 16) * 1000
              )
                .toLocaleString()
                .slice(0, 10)
            };
          } catch (e) {
            return null;
          }
        })
      );
      // Remove duplicates
      proposalsList = proposalsList
        .filter(p => p)
        .filter(
          (proposal, index, self) =>
            self.findIndex(p => p.proposalId === proposal.proposalId) === index
        )
        .sort((a, b) => b.timestampMilli - a.timestampMilli);
      // cache proposals
      localStorage.setItem(
        `rc_proposals_${this.network.type.chainID}`,
        JSON.stringify(proposalsList)
      );

      this.proposals = proposalsList;
      this.isLoading = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.proposal-headings {
  font-size: 24px;
}

.text-success {
  color: #22ad5c;
}

.text-danger {
  color: red;
}

.theme-color {
  color: #ff9900;
}
.vote-box {
  border: 1px solid orange;
  border-radius: 7px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
}

.actions-box {
  border: 1px solid orange;
  border-radius: 7px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  overflow-wrap: anywhere;
}

.proposal-heading-value {
  color: #e56b1a;
}

.proposals-pagination {
  .v-pagination__item--active {
    box-shadow: none !important;
    background-color: #ff9900 !important;
  }
  .v-pagination__navigation {
    box-shadow: none !important;
  }
  .v-pagination__item {
    box-shadow: none !important;
    background-color: #ff9900 !important;
  }
}

.create-btn-right {
  display: flex;
  justify-content: space-between;
}

.d-none {
  display: none;
}
.text-wrap {
  word-wrap: break-word;
}
.proposal-title {
  text-decoration: underline;
  cursor: pointer;
}
.bg-st-pending {
  width: 100px;
  text-align: center;
  color: white;
  background: #ff9900;
  border-radius: 4px;
  padding: 5px;
}
.bg-st-active {
  width: 100px;
  text-align: center;
  color: white;
  background: #ff9900;
  border-radius: 4px;
  padding: 5px;
}
.bg-st-canceled {
  width: 100px;
  text-align: center;
  color: white;
  background: gray;
  border-radius: 4px;
  padding: 5px;
}
.bg-st-succeeded {
  width: 100px;
  text-align: center;
  color: white;
  background: #21ac5c;
  border-radius: 4px;
  padding: 5px;
}
.bg-st-defeated {
  width: 100px;
  text-align: center;
  color: white;
  background: #f24822;
  border-radius: 4px;
  padding: 5px;
}
.bg-st-executed {
  width: 100px;
  text-align: center;
  color: white;
  background: #21ac5c;
  border-radius: 4px;
  padding: 5px;
}
.bg-st-queued {
  width: 100px;
  text-align: center;
  color: white;
  background: #665df5;
  border-radius: 4px;
  padding: 5px;
}
.bg-st-expired {
  width: 100px;
  text-align: center;
  color: white;
  background: #f24822;
  border-radius: 4px;
  padding: 5px;
}
.bg-st-error {
  width: 100px;
  text-align: center;
  color: white;
  background: red;
  border-radius: 4px;
  padding: 5px;
}
.text-st-error {
  color: red;
}
.text-st-success {
  color: green;
}
.text-st-info {
  color: #17a2b8;
}
.cursor-pointer {
  cursor: pointer;
}
.api-error {
  color: #ff445b;
  font-size: 12px;
}
.dao-table {
  width: 100%;
  text-align: left;
}
.vote-btn-right {
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  align-self: flex-start;
}
</style>
