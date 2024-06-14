<template>
  <!--
    ===================================================
    Step 4: Review & Stake
    ===================================================
    -->
  <div>
    <div class="mx-auto pb-3" style="max-width: 550px">
      <div class="mew-heading-2 py-8 text-center">Review and stake</div>
      <v-row dense>
        <!--
    ===================================================
    Stake details
    ===================================================
    -->
        <v-col
          v-for="(detail, idx) in details"
          :key="detail + idx"
          cols="12"
          sm="6"
        >
          <div class="greyLight pa-5 d-flex align-center rounded-lg">
            <div class="mr-3 mt-1">
              <img :src="detail.img" height="25" alt="eth icon" />
            </div>
            <div>
              <div
                class="textLight--text text-uppercase detail-subtitle font-weight-medium"
              >
                {{ detail.subtitle }}
              </div>
              <div class="mew-heading-4 detail-title">{{ detail.title }}</div>
              <mew-transform-hash
                v-if="detail.isAddress"
                class="mew-hash-container textLight--text font-weight-medium"
                :hash="detail.desc"
              />
              <div v-if="!detail.isAddress" class="textLight--text">
                {{ detail.desc }}
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
      <!--
    ===================================================
    Fees
    ===================================================
    -->
      <div class="mt-5">
        <div
          v-for="(fee, idx) in fees"
          :key="fee + idx"
          class="d-block d-sm-flex align-center justify-space-between mb-3 mb-sm-2"
        >
          <div class="mew-caption textLight--text">{{ fee.title }}</div>
          <div>
            {{ fee.ethValue }} <span class="textLight--text">ETH /</span>
            {{ fee.fiatValue }}
          </div>
        </div>
      </div>
      <!--
    ===================================================
    Terms & Conditions
    ===================================================
    -->
      <div class="mt-11 mt-sm-10 pa-5 greyLight">
        <mew-checkbox
          v-model="secondCondition"
          dense
          class-name="textMedium--text"
          label="I understand that staking involves slashing risks and my funds can be lost."
        />
        <mew-checkbox
          v-model="thirdCondition"
          dense
          class-name="textMedium--text"
        >
          <template #contentSlot>
            <span
              >I have read and agreed to
              <a href="https://staked.us/terms/" target="_blank">Staked.us</a>
              terms of service. This Staking feature is provided by Staked.us,
              and MEW is not liable for it's services.</span
            >
          </template>
        </mew-checkbox>
      </div>

      <border-block class="mt-6 mx-md-2 text-center rounded-lg pa-6">
        <!--
      ===================================================
      Prepare to stake (Step 1)
      ===================================================
      -->
        <div v-if="stakedStep === 1">
          <div
            :class="[
              'mx-auto',
              stakedStep1Title.error ? 'redPrimary--text' : 'textMedium--text'
            ]"
            style="max-width: 300px"
          >
            {{ stakedStep1Title.message }}
            <a
              v-if="stakedStep1Title.showContactSupport"
              rel="noopener noreferrer"
              class="cursor-pointer greenPrimary--text text-lowercase"
              href="mailto:support@myetherwallet.com"
              target="_blank"
            >
              {{ $t('common.contact-support') }}
            </a>
          </div>
          <mew-button
            btn-size="xlarge"
            class="mt-3"
            title="Prepare for staking"
            :disabled="!secondCondition || !thirdCondition"
            @click.native="prepareToStake"
          ></mew-button>
        </div>
        <!--
    ===================================================
    Preparing validators (Step 2)
    ===================================================
    -->
        <div v-if="stakedStep === 2">
          <div class="mew-heading-4 font-weight-medium mb-2">
            Preparing validators
          </div>
          <div class="textMedium--text mx-auto" style="max-width: 300px">
            This usually takes ~20 seconds, in rare cases it can take up to 10
            min.
          </div>
          <div class="px-5">
            <v-progress-linear
              style="max-width: 350px"
              class="mt-4 mx-auto"
              indeterminate
              color="greenPrimary"
            ></v-progress-linear>
          </div>
        </div>
        <!--
    ===================================================
    Ready to stake (Step 3)
    ===================================================
    -->
        <div v-if="stakedStep === 3">
          <v-icon color="greenPrimary" class="mr-2">mdi-check-circle</v-icon>
          Ready to stake
        </div>
      </border-block>
      <!--
    ===================================================
    Back & Stake buttons
    ===================================================
    -->
      <div
        class="mt-10 d-flex flex-column-reverse flex-md-row align-center justify-center"
      >
        <mew-button
          :has-full-width="$vuetify.breakpoint.smAndDown"
          btn-size="xlarge"
          class="d-block ma-2"
          title="Back"
          btn-style="outline"
          @click.native="onBack"
        />
        <mew-button
          :has-full-width="$vuetify.breakpoint.smAndDown"
          btn-size="xlarge"
          class="d-block ma-2"
          :title="buttonTitle"
          :disabled="!readyToStake"
          @click.native="onReadyToStake"
        >
        </mew-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import BigNumber from 'bignumber.js';

import { ABI_GET_FEES } from '@/dapps/staked-dapp/handlers/handlerStaked';
import { formatBalanceEthValue } from '@/core/helpers/numberFormatHelper';
import iconColorfulETH from '@/assets/images/icons/icon-colorful-eth.svg';
import configNetworkTypes from '@/dapps/staked-dapp/handlers/configNetworkTypes';
import { useAmplitude } from '@/core/composables/amplitude';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useExternalStore } from '@/core/store/external';

