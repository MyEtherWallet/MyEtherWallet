<template>
  <div class="terms-of-service py-12 pt-16 mt-13">
    <v-container>
      <div class="wrap">
        <div class="page-container">
          <div class="content-width-limit">
            <div class="page-header">
              <h1>{{ t('termsOfService.title') }}</h1>
              <h6>{{ t('termsOfService.date') }}</h6>

              <i18n path="termsOfService.welcome" tag="p" class="my-12">
                <template #tos>
                  <b>"{{ t('termsOfService.tos') }}"</b>
                </template>
                <template #mew>
                  <b>"{{ t('termsOfService.mew') }}"</b>
                </template>
                <template #site>
                  <b>"{{ t('termsOfService.site') }}"</b>
                </template>
                <template #services>
                  <b>"{{ t('termsOfService.services') }}"</b>
                </template>
              </i18n>
            </div>
            <div class="content">
              <h3>
                {{ t('termsOfService.intro') }}
              </h3>

              <i18n path="termsOfService.intro-p1" tag="p">
                <template #privPol>
                  <a
                    href="https://www.myetherwallet.com/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    >{{ t('termsOfService.privacy-policy') }}</a
                  >
                </template>
                <template #agreement>
                  <b>"{{ t('termsOfService.agreement') }}"</b>
                </template>
              </i18n>

              <p>
                {{ t('termsOfService.intro-p2') }}
              </p>

              <p>
                {{ t('termsOfService.intro-p3') }}
              </p>
            </div>

            <div class="content">
              <h3>
                {{ t('termsOfService.services-eligibility-title') }}
              </h3>

              <p>
                {{ t('termsOfService.services-eligibility-title-1') }}
              </p>

              <p>
                {{ t('termsOfService.services-eligibility-title-1-p') }}
              </p>

              <p>
                {{ t('termsOfService.services-eligibility-title-2') }}
              </p>

              <p>
                {{ t('termsOfService.services-eligibility-title-2-p-1') }}
              </p>

              <p>
                {{ t('termsOfService.services-eligibility-title-2-p-2') }}
              </p>

              <p>
                {{ t('termsOfService.services-eligibility-title-2-p-3') }}
              </p>

              <i18n
                path="termsOfService.services-eligibility-title-2-p-4"
                tag="p"
              >
                <template #article1>
                  <a
                    :href="
                      store.getters['article/getArticle']('mew-introduction')
                    "
                    target="_blank"
                    rel="noopener noreferrer"
                    >"{{ t('termsOfService.article1') }}"</a
                  >
                </template>
                <template #article2>
                  <a
                    :href="
                      store.getters['article/getArticle'](
                        'avoid-phishing-scams'
                      )
                    "
                    target="_blank"
                    rel="noopener noreferrer"
                    >“{{ t('termsOfService.article2') }}”</a
                  >
                </template>
              </i18n>
            </div>

            <div class="content">
              <h3>
                {{ t('termsOfService.rights-and-restrictions-title') }}
              </h3>

              <p>
                {{ t('termsOfService.rights-and-restrictions-title-1') }}
              </p>

              <p>
                {{ t('termsOfService.rights-and-restrictions-title-1-p') }}
              </p>

              <p>
                {{ t('termsOfService.rights-and-restrictions-title-2') }}
              </p>

              <p>
                {{ t('termsOfService.rights-and-restrictions-title-2-p-1') }}
              </p>
              <p>
                {{ t('termsOfService.rights-and-restrictions-title-2-p-2') }}
              </p>

              <p>
                {{ t('termsOfService.rights-and-restrictions-title-2-p-3') }}
              </p>

              <p>
                {{ t('termsOfService.rights-and-restrictions-title-2-p-4') }}
              </p>

              <p>
                {{ t('termsOfService.rights-and-restrictions-title-2-p-5') }}
              </p>

              <p>
                {{ t('termsOfService.rights-and-restrictions-title-3') }}
              </p>

              <p>
                {{ t('termsOfService.rights-and-restrictions-title-3-p') }}
              </p>
            </div>

            <div class="content">
              <h3>{{ t('termsOfService.privacy-title') }}</h3>

              <i18n path="termsOfService.privacy-title-p" tag="p">
                <template #link>
                  <a
                    href="https://myetherwallet.com/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    >"{{ t('termsOfService.link') }}"</a
                  >
                </template>
              </i18n>
            </div>

            <div class="content">
              <h3>{{ t('termsOfService.third-party-title') }}</h3>

              <p>
                {{ t('termsOfService.third-party-title-p') }}
              </p>
            </div>
            <div class="content">
              <h3>
                {{ t('termsOfService.subscription-plans-title') }}
              </h3>

              <p>
                {{ t('termsOfService.subscription-plans-p1') }}
              </p>
              <p>
                {{ t('termsOfService.subscription-plans-p2') }}
              </p>
              <p>
                {{ t('termsOfService.subscription-plans-p3') }}
              </p>
              <p>
                {{ t('termsOfService.subscription-plans-p4') }}
              </p>

              <p>
                {{ t('termsOfService.subscription-free-trial-title') }}
              </p>
              <p>
                {{ t('termsOfService.subscription-free-trial-title-p1') }}
              </p>
              <p>
                {{ t('termsOfService.subscription-free-trial-title-p2') }}
              </p>
              <p>
                {{ t('termsOfService.subscription-free-trial-title-p3') }}
              </p>
              <p>
                {{ t('termsOfService.subscription-fee-changes-title') }}
              </p>
              <p>
                {{ t('termsOfService.subscription-fee-changes-title-p1') }}
              </p>
              <p>
                {{ t('termsOfService.subscription-fee-changes-title-p2') }}
              </p>
              <p>
                {{ t('termsOfService.subscription-refund-title') }}
              </p>
              <p>
                {{ t('termsOfService.subscription-refund-title-p1') }}
              </p>
            </div>

            <div class="content">
              <h3>{{ t('termsOfService.disclaimer-title') }}</h3>

              <p>
                {{ t('termsOfService.disclaimer-titlep-1') }}
              </p>

              <p>
                {{ t('termsOfService.disclaimer-titlep-2') }}
              </p>

              <p>
                {{ t('termsOfService.disclaimer-titlep-3') }}
              </p>

              <p>
                {{ t('termsOfService.disclaimer-titlep-4') }}
              </p>

              <p>
                {{ t('termsOfService.disclaimer-titlep-5') }}
              </p>
            </div>

            <div class="content">
              <h3>{{ t('termsOfService.indemnity-title') }}</h3>

              <p>
                {{ t('termsOfService.indemnity-title-p') }}
              </p>
            </div>

            <div class="content">
              <h3>{{ t('termsOfService.assignment-title') }}</h3>

              <p>
                {{ t('termsOfService.assignment-title-p') }}
              </p>
            </div>

            <div class="content">
              <h3>{{ t('termsOfService.agreement-waiver-title') }}</h3>

              <p>
                {{ t('termsOfService.agreement-waiver-title-p-0') }}
              </p>

              <p>
                {{ t('termsOfService.agreement-waiver-title-p-1') }}
              </p>

              <p>
                {{ t('termsOfService.agreement-waiver-title-p-2') }}
              </p>

              <p>
                {{ t('termsOfService.agreement-waiver-title-p-3') }}
              </p>

              <p>
                {{ t('termsOfService.agreement-waiver-title-p-4') }}
              </p>

              <p>
                {{ t('termsOfService.agreement-waiver-title-p-5') }}
              </p>

              <p>
                {{ t('termsOfService.agreement-waiver-title-p-6') }}
              </p>

              <p>
                {{ t('termsOfService.agreement-waiver-title-p-7') }}
              </p>

              <p>
                {{ t('termsOfService.agreement-waiver-title-p-8') }}
              </p>

              <p>
                {{ t('termsOfService.agreement-waiver-title-p-9') }}
              </p>

              <p>
                {{ t('termsOfService.agreement-waiver-title-p-10') }}
              </p>

              <p>
                {{ t('termsOfService.agreement-waiver-title-p-11') }}
              </p>

              <p>
                {{ t('termsOfService.agreement-waiver-title-p-12') }}
              </p>
            </div>

            <div class="content">
              <h3>{{ t('termsOfService.governing-law-title') }}</h3>

              <p>
                {{ t('termsOfService.governing-law-title-p-1') }}
              </p>

              <p>
                {{ t('termsOfService.governing-law-title-p-2') }}
              </p>
            </div>

            <div class="content">
              <h3>{{ t('termsOfService.entire-agreement-title') }}</h3>

              <p>
                {{ t('termsOfService.entire-agreement-title-p') }}
              </p>
            </div>

            <div class="content">
              <h3>{{ t('termsOfService.contact-info-title') }}</h3>

              <i18n path="termsOfService.contact-info-title-p" tag="p">
                <template #suppEmail>
                  <a
                    href="mailto:support@myetherwallet.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    support@myetherwallet.com</a
                  >.
                </template>
              </i18n>
            </div>
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n-composable';

// injections
const { t } = useI18n();
</script>

<style lang="scss" scoped>
h1 {
  text-transform: uppercase;
  margin-bottom: 2px;
}

h3 {
  text-transform: uppercase;
  margin: 40px 0 10px 0;
}

h4 {
  text-transform: uppercase;
  font-size: 18px;
}

h6 {
  text-transform: uppercase;
  margin-bottom: 20px;
}
</style>
