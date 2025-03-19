<template>
  <div>
    <div>
      <h2 class="mew-heading-3 textPrimaryModule--text text-uppercase ml-5">
        Balances
      </h2>
      <p class="titlePrimary--text d-flex align-center mew-heading-2 ml-5">
        {{ totalUsdValue }}
      </p>
    </div>
    <div class="mb-2">
      <staking-modal
        v-if="!loading && stRifContract"
        :open-staking-modal="openStakingModal"
        :rif-contract="rifContract"
        :st-rif-contract="stRifContract"
        :reset-stake-modal="resetStakeModal"
        :rif-balance="rifBalance"
        @onStakeDone="onStakeDone"
      ></staking-modal>

      <unstaking-modal
        v-if="!loading && stRifContract"
        :open-un-staking-modal="openUnstakingModal"
        :st-rif-contract="stRifContract"
        :reset-un-stake-modal="resetUnStakeModal"
        :strif-balance="stRifBalance"
        @onUnStakeDone="onUnStakeDone"
      ></unstaking-modal>
      <v-slide-y-transition hide-on-leave group>
        <!-- Not enough RIF -->
        <mew-alert
          v-if="!loading && Number(rifBalance) == 0 && !loading"
          key="alert-rif"
          class="my-5"
          title="Not enough RIF"
          description=" You need RIF to start staking."
          theme="warning"
          has-white-background
          hide-close-icon
          :link-object="linkNoRif"
        />
        <!-- Not enough RBTC -->
        <mew-alert
          v-if="Number(balanceInWei) == 0 && !loadingWalletInfo"
          key="alert-rbtc"
          class="my-5"
          title="Not enough RBTC"
          description="You need RBTC to pay for gas fees in order to stake and unstake. "
          theme="warning"
          has-white-background
          hide-close-icon
          :link-object="linkNoRbtc"
        />
        <!-- Transaction Hash -->
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
          v-if="!loading && !loadingWalletInfo"
          key="table"
          class="dao-table mt-4 mew-sheet"
        >
          <thead class="table-header">
            <tr>
              <th
                class="px-4 overline textPrimaryModule--text font-weight-medium"
              >
                Token <span v-if="$vuetify.breakpoint.smAndDown"> Balance</span>
              </th>
              <th
                v-if="$vuetify.breakpoint.mdAndUp"
                scope="col"
                class="px-4 overline textPrimaryModule--text font-weight-medium"
              >
                Price
              </th>
              <th
                v-if="$vuetify.breakpoint.mdAndUp"
                scope="col"
                class="px-4 overline textPrimaryModule--text font-weight-medium"
              >
                Balance
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
            <!-- RIF -->
            <tr v-for="token in tableData" :key="token.contract">
              <!--Token-->
              <td>
                <div class="d-flex align-center">
                  <mew-token-container
                    :img="token.icon"
                    :name="token.name"
                    size="42px"
                    class="mr-4"
                  />
                  <div v-if="$vuetify.breakpoint.mdAndUp">
                    <p class="mew-heading-4 font-weight-medium">
                      {{ token.name }}
                    </p>
                    <p class="textSecondary--text mew-label">
                      {{ token.symbol }}
                    </p>
                  </div>
                  <div v-else>
                    <p class="font-weight-medium">
                      {{ token.balance }} {{ token.symbol }}
                    </p>
                    <p class="textSecondary--text mew-label">
                      {{ token.usdBalance }}
                      <span v-if="token.price" class="ml-1"
                        >(@{{ token.formattedPrice }})</span
                      >
                    </p>
                  </div>
                </div>
              </td>
              <!-- Price-->
              <td v-if="$vuetify.breakpoint.mdAndUp">
                <div>
                  <div class="mew-label">
                    <p>{{ token.formattedPrice }}</p>

                    <div class="d-flex align-center">
                      <div
                        :class="[
                          token.status == '+'
                            ? 'greenPrimary--text'
                            : 'redPrimary--text',
                          'mew-label'
                        ]"
                      >
                        {{ token.change ? `${token.change}%` : '' }}
                      </div>
                      <v-icon
                        v-if="token.status == '+'"
                        small
                        color="greenPrimary"
                      >
                        mdi-arrow-up-thick
                      </v-icon>
                      <v-icon
                        v-else-if="token.change !== '' && token.status === '-'"
                        small
                        color="redPrimary"
                      >
                        mdi-arrow-down-thick
                      </v-icon>
                    </div>
                  </div>
                </div>
              </td>
              <!--Balance-->
              <td v-if="$vuetify.breakpoint.mdAndUp">
                <p class="font-weight-medium">
                  {{ token.balance }} {{ token.symbol }}
                </p>

                <p v-if="token.price" class="textSecondary--text mew-label">
                  {{ token.usdBalance }}
                </p>
              </td>
              <!--Actions-->
              <td class="center-align">
                <mew-button
                  v-if="token.contract === rifContractAddress"
                  title="Stake"
                  btn-size="small"
                  @click.native="onStake"
                >
                </mew-button>
                <mew-button
                  v-if="token.contract === stRifContractAddress"
                  title="Unstake"
                  btn-style="outline"
                  btn-size="small"
                  @click.native="onUnStake"
                ></mew-button>
              </td>
            </tr>
          </tbody>
        </table>

        <v-skeleton-loader
          v-else
          key="skeleton-loader"
          class="mx-auto"
          type="table"
        />
      </v-slide-y-transition>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { ethers } from 'ethers';
