<template>
  <div>
    <the-wrapper-dapp
      :has-exit-btn="true"
      :banner-img="stakedLogo"
      :banner-text="{ title: 'staked', subtext: 'stake' }"
      :tab-items="tabs"
      :active-tab="activeTab"
    >
      <template #tabContent1>
        <v-sheet
          min-height="500px"
          max-width="700px"
          color="transparent"
          class="py-15 mx-auto"
        >
          <div class="mb-5">
            <div class="mew-heading-2 mb-8 ml-2">
              {{ $t('ens.search-domain') }}
            </div>
            <Stepper
              :steps="steps"
              :details="details"
              :set-data="setData"
              :tx-hash="txHash"
              :reset-stepper="resetStepper"
              @complete-step="completeStep"
              @active-step="isStepActive"
              @stakeEth2="startProvision"
              @sendTransaction="sendTransaction"
              @reset="reset"
              @resetStepperDone="resetStepperDone"
            >
            </Stepper>
            <!--            <v-row class="mx-0">
              <v-col class="pr-0" cols="12">
                stake
                <mew-stepper :items="stepperItems" :on-step="currentStepIdx">
                  <template v-if="currentStepIdx === 1" #stepperContent1>
                    <mew-input
                      :error-messages="domainTaken ? $t('ens.domain-taken') : null"
                      :value="name"
                      :has-clear-btn="true"
                      :rules="rules"
                      :label="$t('ens.register.domain-name')"
                      :placeholder="$t('ens.ph.three-char')"
                      class="mr-3 flex-grow-1"
                      @input="setName"
                    />
                  </template>
                  <template v-if="currentStepIdx === 2" #stepperContent2>
                  </template>
                  <template v-if="currentStepIdx === 3" #stepperContent3>
                  </template>
                  <template v-if="currentStepIdx === 4" #stepperContent4>
                  </template>
                  <template v-if="currentStepIdx === 5" #stepperContent5>
                  </template>
                </mew-stepper>
              </v-col>
            </v-row>-->
          </div>
        </v-sheet>
      </template>
      <template #tabContent2>
        <v-sheet
          min-height="500px"
          max-width="700px"
          color="transparent"
          class="py-15 mx-auto"
        >
          <div class="mb-5">
            <div class="mew-heading-2 mb-8 ml-2">
              {{ $t('ens.search-domain') }}
            </div>
            <v-row class="mx-0">
              <v-col class="pr-0" cols="8"> status </v-col>
              <v-col class="pl-0" cols="4"> status </v-col>
            </v-row>
          </div>
        </v-sheet>
      </template>
    </the-wrapper-dapp>
  </div>
  <!--  <div class="staked-wrapper">
    <div class="header-container d-flex">
      <back-button class="button-container" :title="$t('common.exit-dapp')">
        <template #center>
          <div class="d-flex">
            <div
              :class="['tab-btn', !activeValidatorsTab ? 'active-tab' : '']"
              @click="activeValidatorsTab = !activeValidatorsTab"
            >
              {{ $t('dappsStaked.stake') }}
            </div>
            <div
              :class="[
                'tab-btn',
                'validators-btn',
                activeValidatorsTab ? 'active-tab' : ''
              ]"
              @click="activeValidatorsTab = !activeValidatorsTab"
            >
              {{ $t('dappsStaked.status') }}
            </div>
          </div>
        </template>
        <template #right>
          <div class="d-flex stats-wrapper">
            <div class="d-flex stats-container">
              <i
                v-if="!apr"
                class="fa fa-spinner fa-spin staking-percent mb-1"
              />
              <span v-if="apr" class="staking-percent">{{ apr }}%</span>
              <span>{{ $t('dappsStaked.current-stake-title') }}</span>
            </div>
            <div class="d-flex stats-container px-3">
              <i
                v-if="!totalStaked"
                class="fa fa-spinner fa-spin total-eth-percent mb-1"
              />
              <span v-if="totalStaked" class="total-eth-percent">{{
                totalStaked
              }}</span>
              <span>{{ $t('dappsStaked.total-eth-title') }}</span>
            </div>
          </div>
        </template>
      </back-button>
    </div>
    <div v-if="!activeValidatorsTab">
      <div class="about-container">
        <img :src="stakedLogo" height="20px" alt="Staked Logo" />
        <p class="pt-2">{{ $t('dappsStaked.about') }}</p>
      </div>
      <stepper
        :steps="steps"
        :details="details"
        :set-data="setData"
        :tx-hash="txHash"
        :reset-stepper="resetStepper"
        @complete-step="completeStep"
        @active-step="isStepActive"
        @stakeEth2="startProvision"
        @sendTransaction="sendTransaction"
        @reset="reset"
        @resetStepperDone="resetStepperDone"
      />

      <div v-if="currentStepIdx === 0" class="warning-container d-flex">
        <div><i class="fa fa-exclamation-triangle" /></div>
        <div>
          <span>{{ $t('dappsStaked.generate-address.attention') }}</span>
          <p class="warning mt-2">{{ $t('dappsStaked.warning') }}</p>
        </div>
      </div>
    </div>
    &lt;!&ndash;    <staked-status&ndash;&gt;
    &lt;!&ndash;      v-if="activeValidatorsTab"&ndash;&gt;
    &lt;!&ndash;      :network="network.type.name"&ndash;&gt;
    &lt;!&ndash;      :loading="loadingValidators"&ndash;&gt;
    &lt;!&ndash;      :validators="myValidators"&ndash;&gt;
    &lt;!&ndash;    />&ndash;&gt;
  </div>-->
