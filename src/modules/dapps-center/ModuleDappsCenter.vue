<template>
  <!-- ===================================================================================== -->
  <!-- Dapp Center Module -->
  <!-- ===================================================================================== -->
  <the-wrapper-wallet
    :total-left-col-items="1"
    :has-draggable="false"
    :total-right-col-items="1"
  >
    <template #leftColItem1>
      <the-wrapper-dapp
        :banner-img="bannerImage"
        :banner-text="bannerText"
        no-back-btn
      >
        <template #content>
          <div class="mew-heading-1 px-4 mb-4">MEW DApps</div>
          <v-row>
            <v-col v-for="(dapp, key) in dapps" :key="key" cols="12" lg="6">
              <mew-button
                color-theme="buttonGrayLight"
                btn-style="light"
                style="height: 173px"
                class="d-flex align-start pt-7"
                has-full-width
                @click.native="routeTo(dappName(dapp))"
              >
                <div
                  class="px-2 d-flex align-start"
                  :class="
                    dapp.style === 'outline' ? 'white--text' : 'textDark--text'
                  "
                  style="width: 100%"
                >
                  <img
                    :src="
                      require(`@/assets/images/icons/dapps/icon-dapp-${dapp.rightIcon.toLowerCase()}.svg`)
                    "
                    :alt="dapp.title"
                    height="60"
                    width="60"
                  />
                  <div class="ml-5">
                    <div
                      class="mb-2 d-flex align-center justify-start flex-row"
                    >
                      <div class="mew-heading-2">{{ dapp.title }}</div>
                      <v-icon
                        v-if="checkIfNew(dapp.release)"
                        size="24"
                        class="ml-1 redPrimary--text"
                      >
                        mdi-new-box
                      </v-icon>
                    </div>
                    <div class="text-left break-word" style="line-height: 19px">
                      {{ dapp.subtitle }}
                    </div>
                    <div class="body-2 mt-1 textLight--text text-left">
                      {{ dapp.tag }}
                    </div>
                  </div>
                </div>
              </mew-button>
            </v-col>
          </v-row>
          <v-row v-if="!dapps.length">
            <v-col cols="12" class="swap-not-available">
              <mew-alert
                theme="warning"
                hide-close-icon
                title="DApps are are not supported on this network"
                description="Please select a different network."
              />
            </v-col>
          </v-row>
        </template>
        <template #moduleBody>
          <div class="swap-not-available">
            <app-user-msg-block message="" />
          </div>
        </template>
      </the-wrapper-dapp>
    </template>
  </the-wrapper-wallet>
</template>

<script>
import { mapGetters } from 'vuex';
import bannerImage from '@/assets/images/backgrounds/bg-dapps-center.jpg';
import dappsMeta from '@/dapps/metainfo-dapps';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import isNew from '@/core/helpers/isNew.js';

export default {
  components: {
    TheWrapperDapp: () => import('@/dapps/TheWrapperDapp.vue'),
    TheWrapperWallet: () => import('@/views/components-wallet/TheWrapperWallet')
  },
  mixins: [handlerAnalytics],
  data() {
    return {
      bannerImage: bannerImage,
      bannerText: {
        title: 'Explore New DApps'
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
    },
    checkIfNew(release) {
      return isNew(release);
    }
  }
};
</script>

<style lang="scss">
.warning-container {
  padding: 10px;
  width: 100%;
  border-radius: 10px;
  border: 1px solid #05c0a5;
  color: #05c0a5;
  background-color: #ebfaf8;
}
</style>
