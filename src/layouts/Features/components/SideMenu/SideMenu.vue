<template>
  <div class="component--sidemenu px-5 py-7">
    <div class="mb-4">
      <router-link :to="{ name: 'Features' }">
        <img width="120" src="@/assets/images/Common/logo-light.png" />
      </router-link>
    </div>
    <WalletCard />
  </div>
</template>

<script>
import WalletCard from './components/WalletCard';

export default {
  components: { WalletCard }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';

.component--sidemenu {
  position: relative;
  height: 100%;
  width: 300px;
  background-color: $dark-sacramento;
  color: white;
}
</style>
