<template>
  <div>
    <div class="title">{{ $t('dappsStaked.my-validators') }}</div>
    <div v-for="(validator, idx) in validators" :key="idx">
      <div v-if="!loadingValidators && validators.length === 0">
        {{ $t('dappsStaked.no-validators') }}
      </div>
      <i
        v-if="loadingValidators"
        class="fa fa-spinner fa-spin staking-percent mb-1"
      />
      <div
        v-for="(info, infoIdx) in validator.raw"
        :key="infoIdx"
        :class="['validator-container d-flex', getContainerClass(info.status)]"
      >
        <div
          :class="['top-row d-flex', getExpandedClasses(idx, info.status)]"
          @click="expand(idx)"
        >
          <div>
            <span>
              {{ $tc('dappsStaked.key', 1) }}:
              <a href=""> {{ truncate(info.validator_key) }}</a>
            </span>
            <div :class="['badge', getBadgeClass(info.status)]">
              {{ info.status }}
            </div>
          </div>
          <div class="d-flex right-container">
            <div>{{ info.amount }} {{ $t('common.currency.eth') }}</div>
            <i v-if="!isExpanded(idx)" class="fa fa-lg fa-caret-down ml-2" />
            <i v-if="isExpanded(idx)" class="fa fa-lg fa-caret-up ml-2" />
          </div>
        </div>
        <div v-if="isExpanded(idx)" class="d-flex more-info">
          <div
            v-for="(detail, detailIdx) in details(info)"
            :key="detailIdx"
            class="more-info-row d-flex mt-3"
          >
            <span>{{ detail.label }}</span>
            <span class="info-text">{{ detail.info }}</span>
          </div>
          <!-- <div
            v-if="info.status.toLowerCase() === types[0]"
            class="more-info-row d-flex mt-3"
          >
            {{ $tc('dappsStaked.activation-queue') }}
            <span class="info-text">{{  }}</span>
          </div>
          <div
            v-if="info.status.toLowerCase() === types[0]"
            class="more-info-row d-flex mt-3"
          >
            {{ $tc('dappsStaked.validators-infront') }}
            <span class="info-text">{{  }}</span>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const types = ['pending', 'created', 'active'];
export default {
  props: {
    validators: {
      type: Array,
      default: () => []
    },
    loadingValidators: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      expanded: '',
      types: types
    };
  },
  watch: {
    validators(newVal, oldVal) {
      console.error('newVal', newVal, oldVal);
    }
  },
  methods: {
    details(info) {
      if (info.status.toLowerCase() === types[0]) {
        return [
          {
            label: this.$t('dappsStaked.estimated-wait'),
            info: ''
          },
          {
            label: this.$t('dappsStaked.validators-infront'),
            info: info.activation_timestamp
          },
          {
            label: this.$t('dappsStaked.validators-back'),
            info: info.amount
          }
        ];
      }
      if (info.status.toLowerCase() === types[1]) {
        return [
          {
            label: this.$tc('dappsStaked.validator', 1),
            info: info.validator_key
          },
          {
            label: this.$t('dappsStaked.activation-timestamp'),
            info: info.activation_timestamp
          },
          {
            label: this.$t('dappsStaked.staked'),
            info: info.amount
          },
          {
            label: this.$t('dappsStaked.apr'),
            info: ''
          },
          {
            label: this.$t('dappsStaked.earnings'),
            info: ''
          }
        ];
      }
      if (info.status.toLowerCase() === types[2]) {
        return [
          {
            label: this.$tc('dappsStaked.validator', 1),
            info: info.validator_key
          },
          {
            label: this.$t('dappsStaked.activation-timestamp'),
            info: info.activation_timestamp
          },
          {
            label: this.$t('dappsStaked.staked'),
            info: info.amount
          },
          {
            label: this.$t('dappsStaked.apr'),
            info: ''
          },
          {
            label: this.$t('dappsStaked.earnings'),
            info: ''
          }
        ];
      }
    },
    getExpandedClasses(idx, status) {
      if (this.isExpanded(idx)) {
        if (status.toLowerCase() === types[0]) {
          return 'pending-expanded';
        }
        if (status.toLowerCase() === types[1]) {
          return 'created-expanded';
        }
        if (status.toLowerCase() === types[2]) {
          return 'active-expanded';
        }
      }
    },
    isExpanded(idx) {
      return this.expanded === idx;
    },
    expand(idx) {
      this.expanded = this.expanded !== idx ? idx : '';
    },
    truncate(str) {
      return str.slice(0, 10) + '...' + str.slice(str.length - 10, str.length);
    },
    getBadgeClass(status) {
      if (status.toLowerCase() === types[0]) {
        return 'pending-badge';
      }
      if (status.toLowerCase() === types[1]) {
        return 'created-badge';
      }
      if (status.toLowerCase() === types[2]) {
        return 'active-badge';
      }
    },
    getContainerClass(status) {
      if (status.toLowerCase() === types[0]) {
        return 'pending-container';
      }
      if (status.toLowerCase() === types[1]) {
        return 'created-container';
      }
      if (status.toLowerCase() === types[2]) {
        return 'active-container';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'Status.scss';
</style>
