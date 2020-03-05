<template>
  <div class="d-flex align-center pt-4 pb-4 px-4">
    <div class="d-flex align-center">
      <img class="mr-3" src="@/assets/images/icons/mew/icon-puppy-mew.svg" />
      <div>
        <div class="font-weight-bold">MEWtopia</div>
        <div>
          Find out what Crypto Wallets is and learn to use MEW securly by using
          many different mobile wallets.
          <a href="#">Read...</a>
        </div>
      </div>
    </div>
    <div class="ml-auto d-flex align-center">
      <MEWconnect class="mr-4" />
      <Notifications />
    </div>
  </div>
</template>

<script>
import Notifications from '@/layouts/Features/components/Header/components/Notifications';
import MEWconnect from '@/layouts/Features/components/Header/components/MEWconnect';

export default {
  components: { Notifications, MEWconnect }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';

a {
  text-decoration: none;
  color: $emerald !important;
  font-weight: 500;
}
</style>
