<template lang="html">
  <div class="permanent-registration-container">
    <div class="permanent-registration-content">
      <b-collapse id="wait-container" :visible="true" class="commitment-wait">
        <div class="circles-container">
          <div class="circle" />
          <div class="circle" />
          <div class="circle" />
        </div>
        <h3>
          Hang on tight! <br />
          We are creating commitment for <br />
          <span class="domain-name"> {{ fullDomainName }}. </span>
        </h3>
      </b-collapse>
      <b-collapse id="commitment-inputs-container" class="commitment-inputs">
        <h3>Commit created! Complete registration for {{ fullDomainName }}</h3>
        <div class="permanent-registration-inputs">
          <label for="secret-phrase">Secret Phrase</label>
          <input
            v-model="secretPhrase"
            placeholder="Please enter secret phrase"
            name="secret-phrase"
          />
        </div>
        <div class="permanent-registration-inputs">
          <label for="duration-input"
            >How many years do you want to keep the name?</label
          >
          <input
            v-model="durationInYears"
            min="1"
            type="number"
            name="duration-input"
          />
        </div>
      </b-collapse>
      <div class="permanent-registration-button">
        <button
          :class="[
            'large-round-button-green-filled',
            !canRegister ? 'disabled' : ''
          ]"
          @click="registerWithDuration(secretPhrase, durationInYears)"
        >
          <span>
            {{ canRegister ? 'Register' : ticker }}
          </span>
        </button>
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

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText
  },
  props: {
    hostName: {
      type: String,
      default: ''
    },
    registerWithDuration: {
      type: Function,
      default: function() {}
    },
    tld: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    minimumAge: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      ticker: `0${this.minimumAge / 60 < 10 ? this.minimumAge / 60 : '00'}:00`,
      timer: () => {},
      canRegister: false,
      secretPhrase: '',
      durationInYears: 1
    };
  },
  computed: {
    fullDomainName() {
      return `${this.hostName}.${this.tld}`;
    }
  },
  destroyed() {
    clearInterval(this.timer);
  },
  mounted() {
    clearInterval(this.timer);
    const _self = this;
    _self.canRegister = false;
    if (_self.hostName === '') {
      _self.$router.push('/interface/dapps/manage-ens');
    }

    const startTime = new Date().getTime();
    const endTime = startTime + _self.minimumAge * 1000;
    if (_self.minimumAge > 0) {
      _self.timer = setInterval(() => {
        const internalStart = new Date().getTime();
        const difference = endTime - internalStart;
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        _self.ticker = `${
          minutes >= 10 ? minutes : minutes < 0 ? '00' : '0' + minutes
        }:${seconds >= 10 ? seconds : seconds < 0 ? '00' : '0' + seconds}`;
        if (seconds < 0) {
          _self.canRegister = true;
          this.$root.$emit(
            'bv::toggle::collapse',
            'commitment-inputs-container'
          );
          this.$root.$emit('bv::toggle::collapse', 'wait-container');
          clearInterval(_self.timer);
        }
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'PermanentRegistrationContainer.scss';
</style>
