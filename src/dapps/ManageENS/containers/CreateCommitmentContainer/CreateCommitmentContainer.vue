<template lang="html">
  <div class="transfer-registrar-container">
    <div class="transfer-registrar-content">
      <h3>Congratulations! {{ fullDomainName }} is available!</h3>
      <p>Do you want to register {{ fullDomainName }}?</p>
      <div class="secret-phrase-container">
        <label for="range-slider"
          >How many years do you want to keep the name?</label
        >
        <b-form-input
          id="range-slider"
          v-model="duration"
          type="range"
          min="1"
          max="20"
          step="1"
        />
        <div>{{ duration > 1 ? `${duration} years` : `${duration} year` }}</div>
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
            Register
          </span>
          <i v-show="loading" class="fa fa-spinner fa-spin" />
        </button>
        <span v-show="info.disable"> {{ info.msg }} </span>
      </div>
    </div>
    <interface-bottom-text
      :link-text="$t('interface.helpCenter')"
      :question="$t('interface.haveIssues')"
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
    ...mapState(['account']),
    fullDomainName() {
      return `${this.hostName}.${this.tld}`;
    },
    info() {
      const balance = this.account.balance;
      if (balance === '0') {
        return {
          disable: true,
          msg: 'You have no balance to send a Tx'
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
      this.$router.push('/interface/dapps/manage-ens', () => {}, () => {});
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'CreateCommitmentContainer.scss';
</style>
