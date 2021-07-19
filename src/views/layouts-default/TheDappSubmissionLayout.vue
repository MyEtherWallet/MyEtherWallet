<template>
  <div class="mew-component--dapp-submission">
    <the-layout-header title="Dapp Submission Form" />
    <v-form ref="form">
      <v-container class="my-10">
        <v-row>
          <v-col cols="12" md="8">
            <div style="max-width: 500px">
              <div class="mew-heading-1">Tell us about your Dapp!</div>
              <div class="mt-1">
                It will take some time to review your Dapp submission. We will
                contact you as soon as the review is done.
              </div>
            </div>

            <!--
            =================================================================
            Dapp name
            =================================================================
            -->
            <div class="section-title">
              <div class="mew-heading-3">
                Dapp name <span class="mew-label">(Required)</span>
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
                Category <span class="mew-label">(Required)</span>
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
                Tags <span class="mew-label">(Required)</span>
              </div>
              <div>
                A 5-7 word description of your DApp. Please don't include
                self-promotion or obvious words such as 'blockchain',
                'decentralized', or 'Ethereum', (e.g. Game, Social, Finance...)
              </div>
              <div>
                Suggested tags
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
                Description <span class="mew-label">(Required)</span>
              </div>
              <div>800 characters max</div>
            </div>
            <v-textarea
              v-model="form.description"
              outlined
              counter
              :rules="[rules.noEmptyString]"
            ></v-textarea>

            <!--
            =================================================================
            Contract address
            =================================================================
            -->
            <div class="section-title">
              <div class="mew-heading-3">
                Contract address <span class="mew-label">(Required)</span>
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
              <div class="mew-heading-3">Dapp website</div>
            </div>
            <mew-input v-model="form.dappWebsite" outlined />

            <!--
            =================================================================
            Is your Dapp available for use in the United States?
            =================================================================
            -->
            <div class="section-title">
              <div class="mew-heading-3">
                Is your Dapp available for use in the United States?
                <span class="mew-label">(Required)</span>
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
                Dapp status <span class="mew-label">(Required)</span>
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
              <div class="mew-heading-3">Dapp contract audit</div>
              <div>
                Audits are not required for application, but are required by
                final step.
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
                Mock user flow <span class="mew-label">(Required)</span>
              </div>
              <div>Dimensions must be 1200px width by 630px height</div>
            </div>
            <div class="border">
              <v-file-input
                v-model="form.mockFlowFile"
                :rules="[rules.noNull]"
                accept="image/jpeg, .pdf"
                label="JPEG, PDF (> 5MB)"
              ></v-file-input>
            </div>

            <!--
            =================================================================
            Dapp icon
            =================================================================
            -->
            <div class="section-title">
              <div class="mew-heading-3">
                Dapp icon <span class="mew-label">(Required)</span>
              </div>
              <div>Dimensions must be 192px width by 192px height</div>
            </div>
            <div class="border">
              <v-file-input
                v-model="form.dappIconFile"
                :rules="[rules.noNull]"
                accept="image/jpeg, image/png"
                label="JPEG, PNG"
              ></v-file-input>
            </div>

            <!--
            =================================================================
            Banner
            =================================================================
            -->
            <div class="section-title">
              <div class="mew-heading-3">
                Banner <span class="mew-label">(Required)</span>
              </div>
              <div>Dimensions must be 1200px width by 206px height</div>
            </div>
            <div class="border">
              <v-file-input
                v-model="form.bannerFile"
                :rules="[rules.noNull]"
                accept="image/jpeg, image/png"
                label="JPEG, PNG"
              ></v-file-input>
            </div>

            <!--
            =================================================================
            Authors
            =================================================================
            -->
            <div class="section-title">
              <div class="mew-heading-3">
                Authors <span class="mew-label">(Required)</span>
              </div>
              <div>Separate names or organizations with a comma</div>
            </div>
            <mew-input
              v-model="form.authors"
              :rules="[rules.noEmptyString]"
              placeholder="e.g.) James Lee, Emilie Roy, Edward McCormick"
            />

            <!--
            =================================================================
            My full name
            =================================================================
            -->
            <div class="section-title">
              <div class="mew-heading-3">
                My full name <span class="mew-label">(Required)</span>
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
                My email <span class="mew-label">(Required)</span>
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
                Company social links <span class="mew-label">(Required)</span>
              </div>
              <div>Provide at least one social link</div>
              <div class="social-media mt-1">
                <img
                  src="@/assets/images/icons/socials/svg/facebook.svg"
                  alt="Facebook"
                />
                <img
                  src="@/assets/images/icons/socials/svg/twitter.svg"
                  alt="Twitter"
                />
                <img
                  src="@/assets/images/icons/socials/svg/linkedin.svg"
                  alt="LinkedIn"
                />
                <img
                  src="@/assets/images/icons/socials/svg/reddit.svg"
                  alt="Reddit"
                />
                <img
                  src="@/assets/images/icons/socials/svg/medium.svg"
                  alt="Medium"
                />
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
              <div class="mew-heading-3">Company website</div>
            </div>
            <mew-input v-model="form.companyWebsite" />

            <!--
            =================================================================
            Software license
            =================================================================
            -->
            <div class="section-title">
              <div class="mew-heading-3">Software license</div>
            </div>
            <mew-input
              v-model="form.license"
              placeholder="e.g.) MIT, GPL, Proprietary"
            />

            <!--
            =================================================================
            Additional notes
            =================================================================
            -->
            <div class="section-title">
              <div class="mew-heading-3">Additional notes</div>
              <div>300 characters max</div>
            </div>
            <v-textarea
              v-model="form.additionalNotes"
              outlined
              counter
            ></v-textarea>

            <!--
            =================================================================
            Submit button
            =================================================================
            -->
            <mew-button
              title="Submit"
              btn-size="xlarge"
              class="d-block mx-auto mt-10"
              @click.native="submitForm"
            ></mew-button>

            <div
              v-show="!allFormsValid"
              class="text-center mx-auto mt-4 mb-4 error--text"
              style="max-width: 300px"
            >
              Please meke sure to fill out all required forms before click
              submit button.
            </div>
          </v-col>

          <v-col cols="12" md="4">
            <div style="position: sticky; top: 0">
              <div class="walletBg pa-6">
                <div class="d-flex align-center justify-space-between">
                  <div class="mew-heading-2">
                    A Joint Effort With State of The Dapps
                  </div>
                  <img
                    src="@/assets/images/icons/icon-sotd.png"
                    alt="stateofthedapps.com"
                    height="50"
                    class="ml-3"
                  />
                </div>
                <div class="mt-5">
                  By submitting your Dapp information, you acknowledge that your
                  Dapp will be listed on
                  <a href="https://www.stateofthedapps.com/" target="_blank">
                    stateofthedapps.com
                  </a>
                </div>
              </div>

              <div class="walletBg pa-6 mt-6">
                <div class="d-flex align-center justify-space-between">
                  <div class="mew-heading-2">MEW Support</div>
                  <img
                    src="@/assets/images/icons/icon-message2-mew.svg"
                    alt="MEW support"
                    height="50"
                    class="ml-3"
                  />
                </div>
                <div class="mt-3">
                  Any question? Get in touch and we’ll get back as soon as we
                  can.
                </div>
                <a href="mailto:support@myetherwallet.com" target="_blank">
                  <mew-button
                    title="Contact Supper"
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

    <v-dialog v-model="formSubmitted" width="500">
      <v-card>
        <v-card-title class="text-h5">
          Great! Your Dapp information have been successfully submitted.
        </v-card-title>
        <v-card-text class="mew-body">
          We will review your Dapp information and this could take several days.
          You will be contacted as soon as the review is done. Thank you.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="gotoHome"> Okay </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="error" width="500">
      <v-card>
        <v-card-title class="text-h5">
          Something went wrong. Please try again.
        </v-card-title>
        <v-card-text class="mew-body">
          There was some error and Dapp submission was failed.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="error = false">
            Okay
          </v-btn>
        </v-card-actions>
      </v-card>
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
    allFormsValid: true,
    formSubmitted: false,
    error: false,
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
        return /.+@.+/.test(value) || 'E-mail must be valid';
      }
    }
  }),
  methods: {
    async submitForm() {
      const formData = new FormData();

      for (const key in this.form) {
        formData.append(key, this.form[key]);
      }

      // Validate input field reqirements
      this.allFormsValid = this.$refs.form.validate();

      if (this.allFormsValid) {
        axios({
          method: 'post',
          url: 'https://formspree.io/f/xdoyllqr',
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' }
        })
          .then(() => {
            this.formSubmitted = true;
          })
          .catch(() => {
            this.error = true;
          });
      }
    },
    gotoHome() {
      this.$router.push({ name: 'Home' });
    }
  }
};
</script>

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
    width: 15px;
    margin-right: 25px;
  }
}
</style>
