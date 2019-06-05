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
                  item.includes('Paragraph') ||
                    item.includes('Sentence') ||
                    item.includes('Footer')
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
                  support@myetherwallet.com
                </a>
              </p>
              <p v-else-if="item.includes('Item')">
                {{ item[item.length - 1] }}. {{ $t(`privacyPol.${item}`) }}
              </p>
              <h4 v-else-if="item.includes('Subtitle')">
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
        'introductionParagraph1',
        'introductionParagraph2',
        'introductionParagraph3',
        'introductionParagraph4',
        'theBlockchain',
        'theBlockchainParagraph',
        'whatWeCollect',
        'whatWeCollectParagraph1',
        'whatWeCollectSubtitle1',
        'whatWeCollectParagraph2',
        'whatWeCollectSubtitle2',
        'whatWeCollectParagraph3',
        'useOfInformation',
        'useOfInformationParagraph1',
        'useOfInformationParagraph2',
        'sharingPersonalInfo',
        'sharingPersonalInfoParagraph1',
        'sharingPersonalInfoParagraph2',
        'sharingPersonalInfoSubtitle',
        'sharingPersonalInfoParagraph3',
        'linksToOtherSites',
        'linksToOtherSitesParagraph',
        'mewCommitment',
        'mewCommitmentParagraph',
        'personalInfoSecurity',
        'personalInfoSecurityParagraph',
        'personalInfoSecuritySentence1',
        'personalInfoSecurityItem1',
        'personalInfoSecurityItem2',
        'personalInfoSecurityItem3',
        'personalInfoSecurityItem4',
        'personalInfoSecurityItem5',
        'personalInfoSecurityItem6',
        'personalInfoSecurityFooter',
        'legalBasis',
        'legalBasisParagraph',
        'legalBasisItem1',
        'legalBasisItem2',
        'retention',
        'retentionParagraph',
        'contactInfo',
        'contactInfoParagraph',
        'changesToPrivacyPolicy',
        'changesToPrivacyPolicyParagraph'
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'PrivacyPolicyLayout.scss';
</style>
