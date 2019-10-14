<template lang="html">
  <div class="permanent-registration-container">
    <div class="permanent-registration-content">
      <div id="wait-container" class="commitment-wait">
        <div class="circles-container">
          <div class="circle" />
          <div class="circle" />
          <div class="circle" />
        </div>
        <h3>
          Hang on tight! <br />
          We are finalizing the registration for <br />
          <span class="domain-name"> {{ fullDomainName }}. </span>
        </h3>
      </div>
      <div v-show="commitmentCreated" class="permanent-registration-button">
        <button
          :class="[
            'large-round-button-green-filled',
            !canRegister ? 'disabled' : ''
          ]"
          @click="registerWithDuration"
        >
          <span>
            {{ canRegister ? 'Register' : ticker }}
          </span>
        </button>
      </div>
    </div>
    <interface-bottom-text
      :link-text="$t('common.help-center')"
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
    },
    commitmentCreated: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ticker: `0${this.minimumAge / 60 < 10 ? this.minimumAge / 60 : '00'}:00`,
      timer: () => {},
      canRegister: false
    };
  },
  computed: {
    fullDomainName() {
      return `${this.hostName}.${this.tld}`;
    }
  },
  watch: {
    commitmentCreated(newVal) {
      if (newVal) {
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
      } else {
        clearInterval(this.timer);
      }
    }
  },
  mounted() {
    if (this.hostName === '') this.$router.push('/interface/dapps/manage-ens');
  },
  destroyed() {
    clearInterval(this.timer);
  }
};
</script>

<style lang="scss" scoped>
@import 'PermanentRegistrationContainer.scss';
</style>
