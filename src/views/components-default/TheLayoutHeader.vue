<template>
  <v-sheet
    tile
    class="page-title-container pt-16 pb-6 pb-md-11"
    color="expandHeader"
  >
    <v-container class="text-center white--text pt-13 pt-md-16">
      <h1 class="mb-3">{{ title }}</h1>
      <div style="max-width: 550px" class="mx-auto">
        <h4>{{ subtitleLineOne }}</h4>
        <h4>
          {{ subtitleLineTwo }}
          <router-link
            v-if="hasLink"
            :to="{ name: routeObj.routeName }"
            class="text-decoration--underline"
            @click.native="routeObj.func ? routeObj.func : () => {}"
          >
            {{ routeObj.text }}
          </router-link>
        </h4>
      </div>
    </v-container>
  </v-sheet>
</template>

<script>
export default {
  name: 'TheLayoutHeader',
  props: {
    title: { default: '', type: String },
    subtitleLineOne: { default: '', type: String },
    subtitleLineTwo: { default: '', type: String },
    /**
     * If you use this prop set hasLink to true, otherwise it will not be dispalyed.
     * routeObj should have the following:
     * {
     * @text string // text to be displayed
     * @rounteName string // route name of the router.js
     * }
     */
    routeObj: {
      default: function () {
        return {};
      },
      type: Object
    },
    hasLink: { default: false, type: Boolean }
  }
};
</script>