</template>

<script>
import TheWrapperDapp from '@/core/components/TheWrapperDapp';
import Staked from './handlers/staked';
import Stepper from './stepper/Stepper';
import stakedLogo from '@/assets/images/icons/staked.png';
export default {
  name: 'ModuleStaked',
  components: {
    TheWrapperDapp,
    Stepper
  },
  data() {
    return {
      activeTab: 0,
      staked: {},
      myValidators: [],
      transactionData: {},
      details: {},
      totalStaked: '',
      apr: '',
      eth2ContractAddress: '',
      endpoint: '',
      batchContract: '',
      txHash: '',
      currentStepIdx: 0,
      resetStepper: false,
      stakedLogo: stakedLogo,
      loadingValidators: true,
      activeValidatorsTab: false,
      tabs: [{ name: 'stake' }, { name: 'status' }],
      stepperItems: [
        {
          step: 1,
          name: 'Stake Amount'
        },
        {
          step: 2,
          name: 'Upload your Keystore File'
        },
        {
          step: 3,
          name: 'Review & Enable'
        },
        {
          step: 4,
          name: 'Stake on Eth2'
        },
        {
          step: 5,
          name: 'Done'
        }
      ],
      steps: [
        {
          name: 1,
          title: '1', //this.$t('dappsStaked.steps.1'),
          completed: false
        },
        {
          name: 2,
          title: '2', //this.$t('dappsStaked.steps.2'),
          completed: false
        },
        {
          name: 3,
          title: '3', //this.$t('dappsStaked.steps.3'),
          completed: false
        },
        {
          name: 4,
          title: '4', //this.$t('dappsStaked.steps.4'),
          completed: false
        },
        {
          name: 5,
          title: '5', //this.$t('dappsStaked.steps.5'),
          completed: false
        }
      ]
    };
  },
  mounted() {
    this.staked = new Staked();
  },
  methods: {
    async getValidators() {
      return this.staked.validatorsCount();
    },
    resetStepperDone() {
      this.resetStepper = false;
    },
    reset() {
      this.transactionData = {};
      this.details = {};
      this.totalStaked = '';
      this.apr = '';
      this.resetStepper = true;
      this.eth2ContractAddress = '';
      this.endpoint = '';
      this.batchContract = '';
      this.setup();
    },
    setup() {},
    goToGenerate() {
      this.$router.push('/generate-eth2-keystore');
    },
    async startProvision() {},
    startPolling(uuid) {},
    sendTransaction() {},
    setData(data) {
      if (this.details.hasOwnProperty(data.key)) {
        this.details[data.key] = data.value;
      } else {
        this.$set(this.details, data.key, data.value);
      }
    },
    completeStep(payload) {},
    isStepActive(payload) {}
  }
};
</script>

<style scoped></style>
