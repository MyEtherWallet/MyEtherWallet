<template>
  <div class="mew-component--landing">
    <v-container>
      <v-row
        class="border-radius--10px card-content align-center justify-space-between pa-7 pa-md-16"
      >
        <v-col cols="12" sm="6" md="8" class="pa-0">
          <h2 class="mew-subtitle white--text mb-5">
            <span class="newbie-title-content pr-2">Newbie in crypto?</span
            ><span class="newbie-title-content">Explore MEWtopia!</span>
          </h2>
          <p class="white--text">
            Our media platform where you can learn about crypto, share ideas,
            and become part of a supportive community.
          </p>
        </v-col>
        <v-spacer />
        <mew-button
          pa-xs-10
          pa-md-16
          btn-link="https://www.mewtopia.com/"
          :has-full-width="false"
          title="Get Started"
          btn-style="outline"
          color-theme="white"
          btn-size="xlarge"
        />
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'AppMewtopiaBlock',
  components: {}
};
</script>

<style lang="scss" scoped>
.card-content {
  background-image: url('~@/assets/images/backgrounds/bg-light.jpg');
  background-position: 0px 0px;
  background-size: 100%;
}
.newbie-title-content {
  display: inline-block;
}
</style>
