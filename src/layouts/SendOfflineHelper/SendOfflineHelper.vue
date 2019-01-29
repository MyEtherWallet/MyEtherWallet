<template>
  <div class="send-offline-helper">
    <div class="wrap">
      <div class="page-title"><page-title :options="titleOptions" /></div>
    </div>
  </div>
</template>

<script>
import TitleTextContentsLayout from '@/layouts/InformationPages/Components/TitleTextContentsLayout';

export default {
  components: {
    'page-title': TitleTextContentsLayout
  },
  data() {
    return {
      titleOptions: {
        title: 'Send Offline Helper',
        boldSubTitle: '',
        textContent: [
          'Customize actions, debug reveals, and more with this set of advance tools. Please be mindful of the capabilities and limitations of these tools before using.'
        ]
      }
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'SendOfflineHelper.scss';
</style>
