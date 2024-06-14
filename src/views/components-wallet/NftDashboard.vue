<template>
  <white-sheet :sideinfo="!mobile">
    <div class="px-5 px-lg-7 py-5">
      <div class="mew-heading-2">MEW exclusive holiday NFTs</div>
      <a
        class="mew-heading-4 d-flex align-center py-2 more-mew-universe"
        href="https://www.myetherwallet.com/blog/join-us-in-the-mew-universe/"
        target="_blank"
        @click="() => trackNftModule('Mewtopia')"
      >
        More about MEW universe
        <v-icon color="#5A678A"> mdi-chevron-right </v-icon>
      </a>
      <div
        v-if="loading"
        class="single-mint-section d-flex align-center justify-space-around justify-md-space-between my-2 flex-wrap text-center"
      >
        <div class="image-container">
          <div class="nft-image mb-2">
            <v-skeleton-loader
              :height="imageContainerWidth"
              :width="imageContainerWidth"
              type="image"
            />
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
        <div class="image-container">
          <div class="nft-image mb-2">
            <v-skeleton-loader
              :height="imageContainerWidth"
              :width="imageContainerWidth"
              type="image"
            />
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
        class="single-mint-section d-flex align-center justify-space-around justify-md-space-between my-2 flex-wrap text-center"
      >
        <div
          v-for="item in singlePaidItems"
          :key="item.description + item.title"
          class="image-container"
        >
          <img :src="item.url" :alt="item.title" class="mb-2 nft-image" />
          <mew-button
            :loading="loading || loaders[item.reward_id]"
            :disabled="loading"
            has-full-width
            :title="`Mint · ${item.pricef} ETH`"
            btn-size="small"
            :btn-style="
              loading ? 'outline' : darkMode ? 'outline' : 'transparent'
            "
            :class="loading ? '' : darkMode ? '' : 'button-background'"
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
          :btn-style="darkMode ? 'light' : 'primary'"
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

<script setup>
import { ref, computed, onMounted } from 'vue';
import { isEmpty } from 'lodash';

import { Toast, ERROR, SUCCESS } from '@/modules/toast/handler/handlerToast';
import { fromBase } from '@/core/helpers/unit';
import { toBNSafe } from '@/core/helpers/numberFormatHelper';
import { useAmplitude } from '@/core/composables/amplitude';
import { useVuetify } from '@/core/composables/vuetify';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';

// injections/use
const { darkMode, gasPrice } = useGlobalStore();
const { address, web3, instance, balanceInWei } = useWalletStore();
const { trackNftModule } = useAmplitude();
const vuetify = useVuetify();

// props
defineProps({
  mobile: {
    type: Boolean,
    default: false
  }
});

// data
const loading = ref(true);
const fetchedData = ref(true);
const loaders = ref({
  seasons_3_exclusive_nft_1: false,
  season_3_exclusive_nft_2: false,
  season_3_exclusive_nfts: false
});

const mintBothText = computed(() => {
  return !isEmpty(fetchedData.value)
    ? `Mint both NFTs · ${fetchedData.value.rewards[2].pricef} ETH`
    : '';
});

const mintBothId = computed(() => {
  return !isEmpty(fetchedData.value)
    ? fetchedData.value.rewards[2].reward_id
    : '';
});

const singlePaidItems = computed(() => {
  return !isEmpty(fetchedData.value)
    ? fetchedData.value.rewards.slice(0, 2).reverse()
    : [];
});
const imageContainerWidth = computed(() => {
  return vuetify.breakpoint.xsAndDown
    ? '144px'
    : vuetify.breakpoint.lgAndUp
    ? '144px'
    : vuetify.breakpoint.smAndDown
    ? '250px'
    : '276px';
});

// mounted
onMounted(() => {
  fetch('https://mainnet.mewwallet.dev/energy/web/info')
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
      fetchedData.value = response;
      loading.value = false;
    })
    .catch(err => {
      Toast(err, {}, ERROR);
    });
});
// methods
const mint = async id => {
  trackNftModule('Mint', {
    item: id
  });
  loaders.value[id] = true;
  const { transaction } = await fetch(
    `https://mainnet.mewwallet.dev/energy/web/purchase?address=${address.value}&reward_id=${id}&season_id=3`
  )
    .then(res => res.json())
    .then(res => {
      return res;
    })
    .catch(err => {
      Toast(err, {}, ERROR);
    });
  const transactionFee = toBNSafe(transaction.value).add(
    toBNSafe(transaction.gas).mul(toBNSafe(gasPrice.value))
  );
  if (toBNSafe(transactionFee).gt(toBNSafe(balanceInWei.value))) {
    loaders.value[id] = false;
    trackNftModule('MintNotEnoughBalance', {
      item: id
    });
    Toast('Not enough balance!', {}, ERROR);
    return;
  }

  web3.value.eth
    .sendTransaction(transaction)
    .then(() => {
      trackNftModule('MintSuccess', {
        item: id
      });
      Toast('Succesfully minted NFT!', {}, SUCCESS);
      loaders.value[id] = false;
    })
    .catch(err => {
      loaders.value[id] = false;
      trackNftModule('MintFailed', {
        item: id
      });
      instance.value.errorHandler(err.message ? err.message : err);
    });
};
</script>

<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}

.more-mew-universe {
  color: #5a678a;
}

.button-background {
  background-color: #f2fafa;
}

.image-container {
  width: 144px;

  .nft-image {
    width: 144px;
    height: 144px;
    border: 1px solid rgba(95, 99, 104, 0.1);
    border-radius: 6px;
  }
}

@media all and (max-width: 1264px) {
  .image-container {
    width: 276px;
    margin-top: 10px;

    .nft-image {
      width: 276px;
      height: 276px;
    }
  }
}

@media all and (max-width: 960px) {
  .image-container {
    max-width: 250px;
    width: 100%;
    margin-top: 10px;

    .nft-image {
      max-width: 250px;
      width: 100%;
      height: auto;
    }
  }
}
</style>
