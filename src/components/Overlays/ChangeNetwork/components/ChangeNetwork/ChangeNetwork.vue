<template>
  <div>
    <v-radio-group v-model="networkSelected">
      <div v-for="(network, i) in networks" :key="i">
        <div class="text-uppercase font-weight-bold subtitle-1 mb-1">
          {{ network.label }}
        </div>

        <v-row no-gutters>
          <v-col
            v-for="button in network.buttons"
            :key="button.value"
            cols="6"
            class="mt-2"
          >
            <v-radio :label="button.name" :value="button.value"></v-radio>
          </v-col>
        </v-row>

        <div>{{ network.id }}</div>
        <DividerLine v-if="networks.length != i + 1" class="my-5" />
      </div>
    </v-radio-group>
    <div class="d-flex justify-center">
      <mew-button button-size="xlarge" title="Change" class="mt-3" />
    </div>
  </div>
</template>

<script>
import DividerLine from '@/web/components/Common/DividerLine';

export default {
  components: { DividerLine },
  data() {
    return {
      networkSelected: null,
      networks: [
        {
          label: 'eth',
          buttons: [
            { name: 'myetherapi.com', value: 'myetherapi' },
            { name: 'infura.io', value: 'infura' },
            { name: 'giveth.io', value: 'giveth' },
            { name: 'therscan.io', value: 'therscan' }
          ]
        },
        {
          label: 'rop',
          buttons: [
            { name: 'myetherapi.com', value: 'myetherapi1' },
            { name: 'infura.io', value: 'infura1' },
            { name: 'giveth.io', value: 'giveth1' },
            { name: 'therscan.io', value: 'therscan1' }
          ]
        },
        {
          label: 'rin',
          buttons: [
            { name: 'myetherapi.com', value: 'myetherapi2' },
            { name: 'infura.io', value: 'infura2' },
            { name: 'giveth.io', value: 'giveth2' },
            { name: 'therscan.io', value: 'therscan2' }
          ]
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.v-input--selection-controls {
  padding: 0;
  margin: 0;
}
</style>
