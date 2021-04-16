<template>
  <div class="staked-status">
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
            :class="[
              'top-row d-flex',
              getExpandedClasses(info.validator_key, info.status)
            ]"
            @click="expand(info.validator_key, info.status)"
          >
            <div class="badge-container d-flex">
              <span>
                {{ $tc('dappsStaked.validator', 1) }}:
                <span class="ml-2">
                  {{ truncate('0x' + info.validator_key) }}</span
                >
              </span>
              <div :class="['badge ml-4', getBadgeClass(info.status)]">
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
              <i
                v-if="!isExpanded(info.validator_key)"
                class="fa fa-lg fa-caret-down ml-2"
              />
              <i
                v-if="isExpanded(info.validator_key)"
                class="fa fa-lg fa-caret-up ml-2"
              />
            </div>
          </div>
          <div v-if="isExpanded(info.validator_key)" class="d-flex more-info">
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
              :class="[
                'more-info-row d-flex',
                detailIdx !== details(info).length - 1 ? 'more-info-border' : ''
              ]"
            >
              <span>{{ detail.label }}</span>
              <a
                v-if="detail.label === $tc('dappsStaked.validator', 1)"
                class="ml-2 info-text"
                :href="getUrl(info.validator_key)"
                target="_blank"
                >{{ detail.info }}
              </a>
              <span
                v-if="detail.label !== $tc('dappsStaked.validator', 1)"
                class="info-text"
                >{{ detail.info }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <exited-popup ref="exitedPopup" />
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import moment from 'moment';
import stakeConfigs from '@/dapps/Staked/configs';
import { mapState } from 'vuex';
import exitedPopup from '@/dapps/Staked/components/ExitedPopup';

const types = ['pending', 'deposited', 'active', 'created', 'exited'];
export default {
  components: {
    exitedPopup
  },
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
  computed: {
    ...mapState('main', ['network'])
  },
  watch: {
    loading: {
      deep: true,
      immediate: true,
      handler: function (newVal) {
        this.loadingValidators = newVal;
      }
    }
  },
  methods: {
    getUrl(key) {
      return stakeConfigs.network[this.network.type.name].url + '0x' + key;
    },
    details(info) {
      const details = [
        {
          label: this.$tc('dappsStaked.validator', 1),
          info: '0x' + info.validator_key
        },
        {
          label: this.$t('dappsStaked.staked'),
          info: info.amount + ' ' + this.$t('common.currency.eth')
        }
      ];
      // pending && deposited
      if (
        info.status.toLowerCase() === types[0] ||
        info.status.toLowerCase() === types[1]
      ) {
        details.push(
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
        );
      }
      // activated
      if (info.status.toLowerCase() === types[2]) {
        details.push(
          {
            label: this.$t('dappsStaked.activation-timestamp'),
            info: moment(info.activation_timestamp).format(
              'MM/DD/YYYY hh:mm:ss'
            )
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
        );
      }
      // exited
      if (info.status.toLowerCase() === types[4]) {
        details.push({
          label: this.$t('dappsStaked.activation-timestamp'),
          info: moment(info.activation_timestamp).format('MM/DD/YYYY hh:mm:ss')
        });
      }

      return details;
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
        if (status.toLowerCase() === types[4]) {
          return 'exited-expanded';
        }
      }
    },
    isExpanded(idx) {
      return this.expanded === idx;
    },
    expand(idx, status) {
      if (status.toLowerCase() === types[4] && !this.isExpanded(idx)) {
        this.$refs.exitedPopup.$refs.exitedPopup.show();
      }
      this.expanded = this.expanded !== idx ? idx : '';
    },
    truncate(str) {
      return str.slice(0, 4) + '...' + str.slice(str.length - 4, str.length);
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
      if (status.toLowerCase() === types[4]) {
        return 'exited-badge';
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
      if (status.toLowerCase() === types[4]) {
        return 'exited-container';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'Status.scss';
</style>
