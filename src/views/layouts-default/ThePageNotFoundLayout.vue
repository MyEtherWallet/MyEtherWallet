<template>
  <v-container class="py-10 py-md-15 text-center">
    <img
      src="@/assets/images/backgrounds/bg-404.svg"
      alt="404"
      style="max-width: 900px"
    />

    <div class="px-2">
      <div
        :class="$vuetify.breakpoint.mdAndUp ? 'mew-title' : 'mew-subtitle'"
        class="textDark--text mt-6"
      >
        Oops! Page not found.
      </div>

      <div
        :class="$vuetify.breakpoint.mdAndUp ? 'mew-heading-2' : 'mew-heading-3'"
        class="greenPrimary--text mx-auto mt-2 mt-md-6"
        style="max-width: 400px"
      >
        We can't seem to find the page you are looking for.
      </div>
    </div>

    <mew-button
      title="Home"
      class="mt-8"
      btn-size="xlarge"
      @click.native="$router.push({ name: 'Home' })"
    />
  </v-container>
</template>

<script>
export default {
  name: 'ThePageNotFound',
  components: {}
};
</script>

<style lang="scss" scoped></style>
