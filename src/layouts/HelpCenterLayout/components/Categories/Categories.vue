<template>
  <div class="categories">
    <div class="wrap">

      <ul class="category-buttons">
        <li
          v-for="button in categoryButtons"
          :key="button.key"><category-button :content="button" /></li>
      </ul>

      <div class="link-blocks">
        <link-block
          v-for="block in linkBlocks"
          :key="block.key"
          :content="block" />
      </div>

    </div>
  </div>
</template>

<script>
import CategoryButton from '../CategoryButton';
import LinkBlock from '../LinkBlock';

import iconCommunity from '@/assets/images/HelpCenter/community.svg';
import iconDrivingDeeper from '@/assets/images/HelpCenter/driving-deepper.svg';
import iconEns from '@/assets/images/HelpCenter/ens.svg';
import iconGetStarted from '@/assets/images/HelpCenter/get-started.svg';
import iconGithub from '@/assets/images/icons/github.svg';
import iconHardware from '@/assets/images/HelpCenter/hardware.svg';
import iconMigrating from '@/assets/images/HelpCenter/migrating.svg';
import iconNetwork from '@/assets/images/icons/network.svg';
import iconOffline from '@/assets/images/HelpCenter/offline.svg';
import iconReddit from '@/assets/images/icons/reddit.svg';
import iconSecurity from '@/assets/images/HelpCenter/security.svg';
import iconSend from '@/assets/images/HelpCenter/send.svg';
import iconSlack from '@/assets/images/icons/slack.svg';
import iconSuggestions from '@/assets/images/HelpCenter/suggestions.svg';
import iconSupport from '@/assets/images/HelpCenter/support.svg';
import iconTokens from '@/assets/images/HelpCenter/tokens.svg';
import iconTx from '@/assets/images/HelpCenter/tx.svg';

export default {
  components: {
    'category-button': CategoryButton,
    'link-block': LinkBlock
  },
  data() {
    return {
      categoryButtons: [
        { icon: iconGetStarted, title: 'Get Started' },
        { icon: iconSecurity, title: 'Security / Phishing' },
        { icon: iconSend, title: 'Send / Swap' },
        { icon: iconMigrating, title: 'Migrating' },
        { icon: iconTokens, title: 'Tokens' },
        { icon: iconOffline, title: 'Offline' },
        { icon: iconTx, title: 'Transactions' },
        { icon: iconHardware, title: 'Hardware Wallets' },
        { icon: iconEns, title: 'ENS' },
        { icon: iconNetwork, title: 'Networks / Nodes' },
        { icon: iconDrivingDeeper, title: 'Driving Deeper' },
        { icon: iconSuggestions, title: 'Suggestions' }
      ],
      linkBlocks: [
        {
          icon: iconSupport,
          title: 'Customer Support',
          description:
            "Can't find your answer? Get in touch and we'll get back as soon as we can.",
          email: 'support@myetherwallet.com'
        },
        {
          icon: iconCommunity,
          title: 'Community',
          description:
            'Join our MEW community, and get more information from us.',
          social: [
            { icon: iconSlack, link: 'https://slack.com' },
            { icon: iconReddit, link: 'https://reddit.com' },
            { icon: iconGithub, link: 'https://github.com' }
          ]
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'Categories.scss';
</style>
