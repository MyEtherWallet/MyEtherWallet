<template>
  <div class="mew-component--dapp-submission">
    <the-layout-header
      :title="$t('dappsSubmission.banner-submit.dapp-submission-form')"
    />
    <v-form ref="form" @input="progress">
      <v-container class="my-10">
        <v-row>
          <!--
          =================================================================
          *****************************************************************
          Main content
          *****************************************************************
          =================================================================
          -->
          <v-col cols="12" md="8">
            <div style="max-width: 500px" class="mb-8">
              <div class="mew-heading-1">
                {{ $t('dappsSubmission.tell-us-about-your-dapp') }}
              </div>
              <div class="mt-1">
                {{ $t('dappsSubmission.provide-text') }}
              </div>
            </div>

            <!--
            =================================================================
            Dapp name
            =================================================================
            -->
            <div class="section-title">
              <div class="mew-heading-3">
                {{ $t('dappsSubmission.about-your-dapp.name') }}
                <span class="mew-label">
                  ({{ $t('dappsSubmission.required') }})
                </span>
              </div>
            </div>
            <mew-input
              v-model="form.dappName"
              :rules="[rules.noEmptyString]"
              outlined
            />

            <!--
            =================================================================
            Category
            =================================================================
            -->
            <div class="section-title">
              <div class="mew-heading-3">
                {{ $t('dappsSubmission.about-your-dapp.category') }}
                <span class="mew-label">
                  ({{ $t('dappsSubmission.required') }})
                </span>
              </div>
            </div>
            <v-select
              v-model="form.category"
              :rules="[rules.noNull]"
              :items="itemsCategory"
              placeholder="Select a category"
              outlined
            />

            <!--
            =================================================================
            Tags
            =================================================================
            -->
            <div class="section-title">
              <div class="mew-heading-3">
                {{ $t('dappsSubmission.about-your-dapp.tags-title') }}
                <span class="mew-label">
                  ({{ $t('dappsSubmission.required') }})
                </span>
              </div>
              <div>
                {{ $t('dappsSubmission.about-your-dapp.tags') }}
              </div>
              <div>
                {{ $t('dappsSubmission.about-your-dapp.suggested-tags') }}
                <v-chip x-small class="ml-1">Games</v-chip>
                <v-chip x-small class="ml-1">Defi</v-chip>
                <v-chip x-small class="ml-1">Lending</v-chip>
                <v-chip x-small class="ml-1">Social</v-chip>
                <v-chip x-small class="ml-1">Finance</v-chip>
                <v-chip x-small class="ml-1">Wallet</v-chip>
              </div>
            </div>
            <v-combobox
              v-model="form.tags"
              :rules="[rules.noEmptyArray]"
              multiple
              chips
              outlined
            />

            <!--
            =================================================================
            Description
            =================================================================
            -->
            <div class="section-title">
              <div class="mew-heading-3">
                {{ $t('dappsSubmission.about-your-dapp.description') }}
                <span class="mew-label">
                  ({{ $t('dappsSubmission.required') }})
                </span>
              </div>
              <div>
                {{
                  $t('dappsSubmission.about-your-dapp.description-placeholder')
                }}
              </div>
            </div>
            <v-textarea
              v-model="form.description"
              outlined
              counter
              :rules="[rules.noEmptyString]"
              maxlength="800"
            ></v-textarea>

            <!--
            =================================================================
            Contract address
            =================================================================
            -->
            <div class="section-title">
              <div class="mew-heading-3">
                Contract address
                <span class="mew-label">
                  ({{ $t('dappsSubmission.required') }})
                </span>
              </div>
            </div>
            <mew-input
              v-model="form.contractAddress"
              outlined
              :rules="[rules.noEmptyString, rules.requireValidEthAddress]"
            />

            <!--
            =================================================================
            Dapp website
            =================================================================
            -->
            <div class="section-title">
              <div class="mew-heading-3">
                {{ $t('dappsSubmission.about-your-dapp.dapp-website') }}
              </div>
            </div>
            <mew-input v-model="form.dappWebsite" outlined />

            <!--
            =================================================================
            Is your Dapp available for use in the United States?
            =================================================================
            -->
            <div class="section-title">
              <div class="mew-heading-3">
                {{ $t('dappsSubmission.about-your-dapp.dapp-us') }}
                <span class="mew-label">
                  ({{ $t('dappsSubmission.required') }})
                </span>
              </div>
            </div>
            <div class="border">
              <v-radio-group
                v-model="form.usMarket"
                column
                class="mt-0"
                :rules="[rules.noNull]"
              >
                <v-radio label="Yes" value="yes"></v-radio>
                <v-radio label="No" value="no"></v-radio>
              </v-radio-group>
            </div>

            <!--
            =================================================================
            Dapp status
            =================================================================
            -->
            <div class="section-title">
              <div class="mew-heading-3">
                {{ $t('dappsSubmission.about-your-dapp.dapp-status') }}
                <span class="mew-label">
                  ({{ $t('dappsSubmission.required') }})
                </span>
              </div>
            </div>
            <div class="border">
              <v-radio-group
                v-model="form.dappStatus"
                :rules="[rules.noNull]"
                column
                class="mt-0"
              >
                <v-radio label="Live" value="Live"></v-radio>
                <v-radio label="Beta" value="Beta"></v-radio>
                <v-radio label="Prototype" value="Prototype"></v-radio>
                <v-radio
                  label="Work in progress"
                  value="Work in progress"
                ></v-radio>
                <v-radio label="Concept" value="Concept"></v-radio>
                <v-radio label="Stealth" value="Stealth"></v-radio>
              </v-radio-group>
            </div>

            <!--
            =================================================================
            Dapp contract audit
            =================================================================
            -->
            <div class="section-title">
              <div class="mew-heading-3">
                {{ $t('dappsSubmission.about-your-dapp.contract-audit-title') }}
              </div>
              <div>
                {{ $t('dappsSubmission.about-your-dapp.contract-audit') }}
              </div>
            </div>
            <div class="border">
              <v-radio-group
                v-model="form.contractAudit"
                :rules="[rules.noNull]"
                column
                class="mt-0"
              >
                <v-radio
                  label="None in process"
                  value="None in process"
                ></v-radio>
                <v-radio label="In process" value="In process"></v-radio>
                <v-radio label="Completed" value="Completed"></v-radio>
              </v-radio-group>
            </div>

            <!--
            =================================================================
            Mock user flow
            =================================================================
            -->
            <div class="section-title">
              <div class="mew-heading-3">
                {{ $t('dappsSubmission.about-your-dapp.mock-flow-title') }}
                <span class="mew-label">
                  ({{ $t('dappsSubmission.required') }})
                </span>
              </div>
              <div>
                {{ $t('dappsSubmission.about-your-dapp.mock-requirements') }}
              </div>
            </div>
            <div>
              {{ form.mockFlowFile }}
            </div>
            <div class="border">
              <v-file-input
                v-model="form.mockFlowFile"
                :rules="[rules.noNull]"
                accept="image/jpeg, .pdf"
                label="JPEG, PDF (> 5MB)"
                @change="imgPreview($event, 'imgMockFlow')"
              ></v-file-input>
              <img
                v-if="imgMockFlow"
                class="preview"
                :src="imgMockFlow"
                alt="Mock flow"
              />
            </div>

            <!--
            =================================================================
            Dapp icon
            =================================================================
            -->
            <div class="section-title">
              <div class="mew-heading-3">
                {{ $t('dappsSubmission.about-your-dapp.dapp-icon-title') }}
                <span class="mew-label">
                  ({{ $t('dappsSubmission.required') }})
                </span>
              </div>
              <div>
                {{ $t('dappsSubmission.about-your-dapp.dapp-icon') }}
              </div>
            </div>
            <div class="border">
              <v-file-input
                v-model="form.dappIconFile"
                :rules="[rules.noNull]"
                accept="image/jpeg, image/png"
                label="JPEG, PNG"
                @change="imgPreview($event, 'imgDappIcon')"
              ></v-file-input>
              <img
                v-if="imgDappIcon"
                class="preview"
                :src="imgDappIcon"
                alt="Mock flow"
              />
            </div>

            <!--
            =================================================================
            Banner
            =================================================================
            -->
            <div class="section-title">
              <div class="mew-heading-3">
                {{ $t('dappsSubmission.about-your-dapp.banner-title') }}
                <span class="mew-label">
                  ({{ $t('dappsSubmission.required') }})
                </span>
              </div>
              <div>
                {{ $t('dappsSubmission.about-your-dapp.banner') }}
              </div>
            </div>
            <div class="border">
              <v-file-input
                v-model="form.bannerFile"
                :rules="[rules.noNull]"
                accept="image/jpeg, image/png"
                label="JPEG, PNG"
                @change="imgPreview($event, 'imgBanner')"
              ></v-file-input>
              <img
                v-if="imgBanner"
                class="preview"
                :src="imgBanner"
                alt="Mock flow"
              />
            </div>

            <!--
            =================================================================
            Authors
            =================================================================
            -->
            <div class="section-title">
              <div class="mew-heading-3">
                {{ $t('dappsSubmission.about-your-team.authors-title') }}
                <span class="mew-label">
                  ({{ $t('dappsSubmission.required') }})
                </span>
              </div>
              <div>{{ $t('dappsSubmission.about-your-team.authors') }}</div>
            </div>
            <mew-input
              v-model="form.authors"
              :rules="[rules.noEmptyString]"
              :placeholder="
                $t('dappsSubmission.about-your-team.author-placeholder')
              "
            />

            <!--
            =================================================================
            My full name
            =================================================================
            -->
            <div class="section-title">
              <div class="mew-heading-3">
                {{ $t('dappsSubmission.about-your-team.full-name') }}
                <span class="mew-label">
                  ({{ $t('dappsSubmission.required') }})
                </span>
              </div>
            </div>
            <mew-input v-model="form.fullName" :rules="[rules.noEmptyString]" />

            <!--
            =================================================================
            My email
            =================================================================
            -->
            <div class="section-title">
              <div class="mew-heading-3">
                {{ $t('dappsSubmission.about-your-team.email') }}
                <span class="mew-label">
                  ({{ $t('dappsSubmission.required') }})
                </span>
              </div>
            </div>
            <mew-input
              v-model="form.email"
              :rules="[rules.noEmptyString, rules.email]"
            />

            <!--
            =================================================================
            Company social links
            =================================================================
            -->
            <div class="section-title">
              <div class="mew-heading-3">
                {{ $t('dappsSubmission.about-your-team.social-links') }}
                <span class="mew-label">
                  ({{ $t('dappsSubmission.required') }})
                </span>
              </div>
              <div>
                {{ $t('dappsSubmission.about-your-team.provide-social-link') }}
              </div>
              <div class="social-media mt-1 d-flex align-center">
                <v-icon class="px-1" small color="basic">mdi-facebook</v-icon>
                <v-icon class="px-1" small color="basic">mdi-twitter</v-icon>
                <v-icon class="px-1" small color="basic">mdi-linkedin</v-icon>
                <v-icon class="px-1" small color="basic">mdi-reddit</v-icon>
                <v-icon class="px-1" small color="basic">mdi-medium</v-icon>
                <img
                  src="@/assets/images/icons/socials/svg/github.svg"
                  alt="Github"
                />
              </div>
            </div>
            <v-combobox
              v-model="form.socialLinks"
              :rules="[rules.noEmptyArray]"
              multiple
              chips
              outlined
            />

            <!--
            =================================================================
            Company website
            =================================================================
            -->
            <div class="section-title">
              <div class="mew-heading-3">
                {{ $t('dappsSubmission.about-your-team.company-website') }}
              </div>
            </div>
            <mew-input v-model="form.companyWebsite" />

            <!--
            =================================================================
            Software license
            =================================================================
            -->
            <div class="section-title">
              <div class="mew-heading-3">
                {{ $t('dappsSubmission.about-your-team.license') }}
              </div>
            </div>
            <mew-input
              v-model="form.license"
              :placeholder="
                $t('dappsSubmission.about-your-team.license-placeholder')
              "
            />

            <!--
            =================================================================
            Additional notes
            =================================================================
            -->
            <div class="section-title">
              <div class="mew-heading-3">
                {{ $t('dappsSubmission.about-your-team.additional-notes') }}
              </div>
              <div>
                {{ $t('dappsSubmission.about-your-team.notes-placeholder') }}
              </div>
            </div>
            <v-textarea
              v-model="form.additionalNotes"
              outlined
              counter
              maxlength="300"
            ></v-textarea>

            <!--
            =================================================================
            Submit button
            =================================================================
            -->
            <mew-button
              :disabled="validRequiredFormsRate !== 100 ? true : false"
              :title="$t('dappsSubmission.submit')"
              btn-size="xlarge"
              class="d-block mx-auto mt-10"
              @click.native="submitForm"
            ></mew-button>

            <div
              v-show="validRequiredFormsRate !== 100"
              class="text-center mx-auto mt-4 mb-4 error--text"
              style="max-width: 300px"
            >
              {{ $t('dappsSubmission.fill-out-required-fields') }}
            </div>
          </v-col>

          <!--
          =================================================================
          *****************************************************************
          Side column
          *****************************************************************
          =================================================================
          -->
          <v-col cols="12" md="4">
            <div style="position: sticky; top: 0">
              <!--
              =================================================================
              Progress (side)
              =================================================================
              -->
              <div class="walletBg pa-6 d-none d-md-block">
                <div class="mew-heading-2">
                  {{ $t('dappsSubmission.progress') }}
                </div>
                <v-progress-linear
                  v-model="validRequiredFormsRate"
                  color="primary"
                  height="25"
                  class="mt-5"
                >
                  <template #default="{ value }">
                    <strong>{{ Math.ceil(value) }}%</strong>
                  </template>
                </v-progress-linear>
              </div>

              <!--
              =================================================================
              State of the Dapps (side)
              =================================================================
              -->
              <div class="walletBg pa-6 mt-6">
                <div class="d-flex align-center justify-space-between">
                  <div class="mew-heading-2">
                    {{ $t('dappsSubmission.sotd.title') }}
                  </div>
                  <img
                    src="@/assets/images/icons/icon-sotd.png"
                    alt="stateofthedapps.com"
                    height="50"
                    class="ml-3"
                    style="border-radius: 50%"
                  />
                </div>
                <div class="mt-5">
                  <i18n tag="div" path="dappsSubmission.sotd.info">
                    <a
                      slot="url"
                      href="https://stateofthedapps.com"
                      target="_blank"
                    >
                      stateofthedapps.com
                    </a>
                  </i18n>
                </div>
              </div>

              <!--
              =================================================================
              MEW Support (side)
              =================================================================
              -->
              <div class="walletBg pa-6 mt-6">
                <div class="d-flex align-center justify-space-between">
                  <div class="mew-heading-2">
                    {{ $t('dappsSubmission.mew-support.title') }}
                  </div>
                  <img
                    src="@/assets/images/icons/icon-message2-mew.svg"
                    alt="MEW support"
                    height="50"
                    class="ml-3"
                  />
                </div>
                <div class="mt-3">
                  {{ $t('dappsSubmission.mew-support.info') }}
                </div>
                <a href="mailto:support@myetherwallet.com" target="_blank">
                  <mew-button
                    :title="$t('dappsSubmission.contact-support')"
                    has-full-width
                    class="mt-3"
                    btn-style="outline"
                  />
                </a>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-form>

    <!--
    =================================================================
    Success (dialog)
    =================================================================
    -->
    <v-dialog v-model="formSubmissionSuccessful" width="500">
      <div class="pa-5 white">
        <div class="mew-heading-2">
          {{ $t('dappsSubmission.successful') }}
        </div>
        <div class="mt-3">
          {{ $t('dappsSubmission.congrats-msg') }}
        </div>
        <mew-button
          class="ml-auto d-block mt-5"
          :title="$t('dappsSubmission.okay')"
          @click.native="$router.push({ name: 'Home' })"
        >
        </mew-button>
      </div>
    </v-dialog>

    <!--
    =================================================================
    Failed (dialog)
    =================================================================
    -->
    <v-dialog v-model="formSubmissionFailed" width="500">
      <div class="pa-5 white">
        <div class="mew-heading-2 error--text">
          {{ $t('dappsSubmission.failed') }}
        </div>
        <div class="mt-3 error--text">
          {{ $t('dappsSubmission.try-again') }}
        </div>
        <mew-button
          class="ml-auto d-block mt-5"
          :title="$t('dappsSubmission.okay')"
          @click.native="formSubmissionFailed = false"
        >
        </mew-button>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import TheLayoutHeader from '../components-default/TheLayoutHeader';
