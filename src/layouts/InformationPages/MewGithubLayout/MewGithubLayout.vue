<template>
  <div class="mew-github">
    <div class="wrap">
      <div class="page-container">
        <title-text-contents :options="titleAndTextContents" />

        <ul class="git-info-block">
          <li>Latest Release(V 5.0.5)</li>
          <li>Legacy Site & CX</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import TitleTextContentsLayout from '../Components/TitleTextContentsLayout';
import github from '@/assets/images/icons/github-black.png';

export default {
  components: {
    'title-text-contents': TitleTextContentsLayout
  },
  props: {
    options: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      titleAndTextContents: {
        titleIcon: github,
        title: 'MEW Github',
        boldSubTitle: '',
        textContent: [
          'The measured steps are meant to avoid an escalation of operations by Russia to more serious computer-based attacks on US information systems and infrastructure.'
        ]
      }
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'MewGithubLayout.scss';
</style>
