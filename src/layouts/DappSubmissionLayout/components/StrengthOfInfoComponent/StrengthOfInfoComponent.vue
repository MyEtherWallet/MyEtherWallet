<template>
  <div class="mt-5">
    <h4 class="text-left">Strength of Information</h4>
    <div class="strength-of-info-box mt-2">
      <div class="strength-of-info-wrapper">
        <div class="circle-wrapper">
          <div
            :class="
              lackOfInfo ? 'lack-of-info-progress' : 'good-strength-progress'
            "
            class="circle"
          ></div>
          <span
            :class="lackOfInfo ? 'lack-of-info-text' : 'good-strength-text'"
            class="strength-text"
          >
            {{ strengthOfInfo }}
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
            {{
              lackOfInfo
                ? 'Please provide all the required information marked “*” we need.'
                : 'Great! Your DApp information is good to submit.'
            }}
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
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'StrengthOfInfoComponent.scss';
</style>
