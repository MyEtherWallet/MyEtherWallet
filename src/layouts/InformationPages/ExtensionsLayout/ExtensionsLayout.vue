<template>
  <div class="extensions">
    <div class="wrap">
      <div class="page-container">
        <title-text-contents :options="titleAndTextContents" />

        <div class="extensions-container">
          <div v-for="ext in extensions" :key="ext.key">
            <div class="logo"><img :src="ext.image" alt /></div>
            <div class="text">
              <p class="title">{{ ext.title }}</p>
              <p class="description">{{ ext.description }}</p>
              <a
                :href="ext.linkURL"
                class="link"
                rel="noopener noreferrer"
                target="_blank"
                >{{ ext.linkName }}</a
              >
            </div>
          </div>
        </div>
      </div>
      <!-- .page-container -->
    </div>
    <!-- .wrap -->
  </div>
</template>

<script>
import TitleTextContentsLayout from '../Components/TitleTextContentsLayout';
import mewLogo from '@/assets/images/logo-small.png';
import metamask from '@/assets/images/icons/button-metamask-fox.svg';
import ethereum from '@/assets/images/icons/ethereum-icon.png';

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
      extensions: [
        {
          image: mewLogo,
          title: 'MyEtherWallet Chrome',
          description: 'Use MEW without internet',
          linkName: 'Download',
          linkURL: 'https://google.com'
        },
        {
          image: metamask,
          title: 'MetaMask Chrome',
          description: 'Use MEW without internet',
          linkName: 'Download',
          linkURL: 'https://google.com'
        },
        {
          image: ethereum,
          title: 'EtherAddressLookup',
          description: 'Use MEW without internet',
          linkName: 'Download',
          linkURL: 'https://google.com'
        }
      ],
      titleAndTextContents: {
        title: 'Extensions',
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
@import 'ExtensionsLayout.scss';
</style>
