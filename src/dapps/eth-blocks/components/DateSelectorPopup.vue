<template>
  <div>
    <mew-popup
      max-width="615px"
      :show="showPopup"
      title="Search ETH Blocks by date and time"
      :has-buttons="false"
      :has-body-content="true"
    >
      <div>
        <v-row>
          <v-col cols="6">
            <v-date-picker v-model="date" />
          </v-col>
          <v-col cols="6">
            <v-time-picker v-model="time" />
          </v-col>
        </v-row>
      </div>
    </mew-popup>
  </div>
</template>

<script>
export default {
  name: 'DateSelectorPopup',
  props: {
    showPopup: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      date: '',
      time: ''
    };
  }
};
</script>
