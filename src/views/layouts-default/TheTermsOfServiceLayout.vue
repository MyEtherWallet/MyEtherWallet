<template functional>
  <div class="terms-of-service py-12">
    <v-container>
      <div class="wrap">
        <div class="page-container">
          <div class="content-width-limit">
            <div class="page-header">
              <h1>{{ parent.$t('termsOfService.title') }}</h1>
              <h6>{{ parent.$t('termsOfService.date') }}</h6>

              <i18n path="termsOfService.welcome" tag="p" class="my-12">
                <template #tos>
                  <b>"{{ parent.$t('termsOfService.tos') }}"</b>
                </template>
                <template #mew>
                  <b>"{{ parent.$t('termsOfService.mew') }}"</b>
                </template>
                <template #site>
                  <b>"{{ parent.$t('termsOfService.site') }}"</b>
                </template>
                <template #services>
                  <b>"{{ parent.$t('termsOfService.services') }}"</b>
                </template>
              </i18n>
            </div>
            <div class="content">
              <h3>
                {{ parent.$t('termsOfService.intro') }}
              </h3>

              <i18n path="termsOfService.intro-p1" tag="p">
                <template #privPol>
                  <a
                    href="https://www.myetherwallet.com/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    >{{ parent.$t('termsOfService.privacy-policy') }}</a
                  >
                </template>
                <template #agreement>
                  <b>"{{ parent.$t('termsOfService.agreement') }}"</b>
                </template>
              </i18n>

              <p>
                {{ parent.$t('termsOfService.intro-p2') }}
              </p>

              <p>
                {{ parent.$t('termsOfService.intro-p3') }}
              </p>
            </div>

            <div class="content">
              <h3>
                {{ parent.$t('termsOfService.services-eligibility-title') }}
              </h3>

              <p>
                {{ parent.$t('termsOfService.services-eligibility-title-1') }}
              </p>

              <p>
                {{ parent.$t('termsOfService.services-eligibility-title-1-p') }}
              </p>

              <p>
                {{ parent.$t('termsOfService.services-eligibility-title-2') }}
              </p>

              <p>
                {{
                  parent.$t('termsOfService.services-eligibility-title-2-p-1')
                }}
              </p>

              <p>
                {{
                  parent.$t('termsOfService.services-eligibility-title-2-p-2')
                }}
              </p>

              <p>
                {{
                  parent.$t('termsOfService.services-eligibility-title-2-p-3')
                }}
              </p>

              <i18n
                path="termsOfService.services-eligibility-title-2-p-4"
                tag="p"
              >
                <template #article1>
                  <a
                    href="https://help.myetherwallet.com/en/articles/5377591-myetherwallet-an-introduction"
                    target="_blank"
                    rel="noopener noreferrer"
                    >"{{ parent.$t('termsOfService.article1') }}"</a
                  >
                </template>
                <template #article2>
                  <a
                    href="https://help.myetherwallet.com/en/articles/5377928-pro-tips-how-to-avoid-phishing-scams"
                    target="_blank"
                    rel="noopener noreferrer"
                    >“{{ parent.$t('termsOfService.article2') }}”</a
                  >
                </template>
              </i18n>
            </div>

            <div class="content">
              <h3>
                {{ parent.$t('termsOfService.rights-and-restrictions-title') }}
              </h3>

              <p>
                {{
                  parent.$t('termsOfService.rights-and-restrictions-title-1')
                }}
              </p>

              <p>
                {{
                  parent.$t('termsOfService.rights-and-restrictions-title-1-p')
                }}
              </p>

              <p>
                {{
                  parent.$t('termsOfService.rights-and-restrictions-title-2')
                }}
              </p>

              <p>
                {{
                  parent.$t(
                    'termsOfService.rights-and-restrictions-title-2-p-1'
                  )
                }}
              </p>
              <p>
                {{
                  parent.$t(
                    'termsOfService.rights-and-restrictions-title-2-p-2'
                  )
                }}
              </p>

              <p>
                {{
                  parent.$t(
                    'termsOfService.rights-and-restrictions-title-2-p-3'
                  )
                }}
              </p>

              <p>
                {{
                  parent.$t(
                    'termsOfService.rights-and-restrictions-title-2-p-4'
                  )
                }}
              </p>

              <p>
                {{
                  parent.$t(
                    'termsOfService.rights-and-restrictions-title-2-p-5'
                  )
                }}
              </p>

              <p>
                {{
                  parent.$t('termsOfService.rights-and-restrictions-title-3')
                }}
              </p>

              <p>
                {{
                  parent.$t('termsOfService.rights-and-restrictions-title-3-p')
                }}
              </p>
            </div>

            <div class="content">
              <h3>{{ parent.$t('termsOfService.privacy-title') }}</h3>

              <i18n path="termsOfService.privacy-title-p" tag="p">
                <template #link>
                  <a
                    href="https://myetherwallet.com/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    >"{{ parent.$t('termsOfService.link') }}"</a
                  >
                </template>
              </i18n>
            </div>

            <div class="content">
              <h3>{{ parent.$t('termsOfService.third-party-title') }}</h3>

              <p>
                {{ parent.$t('termsOfService.third-party-title-p') }}
              </p>
            </div>

            <div class="content">
              <h3>{{ parent.$t('termsOfService.disclaimer-title') }}</h3>

              <p>
                {{ parent.$t('termsOfService.disclaimer-titlep-1') }}
              </p>

              <p>
                {{ parent.$t('termsOfService.disclaimer-titlep-2') }}
              </p>

              <p>
                {{ parent.$t('termsOfService.disclaimer-titlep-3') }}
              </p>

              <p>
                {{ parent.$t('termsOfService.disclaimer-titlep-4') }}
              </p>

              <p>
                {{ parent.$t('termsOfService.disclaimer-titlep-5') }}
              </p>
            </div>

            <div class="content">
              <h3>{{ parent.$t('termsOfService.indemnity-title') }}</h3>

              <p>
                {{ parent.$t('termsOfService.indemnity-title-p') }}
              </p>
            </div>

            <div class="content">
              <h3>{{ parent.$t('termsOfService.assignment-title') }}</h3>

              <p>
                {{ parent.$t('termsOfService.assignment-title-p') }}
              </p>
            </div>

            <div class="content">
              <h3>{{ parent.$t('termsOfService.agreement-waiver-title') }}</h3>

              <p>
                {{ parent.$t('termsOfService.agreement-waiver-title-p-0') }}
              </p>

              <p>
                {{ parent.$t('termsOfService.agreement-waiver-title-p-1') }}
              </p>

              <p>
                {{ parent.$t('termsOfService.agreement-waiver-title-p-2') }}
              </p>

              <p>
                {{ parent.$t('termsOfService.agreement-waiver-title-p-3') }}
              </p>

              <p>
                {{ parent.$t('termsOfService.agreement-waiver-title-p-4') }}
              </p>

              <p>
                {{ parent.$t('termsOfService.agreement-waiver-title-p-5') }}
              </p>

              <p>
                {{ parent.$t('termsOfService.agreement-waiver-title-p-6') }}
              </p>

              <p>
                {{ parent.$t('termsOfService.agreement-waiver-title-p-7') }}
              </p>

              <p>
                {{ parent.$t('termsOfService.agreement-waiver-title-p-8') }}
              </p>

              <p>
                {{ parent.$t('termsOfService.agreement-waiver-title-p-9') }}
              </p>

              <p>
                {{ parent.$t('termsOfService.agreement-waiver-title-p-10') }}
              </p>

              <p>
                {{ parent.$t('termsOfService.agreement-waiver-title-p-11') }}
              </p>

              <p>
                {{ parent.$t('termsOfService.agreement-waiver-title-p-12') }}
              </p>
            </div>

            <div class="content">
              <h3>{{ parent.$t('termsOfService.governing-law-title') }}</h3>

              <p>
                {{ parent.$t('termsOfService.governing-law-title-p-1') }}
              </p>

              <p>
                {{ parent.$t('termsOfService.governing-law-title-p-2') }}
              </p>
            </div>

            <div class="content">
              <h3>{{ parent.$t('termsOfService.entire-agreement-title') }}</h3>

              <p>
                {{ parent.$t('termsOfService.entire-agreement-title-p') }}
              </p>
            </div>

            <div class="content">
              <h3>{{ parent.$t('termsOfService.contact-info-title') }}</h3>

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

<script>
export default {
  name: 'TheTermsOfServiceLayout'
};
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
