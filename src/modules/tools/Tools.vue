<template>
  <div>
    <PageTitle title="Tools" />
    <v-container class="mt-8 mb-12">
      <mew-tabs :items="items">
        <template v-slot:tabItemContent0>
          <WatchOnlyAddress />
        </template>
        <template v-slot:tabItemContent1>
          <ConvertUnits />
        </template>
        <template v-slot:tabItemContent2>
          <SendOfflineHelper />
        </template>
        <template v-slot:tabItemContent3>
          <VerifyMessage />
        </template>
      </mew-tabs>
    </v-container>
    <get-started />
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import getStarted from '@/components/get-started';

import WatchOnlyAddress from './pages/WatchOnlyAddress';
import ConvertUnits from './pages/ConvertUnits';
import SendOfflineHelper from './pages/SendOfflineHelper';
import VerifyMessage from './pages/VerifyMessage';

export default {
  name: 'MoreActions',
  components: {
    PageTitle,
    getStarted,
    WatchOnlyAddress,
    ConvertUnits,
    SendOfflineHelper,
    VerifyMessage
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
