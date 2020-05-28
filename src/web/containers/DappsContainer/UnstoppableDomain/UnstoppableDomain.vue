<template>
  <WhiteSheet>
    <div>
      <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
        <v-tab>
          Buy domain
        </v-tab>
        <v-tab>
          Manage domain
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <div class="py-12 tab-width">
            <div class="mb-5">
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
            <div>
              <BlockTitle title="Results" />
            </div>
          </div>
        </v-tab-item>
        <v-tab-item>
          <div class="py-12 tab-width">
            aaa
          </div>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </WhiteSheet>
</template>

<script>
import WhiteSheet from '@/web/components/Common/WhiteSheet';
import BlockTitle from '@/components/Titles/BlockTitle';

export default {
  components: { WhiteSheet, BlockTitle },
  data() {
    return { tab: null };
  }
};
</script>

<style>
.tab-width {
  max-width: 800px;
  margin: 0 auto;
}
</style>
