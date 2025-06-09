<template>
  <div>
    <staking-modal
      v-if="!isLoading && stRifContract"
      :open-staking-modal="openStakingModal"
      :rif-contract="rifContract"
      :st-rif-contract="stRifContract"
      :reset-stake-modal="resetStakeModal"
      :rif-balance="rifBalance"
      @onStakeDone="onStakeDone"
    ></staking-modal>
    <div
      v-if="!isManage"
      key="my-rewards-title"
      class="d-flex align-center justify-space-between"
    >
      <div>
        <h2 class="mew-heading-3 textPrimaryModule--text text-uppercase ml-5">
          My Rewards
        </h2>
        <div v-for="(item, i) in myRewards" :key="i" class="ml-5">
          <span
            >{{ item.earned }} {{ item.name }} (= ${{
              item.earnedUsd
            }}
            USD)</span
          >
        </div>
      </div>

      <div>
        <h2 class="mew-heading-3 textPrimaryModule--text text-uppercase ml-5">
          Estimated Rewards
        </h2>
        <div v-for="(item, i) in myRewards" :key="i" class="ml-5">
          <span
            >{{ item.estimated }} {{ item.name }} (=${{
              item.estimatedUsd
            }}
            USD)</span
          >
        </div>
      </div>

      <div>
        <mew-button
          title="Claim All Rewards"
          :disabled="totalEarnedUSD === 0"
          :loading="claimLoading"
          btn-size="small"
          btn-style="light"
          color-theme="secondary"
          @click.native="onClaimRewards"
        ></mew-button>
      </div>
    </div>
    <div
      v-if="!isManage"
      key="rewards-leaderboard"
      class="d-flex align-center justify-space-between mt-5"
    >
      <div>
        <h2 class="mew-heading-3 textPrimaryModule--text text-uppercase ml-5">
          Rewards leaderboard
        </h2>
      </div>
      <mew-button
        title="Manage Allocations"
        btn-size="small"
        btn-style="light"
        color-theme="secondary"
        @click.native="onManageClick"
      ></mew-button>
    </div>
    <v-slide-y-transition group hide-on-leave>
      <div v-if="isManage" key="proposal-details">
        <mew-button
          title="Back"
          btn-size="small"
          btn-style="light"
          color-theme="secondary"
          @click.native="onBackFromManage"
        ></mew-button>
        <v-slide-x-transition group leave-absolute>
          <!--
          </div> -->
          <div key="proposal-info" color="bgWalletBlock" class="mt-10">
            <!-- ===============
              Title
            ==================-->
            <div
              class="mew-heading-1 text-center mew-heading-1 pb-5 break-word"
            >
              Confirm stRIF allocation for the selected builders
            </div>

            <div class="mew-heading-3 text-center pb-5 break-word">
              Support innovative Builders by allocating your stRIF to those you
              align with. Your allocations shape their rewards, and you retain
              full ownership and access to your stRIF while earning a portion of
              their rewards. For more information check the
              <a href="https://wiki.rootstockcollective.xyz/" target="_blank"
                >Whitepaper</a
              >.
            </div>

            <!-- ===============
              Overview
            ==================-->
            <div class="py-3">
              <v-row class="justify-space-between">
                <v-col cols="4" md="auto">
                  <p
                    class="overline textPrimaryModule--text font-weight-medium"
                  >
                    Balance
                  </p>
                  <div class="mew-heading-4 font-weight-medium">
                    {{ strifbalance }} stRIF
                  </div>
                </v-col>
                <v-col cols="4">
                  <p
                    class="overline textPrimaryModule--text font-weight-medium"
                  >
                    Allocated amount
                  </p>
                  <div class="d-flex align-center">
                    <div
                      class="pl-2 mew-heading-4 break-word font-weight-medium"
                    >
                      {{ totalOnchainAllocation }} stRIF
                    </div>
                  </div>
                </v-col>

                <v-col cols="4">
                  <p
                    class="overline textPrimaryModule--text font-weight-medium"
                  >
                    Unallocated amount
                  </p>
                  <div class="d-flex align-center">
                    <div
                      class="pl-2 mew-heading-4 break-word font-weight-medium"
                    >
                      <span v-if="totalOnchainAllocation && strifbalance">
                        {{
                          Number(strifbalance) - Number(totalOnchainAllocation)
                        }}</span
                      ><span v-else>0</span>
                      stRIF
                    </div>
                  </div>
                </v-col>
              </v-row>
            </div>
            <div class="py-5">
              <v-row>
                <v-col cols="12" md="12">
                  <div v-if="tx" class="text-info text-wrap theme-color">
                    <a :href="tx" target="_blank" class="theme-color">
                      {{ msg }} {{ tx }}
                    </a>
                  </div>
                </v-col>
                <v-col cols="12" md="12">
                  <div v-if="isManage" class="d-flex justify-space-between">
                    <div>
                      <span>
                        RIF Balance: <b> {{ rifBalance }} </b></span
                      >
                      <br />
                      <mew-button
                        title="Stake More RIF"
                        :disabled="rifBalance < 1"
                        btn-size="small"
                        btn-style="light"
                        color-theme="secondary"
                        @click.native="onStake"
                      ></mew-button>
                      &nbsp;&nbsp;
                      <mew-button
                        title="Restake RIF"
                        :disabled="isFastMode || rifBalance < 1"
                        btn-size="small"
                        btn-style="light"
                        color-theme="secondary"
                        @click.native="onRestake"
                      ></mew-button>
                    </div>

                    <mew-button
                      title="Save Allocation"
                      btn-size="small"
                      :loading="saveAllocationLoading"
                      :disabled="
                        saveAllocationLoading ||
                        isFastMode ||
                        (isManage && tableDataPaginated.length === 0)
                      "
                      btn-style="light"
                      color-theme="secondary"
                      @click.native="onSaveAllocation"
                    ></mew-button>
                  </div>

                  <mew-alert
                    v-if="isFastMode"
                    hide-close-icon
                    class="font-weight-light d-flex justify-space-between align-center mb-4 mt-2"
                  >
                    Allowing this step will stake <b> {{ rifBalance }} </b> RIF
                    and allocate to builders according to existing distribution
                    percentage on top of already allocated stRIF.
                    <br />
                    Would you like to proceed ?
                    <mew-button
                      title="Yes"
                      :disabled="restakingLoading"
                      :loading="restakingLoading"
                      btn-size="small"
                      btn-style="light"
                      color-theme="secondary"
                      @click.native="onYesRestake"
                    ></mew-button>
                    <mew-button
                      title="No"
                      :disabled="restakingLoading"
                      btn-size="small"
                      btn-style="light"
                      color-theme="secondary"
                      @click.native="onNoRestake"
                    ></mew-button>
                  </mew-alert>

                  <div v-if="fastModeMsg" class="msg-fast-mode">
                    <p>
                      {{ fastModeMsg }}
                    </p>
                  </div>

                  <div
                    v-if="isManage && tableDataPaginated.length === 0"
                    class="d-flex align-center justify-space-around"
                  >
                    Select some builders to manage allocations.
                  </div>

                  <mew-alert
                    v-if="tx || msg"
                    key="alert-tx"
                    class="my-5"
                    title="Info"
                    :description="msg"
                    theme="info"
                    has-white-background
                  />
                </v-col>
              </v-row>
            </div>
          </div>
        </v-slide-x-transition>
      </div>

      <!-- ================================
       Builders Table
      =================================-->
      <div key="builders-table-info">
        <v-slide-y-transition hide-on-leave group>
          <table
            v-if="!isLoading && builders.length"
            key="builders-table"
            class="builders-table mt-4 mew-sheet"
            aria-label="Builders Information"
          >
            <thead class="table-header">
              <tr>
                <th
                  class="px-4 overline textPrimaryModule--text font-weight-medium"
                >
                  Builder
                </th>
                <th
                  v-if="$vuetify.breakpoint.mdAndUp"
                  scope="col"
                  class="px-4 overline textPrimaryModule--text font-weight-medium"
                >
                  Backer Rewards %
                </th>
                <th
                  v-if="$vuetify.breakpoint.mdAndUp"
                  scope="col"
                  class="px-4 overline textPrimaryModule--text font-weight-medium"
                >
                  Est. Backers Rewards
                </th>
                <th
                  v-if="$vuetify.breakpoint.mdAndUp"
                  scope="col"
                  class="px-4 overline textPrimaryModule--text font-weight-medium"
                >
                  Backing Share
                </th>
                <th
                  v-if="$vuetify.breakpoint.mdAndUp && isManage"
                  scope="col"
                  class="px-4 overline textPrimaryModule--text font-weight-medium"
                >
                  My Allocation
                </th>
                <th
                  scope="col"
                  class="px-4 overline textPrimaryModule--text font-weight-medium"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="builder in tableDataPaginated"
                :key="builder.address"
                class="table-row"
              >
                <td>
                  <p class="mew-heading-4 font-weight-medium">
                    {{ builder.builderName }}
                  </p>
                  <p
                    v-if="$vuetify.breakpoint.mdAndUp"
                    class="textSecondary--text mew-label"
                  >
                    {{ builder.addressShort }}
                    <app-copy-btn
                      :copy-value="String(builder.address)"
                      class="d-inline"
                    >
                      <v-btn x-small icon color="greenPrimary">
                        <img
                          src="@/assets/images/icons/icon-copy-green.svg"
                          alt="copy"
                          height="13"
                        />
                      </v-btn>
                    </app-copy-btn>
                  </p>
                  <p v-else class="textSecondary--text mew-label">label</p>
                </td>
                <td v-if="$vuetify.breakpoint.mdAndUp">
                  <div>
                    {{ builder.backerRewardPercentage }}
                  </div>
                </td>

                <td v-if="$vuetify.breakpoint.mdAndUp">
                  <div>
                    {{ builder.estimatedRbtcAmount.slice(0, 8) }} RBTC
                    <span>
                      (${{ builder.estimatedRbtcAmountUSD.toFixed(2) }})
                    </span>
                  </div>
                  <div>
                    {{ Number(builder.estimatedRifAmount).toFixed(2) }} RIF
                    <span>
                      (${{ builder.estimatedRifAmountUSD.toFixed(2) }})
                    </span>
                  </div>
                </td>

                <td v-if="$vuetify.breakpoint.mdAndUp">
                  {{ builder.totalAllocation }}
                </td>

                <td v-if="isManage">
                  <mew-input
                    v-model="builder.newAllocation"
                    :disabled="
                      saveAllocationLoading || restakingLoading || isFastMode
                    "
                    :has-clear-btn="true"
                    label="Set amount"
                    placeholder="Set amount"
                    class="mr-3 flex-grow-1"
                  />
                </td>
                <td class="cursor-pointer">
                  <mew-checkbox
                    v-model="builder.select"
                    :disabled="
                      saveAllocationLoading || restakingLoading || isFastMode
                    "
                    class-name="textMedium--text"
                    label="Select"
                  ></mew-checkbox>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- ==================================================================== -->
          <!-- Pagination for both desktop and mobile -->
          <!-- ==================================================================== -->
          <div
            v-if="!isLoading && pageLength"
            key="builders-pagination"
            class="builders-pagination"
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
import AppCopyBtn from '@/core/components/AppCopyBtn';
import { fetchProposals } from '../../handlers/helpers/proposals';
import { govABI } from '../../handlers/helpers/abi/govAbi';
import { stRifABI } from '../../handlers/helpers/abi/stRifAbi';
import { BuilderRegistryAbi } from '../../handlers/helpers/abi/builderRegistryAbi';
import { BackersManagerAbi } from '../../handlers/helpers/abi/backerManagerAbi';
import { GaugeAbi } from '../../handlers/helpers/abi/guageAbi';
import { RewardDistributorAbi } from '../../handlers/helpers/abi/rewardDistributionAbi';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';
import {
  splitCombinedName,
  removeBrackets,
  isAmountValid
} from '../../handlers/helpers/utils';
import {
  getContractAddress,
  ContractType
} from '../../handlers/helpers/contracts';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { rifABI } from '../../handlers/helpers/abi/rifAbi';