// injections/use
const { trackDapp } = useAmplitude();
const { network, getFiatValue, gasPrice } = useGlobalStore();
const { fiatValue } = useExternalStore();
const { web3 } = useWalletStore();

// emits
const emit = defineEmits(['back', 'readyToStake']);

// props
const props = defineProps({
  amount: {
    type: Number,
    default: 0
  },
  eth2Address: {
    type: String,
    default: ''
  },
  startProvision: {
    type: Function,
    default: () => {}
  },
  pollingStatus: {
    type: Object,
    default: () => {}
  }
});

// data
const secondCondition = ref(false);
const thirdCondition = ref(false);
const readyToStake = ref(false);
const serviceFees = ref({});
const stakedStep = ref(1);
const stakedStep1Title = ref({
  message:
    'We will prepare validators for you. After that you can confirm and stake your ETH.'
});

// computed
const buttonTitle = computed(() => {
  return `Stake ${props.amount} ETH`;
});
/**
 * Returns current network eth icon
 * @return string
 */
const networkImg = computed(() => {
  return network.value.type.icon;
});
/**
 * @returns array
 * Staking details to display (including amount and eth2 address)
 */
const details = computed(() => {
  return [
    {
      img: networkImg,
      subtitle: 'Staking',
      title: props.amount + ' ETH',
      desc: amountFiat.value
    },
    {
      img: iconColorfulETH,
      subtitle: 'Ethereum',
      title: 'Your withdrawal address',
      desc: props.eth2Address,
      isAddress: true
    }
  ];
});
/**
 * @returns array
 * Includes network, service fees, total
 */
const fees = computed(() => {
  return [
    {
      title: 'Network fee',
      ethValue: networkFees.value.eth,
      fiatValue: networkFees.value.fiat
    },
    {
      title: 'Service fee',
      ethValue: serviceFees.value.eth,
      fiatValue: serviceFees.value.fiat
    },
    {
      title: 'Total',
      ethValue: totalFees.value.eth,
      fiatValue: totalFees.value.fiat
    }
  ];
});
/**
 * @returns object
 * Network fees in ETH and fiat
 */
const networkFees = computed(() => {
  const gasPriceETH = formatBalanceEthValue(gasPrice.value).value;
  return {
    eth: gasPriceETH,
    fiat: getFiatValue(BigNumber(fiatValue.value).times(gasPriceETH))
  };
});
/**
 * @returns object
 * Total fees in ETH and fiat
 */
const totalFees = computed(() => {
  const totalETH = new BigNumber(networkFees.value.eth)
    .plus(serviceFees.value.eth)
    .toFixed();
  return {
    eth: totalETH,
    fiat: getFiatValue(new BigNumber(fiatValue.value).times(totalETH).toFixed())
  };
});
/**
 * @returns how many validators are needed to stake x amount of eth
 */
const validatorsCount = computed(() => {
  if (props.amount) {
    return new BigNumber(props.amount).dividedBy(32).toFixed();
  }
  return 0;
});
/**
 * @returns eth staking amount in fiat
 */
const amountFiat = computed(() => {
  return getFiatValue(new BigNumber(props.amount).times(fiatValue.value));
});

// watch
/**
 * Watches the status of polling
 * if successful -> then its ready to stake
 * else will error out
 */
watch(
  () => props.pollingStatus,
  newVal => {
    if (newVal.success) {
      stakedStep.value += 1;
      readyToStake.value = true;
    } else {
      stakedStep.value -= 1;
      if (
        newVal.error.status === 406 ||
        newVal.error.message?.includes('406')
      ) {
        stakedStep1Title.value = {
          message:
            'Oops. We don’t know how you got this far without enough ETH. Please start over and check your funds.',
          error: true
        };
      } else {
        stakedStep1Title.value = {
          message:
            'Something went wrong. Please try again in a few minutes. If the problem persists,',
          error: true,
          showContactSupport: true
        };
      }
    }
  }
);

// mounted
onMounted(() => {
  getServiceFees();
});

// methods
/**
 * @returns object
 * Gets service fees (calls contract and abi to get exact fee)
 */
const getServiceFees = async () => {
  const batchContract =
    configNetworkTypes.network[network.value.type.name].batchContract;
  const contract = new web3.value.eth.Contract(ABI_GET_FEES, batchContract);
  const feesWEI = await contract.methods.getFees(props.amount / 32).call();
  const feesETH = formatBalanceEthValue(feesWEI).value;
  serviceFees.value = {
    eth: feesETH,
    fiat: getFiatValue(BigNumber(fiatValue.value).times(feesETH))
  };
};
/**
 * Emits back to go to previous step
 */
const onBack = () => {
  emit('back');
};
/**
 * Start provisioning and polling (step 1: prepare to stake)
 */
const prepareToStake = () => {
  stakedStep.value += 1;
  trackDapp('StakedPrepareStake');
  props.startProvision({
    eth2Address: props.eth2Address,
    count: validatorsCount
  });
};
/**
 * Sends the transaction to confirm eth stake
 */
const onReadyToStake = () => {
  emit('readyToStake');
};
</script>

<style lang="scss" scoped>
.mew-hash-container {
  width: 160px;
}
.detail-subtitle {
  font-size: 0.714rem; //font-size: 10px
}
.detail-title {
  font-weight: 600;
}
</style>
