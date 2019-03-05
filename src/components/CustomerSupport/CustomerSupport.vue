<template>
  <div class="support">
    <div
      :class="['support-content', !noIcon ? 'with-icon' : 'without-icon']"
      @click="showModal"
    >
      <div v-if="!noIcon" class="support-icon">
        <img src="~@/assets/images/icons/help-center.svg" />
      </div>
      <div v-if="!noIcon" class="support-label">
        <h5>{{ $t('common.customerSupport') }}</h5>
      </div>
      <p v-else>{{ $t('common.customerSupport') }}</p>
    </div>
    <b-modal
      ref="emailPrefill"
      hide-footer
      centered
      class="bootstrap-modal nopadding"
      title="Issue information"
    >
      <div class="email-prefill-inputs">
        <input v-model="browser" placeholder="Browser" />
        <input v-model="os" placeholder="Operating System" />
        <input v-model="device" placeholder="Device/Wallet type (If any)" />
        <input v-model="address" placeholder="Wallet PUBLIC address (If any)" />
        <input v-model="url" placeholder="Url" />
        <textarea v-model="description" placeholder="Describe the issue" />
        <a
          :href="issueLinkOut"
          target="_blank"
          rel="noopener noreferrer"
          class="mid-round-button-green-filled"
        >
          Send
        </a>
      </div>
    </b-modal>
  </div>
</template>

<script>
import platform from 'platform';

export default {
  props: {
    noIcon: {
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
      const body = `
        Browser: ${this.browser},
        Os: ${this.os},
        Device: ${this.device},
        url: ${this.url}
        Wallet Address: ${this.url}


        ${this.description}
      `;
      // eslint-disable-next-line
      return `mailto:support@myetherwallet.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
