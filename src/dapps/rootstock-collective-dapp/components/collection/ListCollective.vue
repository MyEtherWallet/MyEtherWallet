<template>
  <div>
    <div class="mb-2">
      <staking-modal
        :open-staking-modal="openStakingModal"
        :rif-contract="rifContract"
        :st-rif-contract="stRifContract"
        :reset-stake-modal="resetStakeModal"
        :rif-balance="rifBalance"
        @onStakeDone="onStakeDone"
      ></staking-modal>

      <unstaking-modal
        :open-un-staking-modal="openUnstakingModal"
        :st-rif-contract="stRifContract"
        :reset-un-stake-modal="resetUnStakeModal"
        :strif-balance="stRifBalance"
        @onUnStakeDone="onUnStakeDone"
      ></unstaking-modal>
      <table class="dao-table">
        <thead class="table-header">
          <tr>
            <th>Token</th>
            <th scope="col">Symbol</th>
            <th scope="col">Price</th>
            <th scope="col">Balance</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Rootstock Infrastructure Framework</td>
            <td>RIF</td>
            <td>${{ rifPriceUSD ? Number(rifPriceUSD).toFixed(2) : 0 }}</td>
            <td class="center-align">
              <img
                width="16"
                height="16"
                src="@/assets/images/currencies/icon-rif-black.svg"
                alt="Crypto"
              />
              &nbsp;
              {{ rifBalance }} RIF
              <span v-if="rifPriceUSD">
                (${{
                  ((rifPriceUSD || 0) * Number(rifBalance)).toFixed(2)
                }})</span
              >
            </td>
            <td>
              <mew-button
                btn-size="small"
                color-theme="#ff9900"
                title="Stake"
                @click.native="onStake"
              >
              </mew-button>
            </td>
          </tr>
          <tr>
            <td>Staked Rootstock Infrastructure Framework</td>
            <td>stRIF</td>
            <td>${{ rifPriceUSD ? Number(rifPriceUSD).toFixed(2) : 0 }}</td>
            <td class="center-align">
              <img
                width="16"
                height="16"
                src="@/assets/images/currencies/icon-rif-black.svg"
                alt="Crypto"
              />
              &nbsp;
              {{ stRifBalance }} stRIF
              <span v-if="rifPriceUSD">
                (${{ ((rifPriceUSD || 0) * Number(stRifBalance)).toFixed(2) }})
              </span>
            </td>
            <td>
              <mew-button
                btn-size="small"
                color-theme="#ff9900"
                title="Unstake"
                @click.native="onUnStake"
              ></mew-button>
            </td>
          </tr>
          <tr>
            <td>Rootstock Bitcoin</td>
            <td>RBTC</td>
            <td>${{ rbtcPriceUSD ? Number(rbtcPriceUSD).toFixed(2) : 0 }}</td>
            <td class="center-align">
              <img
                width="20"
                height="20"
                src="@/assets/images/currencies/icon-rbtc-orange.svg"
                alt="Crypto"
              />
              &nbsp;
              {{ rbtcBalance }} RBTC
              <span v-if="rbtcPriceUSD">
                (${{ ((rbtcPriceUSD || 0) * Number(rbtcBalance)).toFixed(2) }})
              </span>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <br />
      <div v-if="Number(rifBalance) == 0 && !loading" class="mt-2">
        Not enough RIF balance for staking.<a
          href="https://rif.technology/rif-token/"
          target="_blank"
          class="theme-color"
        >
          &nbsp;See how to get RIF</a
        >
      </div>
      <div v-if="Number(rbtcBalance) == 0 && !loading" class="mt-2">
        Not enough RBTC balance for gas fees.<a
          href="https://rootstock.io/rbtc/#get-rbtc"
          target="_blank"
          class="theme-color"
        >
          &nbsp;See how to get RBTC</a
        >
      </div>
      <div v-if="tx || msg" class="text-center text-primary mt-2 mb-2">
        <div class="theme-color">{{ msg }}</div>
        <a :href="tx" target="_blank" class="theme-color"
          >Transaction Hash: {{ tx }}</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { ethers } from 'ethers';
import { rifABI } from '../../handlers/helpers/abi/rifAbi';
import { getTokenPrice } from '../../handlers/helpers/utils';
import { stRifABI } from '../../handlers/helpers/abi/stRifAbi';
import {
  getContractAddress,
  ContractType
} from '../../handlers/helpers/contracts';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';

export default {
  name: 'ListCollective',
  components: {
    StakingModal: () => import('./StakingModal'),
    UnstakingModal: () => import('./UnstakeModal')
  },
  data() {
    return {
      loading: true,
      rifBalance: '',
      stRifBalance: '',
      openStakingModal: false,
      openUnstakingModal: false,
      stRifContract: null,
      rifContract: null,
      rbtcPriceUSD: '',
      rifPriceUSD: '',
      rbtcBalance: '',
      tx: '',
      msg: ''
    };
  },
  computed: {
    ...mapState('wallet', ['balance', 'address', 'web3', 'instance']),
    ...mapGetters('global', ['network'])
  },
  mounted() {
    this.msg = '';
    this.init();
  },
  methods: {
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
      const ethersProvider = new ethers.providers.Web3Provider(
        this.web3.currentProvider
      );
      const ethersSigner = ethersProvider.getSigner();

      // Create an instance of the RIF token contract
      const rifAddress = getContractAddress(
        ContractType.RIF,
        this.network.type.chainID
      );
      const strifAddress = getContractAddress(
        ContractType.STRIF,
        this.network.type.chainID
      );
      const tokenContract = new ethers.Contract(
        rifAddress,
        rifABI,
        ethersSigner
      );

      this.rifContract = tokenContract;

      const stRifContract = new ethers.Contract(
        strifAddress,
        stRifABI,
        ethersSigner
      );

      this.stRifContract = stRifContract;

      const [rbtcPriceResponse, rifPriceResponse] = await Promise.all([
        getTokenPrice('rootstock'),
        getTokenPrice('rif-token')
      ]);

      if (rbtcPriceResponse) {
        this.rbtcPriceUSD = rbtcPriceResponse?.rootstock?.usd;
      }

      if (rifPriceResponse) {
        this.rifPriceUSD = rifPriceResponse['rif-token']?.usd;
      }

      const wallet = ethersProvider.getSigner();

      this.rbtcBalance = ethers.utils.formatUnits(
        await wallet.getBalance(),
        18
      );

      this.rbtcBalance = parseFloat(this.rbtcBalance).toFixed(6);

      const balance = await tokenContract.balanceOf(this.address);
      const formattedBalance = ethers.utils.formatUnits(balance, 18);

      const stRifBalance = await stRifContract.balanceOf(this.address);
      const formattedSTRIFBalance = ethers.utils.formatUnits(stRifBalance, 18);

      this.rifBalance = formattedBalance;
      this.stRifBalance = formattedSTRIFBalance;
      this.loading = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.theme-color {
  color: #ff9900;
}
.dao-table {
  width: 100%;
  text-align: left;
  .table-header {
    text-align: left;
    th {
      padding: 0px;
    }
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
