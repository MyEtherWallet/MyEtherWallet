<template>
  <SuperButton
    :to="{ name: 'HomeCreateWalletMewConnect', query: { step: '1' } }"
  >
    <div class="d-flex">
      <div class="pr-9">
        <div class="d-flex align-center mb-2">
          <h4 class="mr-2 font-weight-bold">Get MEWwallet</h4>
          <mew6-icon-secure />
        </div>
        <p>
          MEW Brings a hardware wallet style security to your iOS or Android
          smartphone, helping you to secure your funds as never before.
        </p>
        <div class="mt-6">
          <img
            height="30"
            src="@/assets/images/icons/button-app-store.png"
            alt="Apple store"
            class="mr-1"
          />
          <img
            height="30"
            src="@/assets/images/icons/button-play-store.png"
            alt="Apple store"
            class="mr-1"
          />
          <img
            height="30"
            src="@/assets/images/icons/button-samsung.png"
            alt="Apple store"
          />
        </div>
      </div>
      <div class="side-image">
        <img
          height="170"
          src="@/assets/images/snippets/mobile/mobile-mewconnect-no-hardware.png"
          alt="MEW wallet"
        />
      </div>
    </div>
  </SuperButton>
</template>

<script>
import SuperButton from '@/web/components/Buttons/SuperButton';
export default {
  components: { SuperButton },
  data: () => ({})
};
</script>

<style lang="scss" scoped>
.side-image {
  margin-bottom: -46px;
}
</style>
