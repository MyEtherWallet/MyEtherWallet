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

<script setup>
import { ref, computed } from 'vue';
import moment from 'moment';

// props
const props = defineProps({
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
});

// data
const date = ref(
  `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()}`
);
const time = ref('');
const leftBtn = {
  method: props.hidePopup
};

// computed
const disableNext = computed(() => time.value && date.value);
const currentDate = new Date().toISOString();
const currentTime = computed(() =>
  moment().isSame(moment(date.value), 'day')
    ? moment().subtract(10, 'minutes').format('HH:mm')
    : undefined
);

// methods
const next = () => {
  const time = moment(`${date.value} ${time.value}`).valueOf();
  props.searchDate(time);
};

const allowedDates = val => {
  return (
    moment(val).isSameOrBefore(moment()) &&
    moment(val).isSameOrAfter(moment('2015-07-30')) &&
    moment(val).isSameOrBefore(moment())
  );
};
</script>
