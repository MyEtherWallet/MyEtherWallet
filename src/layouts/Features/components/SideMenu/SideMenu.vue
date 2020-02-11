<template>
  <div class="component--sidemenu px-4 py-7">
    <div class="mb-4">
      <router-link :to="{ name: 'Features' }">
        <img width="120" src="@/assets/images/Common/logo-light.png" />
      </router-link>
    </div>
    <WalletCard />
    <BuyEthButton class="mt-2" />
  </div>
</template>

<script>
import WalletCard from './components/WalletCard';
import BuyEthButton from './components/BuyEthButton';

export default {
  components: { WalletCard, BuyEthButton }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';

.component--sidemenu {
  position: relative;
  height: 100%;
  width: 300px;
  background-color: #022747;
  color: white;
}
</style>
