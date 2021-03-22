<template>
  <v-sheet
    class="pa-12 text-center"
    rounded
    color="white"
    elevation="1"
    width="500"
  >
    <v-row
      v-for="(detail, idx) in details"
      :key="idx"
      class="d-flex align-center"
    >
      <v-col class="d-flex align-center" cols="6"
        ><span>{{ detail.title }}</span>
        <mew-tooltip v-if="detail.tooltip" class="ml-1" :text="detail.tooltip"
      /></v-col>
      <v-col class="font-weight-bold d-flex align-center justify-end" cols="6">
        <img v-if="detail.icon" :src="detail.icon" height="20" class="mr-1" />
        <v-icon v-if="detail.indicator" :class="detail.class">{{
          detail.indicator
        }}</v-icon>
        <span :class="detail.class">{{ detail.value }}</span>
      </v-col>
    </v-row>
    <mew-button class="mt-10" title="Confirm" btn-size="xlarge" />
  </v-sheet>
</template>

<script>
import ethImg from '@/assets/images/currencies/icon-eth-blue.png';

export default {
  computed: {
    details() {
      /* currently using dummy data for values */
      return [
        { title: 'Currency', value: 'Ethereum', icon: ethImg },
        {
          title: 'Current Health Factor',
          tooltip: 'Tooltip text',
          value: this.currentHealthFactor,
          class:
            this.currentHealthFactor > this.nextHealthFactor
              ? 'primary--text'
              : 'error-text'
        },
        {
          title: 'Next Health Factor',
          tooltip: 'Tooltip text',
          value: '2.1725',
          class:
            this.currentHealthFactor > this.nextHealthFactor
              ? 'error--text'
              : 'primary-text',
          indicator:
            this.currentHealthFactor > this.nextHealthFactor
              ? 'mdi-arrow-down'
              : 'mdi-arrow-up'
        }
      ];
    },
    currentHealthFactor() {
      return '2.4725';
    },
    nextHealthFactor() {
      return '2.1715';
    }
  }
};
</script>
