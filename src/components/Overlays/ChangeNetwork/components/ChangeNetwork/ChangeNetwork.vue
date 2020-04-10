<template>
  <div>
    <DropdownSelect
      label="Network"
      placeholder="Select a network"
      :items="networks"
      @clicked="onClickNetwork"
    />

    <TextField
      label="ETH Node Name"
      placeholder="Type node name"
      :items="networks"
      @changed="onChangeNode"
    />

    <TextField
      label="URL"
      placeholder="Type URL"
      :items="networks"
      @changed="onChangeUrl"
    />

    <TextField
      label="Port"
      placeholder="Type port number"
      :items="networks"
      @changed="onChangePort"
    />

    <StdButton size="x-large" fullwidth>
      Save
    </StdButton>
  </div>
</template>

<script>
import DropdownSelect from '@/components/Inputs/DropdownSelect';
import TextField from '@/components/Inputs/TextField';
import StdButton from '@/web/components/StdButton';

export default {
  components: { StdButton, DropdownSelect, TextField },
  data() {
    return {
      networkSelect: '',
      networks: [
        { name: 'ETH - Ethereum', value: 'eth' },
        { name: 'OTH - Other', value: 'oth' }
      ]
    };
  },
  methods: {
    onClickNetwork(val) {
      console.log(val);
    },
    onChangeNode(val) {
      console.log(val);
    },
    onChangeUrl(val) {
      console.log(val);
    },
    onChangePort(val) {
      console.log(val);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';
</style>
