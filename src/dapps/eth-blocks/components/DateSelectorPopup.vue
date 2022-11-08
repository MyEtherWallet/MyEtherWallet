<template>
  <div>
    <mew-popup
      max-width="690px"
      :show="showPopup"
      title="Search ETH Blocks by date and time"
      :has-buttons="false"
      :has-body-content="true"
      :left-btn="leftBtn"
    >
      <div>
        <v-row>
          <v-col cols="12" sm="12" lg="6" md="6">
            <v-date-picker
              v-model="date"
              :allowed-dates="allowedDates"
              :max="currentDate"
              min="2015-07-30"
              color="#05C0A5"
              full-width
            />
          </v-col>
          <v-col cols="12" sm="12" lg="6" md="6">
            <v-time-picker
              v-model="time"
              :max="currentTime"
              format="ampm"
              color="#05C0A5"
              full-width
            />
          </v-col>
        </v-row>
        <v-divider class="mt-4" />
        <div class="d-flex align-center justify-end py-7 px-5">
          <mew-button
            btn-size="large"
            btn-style="transparent"
            title="Cancel"
            color-theme="primary"
            @click.native="hidePopup"
          />
          <mew-button
            btn-size="large"
            btn-style="background"
            title="Next"
            color-theme="primary"
            class="ml-2"
            :disabled="!disableNext"
            @click.native="next"
          />
        </div>
      </div>
    </mew-popup>
  </div>
</template>

<script>
import moment from 'moment';

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
    },
    searchDate: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    const date = new Date();
    return {
      date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      time: '',
      leftBtn: {
        method: this.hidePopup
      }
    };
  },
  computed: {
    disableNext() {
      return this.time && this.date;
    },
    currentDate() {
      return new Date().toISOString();
    },
    /*
     * Get current time behind 10 minutes
     */
    currentTime() {
      const today = moment().format('YYYY-MM-DD');
      return today === this.date
        ? moment().subtract(10, 'minutes').format('HH:mm')
        : undefined;
    }
  },
  methods: {
    next() {
      const time = moment(`${this.date} ${this.time}`).valueOf();
      this.searchDate(time);
    },
    allowedDates(val) {
      return (
        moment(val).isSameOrBefore(moment()) &&
        moment(val).isSameOrAfter(moment('2015-07-30')) &&
        moment(val).isSameOrBefore(moment())
      );
    }
  }
};
</script>
