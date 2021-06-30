<template>
  <div>
    <div v-for="(key, idx) in keys" :key="`${key}${idx}`">
      <mew-input
        :id="idx"
        class="mb-2"
        :error-messages="errors[key]"
        :value="setRecords[key]"
        :label="key"
        :placeholder="key"
        @input="setRecord"
      />
    </div>
    <div class="d-flex align-center justify-center mt-3">
      <mew-button
        :title="$t('common.save')"
        btn-size="xlarge"
        :disabled="!isValid"
        @click.native="setTextRecords(setRecords)"
      />
    </div>
  </div>
</template>

<script>
import textValidator from '@/dapps/ens-manager-dapp/handlers/handlerTextRecords';
import { _ } from 'web3-utils';

export default {
  props: {
    setTextRecords: {
      default: function () {
        return {};
      },
      type: Function
    },
    textRecords: {
      type: [Object, null],
      default: null
    }
  },
  data() {
    const errors = {};
    const records = {};
    Object.keys(this.textRecords).forEach(item => {
      errors[item] = '';
      records[item] = this.textRecords[item];
    });
    return {
      errors: errors,
      setRecords: records
    };
  },
  computed: {
    hasError() {
      return (
        Object.values(this.errors).filter(item => {
          if (item !== '') return item;
        }).length > 0
      );
    },
    isValid() {
      return !this.hasError && !_.isEmpty(this.setRecords);
    },
    keys() {
      return Object.keys(this.textRecords);
    }
  },
  watch: {
    textRecords: {
      handler: function (newVal) {
        Object.keys(newVal).forEach(item => {
          this.setRecords[item] = newVal[item];
        });
      }
    },
    deep: true,
    immediate: true
  },
  methods: {
    setRecord(value, id) {
      const name = this.keys[id];
      try {
        if (textValidator[id].validate(value)) {
          this.errors[name] = '';
        } else {
          this.errors[name] = this.$t('ens.text-record-error', {
            name: name
          });
        }
      } catch (e) {
        this.errors[name] = e;
      }
    }
  }
};
</script>
