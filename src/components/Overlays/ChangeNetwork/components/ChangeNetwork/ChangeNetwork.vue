<template>
  <div>
    <DropdownSelect
      label="Network"
      placeholder="Select a network"
      :items="networks"
      @changed="onClickNetwork"
    />

    <TextField
      label="ETH Node Name"
      placeholder="Type node name"
      @changed="onChangeNode"
    />

    <TextField label="URL" placeholder="Type URL" @changed="onChangeUrl" />

    <TextField
      label="Port"
      placeholder="Type port number"
      @changed="onChangePort"
    />

    <ExpantionBlock title="HTTP basic access authentication" class="mb-7">
      <TextField label="User name" placeholder=" " :items="networks" />
      <TextField label="Password" placeholder=" " :items="networks" />
    </ExpantionBlock>

    <StdButton size="x-large" fullwidth>
      Save
    </StdButton>
  </div>
</template>

<script>
import DropdownSelect from '@/components/Inputs/DropdownSelect';
import TextField from '@/components/Inputs/TextField';
import StdButton from '@/web/components/StdButton';
import ExpantionBlock from '@/components/ExpantionBlock';

export default {
  components: { StdButton, DropdownSelect, TextField, ExpantionBlock },
  data() {
    return {
      network: '',
      node: '',
      url: '',
      port: '',
      networks: [
        { name: 'ETH - Ethereum', value: 'eth' },
        { name: 'OTH - Other', value: 'oth' }
      ]
    };
  },
  methods: {
    onChangeNetwork(val) {
      this.network = val;
    },
    onChangeNode(val) {
      this.node = val;
    },
    onChangeUrl(val) {
      this.url = val;
    },
    onChangePort(val) {
      this.port = val;
    }
  }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables.scss';
</style>
