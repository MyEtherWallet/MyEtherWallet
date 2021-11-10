<template>
  <div class="pa-6">
    <div class="descriptions mb-7">
      Please upload the file and click the button to open and import your
      configuration file from your local computer.
    </div>
    <div class="d-block d-sm-flex align-start text-center">
      <v-file-input
        color="greenPrimary"
        label="Upload file..."
        truncate-length="15"
        filled
        accept="application/JSON"
        height="60"
        @change="handleChange"
      />
      <mew-button
        class="ml-3"
        title="Confirm & Import"
        btn-size="xlarge"
        :disabled="file === ''"
        @click.native="clickImport"
      />
    </div>
  </div>
</template>

<script>
import { SUCCESS, Toast, ERROR } from '@/modules/toast/handler/handlerToast';
export default {
  name: 'SettingsImportConfig',
  props: {
    importConfig: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      file: ''
    };
  },
  methods: {
    handleChange(e) {
      this.file = e;
    },
    clickImport() {
      this.importConfig
        .importStore(this.file)
        .then(() => {
          Toast('Settings succesfully imported!', {}, SUCCESS);
        })
        .catch(e => {
          Toast(e.messsage, {}, ERROR);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.descriptions {
  max-width: 450px;
}
</style>
