<template>
  <div>
    <v-radio-group v-model="radioGroup">
      <template v-for="network in networks">
        <h3>{{ network.label }}</h3>
        <v-radio
          v-for="button in network.buttons"
          :key="button.id"
          :label="button.name"
          :value="button.value"
        ></v-radio>
      </template>
    </v-radio-group>

    <StdButton size="x-large" fullwidth>
      Change
    </StdButton>
  </div>
</template>

<script>
import StdButton from '@/web/components/StdButton';

export default {
  components: { StdButton },
  data() {
    return {
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
            { name: 'myetherapi.com', value: 'myetherapi' },
            { name: 'infura.io', value: 'infura' },
            { name: 'giveth.io', value: 'giveth' },
            { name: 'therscan.io', value: 'therscan' }
          ]
        },
        {
          label: 'rin',
          buttons: [
            { name: 'myetherapi.com', value: 'myetherapi' },
            { name: 'infura.io', value: 'infura' },
            { name: 'giveth.io', value: 'giveth' },
            { name: 'therscan.io', value: 'therscan' }
          ]
        }
      ]
    };
  }
};
</script>
