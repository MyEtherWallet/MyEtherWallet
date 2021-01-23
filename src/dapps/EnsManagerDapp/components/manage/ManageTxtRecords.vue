<template>
  <div>
    <div v-for="(record, idx) in textRecords" :key="record + idx">
      <mew-input
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
  // computed: {
  //   rules() {
  //     return [
  //       this.isValidAddress ||
  //         this.$t('interface.address-book.validations.invalid-address'),
  //       value =>
  //         !!value || this.$t('interface.address-book.validations.addr-required')
  //     ];
  //   }
  // },
  methods: {
    // need to make mew-input return the label
    setRecord(value, name = 'email') {
      const record = this.textRecords.find(record => record.name === name);
      record.value = value;
      this.setRecords[record.name] = record;
    }
  }
};
</script>
