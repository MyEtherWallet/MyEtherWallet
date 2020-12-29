<template>
  <div>
    <div class="title d-flex">
      {{ $t('dappsStaked.my-validators') }}
      <i
        v-if="loadingValidators"
        class="fa fa-spinner fa-spin staking-percent mb-1 ml-2"
      />
    </div>
    <div
      v-if="!loadingValidators && validators.length === 0"
      class="no-validators"
    >
      {{ $t('dappsStaked.no-validators') }}
    </div>
    <div v-for="(validator, idx) in validators" :key="idx">
      <div v-if="validator.raw[0].status.toLowerCase() !== types[3]">
        <div
          v-for="(info, infoIdx) in validator.raw"
          :key="infoIdx"
          :class="[
            'validator-container d-flex',
            getContainerClass(info.status)
          ]"
        >
          <div
            :class="['top-row d-flex', getExpandedClasses(idx, info.status)]"
            @click="expand(idx)"
          >
            <div>
              <span>
                {{ $tc('dappsStaked.key', 1) }}:
                <a
                  :href="
                    'https://beaconscan.com/validator/' + info.validator_key
                  "
                  target="_blank"
                >
                  {{ truncate(info.validator_key) }}</a
                >
              </span>
              <div :class="['badge', getBadgeClass(info.status)]">
                {{ info.status }}
              </div>
            </div>
            <div class="d-flex right-container">
              <div>
                {{
                  info.balance > 0 ? convertToEth1(info.balance) : info.amount
                }}
                {{ $t('common.currency.eth') }}
              </div>
              <i v-if="!isExpanded(idx)" class="fa fa-lg fa-caret-down ml-2" />
              <i v-if="isExpanded(idx)" class="fa fa-lg fa-caret-up ml-2" />
            </div>
          </div>
          <div v-if="isExpanded(idx)" class="d-flex more-info">
            <div
              v-if="
                info.status.toLowerCase() === types[0] ||
                info.status.toLowerCase() === types[1]
              "
              class="queue-speed"
            >
              {{ $t('dappsStaked.queue-speed') }}: ~900
              {{ $t('dappsStaked.validators-per') }}
            </div>
            <div
              v-for="(detail, detailIdx) in details(info)"
              :key="detailIdx"
              class="more-info-row d-flex mt-3"
            >
              <span>{{ detail.label }}</span>
              <span class="info-text">{{ detail.info }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import moment from 'moment';

const types = ['pending', 'deposited', 'active', 'created'];
export default {
  props: {
    validators: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      expanded: '',
      types: types,
      loadingValidators: true
    };
  },
  watch: {
    loading(newVal) {
      this.loadingValidators = newVal;
    }
  },
  methods: {
    details(info) {
      // pending
      if (info.status.toLowerCase() === types[0]) {
        return [
          {
            label: this.$tc('dappsStaked.validator', 1),
            info: info.validator_key
          },
          {
            label: this.$t('dappsStaked.staked'),
            info: info.amount + ' ' + this.$t('common.currency.eth')
          },
          {
            label: this.$t('dappsStaked.estimated-activation-timestamp'),
            info: info.queue
              ? moment(info.estimated_activation_timestamp).format(
                  'MM/DD/YYYY hh:mm:ss'
                )
              : ''
          },
          {
            label: this.$t('dappsStaked.validators-infront'),
            info: info.queue
              ? new BigNumber(info.queue.total).minus(info.queue.position)
              : ''
          },
          {
            label: this.$t('dappsStaked.validators-back'),
            info: info.queue
              ? info.queue.position === 0
                ? 0
                : info.queue.position - 1
              : ''
          }
        ];
      }
      // deposited
      if (info.status.toLowerCase() === types[1]) {
        return [
          {
            label: this.$tc('dappsStaked.validator', 1),
            info: info.validator_key
          },
          {
            label: this.$t('dappsStaked.staked'),
            info: info.amount + ' ' + this.$t('common.currency.eth')
          },
          {
            label: this.$t('dappsStaked.estimated-activation-timestamp'),
            info: info.queue
              ? moment(info.estimated_activation_timestamp).format(
                  'MM/DD/YYYY hh:mm:ss'
                )
              : ''
          },
          {
            label: this.$t('dappsStaked.validators-infront'),
            info: info.queue
              ? new BigNumber(info.queue.total).minus(info.queue.position)
              : ''
          },
          {
            label: this.$t('dappsStaked.validators-back'),
            info: info.queue
              ? info.queue.position === 0
                ? 0
                : info.queue.position - 1
              : ''
          }
        ];
      }
      // activated
      if (info.status.toLowerCase() === types[2]) {
        return [
          {
            label: this.$tc('dappsStaked.validator', 1),
            info: info.validator_key
          },
          {
            label: this.$t('dappsStaked.activation-timestamp'),
            info: moment(info.activation_timestamp).format(
              'MM/DD/YYYY hh:mm:ss'
            )
          },
          {
            label: this.$t('dappsStaked.staked'),
            info: info.amount + ' ' + this.$t('common.currency.eth')
          },
          {
            label: this.$t('dappsStaked.apr'),
            info: this.getApr(info) + '%'
          },
          {
            label: this.$t('dappsStaked.earnings'),
            info:
              this.getEarnings(info.balance, info.amount) +
              ' ' +
              this.$t('common.currency.eth')
          }
        ];
      }
    },
    getApr(info) {
      const now = moment.utc();
      const activated = moment.utc(info.activation_timestamp);
      const daysActive = now.diff(activated, 'days');
      const percentIncrease = new BigNumber(
        this.getEarnings(info.balance, info.amount).div(info.amount)
      );
      const percentIncreasePerDay = percentIncrease / daysActive;
      const apr = percentIncreasePerDay * 365;
      return new BigNumber(apr).times(100).toFixed(4);
    },
    getEarnings(balance, amount) {
      return new BigNumber(this.convertToEth1(balance)).minus(amount);
    },
    convertToEth1(balance) {
      return new BigNumber(balance).div(new BigNumber(10).pow(9)).toFixed(4);
    },
    getExpandedClasses(idx, status) {
      if (this.isExpanded(idx)) {
        if (status.toLowerCase() === types[0]) {
          return 'pending-expanded';
        }
        if (status.toLowerCase() === types[1]) {
          return 'deposited-expanded';
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
        return 'deposited-badge';
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
        return 'deposited-container';
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