import axios from 'axios';
import web3 from 'web3';

export default {
  name: 'DappSubmition',
  components: { TheLayoutHeader },
  data: () => ({
    imgMockFlow: '',
    imgDappIcon: '',
    imgBanner: '',
    validRequiredFormsRate: 0,
    areAllRequiredFormsValid: true,
    formSubmissionSuccessful: false,
    formSubmissionFailed: false,
    form: {
      dappName: '',
      tags: [],
      contractAddress: '',
      description: '',
      category: null,
      usMarket: null,
      mockFlowFile: null,
      dappIconFile: null,
      bannerFile: null,
      dappWebsite: '',
      contractAudit: null,
      dappStatus: null,
      authors: '',
      fullName: '',
      email: '',
      companyWebsite: '',
      socialLinks: [],
      license: '',
      additionalNotes: '',
      _cc: 'support@stateofthedapps.com'
    },
    itemsCategory: [
      'Games',
      'Social',
      'Finance',
      'Infrastructure',
      'Exchanges',
      'Development',
      'Media',
      'Wallet',
      'Security',
      'Property',
      'Marketplaces',
      'Governance',
      'Storage',
      'Identity',
      'Energy',
      'Insurance',
      'Health',
      'Other'
    ],
    rules: {
      noEmptyString: value => {
        return value != '' || 'This field is required';
      },
      noEmptyArray: value => {
        return value.length != 0 || 'This field is required';
      },
      noNull: value => {
        return value != null || 'This field is required';
      },
      requireValidEthAddress: value => {
        return web3.utils.isAddress(value) || 'Invalid address';
      },
      email: value => {
        return /.+@.+/.test(value) || 'Invalid email';
      }
    }
  }),
  methods: {
    imgPreview(e, targetVar) {
      if (e) {
        this[targetVar] = URL.createObjectURL(e);
      } else {
        this[targetVar] = '';
      }
    },
    submitForm() {
      const formData = new FormData();

      for (const key in this.form) {
        formData.append(key, this.form[key]);
      }

      // Validate input field reqirements
      this.areAllRequiredFormsValid = this.$refs.form.validate();

      if (this.areAllRequiredFormsValid) {
        axios({
          method: 'post',
          url: 'https://formspree.io/f/mqjndkkx',
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' }
        })
          .then(() => {
            this.formSubmissionSuccessful = true;
          })
          .catch(() => {
            this.formSubmissionFailed = true;
          });
      }
    },
    progress() {
      // Total 14 required forms
      const validFormCount =
        (this.form.dappName === '' ? 0 : 1) +
        (this.form.category === null ? 0 : 1) +
        (this.form.tags.length === 0 ? 0 : 1) +
        (this.form.description === '' ? 0 : 1) +
        (this.form.contractAddress === '' ? 0 : 1) +
        (this.form.usMarket === null ? 0 : 1) +
        (this.form.dappStatus === null ? 0 : 1) +
        (this.form.mockFlowFile === null ? 0 : 1) +
        (this.form.dappIconFile === null ? 0 : 1) +
        (this.form.bannerFile === null ? 0 : 1) +
        (this.form.authors === '' ? 0 : 1) +
        (this.form.fullName === '' ? 0 : 1) +
        (this.form.email === '' ? 0 : 1) +
        (this.form.socialLinks.length === 0 ? 0 : 1);

      this.validRequiredFormsRate = (validFormCount / 14) * 100;
    }
  }
};
</script>

<style lang="scss">
.mew-component--dapp-submission {
  // Hide down arrow for v-combobox
  .v-select--is-multi {
    .v-input__append-inner {
      display: none;
    }
  }
}
</style>

<style lang="scss" scoped>
.border {
  border: 1px solid var(--v-inputBorder-base);
  border-radius: 5px;
  padding: 20px;
  margin-bottom: 30px;
}
.section-title {
  padding: 40px 0 10px 0;
}
.social-media {
  img {
    width: 13px;
    margin-left: 5px;
  }
}
.preview {
  max-width: 400px;
  width: 100%;
}
</style>
