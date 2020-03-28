<template>
  <v-item-group>
    <v-row>
      <v-col v-for="n in 4" :key="n" cols="12" md="3">
        <v-item v-slot:default="{ active, toggle }">
          <v-card
            flat
            :color="active ? 'primary' : 'grey'"
            class="d-flex align-center"
            height="200"
            @click="toggle"
          >
            <v-scroll-y-transition>
              <div v-if="active" class="flex-grow-1 text-center">
                a
              </div>
            </v-scroll-y-transition>
          </v-card>
        </v-item>
      </v-col>
    </v-row>
  </v-item-group>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables.scss';
</style>
