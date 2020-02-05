<template>
  <div class="component--address d-flex align-center">
    <div class="monospace full-address">{{ address }}</div>
    <div class="monospace last-four">{{ getLastFour(address) }}</div>
    <Tooltip text="Copy">
      <v-btn text icon :color="iconColor">
        <img src="@/assets/images/Common/Icons/copy.svg" width="13" />
      </v-btn>
    </Tooltip>
  </div>
</template>

<script>
import Tooltip from '@/components/Tooltip';

export default {
  components: { Tooltip },
  props: {
    address: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      iconColor: 'white'
    };
  },
  methods: {
    getLastFour(address) {
      return address.substr(address.length - 4);
    }
  }
};
</script>

<style lang="scss" scoped>
.component--address * {
  color: white;
}

.full-address {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 165px;
}

.last-four {
  margin-left: -4px;
}
</style>
