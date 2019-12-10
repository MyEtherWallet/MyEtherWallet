<template functional>
  <div>
    <div class="terms-and-conditions">
      <div class="wrap">
        <div class="page-container">
          <div class="content-width-limit">
            <div class="page-header">
              <h1>{{ parent.$t('termsOfService.title') }}</h1>
              <h6>{{ parent.$t('termsOfService.date') }}</h6>
              <br /><br /><br /><br />
              <i18n path="termsOfService.welcome" tag="p">
                <template v-slot:tos>
                  <b>"{{ parent.$t('termsOfService.tos') }}"</b>
                </template>
                <template v-slot:mew>
                  <b>"{{ parent.$t('termsOfService.mew') }}"</b>
                </template>
                <template v-slot:site>
                  <b>"{{ parent.$t('termsOfService.site') }}"</b>
                </template>
                <template v-slot:services>
                  <b>"{{ parent.$t('termsOfService.services') }}"</b>
                </template>
              </i18n>
            </div>
            <div class="content">
              <h3>
                {{ parent.$t('termsOfService.intro') }}
              </h3>
              <br />
              <i18n path="termsOfService.intro-p1" tag="p">
                <template v-slot:privPol>
                  <a
                    href="https://www.myetherwallet.com/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    >{{ parent.$t('termsOfService.privacy-policy') }}</a
                  >
                </template>
                <template v-slot:agreement>
                  <b>"{{ parent.$t('termsOfService.agreement') }}"</b>
                </template>
              </i18n>
              <br />
              <p>
                {{ parent.$t('termsOfService.intro-p2') }}
              </p>
              <br />
              <p>
                {{ parent.$t('termsOfService.intro-p3') }}
              </p>
            </div>
            <br /><br />
            <div class="content">
              <h3>
                {{ parent.$t('termsOfService.services-eligibility-title') }}
              </h3>
              <br />
              <p>
                {{ parent.$t('termsOfService.services-eligibility-title-1') }}
              </p>
              <br />
              <p>
                {{ parent.$t('termsOfService.services-eligibility-title-1-p') }}
              </p>
              <br />
              <p>
                {{ parent.$t('termsOfService.services-eligibility-title-2') }}
              </p>
              <br />
              <p>
                {{
                  parent.$t('termsOfService.services-eligibility-title-2-p-1')
                }}
              </p>
              <br />
              <p>
                {{
                  parent.$t('termsOfService.services-eligibility-title-2-p-2')
                }}
              </p>
              <br />
              <i18n
                path="termsOfService.services-eligibility-title-2-p-3"
                tag="p"
              >
                <template v-slot:article1>
                  <a
                    href="https://kb.myetherwallet.com/en/getting-started/myetherwallet-an-introduction/"
                    target="_blank"
                    rel="noopener noreferrer"
                    >"{{ parent.$t('termsOfService.article1') }}"</a
                  >
                </template>
                <template v-slot:article2>
                  <a
                    href="https://kb.myetherwallet.com/en/security-and-privacy/pro-tips-how-to-avoid-phishing-scams/"
                    target="_blank"
                    rel="noopener noreferrer"
                    >“{{ parent.$t('termsOfService.article2') }}”</a
                  >
                </template>
              </i18n>
            </div>
            <br /><br />
            <div class="content">
              <h3>
                {{ parent.$t('termsOfService.rights-and-restrictions-title') }}
              </h3>
              <br />
              <p>
                {{
                  parent.$t('termsOfService.rights-and-restrictions-title-1')
                }}
              </p>
              <br />
              <p>
                {{
                  parent.$t('termsOfService.rights-and-restrictions-title-1-p')
                }}
              </p>
              <br />
              <p>
                {{
                  parent.$t('termsOfService.rights-and-restrictions-title-2')
                }}
              </p>
              <br />
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
              <br />
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
              <br />
              <p>
                {{
                  parent.$t(
                    'termsOfService.rights-and-restrictions-title-2-p-5'
                  )
                }}
              </p>
              <br />
              <p>
                {{
                  parent.$t('termsOfService.rights-and-restrictions-title-3')
                }}
              </p>
              <br />
              <p>
                {{
                  parent.$t('termsOfService.rights-and-restrictions-title-3-p')
                }}
              </p>
            </div>
            <br /><br />
            <div class="content">
              <h3>{{ parent.$t('termsOfService.privacy-title') }}</h3>
              <br />
              <i18n path="termsOfService.privacy-title-p" tag="p">
                <template v-slot:link>
                  <a
                    href="https://kb.myetherwallet.com/en/getting-started/myetherwallet-an-introduction/"
                    target="_blank"
                    rel="noopener noreferrer"
                    >"{{ parent.$t('termsOfService.link') }}"</a
                  >
                </template>
              </i18n>
            </div>
            <br /><br />
            <div class="content">
              <h3>{{ parent.$t('termsOfService.third-party-title') }}</h3>
              <br />
              <p>
                {{ parent.$t('termsOfService.third-party-title-p') }}
              </p>
            </div>
            <br /><br />
            <div class="content">
              <h3>{{ parent.$t('termsOfService.disclaimer-title') }}</h3>
              <br />
              <p>
                {{ parent.$t('termsOfService.disclaimer-titlep-1') }}
              </p>
              <br />
              <p>
                {{ parent.$t('termsOfService.disclaimer-titlep-2') }}
              </p>
              <br />
              <p>
                {{ parent.$t('termsOfService.disclaimer-titlep-3') }}
              </p>
              <br />
              <p>
                {{ parent.$t('termsOfService.disclaimer-titlep-4') }}
              </p>
              <br />
              <p>
                {{ parent.$t('termsOfService.disclaimer-titlep-5') }}
              </p>
            </div>
            <br /><br />
            <div class="content">
              <h3>{{ parent.$t('termsOfService.indemnity-title') }}</h3>
              <br />
              <p>
                {{ parent.$t('termsOfService.indemnity-title-p') }}
              </p>
            </div>
            <br /><br />
            <div class="content">
              <h3>{{ parent.$t('termsOfService.assignment-title') }}</h3>
              <br />
              <p>
                {{ parent.$t('termsOfService.assignment-title-p') }}
              </p>
            </div>
            <br /><br />
            <div class="content">
              <h3>{{ parent.$t('termsOfService.agreement-waiver-title') }}</h3>
              <br />
              <p>
                {{ parent.$t('termsOfService.agreement-waiver-title-p-0') }}
              </p>
              <br />
              <p>
                {{ parent.$t('termsOfService.agreement-waiver-title-p-1') }}
              </p>
              <br />
              <p>
                {{ parent.$t('termsOfService.agreement-waiver-title-p-2') }}
              </p>
              <br />
              <p>
                {{ parent.$t('termsOfService.agreement-waiver-title-p-3') }}
              </p>
              <br />
              <p>
                {{ parent.$t('termsOfService.agreement-waiver-title-p-4') }}
              </p>
              <br />
              <p>
                {{ parent.$t('termsOfService.agreement-waiver-title-p-5') }}
              </p>
              <br />
              <p>
                {{ parent.$t('termsOfService.agreement-waiver-title-p-6') }}
              </p>
              <br />
              <p>
                {{ parent.$t('termsOfService.agreement-waiver-title-p-7') }}
              </p>
              <br />
              <p>
                {{ parent.$t('termsOfService.agreement-waiver-title-p-8') }}
              </p>
              <br />
              <p>
                {{ parent.$t('termsOfService.agreement-waiver-title-p-9') }}
              </p>
              <br />
              <p>
                {{ parent.$t('termsOfService.agreement-waiver-title-p-10') }}
              </p>
              <br />
              <p>
                {{ parent.$t('termsOfService.agreement-waiver-title-p-11') }}
              </p>
              <br />
              <p>
                {{ parent.$t('termsOfService.agreement-waiver-title-p-12') }}
              </p>
            </div>
            <br /><br />
            <div class="content">
              <h3>{{ parent.$t('termsOfService.governing-law-title') }}</h3>
              <br />
              <p>
                {{ parent.$t('termsOfService.governing-law-title-p-1') }}
              </p>
              <br />
              <p>
                {{ parent.$t('termsOfService.governing-law-title-p-2') }}
              </p>
            </div>
            <br /><br />
            <div class="content">
              <h3>{{ parent.$t('termsOfService.entire-agreement-title') }}</h3>
              <br />
              <p>
                {{ parent.$t('termsOfService.entire-agreement-title-p') }}
              </p>
            </div>
            <br /><br />
            <div class="content">
              <h3>{{ parent.$t('termsOfService.contact-info-title') }}</h3>
              <br />
              <i18n path="termsOfService.contact-info-title-p" tag="p">
                <template v-slot:suppEmail>
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
            <br />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import 'TermsOfService.scss';
</style>
