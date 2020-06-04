<template>
  <WhiteSheet>
    <mew-banner
      :text-obj="topBanner"
      :banner-img="BG"
      @closeBanner="closeBanner"
    />
    <div>
      <v-tabs v-model="tab" background-color="transparent" class="px-10 py-6">
        <v-tab class="text-transform--initial mew-heading-2">
          Register domain
        </v-tab>
        <v-tab class="text-transform--initial mew-heading-2">
          Manage domain
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <div class="py-12 tab-width">
            <BlockTitle title="Find your blockchain domain" />
            <div class="d-flex align-start">
              <mew-input
                :has-clear-btn="true"
                right-label=".ctypto"
                placeholder="Domain name"
                class="mr-2"
              />
              <mew-button
                :has-full-width="false"
                button-size="xlarge"
                title="Check availability"
              />
            </div>
          </div>
        </v-tab-item>
        <v-tab-item>
          <div class="py-12 px-12">
            <div class="d-flex align-center justify-space-between">
              <div class="mew-heading-1">My domains (1)</div>
              <mew-button
                button-size="xlarge"
                title="+Add your dowmain"
                :has-full-width="false"
              ></mew-button>
            </div>
            <div>
              <mew-expand-panel
                :is-toggle="true"
                :panel-items="[
                  { name: 'mewdev01.eth', tooltip: '', subtext: 'Expired' }
                ]"
              >
                <template v-slot:panelBody0>
                  <span>Panel slot example</span>
                </template>
              </mew-expand-panel>
              <mew-expand-panel
                :is-toggle="true"
                :panel-items="[
                  { name: 'mewdev01.eth', tooltip: '', subtext: '' }
                ]"
              >
                <template v-slot:panelBody0>
                  <span>Panel slot example</span>
                </template>
              </mew-expand-panel>
            </div>
          </div>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </WhiteSheet>
</template>

<script>
import BG from '@/assets/images/backgrounds/bg-ens.png';
import WhiteSheet from '@/web/components/Common/WhiteSheet';
import BlockTitle from '@/components/Titles/BlockTitle';

export default {
  components: { WhiteSheet, BlockTitle },
  data() {
    return {
      BG: BG,
      tab: null,
      topBanner: {
        title: 'ENS manager',
        subtext: 'Manage the public address',
        exit: 'Exit Dapp'
      }
    };
  }
};
</script>
