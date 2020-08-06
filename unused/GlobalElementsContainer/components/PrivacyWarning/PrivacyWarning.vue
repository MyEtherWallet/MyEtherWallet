<template>
  <div class="text-center">
    <v-bottom-sheet v-model="sheet">
      <v-sheet color="#184f8f">
        <v-container>
          <div class="d-flex align-center py-3">
            <div class="white--text">
              This website uses cookies to enhance the user experience. To learn
              more visit our
              <a class="teal--text text--lighten-2" href="/">Privacy Policy.</a>
            </div>
            <v-spacer />
            <mew-button title="I understood" @click.native="sheet = !sheet" />
          </div>
        </v-container>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<script>
export default {
  name: 'PrivacyWarning',
  components: {},
  data: () => ({
    sheet: false
  }),
  mounted() {
    // Open Privacy warning after 3 seconds
    setTimeout(() => {
      this.openPrivacyWarning();
    }, 2000);
  },
  methods: {
    openPrivacyWarning() {
      //this.sheet = true;
    }
  }
};
</script>

<style lang="scss" scoped></style>
