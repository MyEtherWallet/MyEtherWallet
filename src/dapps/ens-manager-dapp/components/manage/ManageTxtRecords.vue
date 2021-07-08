<template>
  <div>
    <div v-for="(key, idx) in keys" :key="`${key}${idx}`">
      <mew-input
        :id="idx"
        v-model="setRecords[key]"
        class="mb-2"
        :error-messages="errors[key]"
        :label="key"
        :placeholder="key"
        @input="validateRecord"
      />
    </div>
    <div class="d-flex align-center justify-center mt-3">
      <mew-button
        :title="$t('common.save')"
        btn-size="xlarge"
        :disabled="!isValid"
        @click.native="callSetRecords"
      />
    </div>
  </div>
</template>

<script>
import textValidator from '@/dapps/ens-manager-dapp/handlers/handlerTextRecords';
import { _ } from 'web3-utils';
import { Toast, WARNING } from '@/modules/toast/handler/handlerToast';

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
          this.errors[item] = '';
        });
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    validateRecord(value, id) {
      const name = this.keys[id];
      if (value) {
        this.errors[name] = textValidator[id].validate(value)
          ? ''
          : this.$t('ens.text-record-error', {
              name: name
            });
      } else {
        this.errors[name] = '';
      }
    },
    callSetRecords() {
      const newObj = {};
      Object.keys(this.setRecords)
        .filter(item => {
          // Filters out empty values and unchanged values
          if (
            this.setRecords[item] !== '' &&
            this.textRecords[item] !== this.setRecords[item]
          )
            return item;
        })
        .forEach(item => {
          newObj[item] = this.setRecords[item];
        });
      if (!_.isEmpty(newObj)) {
        this.setTextRecords(newObj);
      } else {
        Toast('No changes found!', {}, WARNING);
      }
    }
  }
};
</script>
