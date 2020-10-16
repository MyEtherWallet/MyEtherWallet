<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title
          class="headline lighten-2 d-flex align-center justify-space-between black"
        >
          <h4 class="white--text">{{ title }}</h4>
          <v-btn
            fab
            small
            depressed
            color="transparent"
            @click="dialog = false"
          >
            <v-icon large color="white"> mdi-close </v-icon>
          </v-btn>
        </v-card-title>
        <slot />
        <div class="d-flex justify-center pb-8">
          <mew-button
            :title="button"
            btn-size="xlarge"
            @click.native="dialog = false"
          />
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    open: {
      default: false,
      type: Boolean
    },
    title: {
      default: '',
      type: String
    },
    button: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      dialog: false
    };
  },
  watch: {
    open(newVal) {
      this.dialog = newVal;
    },
    dialog(newVal) {
      if (newVal === false) {
        this.$emit('close');
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
