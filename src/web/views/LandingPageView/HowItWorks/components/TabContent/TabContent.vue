<template>
  <v-container>
    <Tabs>
      <v-tab>Send</v-tab>
      <v-tab>Swap</v-tab>
      <v-tab>Dapps</v-tab>
      <v-tab>Tokens</v-tab>
      <v-tab>More</v-tab>

      <v-tab-item>
        <Send />
      </v-tab-item>
      <v-tab-item>
        <Swap />
      </v-tab-item>
      <v-tab-item>
        <Dapps />
      </v-tab-item>
      <v-tab-item>
        <Tokens />
      </v-tab-item>
      <v-tab-item>
        <More />
      </v-tab-item>
    </Tabs>
  </v-container>
</template>

<script>
import Tabs from '../../../components/Tabs';
import Send from './components/Send';
import Swap from './components/Swap';
import Dapps from './components/Dapps';
import Tokens from './components/Tokens';
import More from './components/More';

export default {
  name: 'TabContent',
  components: { Tabs, Send, Swap, Dapps, Tokens, More }
};
</script>

<style lang="scss" scoped></style>
