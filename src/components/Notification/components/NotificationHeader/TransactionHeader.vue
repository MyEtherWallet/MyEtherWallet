<template lang="html">
  <div class="notification-header" @click="expand()">
    <div class="notification-type-status">
      <p :class="['type', notice.read ? 'read' : 'un-read']">
        {{ typeString }}
      </p>
      <p :class="['status', notice.read ? 'read' : 'un-read', txStatus.class]">
        ({{ txStatus.text }})
      </p>
    </div>
    <div class="time-date">
      <p>{{ timeString(notice) }}</p>
      <p>{{ dateString(notice) }}</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { notificationHeaderLabels, noticeStatusFields } from '../config';

export default {
  props: {
    expand: {
      type: Function,
      default: function() {}
    },
    notice: {
      type: Object,
      default: function() {
        return {};
      }
    },
    processStatus: {
      type: Function,
      default: function() {}
    },
    dateString: {
      type: Function,
      default: function() {}
    },
    timeString: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      unreadCount: 0
    };
  },
  computed: {
    ...mapState(['web3', 'network', 'notifications', 'wallet']),
    typeString() {
      if (notificationHeaderLabels[this.notice.type]) {
        return this.$t(notificationHeaderLabels[this.notice.type]);
      }
      return this.$t(notificationHeaderLabels['transaction']);
    },
    details() {
      return this.notice.body;
    },
    txStatus() {
      return this.processStatus(
        this.notice[noticeStatusFields[this.notice.type]]
      );
    }
  },
  methods: {
    emitShowDetails() {
      this.$emit('showDetails', ['transaction', this.notice]);
    }
  }
};
</script>

<style lang="scss" scoped>
@import './TransactionHeader.scss';
</style>
