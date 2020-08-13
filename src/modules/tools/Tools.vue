<template>
  <div class="mew-component--tools">
    <home-header title="Tools" />
    <v-container class="mt-8 mb-12">
      <mew-tabs :is-vertical="true" :items="items">
        <template v-slot:tabItemContent1>
          <watch-only />
        </template>
        <template v-slot:tabItemContent2>
          <convert />
        </template>
        <template v-slot:tabItemContent3>
          <offline-helper />
        </template>
        <template v-slot:tabItemContent4>
          <verify />
        </template>
      </mew-tabs>
    </v-container>
    <get-started />
  </div>
</template>

<script>
import homeHeader from '@/components/home-header/HomeHeader';
import getStarted from '@/components/get-started/GetStarted';

import watchOnly from './pages/watch-only/WatchOnly';
import convert from './pages/convert/Convert';
import offlineHelper from './pages/offline-helper/OfflineHelper';
import verify from './pages/verify/Verify';

export default {
  name: 'MoreActions',
  components: {
    homeHeader,
    getStarted,
    watchOnly,
    convert,
    offlineHelper,
    verify
  },
  data: () => ({
    items: [
      {
        name: 'Watch only address'
      },
      {
        name: 'Convert units'
      },
      {
        name: 'Send offline helper'
      },
      {
        name: 'Verify message'
      }
    ]
  })
};
</script>
<style lang="scss">
.mew-component--tools {
  .v-tabs {
    .v-slide-group {
      border-right: 1px solid var(--v-inputBorder-base) !important;
      margin-right: 30px;
      padding-right: 30px;
    }
    .v-tab {
      text-align: left;
      font-weight: 400 !important;
      font-size: 14px !important;
      justify-content: flex-start;
    }
    .v-tab--active {
      font-weight: 600 !important;
      border-left: 4px solid var(--v-primary-base) !important;
    }
  }
}
</style>