const RELAY_FUNCTION_SELECTOR = '0xc28bc2fa';
const CR_WHITELIST_FUNCTION_SELECTOR_MVP = '0xb0db8f2c';
const CR_WHITELIST_FUNCTION_SELECTOR_V2 = '0xd3a954bb';
const RELAY_PARAMETER_PADDING_LENGTH = 256;
const ADDRESS_PADDING_LENGTH = 24;
const DECIMALS = 18;

export default {
  name: 'ListRewards',
  components: {
    AppCopyBtn,
    StakingModal: () => import('../collection/StakingModal')
  },
  data() {
    return {
      page: 1,
      itemsPerPage: 10,
      msg: '',
      fastModeMsg: '',
      tx: '',
      rifContract: null,
      openStakingModal: false,
      isManage: false,
      isFastMode: false,
      myRewards: [],
      totalEarnedUSD: 0,
      govContract: null,
      stRifContract: null,
      claimLoading: false,
      totalOnchainAllocation: '',
      strifbalance: '',
      rifBalance: 0,
      backerManagerContract: null,
      builderRegistryContract: null,
      builders: [],
      myVotingPower: null,
      isLoading: false,
      saveAllocationLoading: false,
      restakingLoading: false
    };
  },
  computed: {
    ...mapState('wallet', [
      'balance',
      'address',
      'web3',
      'instance',
      'loadingWalletInfo'
    ]),
    ...mapGetters('global', ['network']),
    ...mapGetters('external', ['contractToToken']),
    pageLength() {
      return Math.ceil(this.builders.length / this.itemsPerPage);
    },
    tableDataPaginated() {
      if (this.isManage) {
        return this.builders.filter(v => v.select);
      }
      return this.paginate(this.builders, this.itemsPerPage, this.page);
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
    getContractInfo(contract, isMain = false) {
      let address = '';
      if (isMain) {
        address = MAIN_TOKEN_ADDRESS;
      } else {
        address = getContractAddress(contract, this.network.type.chainID);
      }
      const data = this.contractToToken(address);

      return data.price;
    },
    async onYesRestake() {
      try {
        this.restakingLoading = true;
        // Step 1: Allow
        this.fastModeMsg =
          'Step # 1/3: Allowing RIF for staking. Please wait...';
        const strifAddress = getContractAddress(
          ContractType.STRIF,
          this.network.type.chainID
        );
        const rifTx = await this.rifContract.approve(
          strifAddress,
          ethers.utils.parseEther(String(this.rifBalance))
        );
        await rifTx.wait();
        // Step 2: Stake
        this.fastModeMsg =
          'Step # 2/3: Staking RIF in progress. Please wait...';
        const stakeTx = await this.stRifContract.depositAndDelegate(
          this.address.toLowerCase(),
          ethers.utils.parseEther(String(this.rifBalance))
        );

        await stakeTx.wait();

        // Step 3: Save New Allocations
        this.fastModeMsg =
          'Step# 3/3: Saving updated allocation. Please wait...';
        await this.onSaveAllocation();

        this.isFastMode = false;
        this.fastModeMsg = '';
        this.restakingLoading = false;
      } catch (e) {
        this.restakingLoading = false;
        this.fastModeMsg = '';
        this.isFastMode = false;
        this.fetchFromLocalStorage();
        Toast(e, {}, ERROR);
      }
    },
    onNoRestake() {
      this.isFastMode = false;
      this.fetchFromLocalStorage();
    },
    onRestake() {
      this.fetchFromLocalStorage();
      this.isFastMode = true;
      // calculate amounts
      const allocations = this.builders.filter(builder => builder.select);
      // find existing allocation percentage per builder
      const allocatedAmount = Number(this.totalOnchainAllocation);
      const newAmountToBeStaked = Number(this.rifBalance); // all available rif

      for (const alloc of allocations) {
        // find existing percentege of distribution
        const sharePercentage =
          (Number(alloc.newAllocation) / allocatedAmount) * 100;

        // New amount to be distributed using existing percantage
        const amountToAllocate = (sharePercentage / 100) * newAmountToBeStaked;

        const formattedAmount = Math.floor(amountToAllocate);
        alloc.newAllocation = Number(alloc.newAllocation) + formattedAmount;
      }
    },
    onStake() {
      this.openStakingModal = true;
    },
    resetStakeModal() {
      this.openStakingModal = false;
    },
    async onStakeDone(tx) {
      try {
        const receipt = await tx.wait();
        if (receipt.status === 1) {
          this.openStakingModal = false;
          const explorer = this.network.type.blockExplorerTX;
          this.tx = explorer.replace('[[txHash]]', tx.hash);
          this.msg =
            'STAKE IN PROCESS: Congratulations and thank you for staking your RIF in the Collective.';

          this.init();
        } else {
          this.msg = 'Transaction failed. Please try again.';
        }
      } catch (e) {
        Toast(e, {}, ERROR);
      }
    },
    async onClaimRewards() {
      try {
        this.claimLoading = true;
        const builders = this.builders.filter(builder => builder.select);
        const guages = builders.map(v => v.guage);
        const tx = await this.backerManagerContract[
          'claimBackerRewards(address[])'
        ](guages);

        await tx.wait();

        const explorer = this.network.type.blockExplorerTX;
        this.tx = explorer.replace('[[txHash]]', tx.hash);
        this.msg = 'Transaction successfull';
        this.claimLoading = false;
        this.init();
      } catch (e) {
        this.claimLoading = false;
        Toast(e, {}, ERROR);
      }
    },
    async onSaveAllocation() {
      this.msg = '';
      try {
        this.saveAllocationLoading = true;
        // save the allocation
        const updatedAllocations = this.builders.filter(
          builder => builder.select
        );
        const allocTotal = updatedAllocations.reduce(
          (acc, val) => acc + Number(val.newAllocation),
          0
        );

        if (
          !this.isFastMode &&
          updatedAllocations.find(
            alloc =>
              !isAmountValid(alloc.newAllocation, 1, Number.MAX_SAFE_INTEGER)
          )
        ) {
          this.saveAllocationLoading = false;
          this.msg = 'Invalid allocation amounts!';
          return;
        }
        if (!this.isFastMode && allocTotal > Number(this.strifbalance)) {
          // perform validation
          this.saveAllocationLoading = false;
          this.msg =
            'Not enough stRIF for this allocation. Stake more RIF to allow this allocation.';
          return;
        }
        const guages = updatedAllocations.map(v => v.guage);
        const allocs = updatedAllocations.map(v =>
          ethers.utils.parseUnits(String(v.newAllocation), DECIMALS).toBigInt()
        );

        let tx = null;
        if (updatedAllocations.length > 1) {
          // batch allocation
          tx = await this.backerManagerContract.allocateBatch(guages, allocs);
        } else {
          tx = await this.backerManagerContract.allocate(guages[0], allocs[0]);
        }

        await tx.wait();
        const explorer = this.network.type.blockExplorerTX;
        this.tx = explorer.replace('[[txHash]]', tx.hash);
        this.msg = 'Transaction successfull';
        this.isManage = false;
        this.saveAllocationLoading = false;
        this.init();
      } catch (e) {
        this.saveAllocationLoading = false;
        Toast(e, {}, ERROR);
      }
    },
    onManageClick() {
      this.isManage = true;
    },
    onBackFromManage() {
      this.fetchFromLocalStorage();
      this.isManage = false;
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
    getBackerRewardPercentage(
      previous,
      next,
      cooldownEndTime,
      timestampInSeconds
    ) {
      const currentTimestamp =
        timestampInSeconds ?? Math.floor(Date.now() / 1000);
      const current = currentTimestamp < cooldownEndTime ? previous : next;

      return {
        current,
        next,
        cooldownEndTime
      };
    },
    fetchFromLocalStorage() {
      // Cache handling
      const rewardsCache = localStorage.getItem(
        `rc_rewards_${this.network.type.chainID}`
      );

      if (rewardsCache) {
        try {
          const rewardsJson = JSON.parse(rewardsCache);
          this.builders = rewardsJson.builders;
          this.myRewards = rewardsJson.myRewards;
          this.isLoading = false;
        } catch (_) {
          this.isLoading = false;
          localStorage.removeItem(`rc_rewards_${this.network.type.chainID}`);
        }
      }
    },
    async init() {
      this.msg = '';
      this.tx = '';
      this.isLoading = true;

      this.fetchFromLocalStorage();
      // first get builders and then populate fields for each builder
      const rifTokenAddress = getContractAddress(
        ContractType.RIF,
        this.network.type.chainID
      );

      // builder registry contract
      const builderRegistryAddress = getContractAddress(
        ContractType.BUILDER_REGISTRY,
        this.network.type.chainID
      );

      // reward distributor contract
      const rewardDistributorAddress = getContractAddress(
        ContractType.REWARD_DISTRIBUTOR,
        this.network.type.chainID
      );

      // backer manager address
      const backderManagerAddress = getContractAddress(
        ContractType.BACKER_MANAGER,
        this.network.type.chainID
      );

      const ethersProvider = new ethers.providers.Web3Provider(
        this.web3.currentProvider
      );
      const ethersSigner = ethersProvider.getSigner();

      this.builderRegistryContract = new ethers.Contract(
        builderRegistryAddress,
        BuilderRegistryAbi,
        ethersSigner
      );

      this.rifContract = new ethers.Contract(
        rifTokenAddress,
        rifABI,
        ethersSigner
      );

      this.backerManagerContract = new ethers.Contract(
        backderManagerAddress,
        BackersManagerAbi,
        ethersSigner
      );

      // reward distributor contract
      const rewardDistributorContract = new ethers.Contract(
        rewardDistributorAddress,
        RewardDistributorAbi,
        ethersSigner
      );

      const [
        rewardsERC20,
        rewardsCoinbase,
        totalPotentialReward,
        totalOnchainAllocation
      ] = await Promise.all([
        rewardDistributorContract.defaultRifAmount(),
        rewardDistributorContract.defaultNativeAmount(),
        this.backerManagerContract.totalPotentialReward(),
        this.backerManagerContract.backerTotalAllocation(this.address)
      ]);

      this.totalOnchainAllocation = Math.floor(
        ethers.utils.formatUnits(totalOnchainAllocation, DECIMALS)
      );

      const [activeLength, haltedLength] = await Promise.all([
        this.builderRegistryContract.getGaugesLength(),
        this.builderRegistryContract.getHaltedGaugesLength()
      ]);

      const activeLen = Number(activeLength.toString()) ?? 0;
      const haltedLen = Number(haltedLength.toString()) ?? 0;

      const activeCalls = await Promise.all(
        Array.from({ length: activeLen }, (_, index) => {
          return this.builderRegistryContract.getGaugeAt(index);
        })
      );

      const haltedCalls = await Promise.all(
        Array.from({ length: haltedLen }, (_, index) => {
          return this.builderRegistryContract.getHaltedGaugeAt(index);
        })
      );
      const gauges = [...activeCalls, ...haltedCalls];
      const builders = await Promise.all(
        gauges.map(guage => {
          return this.builderRegistryContract.gaugeToBuilder(guage);
        })
      );

      // find reward shares
      const rewardShares = await Promise.all(
        gauges.map(guage => {
          const contract = new ethers.Contract(guage, GaugeAbi, ethersSigner);

          return contract.rewardShares();
        })
      );

      const assets = [
        {
          name: 'RBTC',
          address: '0xf7ab6cfaebbadfe8b5494022c4c6db776bd63b6b', // COINBASE ADDRESS
          earned: null,
          estimated: null,
          earnedUsd: 0,
          estimatedUsd: 0,
          type: ContractType.RBTC,
          isMain: true,
          price: 0
        },
        {
          name: 'RIF',
          address: rifTokenAddress,
          earned: null,
          estimated: null,
          earnedUsd: 0,
          estimatedUsd: 0,
          type: ContractType.RIF,
          isMain: false,
          price: 0
        }
      ];

      this.totalEarnedUSD = 0;
      for (const asset of assets) {
        const earnedValue = await Promise.all(
          gauges.map(guage => {
            const contract = new ethers.Contract(guage, GaugeAbi, ethersSigner);

            return contract.earned(asset.address, this.address);
          })
        );

        const estimatedValue = await Promise.all(
          gauges.map(guage => {
            const contract = new ethers.Contract(guage, GaugeAbi, ethersSigner);

            return contract.estimatedBackerRewards(asset.address, this.address);
          })
        );

        const earnedFormattedValue = earnedValue
          .map(a => ethers.utils.formatUnits(a.toString(), DECIMALS))
          .reduce((acc, earned) => acc + Number(earned), 0);

        const estimatedFormattedValue = estimatedValue
          .map(a => ethers.utils.formatUnits(a.toString(), DECIMALS))
          .reduce((acc, est) => acc + Number(est), 0);

        const price = await this.getContractInfo(asset.type, asset.isMain);
        asset.price = price;
        asset.earned = earnedFormattedValue.toFixed(8);
        asset.earnedUsd = price * earnedFormattedValue;
        asset.earnedUsd = asset.earnedUsd.toFixed(2);
        this.totalEarnedUSD = this.totalEarnedUSD + Number(asset.earnedUsd);

        asset.estimated = estimatedFormattedValue.toFixed(8);
        asset.estimatedUsd = price * estimatedFormattedValue;
        asset.estimatedUsd = asset.estimatedUsd.toFixed(2);
      }

      this.myRewards = assets;

      //totalAllocation
      const totalAllocations = await Promise.all(
        gauges.map(guage => {
          const contract = new ethers.Contract(guage, GaugeAbi, ethersSigner);

          return contract.totalAllocation();
        })
      );

      // my allocation - for backer
      const myCurrentAllocation = await Promise.all(
        gauges.map(guage => {
          const contract = new ethers.Contract(guage, GaugeAbi, ethersSigner);

          return contract.allocationOf(this.address);
        })
      );

      // backer reward percentage
      const backerRewardPercentageRaw = await Promise.all(
        builders.map(b => {
          return this.builderRegistryContract.backerRewardPercentage(b);
        })
      );

      this.builders = [];
      builders.forEach((builder, i) => {
        const backerRewardPercentage = this.getBackerRewardPercentage(
          backerRewardPercentageRaw[i].previous,
          backerRewardPercentageRaw[i].next,
          backerRewardPercentageRaw[i].cooldownEndTime
        );

        const rewardPercentageToApply = backerRewardPercentage?.current ?? 0n;

        // calculate rif estimated rewards
        const estimatedBackerRewardsPct = totalPotentialReward
          ? (rewardShares[i] * rewardPercentageToApply) / totalPotentialReward
          : 0n;

        const WeiPerEther = 10n ** 18n;

        const rewardRif = rewardsERC20 ?? 0n;
        const estimatedRifAmount =
          (BigNumber.from(
            String(Math.ceil(estimatedBackerRewardsPct))
          ).toBigInt() *
            BigNumber.from(rewardRif.toString()).toBigInt()) /
          WeiPerEther;
        // calculate rbtc estimated rewards
        const rewardRbtc = rewardsCoinbase ?? 0n;
        const estimatedRbtcAmount =
          (BigNumber.from(
            String(Math.ceil(estimatedBackerRewardsPct))
          ).toBigInt() *
            BigNumber.from(rewardRbtc.toString()).toBigInt()) /
          WeiPerEther;

        const sumTotalAllocation = totalAllocations
          .map(v => BigNumber.from(v.toString()).toBigInt())
          .reduce((acc, val) => acc + val, 0n);

        // total allocations
        const builderTotalAllocation = totalAllocations[i] ?? 0n;

        const totalAllocationPercentage = sumTotalAllocation
          ? (BigNumber.from(builderTotalAllocation.toString()).toBigInt() *
              100n) /
            sumTotalAllocation
          : 0n;

        const newAlloc = ethers.utils.formatUnits(
          myCurrentAllocation[i],
          DECIMALS
        );

        this.builders.push({
          select: Number(newAlloc) > 0,
          newAllocation: Math.floor(newAlloc),
          address: builder,
          guage: gauges[i],
          addressShort: `${builder.slice(0, 5)}...${builder.slice(-5)}`,
          backerRewardPercentage:
            100 *
            Number(
              ethers.utils.formatUnits(
                (backerRewardPercentage?.current ?? 0n).toString(),
                DECIMALS
              )
            ),
          totalAllocation: `${totalAllocationPercentage}%`,
          estimatedRifAmount: ethers.utils.formatUnits(
            estimatedRifAmount,
            DECIMALS
          ),
          estimatedRifAmountUSD:
            ethers.utils.formatUnits(estimatedRifAmount, DECIMALS) *
            assets[1].price,
          estimatedRbtcAmount: ethers.utils.formatUnits(
            estimatedRbtcAmount,
            DECIMALS
          ),
          estimatedRbtcAmountUSD:
            ethers.utils.formatUnits(estimatedRbtcAmount, DECIMALS) *
            assets[0].price
        });
      });

      const strifAddress = getContractAddress(
        ContractType.STRIF,
        this.network.type.chainID
      );

      const govAddress = getContractAddress(
        ContractType.GOV,
        this.network.type.chainID
      );
      this.stRifContract = new ethers.Contract(
        strifAddress,
        stRifABI,
        ethersSigner
      );
      // get strif balance
      const stRifBalance = await this.stRifContract.balanceOf(this.address);
      const formattedSTRIFBalance = ethers.utils.formatUnits(
        stRifBalance,
        DECIMALS
      );
      this.strifbalance = Math.floor(formattedSTRIFBalance);

      // get rif balance
      const rifBalance = await this.rifContract.balanceOf(this.address);
      this.rifBalance = Math.floor(
        ethers.utils.formatUnits(rifBalance, DECIMALS)
      );

      const vPower = await this.stRifContract.getVotes(
        this.address.toLowerCase()
      );
      this.myVotingPower = ethers.utils.formatUnits(vPower, DECIMALS);

      this.govContract = new ethers.Contract(govAddress, govABI, ethersSigner);

      const interfaceDAO = new ethers.utils.Interface(govABI);
      // parse proposal name
      const encodedProposals = await fetchProposals(
        this.network.type.chainID,
        govAddress
      );
      this.stylePagination();
      await Promise.all(
        encodedProposals.map(async encodedProposal => {
          try {
            // Decode event data
            const decoded = interfaceDAO.decodeEventLog(
              'ProposalCreated',
              encodedProposal.data,
              encodedProposal.topics.filter(a => a)
            );

            const relayFilteredEvents = decoded.calldatas.filter(calldata =>
              calldata.startsWith(RELAY_FUNCTION_SELECTOR)
            );

            const crWhitelistFunctionHashMVP =
              CR_WHITELIST_FUNCTION_SELECTOR_MVP.slice(2);
            const crWhitelistFunctionHashV2 =
              CR_WHITELIST_FUNCTION_SELECTOR_V2.slice(2);

            // both MVP and V2 have the same length
            const whitelistFnLength = crWhitelistFunctionHashV2.length;
            const relayPadding =
              RELAY_FUNCTION_SELECTOR.length + RELAY_PARAMETER_PADDING_LENGTH;

            const crEventCalldatas = (relayFilteredEvents || []).find(
              calldata =>
                calldata.startsWith(crWhitelistFunctionHashMVP, relayPadding) ||
                calldata.startsWith(crWhitelistFunctionHashV2, relayPadding)
            );
            let builder;

            if (crEventCalldatas) {
              const addressStart =
                relayPadding + whitelistFnLength + ADDRESS_PADDING_LENGTH;
              const addressEnd = addressStart + 40;
              const addressSlice = `0x${crEventCalldatas.slice(
                addressStart,
                addressEnd
              )}`;
              try {
                builder = ethers.utils.getAddress(addressSlice);
              } catch (e) {
                Toast(e, {}, ERROR);
              }
            }

            const [title] = decoded.description.split(';');
            const splitResult = splitCombinedName(title);

            this.builders.forEach(bi => {
              if (bi.address.toLowerCase() === decoded.proposer.toLowerCase()) {
                bi.builderName = removeBrackets(splitResult.builderName);
              } else if (
                builder &&
                builder.toLowerCase() === bi.address.toLowerCase()
              ) {
                bi.builderName = removeBrackets(splitResult.builderName);
              }
            });
            return {
              proposalId: decoded.proposalId.toString()
            };
          } catch (e) {
            return null;
          }
        })
      );

      this.builders = this.builders.filter(b => b.builderName);
      // cache rewards
      localStorage.setItem(
        `rc_rewards_${this.network.type.chainID}`,
        JSON.stringify({
          builders: this.builders,
          myRewards: this.myRewards
        })
      );
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

.builders-pagination {
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
.msg-fast-mode {
  background: lightgreen;
  padding: 5px;
  border-radius: 5px;
  p {
    color: green;
    font-size: medium;
  }
}
.builders-table {
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
