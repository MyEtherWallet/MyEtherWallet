<template>
  <div class="web-detected-container">
    <img :src="alien" />
    <p>
      We've detected other Web3 applications (a wallet browser extension, i.e.
      MetaMask) running in the background. In order for MEW CX to function
      properly, please make sure all other Web3 instances are closed.
    </p>
  </div>
</template>
<script>
import alien from '@/assets/images/icons/alien-spaceship.svg';
export default {
  data() {
    return {
      alien: alien
    };
  }
};
</script>
<style lang="scss" scoped>
@import 'Web3DetectedContainer.scss';
</style>
