<template>
  <div>
    <mew-super-button
      class="mb-1"
      color-theme="basic"
      title="Get MEWwallet"
      subtitle="Still stick on MEWconnect? Fully fledged new MEWwallet App is now
              available."
      :right-icon="require('@/assets/images/snippets/bg-mew-wallet.png')"
      :title-icon="require('@/assets/images/icons/icon-mew-cx.png')"
    />

    <a
      href="https://www.mewwallet.com/"
      target="_blank"
      class="display--block text-decoration--none"
    >
      <mew6-flexible-btn nopadding>
        <div class="d-flex bg pa-10 border-radius--10px">
          <div>
            <div class="d-flex align-center mb-2">
              <h4 class="mr-2 white--text font-weight-bold">Get MEWwallet</h4>
              <mew6-icon-secure color="white" />
            </div>
            <div class="white--text">
              Still stick on MEWconnect? Fully fledged new MEWwallet App is now
              available.
            </div>
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
          <div class="side-image position--relative">
            <img
              height="160"
              src="@/assets/images/snippets/bg-mew-wallet.png"
              alt="MEWwallet"
            />
          </div>
        </div>
      </mew6-flexible-btn>
    </a>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => ({})
};
</script>

<style lang="scss" scoped>
.side-image {
  width: 300px;
  img {
    position: absolute;
    right: 0px;
    bottom: -40px;
  }
}
.bg {
  background: linear-gradient(90deg, #24a2ca 0%, #32bfa5 100%);
}
</style>
