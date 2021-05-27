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
            <mew-stepper :items="stepperItems" :on-step="currentStepIdx">
              <template v-if="isStepActive(0)" #stepperContent1>
                <step-one :next="nextStep" @completed="proceed" />
              </template>
              <template v-if="isStepActive(1)" #stepperContent2>
                <step-two :back="backStep" :next="nextStep" @completed="proceed" />
              </template>
              <template v-if="isStepActive(2)" #stepperContent3>
                <step-three :details="details" :back="backStep" :next="nextStep" @completed="proceed" />
              </template>
              <template v-if="isStepActive(3)" #stepperContent4>
                <step-four :details="details"  @completed="proceed" />
              </template>
              <template v-if="isStepActive(4)" #stepperContent5>
                <step-five
                  :amt="details.amount ? details.amount : 0"
                  :hash="txHash"
                  @completed="proceed"
                />
              </template>
            </mew-stepper>
<!--            <Stepper
              :steps="steps"
              :details="details"
              :set-data="setData"
              :tx-hash="txHash"
              :reset-stepper="resetStepper"
              @complete-step="completeStep"
              @active-step="isStepActiveIdx"
              @stakeEth2="startProvision"
              @sendTransaction="sendTransaction"
              @reset="reset"
              @resetStepperDone="resetStepperDone"
            >
            </Stepper>-->
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
</template>

