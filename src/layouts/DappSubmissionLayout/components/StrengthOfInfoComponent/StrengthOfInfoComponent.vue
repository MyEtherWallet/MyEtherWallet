<template>
  <div class="mt-5">
    <h4 class="text-left">Strength of Information</h4>
    <div class="strength-of-info-box mt-2">
      <div class="strength-of-info-wrapper">
        <div class="circle-wrapper">
          <div
            ref="circularProgressBar"
            :class="
              lackOfInfo ? 'lack-of-info-progress' : 'good-strength-progress'
            "
            class="circle"
          ></div>
          <span
            :class="lackOfInfo ? 'lack-of-info-text' : 'good-strength-text'"
            class="strength-text"
          >
            {{ strengthOfInfo + '%' }}
          </span>
        </div>
        <div class="text-wrapper">
          <h3
            :class="lackOfInfo ? 'lack-of-info-text' : 'good-strength-text'"
            class="mb-2"
          >
            {{ lackOfInfo ? 'Lack of Info' : 'Good Job!' }}
          </h3>
          <p class="info-text">
            {{ getStrengthText() }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    lackOfInfo: {
      type: Boolean,
      default: false
    },
    strengthOfInfo: {
      type: Number,
      default: 0
    }
  },
  watch: {
    strengthOfInfo(newVal) {
      this.$refs.circularProgressBar.style.setProperty(
        '--percentage',
        `${newVal * 3.6}deg`
      );
    }
  },
  mounted() {
    this.$refs.circularProgressBar.style.setProperty(
      '--percentage',
      `${this.strengthOfInfo * 3.6}deg`
    );
  },
  methods: {
    getStrengthText() {
      if (this.strengthOfInfo < 50) {
        return 'Please provide all the required information marked “*” we need.';
      } else if (this.strengthOfInfo === 100) {
        return 'Great! Your Dapp information is good to submit.';
      }
      return 'Almost there! Please provide all the required information marked “*” we need.';
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'StrengthOfInfoComponent.scss';
</style>
