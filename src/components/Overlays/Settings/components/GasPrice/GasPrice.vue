<template>
  <v-item-group mandatory>
    <v-row>
      <v-col v-for="button in buttons" :key="button.title" cols="12" md="3">
        <v-item v-slot:default="{ active, toggle }">
          <v-card
            flat
            :color="active ? '#f2fafa' : '#f2fafa'"
            class="d-flex align-center"
            height="200"
            @click="toggle"
          >
            <v-scroll-y-transition>
              <div
                :class="active ? '' : 'inactive'"
                class="flex-grow-1 text-center"
              >
                <img height="55" :src="button.icon" :alt="button.title" />
                <div class="font-weight-bold subtitle-1">
                  {{ button.title }}
                </div>
                <div class="font-weight-medium mb-1">{{ button.gas }}</div>
                <div>{{ button.usd }} ({{ button.time }})</div>
              </div>
            </v-scroll-y-transition>
          </v-card>
        </v-item>
      </v-col>
    </v-row>
  </v-item-group>
</template>

<script>
import economic from '@/assets/images/icons/icon-money-bag-mew.svg';

export default {
  components: {},
  props: {},
  data() {
    return {
      buttons: [
        {
          icon: economic,
          title: 'Economic',
          gas: '1 Gwei',
          usd: '$0.004',
          time: '< 30 min'
        },
        {
          icon: economic,
          title: 'Regular',
          gas: '2 Gwei',
          usd: '$0.008',
          time: '< 10 min'
        },
        {
          icon: economic,
          title: 'Fast',
          gas: '3 Gwei',
          usd: '$0.012',
          time: '< 5 min'
        },
        {
          icon: economic,
          title: 'Custom',
          gas: '0 Gwei',
          usd: '$0',
          time: '0 min'
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
//@import '@/assets/styles/GlobalVariables.scss';

.v-card {
  border-radius: 10px !important;
}

.v-card.v-item--active {
  border: 2px solid #05c0a5 !important;
}

.v-card:not(.v-item--active) {
  background-color: #d8e7f7 !important;
  opacity: 0.3 !important;
}
</style>
