<template>
  <div class="terms-and-conditions">
    <div class="wrap">
      <div class="page-container">
        <title-text-contents :options="titleAndTextContents" />
      </div>
    </div>
  </div>
</template>

<script>
import TitleTextContentsLayout from '../Components/TitleTextContentsLayout';

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
        title: 'Terms and Conditions',
        boldSubTitle: 'Last updated May 10, 2018',
        textContent: [
          'The measured steps are meant to avoid an escalation of operations by Russia to more serious computer-based attacks on US information systems and infrastructure.',
          'The US Cyber Command (USCYBERCOM) is engaging in a campaign to deter further disinformation operations by Russian operatives—individuals like those employed through Russian companies as part of the "Project Lakhta" program described in last week\'s Justice Department indictment of Elena Alekseevna Khusyaynova—by letting them know that they are being watched.',
          'The Cyber Command operation, described by unnamed senior military officials, is limited in scope and does not involve directly threatening Russian operatives.',
          "According to a report from the New York Times' Julian E. Barnes, USCYBERCOM has directed operations to identify, track, and directly message individuals involved in disinformation campaigns associated with the upcoming midterm elections."
        ]
      }
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'TermsAndConditionsLayout.scss';
</style>
