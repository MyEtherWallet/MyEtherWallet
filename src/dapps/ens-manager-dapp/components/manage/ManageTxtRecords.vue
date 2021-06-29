<template>
  <div>
    <div v-for="(record, idx) in textRecords" :key="record + idx">
      <mew-input
        :id="idx"
        class="mb-2"
        :error-messages="errors[record.name]"
        :value="record.value"
        :label="record.name"
        :placeholder="record.name"
        @input="setRecord"
      />
    </div>
    <div class="d-flex align-center justify-center mt-3">
      <mew-button
        :title="$t('common.save')"
        btn-size="xlarge"
        @click.native="setTextRecords(setRecords)"
      />
    </div>
  </div>
</template>

<script>
import textRecords from '@/dapps/ens-manager-dapp/handlers/handlerTextRecords';

export default {
  props: {
    setTextRecords: {
      default: function () {
        return {};
      },
      type: Function
    }
  },
  data() {
    const errors = {};
    textRecords.forEach(item => {
      errors[item] = '';
    });
    return {
      errors: errors,
      textRecords: textRecords,
      setRecords: {}
    };
  },
  methods: {
    setRecord(value, id) {
      console.log(value, id);
      const record = this.textRecords[id];
      if (record.validate(value)) {
        record.value = value;
        this.setRecords[record.name] = record;
      } else {
        console.log(this.textRecords[id]);
        this.errors[this.textRecords[id]] = this.$t('ens.text-record-error', {
          name: record.name
        });
      }
    }
  }
};
</script>
