<template>
  <mew-overlay :show-overlay="open" title="Network" right-btn-text="Close">
    <template v-slot:mewComponent>
      <mew-tabs :items="tabs" is-block>
        <template v-slot:tabContent0>
          <mew6-white-sheet>
            <div class="pa-8">
              <ChangeNetwork />
            </div>
          </mew6-white-sheet>
        </template>
        <template v-slot:tabContent1>
          <mew6-white-sheet>
            <div class="pa-8">
              <AddNetwork />
            </div>
          </mew6-white-sheet>
        </template>
      </mew-tabs>
    </template>
  </mew-overlay>
</template>

<script>
import AddNetwork from './components/AddNetwork';
import ChangeNetwork from './components/ChangeNetwork';

export default {
  components: {
    AddNetwork,
    ChangeNetwork
  },
  props: {
    open: { default: false, type: Boolean }
  },
  data() {
    return {
      tabs: [
        {
          name: 'Change network'
        },
        {
          name: 'Add network / HTTP'
        }
      ]
    };
  }
};
</script>
