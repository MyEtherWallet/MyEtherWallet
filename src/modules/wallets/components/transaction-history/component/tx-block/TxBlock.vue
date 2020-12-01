<template>
  <div
    class="mew-component--tx-block d-flex align-center justify-space-between"
  >
    <div class="d-flex align-center text-overflow--ellipsis">
      <div class="d-flex align-center mr-2">
        <v-icon :color="getStatusColor(status)" class="mr-1">
          mdi-circle-medium
        </v-icon>
        <mew-blockie :address="address" width="30px" height="30px" />
      </div>
      <div class="text-overflow--ellipsis">
        <div class="d-flex align-center">
          <div class="mr-1">From:</div>
          <ellipsisBlock :text="address" max-width="110px" class="monospace" />
        </div>
        <div class="d-flex align-center">
          <div class="mr-1">Amount:</div>
          <ellipsisBlock :text="amount" max-width="110px" class="monospace" />
        </div>
      </div>
    </div>
    <div class="text-right flex-grow-1">
      <badge :type="direction" />
      <div>{{ time }} ago</div>
    </div>
  </div>
</template>

<script>
import ellipsisBlock from '@/components/ellipsisBlock/EllipsisBlock';
import badge from '@/components/badge/Badge';

export default {
  components: { ellipsisBlock, badge },
  props: {
    address: {
      type: String,
      default: ''
    },
    amount: {
      type: String,
      default: ''
    },
    time: {
      type: String,
      default: ''
    },
    direction: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: 'success'
    }
  },
  data() {
    return {};
  },
  methods: {
    getStatusColor(status) {
      let color = '';

      switch (status) {
        case 'success':
          color = 'primary';
          break;

        case 'pending':
          color = 'orange';
          break;

        case 'error':
          color = 'red';
          break;

        default:
          color = 'primary';
      }

      return color;
    }
  }
};
</script>

<style lang="scss">
.mew-component--tx-block div {
  font-size: 0.8rem;
  line-height: 1.1rem;
}
</style>
