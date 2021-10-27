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
          <mew-button
            color-theme="backgroundGrey"
            btn-style="light"
            style="height: 160px"
            @click.native="routeTo(dapp.name)"
          >
            <div
              class="px-2 text-left d-flex align-center justify-space-between"
              :class="
                dapp.style === 'outline' ? 'white--text' : 'textDark--text'
              "
              style="width: 100%"
            >
              <div>
                <div class="mb-2 d-flex align-center">
                  <div class="mew-heading-3">{{ dapp.title }}</div>
                </div>
                <div class="break-word">
                  {{ dapp.subtitle }}
                </div>
                <div class="body-2 mt-1 tagLabel--text">{{ dapp.tag }}</div>
              </div>
              <div class="d-none d-sm-flex align-center pl-5">
                <mew-icon :icon-name="dapp.rightIcon" :img-height="80" />
              </div>
            </div>
          </mew-button>
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
  mounted() {
    console.log(this.dapps);
  },
  methods: {
    routeTo(name) {
      this.trackDapp(name);
      this.$router.push({ name: name });
    }
  }
};
</script>
