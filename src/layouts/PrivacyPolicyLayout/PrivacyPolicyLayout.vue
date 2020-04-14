<template>
  <div class="privacy-policy">
    <div class="wrap">
      <div class="page-container">
        <div class="content-width-limit">
          <div class="page-header">
            <h1>{{ $t('privacyPol.title') }}</h1>
            <h6>{{ $t('privacyPol.date') }}</h6>
          </div>

          <div class="content">
            <div v-for="item in items" :key="item">
              <p
                v-if="
                  item.includes('paragraph') ||
                  item.includes('sentence') ||
                  item.includes('footer')
                "
              >
                {{ $t(`privacyPol.${item}`) }}
                <a
                  v-show="
                    $t(`privacyPol.${item}`).includes('at:') ||
                    $t(`privacyPol.${item}`).includes('to:')
                  "
                  href="mailto:support@myetherwallet.com"
                  rel="noopener noreferrer"
                >
                  {{ $t('common.support-email') }}
                </a>
              </p>
              <p v-else-if="item.includes('item')">
                {{ item[item.length - 1] }}. {{ $t(`privacyPol.${item}`) }}
              </p>
              <h4 v-else-if="item.includes('subtitle')">
                {{ $t(`privacyPol.${item}`) }}
              </h4>
              <h3 v-else>
                {{ $t(`privacyPol.${item}`) }}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        'introduction',
        'introduction-paragraph-1',
        'introduction-paragraph-2',
        'introduction-paragraph-3',
        'introduction-paragraph-4',
        'the-blockchain',
        'the-blockchain-paragraph',
        'what-we-collect',
        'what-we-collect-paragraph-1',
        'what-we-collect-subtitle-1',
        'what-we-collect-paragraph-2',
        'what-we-collect-subtitle-2',
        'what-we-collect-paragraph-3',
        'use-of-information',
        'use-of-information-paragraph-1',
        'use-of-information-paragraph-2',
        'sharing-personal-info',
        'sharing-personal-info-paragraph-1',
        'sharing-personal-info-paragraph-2',
        'sharing-personal-info-subtitle',
        'sharing-personal-info-paragraph-3',
        'links-to-other-sites',
        'links-to-other-sites-paragraph',
        'mew-commitment',
        'mew-commitment-paragraph',
        'personal-info-security',
        'personal-info-security-paragraph',
        'personal-info-security-sentence-1',
        'personal-info-security-item1',
        'personal-info-security-item2',
        'personal-info-security-item3',
        'personal-info-security-item4',
        'personal-info-security-item5',
        'personal-info-security-item6',
        'personal-info-security-footer',
        'legal-basis',
        'legal-basis-paragraph',
        'legal-basis-item1',
        'legal-basis-item2',
        'retention',
        'retention-paragraph',
        'contact-info',
        'contact-info-paragraph',
        'changes-to-privacy-policy',
        'changes-to-privacy-policy-paragraph'
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'PrivacyPolicyLayout.scss';
</style>
