<template>
  <mew-overlay :show-overlay="open" title="Network" right-btn-text="Close">
    <template v-slot:mewComponent>
      <mew-tabs :items="tabs" is-block>
        <template v-slot:tabContent1>
          <mew6-white-sheet>
            <div class="pa-8">
              <change />
            </div>
          </mew6-white-sheet>
        </template>
        <template v-slot:tabContent2>
          <mew6-white-sheet>
            <div class="pa-8">
              <add />
            </div>
          </mew6-white-sheet>
        </template>
      </mew-tabs>
    </template>
  </mew-overlay>
</template>

<script>
import add from './components/add';
import change from './components/change';

export default {
  components: {
    add,
    change
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
