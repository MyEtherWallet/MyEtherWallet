<template>
  <div>
    <DropdownSelect
      v-model="network"
      label="Network"
      placeholder="Select a network"
      :items="networks"
    />
    <TextField
      v-model="node"
      label="ETH Node Name"
      placeholder="Type node name"
    />
    <TextField v-model="url" label="URL" placeholder="Type URL" />
    <TextField v-model="port" label="Port" placeholder="Type port number" />
    <ExpantionBlock title="HTTP basic access authentication" class="mb-7">
      <TextField v-model="username" label="Username" placeholder=" " />
      <TextField v-model="password" label="Password" placeholder=" " />
    </ExpantionBlock>
    <mew6-std-btn size="x-large" fullwidth>
      Save
    </mew6-std-btn>
  </div>
</template>

<script>
import DropdownSelect from '@/components/Inputs/DropdownSelect';
import TextField from '@/components/Inputs/TextField';
import ExpantionBlock from '@/components/ExpantionBlock';

export default {
  components: { DropdownSelect, TextField, ExpantionBlock },
  data() {
    return {
      network: '',
      node: '',
      url: '',
      port: '',
      username: '',
      password: '',
      networks: [
        { name: 'ETH - Ethereum', value: 'eth' },
        { name: 'OTH - Other', value: 'oth' }
      ]
    };
  }
};
</script>
