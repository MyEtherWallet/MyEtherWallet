<template>
  <div class="support">
    <div
      :class="['support-content', !noIcon ? 'with-icon' : 'without-icon']"
      @click="showModal"
    >
      <div v-if="!noIcon" class="support-icon">
        <img
          :alt="$t('common.help-center')"
          src="~@/assets/images/icons/help-center.svg"
        />
      </div>
      <div v-if="!noIcon" class="support-label">
        <h5>{{ $t('common.cstm-support') }}</h5>
      </div>
      <p v-else>{{ $t('common.cstm-support') }}</p>
    </div>
    <b-modal
      ref="emailPrefill"
      :title="$t('common.issue-info')"
      hide-footer
      centered
      class="bootstrap-modal nopadding"
      static
      lazy
    >
      <div class="email-prefill-inputs">
        <input v-model="browser" :placeholder="$t('common.support.browser')" />
        <input v-model="os" :placeholder="$t('common.support.os')" />
        <input v-model="device" :placeholder="$t('common.support.device')" />
        <input v-model="address" :placeholder="$t('common.support.address')" />
        <input v-model="url" :placeholder="$t('common.support.url')" />
        <textarea
          v-model="description"
          :placeholder="$t('common.support.description')"
        />
        <a
          :href="issueLinkOut"
          target="_blank"
          rel="noopener noreferrer"
          class="mid-round-button-green-filled"
        >
          {{ $t('common.send') }}
        </a>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Misc from '@/helpers/misc';
import platform from 'platform';

export default {
  props: {
    noIcon: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      browser: '',
      os: '',
      device: '',
      url: '',
      description: '',
      address: ''
    };
  },
  computed: {
    issueLinkOut() {
      const subject = `Issue on ${this.url}`;
      const body =
        'Browser: ' +
        this.browser +
        ', \n' +
        'Os: ' +
        this.os +
        ', \n' +
        'Device: ' +
        this.device +
        ',\n' +
        'url: ' +
        this.url +
        ', \n' +
        'Wallet Address: ' +
        this.address +
        ',' +
        '\n\n' +
        this.description;
      // eslint-disable-next-line
      return `mailto:support@myetherwallet.com?subject=${encodeURIComponent(
        Misc.stripTags(subject)
      )}&body=${encodeURIComponent(Misc.stripTags(body))}`;
    }
  },
  watch: {
    show() {
      this.showModal();
    }
  },
  mounted() {
    this.browser = platform.name;
    this.os = platform.os.family;
    this.device = platform.product;
    this.url = this.$router.history.current.fullPath;
  },
  methods: {
    showModal() {
      this.$refs.emailPrefill.show();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'CustomerSupport.scss';
</style>
