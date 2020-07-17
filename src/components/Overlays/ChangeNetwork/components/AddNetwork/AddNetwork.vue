<template>
  <div>
    <DropdownSelect
      v-model="network"
      label="Network"
      placeholder="Select a network"
      :items="networks"
    />
    <mew-input label="ETH Node Name" placeholder="Type node name" />
    <mew-input label="URL" placeholder="Type URL" />
    <mew-input label="Port" placeholder="Type port number" />

    <mew-expand-panel
      class="mb-7"
      is-toggle
      has-dividers
      :panel-items="exPannel"
    >
      <template v-slot:panelBody0>
        <mew-input label="Username" placeholder=" " />
        <mew-input label="Password" placeholder=" " />
      </template>
    </mew-expand-panel>

    <div class="d-flex justify-center">
      <mew-button button-size="xlarge" title="Save" />
    </div>
  </div>
</template>

<script>
import DropdownSelect from '@/components/Inputs/DropdownSelect';

export default {
  components: { DropdownSelect },
  data() {
    return {
      exPannel: [
        {
          name: 'HTTP basic access authentication'
        }
      ],
      network: '',
      networks: [
        { name: 'ETH - Ethereum', value: 'eth' },
        { name: 'OTH - Other', value: 'oth' }
      ]
    };
  }
};
</script>
