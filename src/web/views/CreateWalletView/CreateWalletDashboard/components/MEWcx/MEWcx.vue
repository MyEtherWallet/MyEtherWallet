<template>
  <SuperButton
    :to="{ name: 'HomeCreateWalletMewConnect', query: { step: '1' } }"
  >
    <div class="d-flex align-center">
      <div class="pr-9">
        <div class="d-flex align-center mb-2">
          <h4 class="mr-2 font-weight-bold">MEW CX</h4>
          <mew6-icon-secure />
        </div>
        <div>
          MEWcx is a secure and convinient way to create and manage your wallet.
          Click here to download today.
        </div>
      </div>
      <div>
        <img
          height="90"
          src="@/assets/images/icons/icon-mew-cx.png"
          alt="MEWcx"
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

<style lang="scss" scoped></style>
