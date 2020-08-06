<template>
  <div>
    <home-header title="Tools" />
    <v-container class="mt-8 mb-12">
      <mew-tabs :items="items">
        <template v-slot:tabItemContent0>
          <watch-only />
        </template>
        <template v-slot:tabItemContent1>
          <convert />
        </template>
        <template v-slot:tabItemContent2>
          <offline-helper />
        </template>
        <template v-slot:tabItemContent3>
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
