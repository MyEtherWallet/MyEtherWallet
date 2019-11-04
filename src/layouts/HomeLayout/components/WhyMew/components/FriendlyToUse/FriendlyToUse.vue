<template>
  <div>
    <LinkBox>
      <div class="">
        <v-img
          class="white--text align-end"
          height="150px"
          contain
          src="@/assets/images/Etc/LandingPage/friendly.svg"
        >
        </v-img>
      </div>
      <div>Friendly to use</div>
      <div>
        Access the Ethereum blockchain's original and most-trusted wallet
        client, now with a host of new features all contained in an elegant,
        easy and friendly interface.
      </div>
      <div>
        <v-btn color="orange" text>
          Explore
        </v-btn>
      </div>
    </LinkBox>
  </div>
</template>

<script>
import LinkBox from '../Common/LinkBox';

export default {
  name: 'FriendlyToUse',
  components: { LinkBox }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables';
</style>
