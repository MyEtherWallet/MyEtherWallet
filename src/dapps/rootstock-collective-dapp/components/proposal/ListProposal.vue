<template>
  <div>
    <div
      v-if="!selectedProposal"
      key="proposals-title"
      class="d-flex align-center justify-space-between"
    >
      <div>
        <h2 class="mew-heading-3 textPrimaryModule--text text-uppercase ml-5">
          Latest Proposals
        </h2>
        <p
          v-if="!isLoading"
          class="titlePrimary--text d-flex align-center mew-heading-2 ml-5"
        >
          My Voting Power:
          <span v-if="myVotingPower" class="pl-1">
            {{ parseInt(myVotingPower) }}
          </span>
        </p>
      </div>
    </div>
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
    <v-slide-y-transition group hide-on-leave>
      <div v-if="selectedProposal" key="proposal-details">
        <mew-button
          title="Back to Proposals"
          btn-size="small"
          btn-style="light"
          color-theme="secondary"
          @click.native="handleClickX"
        ></mew-button>
        <v-slide-x-transition group leave-absolute>
          <mew-alert
            v-if="selectedProposal.hasVoted"
            key="alert-vote"
            class="my-4"
            has-white-background
          >
            You have successfully cast a vote on this proposal ✅
          </mew-alert>
          <mew-alert
            v-if="
              selectedProposal.status == 'Queued' &&
              !selectedProposal.canProposalBeExecuted
            "
            key="alert-not-ready"
            class="my-4"
            has-white-background
          >
            The proposal is not ready to be executed yet. It should be ready on:
            {{ selectedProposal.proposalEtaHumanDate }}
          </mew-alert>
          <!--
          </div> -->
          <div key="proposal-info" color="bgWalletBlock" class="mt-10">
            <!-- ===============
              Title
            ==================-->
            <div
              class="mew-heading-1 text-center mew-heading-1 pb-5 break-word"
            >
              {{ selectedProposal.titleFull }}
            </div>
            <!-- ===============
              Overview
            ==================-->
            <div class="py-3">
              <v-row class="justify-space-between">
                <v-col cols="12" md="auto">
                  <p
                    class="overline textPrimaryModule--text font-weight-medium"
                  >
                    status
                  </p>
                  <div :class="selectedProposal.statusClass">
                    {{ selectedProposal.status }}
                  </div>
                </v-col>
                <v-col cols="12" md="auto">
                  <p
                    class="overline textPrimaryModule--text font-weight-medium"
                  >
                    Snapshot (Taken at block)
                  </p>
                  <p class="mew-heading-4 font-weight-medium">
                    {{ selectedProposal.proposalSnapshot }}
                  </p>
                </v-col>
                <v-col cols="12" md="auto">
                  <p
                    class="overline textPrimaryModule--text font-weight-medium"
                  >
                    Created at
                  </p>
                  <p class="mew-heading-4 font-weight-medium">
                    {{ selectedProposal.timestamp }}
                    <span
                      v-if="Number(selectedProposal.blocksUntilClosure) > 0"
                    >
                      , Blocks until closure:
                      {{ selectedProposal.blocksUntilClosure }}
                    </span>
                  </p></v-col
                >
                <v-col cols="12">
                  <p
                    class="overline textPrimaryModule--text font-weight-medium"
                  >
                    Proposed by
                  </p>
                  <div class="d-flex align-center">
                    <mew-blockie
                      :address="selectedProposal.proposer"
                      width="36px"
                      height="36px"
                    />
                    <div
                      class="pl-2 mew-heading-4 break-word font-weight-medium"
                    >
                      {{ selectedProposal.proposer }}
                    </div>
                  </div>
                </v-col>
              </v-row>
            </div>
            <div class="py-5">
              <v-row>
                <!-- ===============
                  Description
                ==================-->
                <v-col cols="12" md="6" class="text-left">
                  <b class="proposal-headings mb-2">Description</b>
                  <div class="mt-2 break-word">
                    {{ selectedProposal.description }}
                  </div>
                </v-col>
                <!-- ===============
                  Votes
                ==================-->
                <v-col cols="12" md="6">
                  <!-- Votes Table -->
                  <h3 class="mb-2 proposal-headings">Votes</h3>
                  <div
                    class="mt-4 mb-2 pa-3 d-flex justify-space-between mew-sheet"
                  >
                    <div class="greenPrimary--text font-weight-medium">
                      Votes For:
                    </div>
                    <div>{{ parseInt(selectedProposal.votesVector[1]) }}</div>
                  </div>
                  <div class="mb-2 pa-3 d-flex justify-space-between mew-sheet">
                    <div class="redPrimary--text font-weight-medium">
                      Against:
                    </div>
                    <div>{{ parseInt(selectedProposal.votesVector[0]) }}</div>
                  </div>
                  <div class="mb-2 pa-3 d-flex justify-space-between mew-sheet">
                    <div class="font-weight-medium">Abstain:</div>
                    <div>{{ parseInt(selectedProposal.votesVector[2]) }}</div>
                  </div>
                  <br />
                  <!-- Actions -->
                  <mew-button
                    v-if="
                      selectedProposal.status == 'Active' &&
                      !selectedProposal.hasVoted
                    "
                    title="Vote on chain"
                    :has-full-width="$vuetify.breakpoint.xs"
                    class="mb-4"
                    @click.native="onVoteOpenClick"
                  />
                  <mew-button
                    v-if="
                      false &&
                      selectedProposal.status == 'Succeeded' &&
                      selectedProposal.proposalNeedsQueuing
                    "
                    title="Put on Queue"
                    :has-full-width="$vuetify.breakpoint.xs"
                    class="mb-4"
                    @click.native="onProposalNeedsQueuing"
                  />
                  <mew-button
                    v-if="
                      false &&
                      selectedProposal.status == 'Queued' &&
                      selectedProposal.canProposalBeExecuted
                    "
                    title="Execute"
                    :has-full-width="$vuetify.breakpoint.xs"
                    class="mb-4"
                    @click.native="onProposalExecute"
                  />
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
                    class="mew-sheet pa-3"
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
            </div>
          </div>
        </v-slide-x-transition>
      </div>
      <!-- ================================
       Proposals Table
      =================================-->
      <div v-else key="proposals-table-info">
        <v-slide-y-transition hide-on-leave group>
          <mew-alert
            v-if="tx || msg"
            key="alert-tx"
            class="my-5"
            :title="`Transaction Hash: ${tx}`"
            :description="msg"
            theme="info"
            has-white-background
          />
          <table
            v-if="!isLoading && proposals.length"
            key="proposals-table"
            class="proposals-table mt-4 mew-sheet"
            aria-label="Proposal Information"
          >
            <thead class="table-header">
              <tr>
                <th
                  class="px-4 overline textPrimaryModule--text font-weight-medium"
                >
                  Proposal
                </th>
                <th
                  v-if="$vuetify.breakpoint.mdAndUp"
                  scope="col"
                  class="px-4 overline textPrimaryModule--text font-weight-medium"
                >
                  Quorum Votes
                </th>
                <th
                  v-if="$vuetify.breakpoint.mdAndUp"
                  scope="col"
                  class="px-4 overline textPrimaryModule--text font-weight-medium"
                >
                  Time Remaining
                </th>
                <th
                  scope="col"
                  class="px-4 overline textPrimaryModule--text font-weight-medium"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="proposal in tableDataPaginated"
                :key="proposal.proposalId"
                class="table-row"
                @click="onSelectProposal(proposal)"
              >
                <td>
                  <p class="mew-heading-4 font-weight-medium">
                    {{ proposal.title }}
                  </p>
                  <p
                    v-if="$vuetify.breakpoint.mdAndUp"
                    class="textSecondary--text mew-label"
                  >
                    {{ proposal.timestamp }}
                  </p>
                  <p v-else class="textSecondary--text mew-label">
                    {{ proposal.timeRemaining }}
                  </p>
                </td>
                <td v-if="$vuetify.breakpoint.mdAndUp">
                  <div :class="proposal.colorClass">
                    {{ proposal.totalVotes }} ({{ proposal.percentage }}%)
                  </div>
                  <div>Quorum: {{ proposal.quorum }}</div>
                </td>
                <td v-if="$vuetify.breakpoint.mdAndUp">
                  {{ proposal.timeRemaining }}
                </td>
                <td class="cursor-pointer" @click="onSelectProposal(proposal)">
                  <div :class="proposal.statusClass">{{ proposal.status }}</div>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- ==================================================================== -->
          <!-- Pagination for both desktop and mobile -->
          <!-- ==================================================================== -->
          <div
            v-if="!isLoading && pageLength"
            key="proposals-pagination"
            class="proposals-pagination"
          >
            <v-pagination
              v-model="page"
              active-color="#e56b1a"
              class="mt-6"
              :length="pageLength"
            ></v-pagination>
          </div>
          <v-skeleton-loader
            v-else
            key="skeleton-loader"
            class="mx-auto mt-10"
            type="table"
          />
        </v-slide-y-transition>
      </div>
    </v-slide-y-transition>
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

            let colorClass = 'redPrimary--text'; // Default to RED (0-49%)
            if (percentage >= 100) {
              colorClass = 'greenPrimary--text';
            } else if (percentage >= 50) {
              colorClass = 'bluePrimary--text';
            }
            const [title, description] = decoded.description.split(';');

            return {
              blocksUntilClosure: blocksUntilClosure,
              proposer: decoded.proposer,
              titleFull: title,
              title: title.length > 30 ? `${title.slice(0, 30)}...` : title,
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
  background: var(--v-orangePrimary-base);
  border-radius: 16px;
  padding: 5px;
}
.bg-st-active {
  width: 100px;
  text-align: center;
  color: white;
  background: var(--v-bluePrimary-base);
  border-radius: 16px;
  padding: 5px;
}
.bg-st-canceled {
  width: 100px;
  text-align: center;
  color: white;
  background: var(--v-greyPrimary-base);
  border-radius: 16px;
  padding: 5px;
}
.bg-st-succeeded {
  width: 100px;
  text-align: center;
  color: white;
  background: var(--v-greenPrimary-base);
  border-radius: 16px;
  padding: 5px;
}
.bg-st-defeated {
  width: 100px;
  text-align: center;
  color: white;
  background: var(--v-redPrimary-base);
  border-radius: 16px;
  padding: 5px;
}
.bg-st-executed {
  width: 100px;
  text-align: center;
  color: white;
  background: var(--v-greenPrimary-base);
  border-radius: 16px;
  padding: 5px;
}
.bg-st-queued {
  width: 100px;
  text-align: center;
  color: white;
  background: rgba(104, 76, 255, 1);
  border-radius: 16px;
  padding: 5px;
}
.bg-st-expired {
  width: 100px;
  text-align: center;
  color: white;
  background: var(--v-greyPrimary-base);
  border-radius: 16px;
  padding: 5px;
}
.bg-st-error {
  width: 100px;
  text-align: center;
  color: white;
  background: var(--v-redPrimary-base);
  border-radius: 16px;
  padding: 5px;
}

.cursor-pointer {
  cursor: pointer;
}
.api-error {
  color: #ff445b;
  font-size: 12px;
}
.proposals-table {
  width: 100%;
  text-align: left;
  .table-header {
    text-align: left;
    height: 58px;
    th {
      border-bottom: 1px solid var(--v-greyMedium-base);
    }
  }

  td {
    padding: 16px;
  }
  .table-row {
    background-color: transparent;
    transition: background-color 0.3s;
    &:hover {
      background-color: var(--v-greyLight-base);
      cursor: pointer;
    }
  }

  .center-align {
    padding: 1rem;
    display: flex;
    vertical-align: middle;
    align-items: center;
  }
}
.vote-btn-right {
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  align-self: flex-start;
}

p {
  margin: 0;
}
</style>
