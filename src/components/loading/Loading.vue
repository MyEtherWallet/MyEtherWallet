<template>
  <div class="mew-component--loading">
    <v-sheet color="transparent" max-width="300px" class="mx-auto">
      <h1>Loading...........</h1>

      <div>
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
        indeterminate
        rounded
        height="15"
        color="primary"
      ></v-progress-linear>
    </v-sheet>
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
    message: {
      default: '',
      type: String
    }
  },
  data: function () {
    return {
      dialog: false
    };
  },
  watch: {
    show(val) {
      this.dialog = val;
    }
  },
  mounted() {
    this.dialog = this.show;
  }
};
</script>

<style lang="scss" scoped></style>
