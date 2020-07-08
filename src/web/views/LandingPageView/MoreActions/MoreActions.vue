<template>
  <div>
    <PageTitle title="More actions" />
    <v-container class="mt-8 mb-12">
      <mew6-vertical-tabs :tabs="tabs" />
    </v-container>
    <Ad />
  </div>
</template>

<script>
import PageTitle from '@/web/components/PageTitle';
import Ad from '@/web/components/HomeAd2';

import WatchOnlyAddress from './components/WatchOnlyAddress';
import ConvertUnits from './components/ConvertUnits';
import SendOfflineHelper from './components/SendOfflineHelper';
import VerifyMessage from './components/VerifyMessage';

export default {
  name: 'MoreActions',
  components: { PageTitle, Ad },
  data: () => ({
    tabs: [
      { label: 'Watch only address', content: WatchOnlyAddress },
      { label: 'Convert units', content: ConvertUnits },
      { label: 'Send offline helper', content: SendOfflineHelper },
      { label: 'Verify message', content: VerifyMessage }
    ]
  })
};
</script>
