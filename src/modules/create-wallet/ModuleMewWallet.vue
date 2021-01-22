<template>
  <a href="https://www.mewwallet.com/" target="_blank">
    <mew-super-button
      btn-mode="large-right-image"
      class="mb-5"
      color-theme="basic"
      title="Get MEW wallet App"
      subtitle="Download our official app and connect to MEW web using your mobile phone. Available on iOS and Android."
      title-mdi-icon="mdi-shield-check"
      title-icon-class="primary--text"
    >
      <template #contentBelowTitle>
        <div class="mt-6">
          <img
            src="@/assets/images/icons/button-app-store.png"
            alt="Apple app store"
            style="height: 30px"
            class="mr-2"
          />
          <img
            src="@/assets/images/icons/button-play-store.png"
            alt="Google play store"
            style="height: 30px"
          />
        </div>
      </template>
      <template #contentRight>
        <img
          class="mew-wallet-img"
          src="@/assets/images/snippets/bg-mew-wallet.png"
          alt="MEWwallet"
          style="height: 190px"
        />
      </template>
    </mew-super-button>
  </a>
</template>
<script>
import MewSuperButton from '@/components/mewSuperButton/MewSuperButton';

export default {
  name: 'ModuleMewWallet',
  components: {
    MewSuperButton
  }
};
</script>
