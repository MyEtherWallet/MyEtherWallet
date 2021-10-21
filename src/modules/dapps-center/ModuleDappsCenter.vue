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
    <template #content>
      <div class="mew-heading-1 px-4 mb-4">MEW DApps</div>
      <v-row>
        <v-col v-for="(dapp, key) in dapps" :key="key" cols="12" md="6" lg="4">
          <mew-super-button
            :cols-num="8"
            :title="dapp.title"
            :subtitle="dapp.subtitle"
            :tag="dapp.tag"
            :is-new="dapp.isNew"
            :title-icon-type="dapp.titleIconType"
            :title-icon="dapp.titleIcon"
            :right-icon-type="dapp.rightIconType"
            :right-icon="dapp.rightIcon"
            @click.native="routeTo(dappName(dapp))"
          />
        </v-col>
      </v-row>
      <v-row v-if="!dapps.length">
        <v-col cols="12" class="swap-not-available">
          <app-user-msg-block :message="noDappsAvailable" />
        </v-col>
      </v-row>
    </template>
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
import dappsMeta from '@/dapps/metainfo-dapps';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import AppUserMsgBlock from '@/core/components/AppUserMsgBlock';
export default {
  components: { TheWrapperDapp, AppUserMsgBlock },
  mixins: [handlerAnalytics],
  data() {
    return {
      bannerImage: bannerImage,
      bannerText: {
        title: 'Explore MEW DApps'
      },
      noDappsAvailable: {
        title: `DApps are are not supported on this network`,
        subtitle: 'Please select a different network'
      }
    };
  },
  computed: {
    ...mapGetters('global', ['network']),
    dapps() {
      return Object.values(dappsMeta).filter(val => {
        for (const n of val.networks) {
          if (n.name === this.network.type.name) return true;
        }
        return false;
      });
    }
  },
  methods: {
    routeTo(name) {
      this.trackDapp(name);
      this.$router.push({ name: name });
    },
    /**
     * defualtName is used to route to dapps that has defalt child route
     */
    dappName(dapp) {
      return dapp.name || dapp.defaultName;
    }
  }
};
</script>
