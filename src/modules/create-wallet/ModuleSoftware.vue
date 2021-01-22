<template>
  <div>
    <mew-super-button
      btn-mode="small-right-image"
      class="mb-5"
      color-theme="outline"
      title="Software"
      subtitle="Keystore files / Mnemonic phrase is highly sensitive information, and
          they should only be used in offline settings by experienced users."
      title-icon-class="warning--text text--darken-1"
      note="NOT RECOMMENDED"
      @click.native="showSoftware = true"
    />
    <software-overlay :open="showSoftware" :close="closeOverLay" />
  </div>
</template>
<script>
import MewSuperButton from '@/components/mewSuperButton/MewSuperButton';
import SoftwareOverlay from './components/SoftwareOverlay';
export default {
  name: 'ModuleSoftware',
  components: {
    MewSuperButton,
    SoftwareOverlay
  },
  data: () => ({
    showSoftware: false
  }),
  methods: {
    closeOverLay() {
      this.showSoftware = false;
    }
  }
};
</script>
