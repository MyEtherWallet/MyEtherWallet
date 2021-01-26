<template>
  <div>
    <div v-for="(record, idx) in textRecords" :key="record + idx">
      <mew-input
        :id="idx"
        :rules="rules(idx, record)"
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
import textRecords from '@/dapps/EnsManagerDapp/handlers/handlerTextRecords';

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
    return {
      textRecords: textRecords,
      setRecords: {}
    };
  },
  methods: {
    rules(idx, record) {
      console.error('in here', idx, record)
      return [
        !this.textRecords[idx].validate(record.value) ||
          this.$t('ens.text-record-error', { name: record.name })
      ];
    },
    setRecord(value, id) {
      const record = this.textRecords[id];
      record.value = record.validate(value) ? value : '';
      this.setRecords[record.name] = record;
    }
  }
};
</script>
