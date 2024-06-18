<template>
  <div class="pa-6">
    <div class="descriptions mb-7">
      {{ $t('interface.import.desc') }}
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

<script setup>
import { ref } from 'vue';
import { SUCCESS, Toast, ERROR } from '@/modules/toast/handler/handlerToast';

// props
const props = defineProps({
  importConfig: {
    type: Object,
    default: () => {}
  }
});

// data
const file = ref('');

// methods
const handleChange = e => {
  file.value = e;
};

const clickImport = () => {
  props.importConfig
    .importStore(file.value)
    .then(() => {
      Toast('Settings succesfully imported!', {}, SUCCESS);
    })
    .catch(e => {
      Toast(e.messsage, {}, ERROR);
    });
};
</script>

<style lang="scss" scoped>
.descriptions {
  max-width: 450px;
}
</style>
