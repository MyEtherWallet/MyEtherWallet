<template>
  <white-sheet :sideinfo="!mobile">
    <div class="px-5 px-lg-7 py-5">
      <div class="mew-heading-2">MEW exclusive holiday NFTs</div>
      <a
        class="mew-heading-4 d-flex align-center py-2 more-mew-universe"
        href=""
        target="_blank"
      >
        More about MEW universe
        <v-icon color="#5A678A"> mdi-chevron-right </v-icon>
      </a>
      <div
        v-if="loading"
        class="single-mint-section d-flex align-center justify-space-between my-2"
      >
        <div style="width: 144px">
          <div class="nft-image mb-2">
            <v-skeleton-loader height="144" width="144" type="image" />
          </div>
          <mew-button
            :loading="loading"
            :disabled="loading"
            has-full-width
            btn-size="small"
            :btn-style="loading ? 'outline' : 'transparent'"
            :class="loading ? '' : 'button-background'"
          />
        </div>
        <div style="width: 144px">
          <div class="nft-image mb-2">
            <v-skeleton-loader height="144" width="144" type="image" />
          </div>
          <mew-button
            :loading="loading"
            :disabled="loading"
            has-full-width
            btn-size="small"
            :btn-style="loading ? 'outline' : 'transparent'"
            :class="loading ? '' : 'button-background'"
          />
        </div>
      </div>
      <div
        v-else
        class="single-mint-section d-flex align-center justify-space-between my-2"
      >
        <div
          v-for="item in singlePaidItems"
          :key="item.description + item.title"
          style="width: 144px"
        >
          <img :src="item.url" :alt="item.title" class="mb-2 nft-image" />
          <mew-button
            :loading="loading || loaders[item.reward_id]"
            :disabled="loading"
            has-full-width
            :title="`Mint · ${item.pricef} ETH`"
            btn-size="small"
            :btn-style="loading ? 'outline' : 'transparent'"
            :class="loading ? '' : 'button-background'"
            @click.native="mint(item.reward_id)"
          />
        </div>
      </div>
      <div>
        <mew-button
          :loading="loading || loaders[mintBothId]"
          :disabled="loading"
          :title="mintBothText"
          has-full-width
          btn-size="large"
          @click.native="mint(mintBothId)"
        />
        <div
          v-show="!loading"
          class="mt-2 textLight--text text-center mew-label"
        >
          Save on price and gas when you mint both
        </div>
      </div>
    </div>
  </white-sheet>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { Toast, ERROR, SUCCESS } from '@/modules/toast/handler/handlerToast';
import { isEmpty } from 'lodash';
import { fromBase } from '@/core/helpers/unit';
import { toBNSafe } from '@/core/helpers/numberFormatHelper';

export default {
  name: 'ModuleSwapRates',
  props: {
    mobile: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: true,
      fetchedData: {},
      loaders: {
        seasons_3_exclusive_nft_1: false,
        season_3_exclusive_nft_2: false,
        season_3_exclusive_nfts: false
      }
    };
  },
  computed: {
    ...mapState('wallet', ['address', 'web3', 'instance']),
    ...mapGetters('global', ['gasPrice']),
    ...mapGetters('wallet', ['balanceInWei']),
    mintBothText() {
      return !isEmpty(this.fetchedData)
        ? `Mint both NFTs · ${this.fetchedData.rewards[2].pricef} ETH`
        : '';
    },
    mintBothId() {
      return !isEmpty(this.fetchedData)
        ? this.fetchedData.rewards[2].reward_id
        : '';
    },
    singlePaidItems() {
      return !isEmpty(this.fetchedData)
        ? this.fetchedData.rewards.slice(0, 2).reverse()
        : [];
    }
  },
  mounted() {
    fetch('https://development.mewwallet.dev/energy/web/info')
      .then(res => {
        return res.json();
      })
      .then(res => {
        const response = res.season;
        const rewards = response.rewards.map(item => {
          item.pricef = fromBase(item.price, 18);
          return item;
        });
        response['rewards'] = rewards;
        console.log(response);
        this.fetchedData = response;
        this.loading = false;
      })
      .catch(err => {
        Toast(err, {}, ERROR);
      });
  },
  methods: {
    async mint(id) {
      console.log(id);
      this.loaders[id] = true;
      const { transaction } = await fetch(
        `https://development.mewwallet.dev/energy/web/purchase?address=${this.address}&reward_id=${id}&season_id=3`
      )
        .then(res => res.json())
        .then(res => {
          return res;
        })
        .catch(err => {
          Toast(err, {}, ERROR);
        });
      const transactionFee = toBNSafe(transaction.value).add(
        toBNSafe(transaction.gas).mul(toBNSafe(this.gasPrice))
      );
      if (toBNSafe(transactionFee).gt(toBNSafe(this.balanceInWei))) {
        Toast('Not enough balance!', {}, ERROR);
        return;
      }

      this.web3.eth
        .sendTransaction(transaction)
        .then(() => {
          Toast('Succesfully minted NFT!', {}, SUCCESS);
          this.loaders[id] = false;
        })
        .catch(err => {
          this.loaders[id] = false;
          this.instance.errorHandler(err.message ? err.message : err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}

.more-mew-universe {
  color: #5a678a;
}

.nft-image {
  width: 144px;
  height: 144px;
  border: 1px solid rgba(95, 99, 104, 0.1);
  border-radius: 6px;
}

.button-background {
  background-color: #f2fafa;
}
</style>
