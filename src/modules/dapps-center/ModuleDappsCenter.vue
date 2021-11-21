<template>
  <!--
    =====================================================================================
      Dapp Center Module
    =====================================================================================
    -->
  <the-wrapper-dapp
    :banner-img="bannerImage"
    :banner-text="bannerText"
    no-back-btn
  >
    <template #moduleBody>
      <div class="swap-not-available">
        <app-user-msg-block message="sdfsdfsdfsdf" />
      </div>
    </template>
  </the-wrapper-dapp>
</template>

<script>
import { mapGetters } from 'vuex';
import TheWrapperDapp from '@/core/components/TheWrapperDapp';
import bannerImage from '@/assets/images/backgrounds/bg-dapps-center.png';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import AppUserMsgBlock from '@/core/components/AppUserMsgBlock';
export default {
  components: { TheWrapperDapp, AppUserMsgBlock },
  mixins: [handlerAnalytics],
  data() {
    return {
      bannerImage: bannerImage,
      bannerText: {
        title: 'Explore DApps'
      }
    };
  },
  computed: {
    ...mapGetters('global', ['network'])
  }
};
</script>
