<template>
  <div>
    <mew-popup
      max-width="615px"
      :show="showPopup"
      title="Search ETH Blocks by date and time"
      :has-buttons="false"
      :has-body-content="true"
      :left-btn="leftBtn"
    >
      <div>
        <v-row>
          <v-col cols="6">
            <v-date-picker
              v-model="date"
              :allowed-dates="allowedDates"
              full-width
            />
          </v-col>
          <v-col cols="6">
            <v-time-picker v-model="time" format="ampm" full-width />
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
    },
    hidePopup: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    const date = new Date();
    return {
      date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      time: '',
      allowedDates: val => {
        return (
          new Date(val).getTime() >= new Date('07-30-2015').getTime() &&
          new Date(val).getTime() <= new Date().getTime()
        );
      },
      leftBtn: {
        method: this.hidePopup
      }
    };
  }
};
</script>
