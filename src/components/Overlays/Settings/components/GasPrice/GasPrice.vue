<template>
  <div>
    <div>Please select a default gas price for your transaction fee</div>
    <v-sheet color="transparent" max-width="500px" class="mx-auto">
      <mew-toggle-btn button-type="custom">
        <template v-slot:btn1>
          <mew-super-button
            title="Economic"
            subtitle="1 Gwei"
            tag="$0.004 (< 30 min)"
            right-icon="BICYCLE"
            icon-type="mew"
            :is-column="true"
          />
        </template>
        <template v-slot:btn2>
          <mew-super-button
            title="Regular"
            subtitle="2 Gwei"
            tag="$0.008 (< 10 min)"
            right-icon="CAR"
            icon-type="mew"
            :is-column="true"
          />
        </template>
        <template v-slot:btn3>
          <mew-super-button
            title="Fast"
            subtitle="3 Gwei"
            tag="$0.012 (< 5 min)"
            right-icon="ROCKET"
            icon-type="mew"
            :is-column="true"
          />
        </template>
      </mew-toggle-btn>

      <div class="mt-9 d-flex">
        <mew-input
          label="Customize"
          placeholder=" "
          right-label="$0.00 (-min)"
          value="0 Gwei"
          class="flex-grow-1 mr-3"
        />
        <mew-button title="Confirm" button-size="xlarge" />
      </div>
    </v-sheet>
  </div>
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