<script>
import TheWrapperDapp from '@/core/components/TheWrapperDapp';
// import Staked from './handlers/staked';
// import Stepper from './stepper/Stepper';
import stakedLogo from '@/assets/images/icons/staked.png';
import stakeConfigs from './handlers/configs';
import axios from 'axios';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import { mapGetters, mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import calculateEth2Rewards from './handlers/helpers';
import stepOne from './stepper/steps/SetAmount/SetAmount';
import stepTwo from './stepper/steps/Upload/Upload';
import stepThree from './stepper/steps/Review/Review';
import stepFour from './stepper/steps/InProgress/InProgress';
import stepFive from './stepper/steps/Done/Done';

export default {
  name: 'ModuleStaked',
  components: {
    TheWrapperDapp,
    stepOne,
    stepTwo,
    stepThree,
    stepFour,
    stepFive
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
      ],
      currentStep: { index: '0' },
      previousStep: {},
      nextButton: {},
      canContinue: false,
      finalStep: false
    };
  },
  computed: {
    ...mapState('wallet', ['balance', 'web3', 'address']),
    ...mapGetters('global', ['network', 'gasPrice'])
  },
  watch: {
    resetStepper: {
      handler: function (val) {
        if (val === true) {
          this.init();
          this.previousStep = {};
          this.$emit('resetStepperDone');
        }
      },
      deep: true,
      immediate: true
    },
    currentStep: {
      handler: function (newVal, oldVal) {
        if (newVal.index === 0 && oldVal.index === 4) {
          this.reset();
        }
      },
      deep: true,
      immediate: true
    },
    txHash(val) {
      if (val && val !== '') {
        this.nextStepAction();
      }
    }
  },
  created() {
    this.init();
  },
  mounted() {
    // this.staked = new Staked();
    this.setup();
  },
  methods: {
    setup() {
      console.log('setup'); // todo remove dev item
      this.eth2ContractAddress =
        stakeConfigs.network[this.network.type.name].depositAddress;
      this.endpoint = stakeConfigs.network[this.network.type.name].endpoint;
      this.batchContract =
        stakeConfigs.network[this.network.type.name].batchContract;

      this.web3.eth
        .getBalance(this.eth2ContractAddress)
        .then(res => {
          const raw = this.web3.utils.fromWei(res, 'ether');
          this.totalStaked = new BigNumber(raw).toFormat(0);
          this.apr = new BigNumber(calculateEth2Rewards({ totalAtStake: raw }))
            .times(100)
            .toFixed(2);
        })
        .catch(err => {
          Toast(err, ERROR);
        });
      console.log('endpoint', this.endpoint); // todo remove dev item
      this.getValidators();
    },
    validatorsCount() {
      if (this.details.amount) {
        return new BigNumber(this.details.amount).dividedBy(32).toFixed();
      }
      return 0;
    },
    async getValidators() {
      this.loadingValidators = true;
      await axios
        .get(`${this.endpoint}/history?address=${this.address}`, {
          header: {
            'Content-Type': 'application/json'
          }
        })
        .then(resp => {
          this.myValidators = resp.data;
          this.loadingValidators = false;
        })
        .catch(err => {
          this.loadingValidators = false;
          this.myValidators = [];
          if (
            err.response &&
            err.response.status === 404 &&
            err.response.data.msg === 'No matching history found'
          ) {
            return;
          }
          Toast(err, ERROR);
        });
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
    goToGenerate() {
      this.$router.push('/generate-eth2-keystore');
    },
    async startProvision() {
      const params = {
        address: this.address,
        withdrawalKey: this.details.address,
        validatorsCount: this.validatorsCount
      };
      await axios
        .post(this.endpoint + '/provision', params, {
          header: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          response && response.data.provisioning_request_uuid
            ? this.startPolling(response.data.provisioning_request_uuid)
            : Toast(this.$t('dappsStaked.error-try-again'), {}, ERROR);
        })
        .catch(err => {
          Toast(err, {}, ERROR);
        });
    },
    startPolling(uuid) {
      let prevReqComplete = true;
      const interval = setInterval(() => {
        if (!prevReqComplete) return;
        prevReqComplete = false;
        axios
          .get(`${this.endpoint}/status?provisioning_request_uuid=${uuid}`, {
            header: {
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            prevReqComplete = true;
            if (
              response &&
              response.data &&
              response.data.raw.length === parseInt(this.validatorsCount())
            ) {
              const validatorStaked = this.details.amount / 32;
              if (this.details.hasOwnProperty('currentValidatorsStaked')) {
                this.details.currentValidatorsStaked = validatorStaked;
              } else {
                this.$set(
                  this.details,
                  'currentValidatorsStaked',
                  validatorStaked
                );
              }

              if (this.details.hasOwnProperty('totalValidators')) {
                this.details.totalValidators = validatorStaked;
              } else {
                this.$set(this.details, 'totalValidators', validatorStaked);
              }
              this.transactionData = response.data.transaction;
              clearInterval(interval);
            }
          })
          .catch(err => {
            prevReqComplete = true;
            if (
              err.response &&
              err.response.status === 424 &&
              err.response.data.msg ===
                'Not all validators have been provisioned'
            ) {
              if (this.details.hasOwnProperty('currentValidatorsStaked')) {
                this.details.currentValidatorsStaked =
                  err.response.data.current;
              } else {
                this.$set(
                  this.details,
                  'currentValidatorsStaked',
                  err.response.data.current
                );
              }

              if (this.details.hasOwnProperty('totalValidators')) {
                this.details.totalValidators = err.response.data.total;
              } else {
                this.$set(
                  this.details,
                  'totalValidators',
                  err.response.data.total
                );
              }

              return;
            }
            if (
              err.response &&
              err.response.status === 404 &&
              err.response.data.msg ===
                'Requested provisioning_request_uuid not found'
            )
              return;
            Toast(err, {}, ERROR);
          });
      }, 5000);
    },
    sendTransaction() {},
    setData(data) {
      if (this.details.hasOwnProperty(data.key)) {
        this.details[data.key] = data.value;
      } else {
        this.$set(this.details, data.key, data.value);
      }
      console.log('this.details', this.details); // todo remove dev item
    },
    completeStep(payload) {
      this.steps.forEach(step => {
        if (step.name === payload.name) {
          step.completed = true;
        }
      });
    },
    isStepActiveIdx(payload) {
      this.currentStepIdx = payload.index;
      this.steps.forEach(step => {
        if (step.name === payload.name) {
          if (step.completed === true) {
            step.completed = false;
          }
        }
      });
    },
    isStepActive(index) {
      if (this.currentStep.index === index) {
        return true;
      }
      return false;
    },
    activateStep(index) {
      if (this.steps[index]) {
        this.previousStep = this.currentStep;
        this.currentStep = {
          name: this.steps[index].name,
          index: index
        };
        if (index + 1 === this.steps.length) {
          this.finalStep = true;
        } else {
          this.finalStep = false;
        }
      }
      this.$emit('active-step', this.currentStep);
    },
    nextStepAction() {
      this.nextButton[this.currentStep.name] = true;
      console.log(this.canContinue); // todo remove dev item
      if (this.canContinue) {
        const currentIndex =
          this.currentStep.index === 4 ? 0 : this.currentStep.index + 1;
        this.activateStep(currentIndex);
      }
      this.canContinue = false;
      this.$forceUpdate();
    },
    nextStep() {
      console.log('nextStep'); // todo remove dev item
      if (this.currentStep.index === 2) {
        this.startProvision();
        // this.$emit('stakeEth2');
      }
      if (this.currentStep.index === 3) {
        this.$emit('sendTransaction');
        return;
      }
      if (!this.$listeners || !this.$listeners['before-next-step']) {
        this.nextStepAction();
      }
      this.canContinue = false;
    },
    backStep() {
      const currentIndex = this.currentStep.index - 1;
      if (currentIndex >= 0) {
        this.activateStep(currentIndex, true);
      }
    },
    proceed(canContinue, param, ethPrice) {
      console.log(canContinue, param, ethPrice); // todo remove dev item
      this.canContinue = canContinue;
      this.setData(param);
      if (ethPrice) {
        this.setData({ key: 'ethPrice', value: ethPrice });
      }
    },
    init() {
      // Initiate stepper
      this.activateStep(0);
      this.canContinue = false;
      this.steps.forEach(step => {
        this.nextButton[step.name] = false;
      });
    }
  }
};
</script>

<style scoped></style>
