<template>
  <div class="pa-3">
    <!--
    ===================================================
    Staked MEW Stepper
    ===================================================
    -->
    <mew-stepper :items="stepperItems" :on-step="onStep" @onContinue="nextStep">
      <!--
    ===================================================
    Step 1: Select Amount 
    ===================================================
    -->
      <template v-if="onStep === 1" #stepperContent1>
        <step-one-amount :current-apr="currentApr" @onContinue="nextStep" />
      </template>
      <!--
    ===================================================
    Step 2: Generate ETH2 Address
    ===================================================
    -->
      <template v-if="onStep === 2" #stepperContent2>
        <step-two-generate
          :skipped="skipped"
          @onContinue="nextStep"
          @back="back"
        />
      </template>
      <!--
    ===================================================
    Step 3: Upload Keystore file
    ===================================================
    -->
      <template v-if="onStep === 3" #stepperContent3>
        <step-three-upload
          :skipped="skipped"
          :address="address"
          @onContinue="nextStep"
          @back="back"
        />
      </template>
      <!--
    ===================================================
    Step 4: Review & Stake
    ===================================================
    -->
      <template v-if="onStep === 4" #stepperContent4>
        <step-four-review
          :amount="amount"
          :eth2-address="address"
          :start-provision="startProvision"
          :polling-status="pollingStatus"
          @readyToStake="readyToStake"
          @back="back"
        />
      </template>
    </mew-stepper>
  </div>
</template>

<script>
import StepOneAmount from './staked-steps/StepOneAmount';
import StepTwoGenerate from './staked-steps/StepTwoGenerate';
import StepFourReview from './staked-steps/StepFourReview';
import StepThreeUpload from './staked-steps/StepThreeUpload';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';

export default {
  components: {
    StepOneAmount,
    StepTwoGenerate,
    StepThreeUpload,
    StepFourReview
  },
  props: {
    currentApr: {
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
  },
  data() {
    return {
      amount: 0,
      onStep: 1,
      stepperItems: [
        {
          step: 1,
          name: 'Stake Amount'
        },
        {
          step: 2,
          name: 'Generate Eth2 address'
        },
        {
          step: 3,
          name: 'Upload keystore file'
        },
        {
          step: 4,
          name: 'Review & stake'
        }
      ],
      skipped: false,
      address: ''
    };
  },
  watch: {
    onStep(newStep) {
      if (newStep == 2) {
        this.$router.push({ name: ROUTES_WALLET.STAKED_2.NAME });
      } else if (newStep == 3) {
        this.$router.push({ name: ROUTES_WALLET.STAKED_3.NAME });
      } else if (newStep == 4) {
        this.$router.push({ name: ROUTES_WALLET.STAKED_4.NAME });
      } else {
        this.$router.push({ name: ROUTES_WALLET.STAKED.NAME });
      }
    }
  },
  mounted() {
    if (this.$route.name == ROUTES_WALLET.STAKED.NAME)
      this.$router.push({ name: ROUTES_WALLET.STAKED_1.NAME });
  },
  methods: {
    /**
     * Sets the correct values and continues to next step
     */
    nextStep(obj) {
      switch (obj.onStep) {
        case 1:
          this.amount = obj.amount;
          break;
        case 2:
          this.address = obj.address;
          this.skipped = obj.isSkipped;
          break;
        case 3:
          this.address = obj.address;
          break;
        default:
          break;
      }
      this.onStep += 1;
    },
    /**
     * Goes back a step
     */
    back() {
      this.onStep -= 1;
    },
    /**
     * Emits 'readyToStake' to trigger send transaction
     * and reset the page
     */
    readyToStake() {
      this.$emit('readyToStake', this.amount);
    },
    // eslint-disable-next-line
    reset() {
      this.nextStep({ onStep: 1, amount: this.amount });
    }
  }
};
</script>