import { rifABI } from '../../handlers/helpers/abi/rifAbi';
import { stRifABI } from '../../handlers/helpers/abi/stRifAbi';
import {
  getContractAddress,
  ContractType
} from '../../handlers/helpers/contracts';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import {
  formatFiatValue,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';
import BigNumber from 'bignumber.js';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';

export default {
  name: 'ListCollective',
  components: {
    StakingModal: () => import('./StakingModal'),
    UnstakingModal: () => import('./UnstakeModal')
  },
  data() {
    return {
      loading: true,
      rifBalance: '0',
      stRifBalance: '0',
      openStakingModal: false,
      openUnstakingModal: false,
      stRifContract: null,
      rifContract: null,
      rifContractAddress: '',
      stRifContractAddress: '',
      tx: '',
      msg: '',
      linkNoRbtc: {
        text: 'See how to get RBTC',
        url: 'https://rootstock.io/rbtc/#get-rbtc'
      },
      linkNoRif: {
        text: 'See how to get RIF',
        url: 'https://rif.technology/rif-token/'
      }
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
    ...mapGetters('wallet', ['balanceInETH', 'balanceInWei']),

    /** RIF */
    rifContractMarketData() {
      if (this.loadingWalletInfo) {
        return null;
      }
      return this.getContractInfo(ContractType.RIF);
    },
    rifUsdBalanceBn() {
      if (this.loadingWalletInfo || this.loading) {
        return 0;
      }
      const balance = new BigNumber(this.rifBalance || 0);
      const price = new BigNumber(this.rifContractMarketData.price || 0);
      return price.multipliedBy(balance);
    },
    /** STRIF */
    stRifUsdBalanceBn() {
      if (this.loadingWalletInfo || this.loading) {
        return 0;
      }
      const balance = new BigNumber(this.stRifBalance || 0);
      const price = new BigNumber(this.rifContractMarketData.price || 0);
      return price.multipliedBy(balance);
    },
    /** RBTC */
    rbtcContractMarketData() {
      if (this.loadingWalletInfo) {
        return null;
      }
      return this.getContractInfo(ContractType.RBTC, true);
    },
    rbtcUsdBalanceBn() {
      if (this.loadingWalletInfo || this.loading) {
        return 0;
      }
      const balance = new BigNumber(this.balanceInETH || 0);
      const price = new BigNumber(this.rbtcContractMarketData.price || 0);
      return price.multipliedBy(balance);
    },
    totalUsdValue() {
      const totalValue = BigNumber(this.rbtcUsdBalanceBn)
        .plus(this.rifUsdBalanceBn)
        .plus(this.stRifUsdBalanceBn);
      return formatFiatValue(totalValue).value;
    },
    /**
     * table data for the UI
     * @returns {object} - {name, balance, usdBalance, contract, icon, change, status, price, symbol, formattedPrice}
     */
    tableData() {
      if (
        this.loading ||
        this.loadingWalletInfo ||
        this.rifContractMarketData === null
      ) {
        return [];
      }
      const rifBalanceBN = new BigNumber(this.rifBalance || 0);
      const stRifBalanceBN = new BigNumber(this.stRifBalance || 0);
      return [
        {
          name: 'Rootstock Infrastructure Framework',
          balance: formatFloatingPointValue(rifBalanceBN).value,
          usdBalance: formatFiatValue(this.rifUsdBalanceBn).value,
          contract: this.rifContractAddress,
          symbol: 'RIF',
          ...this.rifContractMarketData
        },
        {
          name: 'Staked Rootstock Infrastructure Framework',
          balance: formatFloatingPointValue(stRifBalanceBN).value,
          usdBalance: formatFiatValue(this.stRifUsdBalanceBn).value,
          contract: this.stRifContractAddress,
          symbol: 'sRIF',
          ...this.rifContractMarketData
        },
        {
          name: 'Rootstock Bitcoin',
          balance: formatFloatingPointValue(this.balanceInETH).value,
          usdBalance: formatFiatValue(this.rbtcUsdBalanceBn).value,
          contract: MAIN_TOKEN_ADDRESS,
          symbol: 'RBTC',
          ...this.rbtcContractMarketData
        }
      ];
    }
  },
  mounted() {
    this.msg = '';
    this.init();
  },
  methods: {
    /** Returns Market Data for the ui
     * @param {string} contract
     * @param {boolean} isMain - if the contract is the main token
     * @returns {object} - {icon, change, status, price, symbol, formattedPrice}
     */
    getContractInfo(contract, isMain = false) {
      let address = '';
      if (isMain) {
        address = MAIN_TOKEN_ADDRESS;
      } else {
        address = getContractAddress(contract, this.network.type.chainID);
      }
      const data = this.contractToToken(address);
      const change =
        data.price_change_percentage_24hf &&
        data.price_change_percentage_24hf !== '0'
          ? data.price_change_percentage_24hf.replaceAll('%', '')
          : '';
      const status =
        data.price_change_percentage_24h > 0
          ? '+'
          : data.price_change_percentage_24h === 0
          ? ''
          : '-';
      const _price = formatFiatValue(BigNumber(data.price || 0)).value;
      return {
        icon: data.img,
        change: change,
        status: status,
        price: data.price,
        formattedPrice: _price
      };
    },
    resetStakeModal() {
      this.openStakingModal = false;
    },
    resetUnStakeModal() {
      this.openUnstakingModal = false;
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
    async onUnStakeDone(tx) {
      try {
        const receipt = await tx.wait();

        if (receipt.status === 1) {
          this.openUnstakingModal = false;
          const explorer = this.network.type.blockExplorerTX;
          this.tx = explorer.replace('[[txHash]]', tx.hash);
          this.msg =
            'UN-STAKE IN PROCESS: You successfully unstaked your RIF from the Collective.';

          this.init();
        } else {
          this.msg = 'Transaction failed. Please try again.';
        }
      } catch (e) {
        Toast(e, {}, ERROR);
      }
    },
    onStake() {
      this.openStakingModal = true;
    },
    onUnStake() {
      this.openUnstakingModal = true;
    },
    async init() {
      try {
        const ethersProvider = new ethers.providers.Web3Provider(
          this.web3.currentProvider
        );
        const ethersSigner = ethersProvider.getSigner();

        // Create an instance of the token contracts
        this.rifContractAddress = getContractAddress(
          ContractType.RIF,
          this.network.type.chainID
        );
        this.stRifContractAddress = getContractAddress(
          ContractType.STRIF,
          this.network.type.chainID
        );
        const tokenContract = new ethers.Contract(
          this.rifContractAddress,
          rifABI,
          ethersSigner
        );

        this.rifContract = tokenContract;

        const stRifContract = new ethers.Contract(
          this.stRifContractAddress,
          stRifABI,
          ethersSigner
        );

        this.stRifContract = stRifContract;
        /** Get Balances */
        /** NOTE: WHY ARE DECIMALS  HARDCODED?*/

        const balance = await tokenContract.balanceOf(this.address);
        const formattedBalance = ethers.utils.formatUnits(balance, 18);
        const stRifBalance = await stRifContract.balanceOf(this.address);
        const formattedSTRIFBalance = ethers.utils.formatUnits(
          stRifBalance,
          18
        );
        this.rifBalance = formattedBalance;
        this.stRifBalance = formattedSTRIFBalance;
        this.loading = false;
      } catch (e) {
        // eslint-disable-next-line
        console.error(e);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
p {
  margin: 0;
}
.theme-color {
  color: #ff9900;
}
.dao-table {
  width: 100% !important;
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

  .center-align {
    padding: 1rem;
    display: flex;
    vertical-align: middle;
    align-items: center;
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
