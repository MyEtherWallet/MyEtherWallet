<template>
  <div>
    <div>
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
            <td>
              {{ rifBalance }} RIF
              <span v-if="rifPriceUSD">
                (${{
                  ((rifPriceUSD || 0) * Number(rifBalance)).toFixed(2)
                }})</span
              >
            </td>
            <td>
              <mew-button title="Stake" @click.native="onStake"> </mew-button>
            </td>
          </tr>
          <tr>
            <td>Staked Rootstock Infrastructure Framework</td>
            <td>stRIF</td>
            <td>${{ rifPriceUSD ? Number(rifPriceUSD).toFixed(2) : 0 }}</td>
            <td>
              {{ stRifBalance }} stRIF
              <span v-if="rifPriceUSD">
                (${{ ((rifPriceUSD || 0) * Number(stRifBalance)).toFixed(2) }})
              </span>
            </td>
            <td>
              <mew-button
                title="Unstake"
                @click.native="onUnStake"
              ></mew-button>
            </td>
          </tr>
          <tr>
            <td>Rootstock Bitcoin</td>
            <td>RBTC</td>
            <td>${{ rbtcPriceUSD ? Number(rbtcPriceUSD).toFixed(2) : 0 }}</td>
            <td>
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
      <div v-if="tx || msg" class="text-center text-primary mt-2 mb-2">
        <div class="text-primary">{{ msg }}</div>
        <a :href="tx" target="_blank">Transaction Hash: {{ tx }}</a>
        <mew-button title="Refresh Balance" @click.native="init"></mew-button>
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
  getRIFAddress,
  getSTRIFAddress
} from '../../handlers/helpers/contracts';

export default {
  name: 'ListCollective',
  components: {
    StakingModal: () => import('./StakingModal'),
    UnstakingModal: () => import('./UnstakeModal')
  },
  data() {
    return {
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
    onStakeDone(tx) {
      this.openStakingModal = false;
      const explorer = this.network.type.blockExplorerTX;
      this.tx = explorer.replace('[[txHash]]', tx.hash);
      this.msg =
        'STAKE IN PROCESS: Congratulations and thank you for staking your RIF in the Collective.';

      this.init();
    },
    onUnStakeDone(tx) {
      this.openUnstakingModal = false;
      const explorer = this.network.type.blockExplorerTX;
      this.tx = explorer.replace('[[txHash]]', tx.hash);
      this.msg =
        'UN-STAKE IN PROCESS: You successfully unstaked your RIF from the Collective.';

      this.init();
    },
    onStake() {
      this.openStakingModal = true;
    },
    onUnStake() {
      this.openUnstakingModal = true;
    },
    async init() {
      const rbtcPriceResponse = await getTokenPrice('rootstock');
      const rifPriceResponse = await getTokenPrice('rif-token');

      if (rbtcPriceResponse) {
        this.rbtcPriceUSD = rbtcPriceResponse?.rootstock?.usd;
      }

      if (rifPriceResponse) {
        this.rifPriceUSD = rifPriceResponse['rif-token']?.usd;
      }

      const ethersProvider = new ethers.providers.Web3Provider(
        this.web3.currentProvider
      );
      const ethersSigner = ethersProvider.getSigner();
      const wallet = ethersProvider.getSigner();

      this.rbtcBalance = ethers.utils.formatUnits(
        await wallet.getBalance(),
        18
      );

      this.rbtcBalance = parseFloat(this.rbtcBalance).toFixed(6);

      // Create an instance of the RIF token contract
      const rifAddress = getRIFAddress(this.network.type.chainID);
      const strifAddress = getSTRIFAddress(this.network.type.chainID);
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

      const balance = await tokenContract.balanceOf(this.address);
      const formattedBalance = ethers.utils.formatUnits(balance, 18);

      const stRifBalance = await stRifContract.balanceOf(this.address);
      const formattedSTRIFBalance = ethers.utils.formatUnits(stRifBalance, 18);

      this.rifBalance = formattedBalance;
      this.stRifBalance = formattedSTRIFBalance;
    }
  }
};
</script>
<style lang="scss" scoped>
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
