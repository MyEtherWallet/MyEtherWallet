<template>
  <app-user-msg-block
    v-if="toTokenType && toTokenType.toLowerCase() == 'bitcoin'"
    class="mt-5"
    :message="message"
  >
    <div class="border-top mt-3">
      <v-expansion-panels flat class="expansion-panels--remove-paddings">
        <v-expansion-panel>
          <v-expansion-panel-header
            color="tableHeader"
            class="textPrimaryModule--text"
          >
            How can I get wrapped Bitcoin?
          </v-expansion-panel-header>
          <v-expansion-panel-content color="tableHeader" class="pa-0">
            <div class="textPrimaryModule--text mb-2">
              When you swap to Bitcoin, it is moved to the Bitcoin blockchain, &
              requires a Bitcoin wallet. In order to keep Bitcoin in
              MyEtherWallet, you can swap to wrapped Bitcoin instead. Wrapped
              Bitcoin is an Ethereum token, with a value approximately equal to
              1 BTC. Wrapped Bitcoins can be stored in MEW, and can be used as
              any other Ethereum asset: you can swap it to other tokens, use it
              as collateral in DeFi apps, etc. There are multiple kinds of
              wrapped Bitcoins, but they roughly do the same thing.
              <a
                href="https://kb.myetherwallet.com/en/swap/btc-to-ethereum/"
                target="_blank"
              >
                Learn more about Wrapped Bitcoin.
              </a>
            </div>
            <v-row class="mt-6">
              <v-col cols="12" md="4">
                <mew-button
                  btn-size="small"
                  btn-style="outline"
                  title="Swap to renBTC"
                  :has-full-width="true"
                />
              </v-col>
              <v-col cols="12" md="4">
                <mew-button
                  btn-size="small"
                  btn-style="outline"
                  title="Swap to wBTC"
                  :has-full-width="true"
                />
              </v-col>
              <v-col cols="12" md="4">
                <mew-button
                  btn-size="small"
                  btn-style="outline"
                  title="Swap to PBTC"
                  :has-full-width="true"
                />
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </app-user-msg-block>
</template>

<script>
import AppUserMsgBlock from '@/core/components/AppUserMsgBlock';

export default {
  components: {
    AppUserMsgBlock
  },
  props: {
    message: {
      type: Object,
      default: () => {
        return {};
      }
    },
    toTokenType: {
      type: String,
      default: ''
    }
  }
};
</script>

<style></style>
