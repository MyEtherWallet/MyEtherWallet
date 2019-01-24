<template>
  <div class="schedule-transaction-container">
    <back-button />
    <div class="schedule-transaction-content">
      <div class="schedule-transaction-form-container">
        <div class="title"><h4>Schedule a transaction</h4></div>
        <div class="form">
          <div
            class="submit-button large-round-button-green-filled clickable"
            @click="scheduleTx"
          >
            Schedule
          </div>
        </div>
      </div>
      <div>
        <interface-bottom-text
          :link-text="$t('interface.helpCenter')"
          :question="$t('interface.haveIssues')"
          link="https://www.ethereum-alarm-clock.com/"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { EAC } from '@ethereum-alarm-clock/lib';

import BackButton from '@/layouts/InterfaceLayout/components/BackButton';
import InterfaceContainerTitle from '@/layouts/InterfaceLayout/components/InterfaceContainerTitle';
import InterfaceBottomText from '@/components/InterfaceBottomText';

export default {
  name: 'ScheduleTransaction',
  components: {
    'back-button': BackButton,
    'interface-container-title': InterfaceContainerTitle,
    'interface-bottom-text': InterfaceBottomText
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['web3', 'network', 'wallet'])
  },
  methods: {
    scheduleTx: async function() {
      const eac = new EAC(this.web3);
      const now = Math.round(new Date().getTime() / 1000);
      const oneDayFromNow = now + 24 * 60 * 60;

      await eac.schedule({
        toAddress: '0xe87529A6123a74320e13A6Dabf3606630683C029',
        windowStart: oneDayFromNow
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ScheduleTransaction.scss';
</style>
