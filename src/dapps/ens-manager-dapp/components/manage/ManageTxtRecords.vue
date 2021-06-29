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
        :disabled="hasError"
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
      errors[item.name] = '';
    });
    return {
      errors: errors,
      textRecords: textRecords,
      setRecords: {}
    };
  },
  computed: {
    hasError() {
      return (
        Object.values(this.errors).filter(item => {
          if (item !== '') return item;
        }).length > 0
      );
    }
  },
  methods: {
    setRecord(value, id) {
      console.log(value, id);
      const record = this.textRecords[id];
      if (record.validate(value)) {
        record.value = value;
        this.setRecords[record.name] = record;
      } else {
        this.errors[this.textRecords[id].name] = this.$t(
          'ens.text-record-error',
          {
            name: record.name
          }
        );
      }
    }
  }
};
</script>
