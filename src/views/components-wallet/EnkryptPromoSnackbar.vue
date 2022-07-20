<template>
  <div class="enkrypt-promo-snackbar">
    <v-snackbar
      :value="showEnkrypt"
      :width="width"
      :height="height"
      :timeout="-1"
      light
      left
      rounded
      transition="scale-transition"
      content-class="mew-survey-content"
      style="padding-left: 20px"
    >
      <div class="d-flex justify-space-between flex-column">
        <div class="close d-flex justify-space-between align-center">
          <v-btn icon @click="closeEnkryptPopup"
            ><v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <div>
          <div class="d-flex justify-space-between">
            <span class="title mew-heading-1">Enkrypt</span>
            <span class="content ml-4 mew-heading-5 font-weight-bold">
              Access your wallet and switch accounts in seconds with our
              official browser extension
            </span>
          </div>
        </div>
      </div>
      <div class="btn-container">
        <a href="" class="learn-more" style="color: #939fb9">Learn More</a>
        <mew-button color-theme="#7E44F2" class="extension-btn ml-4">
          <img
            class="chrome-logo mr-3"
            src="@/assets/images/icons/icon-chrome.svg"
            alt="chrome"
          />
          Install Extension
        </mew-button>
      </div>
    </v-snackbar>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import moment from 'moment';
export default {
  data() {
    return {
      timeoutHolder: null,
      showEnkrypt: false
    };
  },
  computed: {
    ...mapState('wallet', [
      'address',
      'web3',
      'showInitialPromo',
      'closedInitialPromo',
      'showForSeven',
      'showForFourteen'
    ]),
    ...mapGetters('global', ['network']),
    ...mapGetters('global', ['isEthNetwork', 'network']),
    width() {
      return '375px';
    },
    height() {
      return '200px';
    },
    shouldShow() {
      if (this.diff === 7 && this.showForSeven) {
        return true;
      }
      if (this.diff === 14 && this.showForFourteen) {
        return true;
      }
      return !this.showInitialPromo;
    },
    diff() {
      if (this.closedInitialPromo !== '') {
        const diff = moment(new Date()).diff(
          moment(this.closedInitialPromo),
          'days'
        );
        return diff;
      }
      return 0;
    }
  },
  watch: {
    closedInitialPromo(newVal) {
      if (newVal) {
        this.checkAndOpen();
      }
    }
  },
  mounted() {
    this.checkAndOpen();
  },
  methods: {
    ...mapActions('wallet', ['hideForSeven', 'hideForFourteen']),
    checkAndOpen() {
      if (this.closedInitialPromo) {
        if (this.diff === 7 || this.diff === 14) {
          this.delayOpenSnackBar();
        }
      }
    },
    setCloseState() {
      if (this.diff === 7) {
        this.hideForSeven();
      }
      if (this.diff === 14) {
        this.hideForFourteen();
      }
    },
    closeEnkryptPopup() {
      this.setCloseState();
      this.showEnkrypt = false;
    },
    delayOpenSnackBar() {
      this.timeoutHolder = setTimeout(() => {
        this.showEnkrypt = this.shouldShow;
      }, 3000);
    }
  }
};
</script>
<style lang="scss">
.title {
  position: absolute;
  top: 12%;
  left: 8%;
}
.close {
  position: absolute;
  top: 8%;
  right: 5%;
}
.content {
  width: 312px;
  height: 40px;
  margin-bottom: 20px;
}
.popup-container {
  height: 210px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: left;
  overflow: hidden;
  border: 3px solid red;
}
.btn-container {
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 15%;
  left: 0%;
}
.mew-pop-btns {
  display: none;
}
.extension-btn {
  width: 212px;
  height: 48px;
}
.chrome-logo {
  width: 25px;
  height: 25px;
}
</style>
