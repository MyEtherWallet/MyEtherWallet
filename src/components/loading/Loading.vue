<template>
  <div class="mew-component--loading">
    <v-dialog
      v-model="dialog"
      max-width="500px"
      content-class="mew-component--loading--loading-dialog"
      persistent
    >
      <div class="loading-container pa-5">
        <div class="loading-img">
          <img
            class="spaceman"
            src="@/assets/images/icons/icon-spaceman.png"
            alt="Spaceman"
          />
          <img
            class="logo"
            src="@/assets/images/icons/icon-mew-logo.png"
            alt="MEW logo"
          />
        </div>
        <v-progress-linear
          color="white"
          height="20"
          indeterminate
          rounded
          content-class="mew-component--loading--progress"
        ></v-progress-linear>
        <v-sheet
          max-width="400px"
          class="text-center mt-5 mx-auto"
          color="transparent"
        >
          <h4 class="white--text font-weight-bold mt-2">{{ message }}</h4>
          <div v-if="timer" class="d-flex align-center justify-center mt-3">
            <v-icon color="white" class="mr-1">mdi-timer</v-icon>
            <h1 class="white--text font-weight-bold">
              {{ timerCount }} <span>sec</span>
            </h1>
          </div>
        </v-sheet>
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  components: {},
  props: {
    show: {
      default: false,
      type: Boolean
    },
    timer: {
      default: false,
      type: Boolean
    },
    message: {
      default: '',
      type: String
    }
  },
  data: function () {
    return {
      dialog: true,
      timerCount: 0
    };
  },

  watch: {
    show(val) {
      this.dialog = val;
    },
    timerCount: {
      handler() {
        setTimeout(() => {
          this.timerCount++;
        }, 1000);
      },
      immediate: true
    }
  },
  mounted() {
    this.dialog = this.show;
  }
};
</script>

<style lang="scss" scoped>
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading-container {
  //background-color: white;
}

.loading-img {
  position: relative;
  height: 170px;
  overflow: hidden;

  .spaceman {
    position: absolute;
    top: 0;
    left: -170px;
    right: 0;
    margin: 0 auto;
    width: 150px;
    z-index: 2;
  }

  .logo {
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 200px;
    z-index: 1;
    animation: rotate 0.5s linear infinite;
  }
}
</style>

<style lang="scss">
.mew-component--loading--loading-dialog {
  box-shadow: none !important;
}

.mew-component--loading--progress {
  margin: 0 auto;
}
</style>
