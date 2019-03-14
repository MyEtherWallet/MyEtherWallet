<template>
  <div class="timer">
    <div class="actual-timer">
      <div>
        <img src="@/assets/images/icons/hourglass.svg" alt="" />
        <span v-show="dateType === 'reveal'">
          {{ $t('dapps.revealsBid') }}
        </span>
        <span v-show="dateType === 'auction'">
          {{ $t('dapps.auctionCloses') }}
        </span>
      </div>
      <b>{{ time }}</b>
    </div>

    <span class="deadline">{{ dateToText() }}</span>
  </div>
</template>
<script>
import { Misc } from '@/helpers';
export default {
  props: {
    dateType: {
      type: String,
      default: ''
    },
    dateNumber: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      text: '',
      time: '0 Day(s) --:--:--',
      timer: () => {}
    };
  },
  mounted() {
    if (this.dateNumber !== 0) {
      this.startClock();
    }
  },
  destroyed() {
    const self = this;
    clearInterval(self.timer);
  },
  methods: {
    dateToText() {
      const auctionCloses = new Date(this.dateNumber);
      const revealDate = auctionCloses.setDate(auctionCloses.getDate() - 2);
      return this.dateType === 'reveal'
        ? Misc.formatDate(revealDate)
        : Misc.formatDate(this.dateNumber);
    },
    startClock() {
      const auctionCloses = new Date(this.dateNumber);
      const revealDate = auctionCloses.setDate(auctionCloses.getDate() - 2);
      const endDate =
        this.dateType === 'reveal'
          ? new Date(revealDate).getTime()
          : new Date(this.dateNumber);
      let startDate;
      let hours = 0;
      let seconds = 0;
      let minutes = 0;
      let days = 0;
      let difference;

      this.timer = setInterval(() => {
        startDate = new Date().getTime();
        difference = endDate - startDate;
        seconds = Math.floor((difference % (1000 * 60)) / 1000);
        minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        days = Math.floor(difference / (1000 * 60 * 60 * 24));
        this.time = `${days} Day(s) ${hours < 10 ? '0' + hours : hours}:${
          minutes < 10 ? '0' + minutes : minutes
        }:${seconds < 10 ? '0' + seconds : seconds}`;
        if (seconds < 0) {
          const self = this;
          this.time = 'Reveal bids on going.';
          clearInterval(self.timer);
        }
      }, 1000);
    }
  }
};
</script>
<style lang="scss" scoped>
@import 'Timer.scss';
</style>
