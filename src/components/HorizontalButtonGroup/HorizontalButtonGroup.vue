<template>
  <div class="horizontal-button-group">
    <ul class="flex--row--align-center button-container">
      <li v-for="button in buttons" :key="button.key">
        <img :src="button.icon" />
        <h4>{{ button.title }}</h4>
        <p>{{ button.description }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import IconEns from '@/assets/images/icons/dashboard/domain.svg';
import IconMaker from '@/assets/images/icons/dashboard/maker.svg';
import IconDomain from '@/assets/images/icons/dashboard/domain.svg';

export default {
  components: {},
  props: {
    greytitle: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      buttons: [
        {
          title: 'Register ENS',
          description: 'Register or buy your domain here',
          icon: IconEns
        },
        {
          title: 'Maker',
          description: 'Collateralize & Generate DAI',
          icon: IconMaker
        },
        {
          title: 'Domain Sale',
          description: ' Sale your domain here',
          icon: IconDomain
        }
      ]
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'HorizontalButtonGroup.scss';
</style>
