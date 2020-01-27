<template lang="html">
  <div class="transfer-registrar-container">
    <div class="transfer-registrar-content">
      <h3>{{ $t('ens.commit.is-available', { domain: fullDomainName }) }}</h3>
      <p>{{ $t('ens.commit.register-domain', { domain: fullDomainName }) }}</p>
      <div class="secret-phrase-container">
        <label for="range-slider">{{ $t('ens.commit.how-many-years') }}</label>
        <b-form-input
          id="range-slider"
          v-model="duration"
          type="range"
          min="1"
          max="20"
          step="1"
        />
        <div>
          {{
            duration > 1
              ? $tc('ens.commit.year', 2, { duration: duration })
              : $tc('ens.commit.year', 1)
          }}
        </div>
      </div>
      <div class="transfer-registrar-button">
        <button
          :class="[
            'large-round-button-green-filled',
            loading ? 'disabled' : '',
            info.disable ? 'disabled' : ''
          ]"
          @click="createCommitment"
        >
          <span v-show="!loading">
            {{ $t('ens.register') }}
          </span>
          <i v-show="loading" class="fa fa-spinner fa-spin" />
        </button>
        <span v-show="info.disable"> {{ $t(info.msg) }} </span>
      </div>
    </div>
    <interface-bottom-text
      :link-text="$t('common.help-center')"
      :question="$t('common.have-issues')"
      link="https://kb.myetherwallet.com"
    />
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import { mapState } from 'vuex';

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText
  },
  props: {
    hostName: {
      type: String,
      default: ''
    },
    createCommitment: {
      type: Function,
      default: function() {}
    },
    loading: {
      type: Boolean,
      default: false
    },
    tld: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      duration: '1'
    };
  },
  computed: {
    ...mapState('main', ['account']),
    fullDomainName() {
      return `${this.hostName}.${this.tld}`;
    },
    info() {
      const balance = this.account.balance;
      if (balance === '0') {
        return {
          disable: true,
          msg: 'ens.commit.no-balance'
        };
      }
      return {
        disable: false,
        msg: ''
      };
    }
  },
  watch: {
    duration(newVal) {
      this.$emit('updateDuration', Number(newVal));
    }
  },
  mounted() {
    if (this.hostName === '') {
      this.$router.push('/interface/dapps/manage-ens');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'CreateCommitmentContainer.scss';
</style>
