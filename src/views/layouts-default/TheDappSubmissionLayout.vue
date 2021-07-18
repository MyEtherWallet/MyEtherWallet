<template>
  <div class="mew-component--dapp-submission">
    <the-layout-header title="Dapp Submission Form" />
    <v-form ref="form">
      <v-container class="my-10">
        <v-row>
          <v-col cols="12" md="6">
            <!--
          =================================================================
          Dapp name
          =================================================================
          -->
            <div class="title-m">
              <div class="mew-heading-3">
                Dapp name <span class="mew-label">(Required)</span>
              </div>
            </div>
            <v-text-field
              ref="dappName"
              v-model="form.dappName"
              :rules="[rules.noEmptyString]"
              outlined
            />

            <!--
          =================================================================
          Category
          =================================================================
          -->
            <div class="title-m">
              <div class="mew-heading-3">
                Category <span class="mew-label">(Required)</span>
              </div>
            </div>
            <v-select
              v-model="form.category"
              :items="itemsCategory"
              placeholder="Select a category"
              outlined
            />

            <!--
          =================================================================
          Tags
          =================================================================
          -->
            <div class="title-m">
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
            <div class="border">
              <v-combobox v-model="form.tags" label="Tags" multiple chips />
            </div>

            <!--
          =================================================================
          Description
          =================================================================
          -->
            <div class="title-m">
              <div class="mew-heading-3">
                Description <span class="mew-label">(Required)</span>
              </div>
              <div>800 characters max</div>
            </div>
            <v-textarea
              v-model="form.description"
              outlined
              counter
            ></v-textarea>

            <!--
          =================================================================
          Contract address
          =================================================================
          -->
            <div class="title-m">
              <div class="mew-heading-3">
                Contract address <span class="mew-label">(Required)</span>
              </div>
            </div>
            <v-text-field
              ref="contractAddress"
              v-model="form.contractAddress"
              outlined
              :rules="[rules.validEthAddress]"
            />

            <!--
          =================================================================
          Dapp website
          =================================================================
          -->
            <div class="title-m">
              <div class="mew-heading-3">Dapp website</div>
            </div>
            <mew-input v-model="form.dappWebsite" />

            <!--
          =================================================================
          Is your Dapp available for use in the United States?
          =================================================================
          -->
            <div class="title-m">
              <div class="mew-heading-3">
                Is your Dapp available for use in the United States?
                <span class="mew-label">(Required)</span>
              </div>
            </div>
            <div class="border">
              <v-radio-group v-model="form.usMarket" column class="mt-0">
                <v-radio label="Yes" value="yes"></v-radio>
                <v-radio label="No" value="no"></v-radio>
              </v-radio-group>
            </div>

            <!--
          =================================================================
          Dapp status
          =================================================================
          -->
            <div class="title-m">
              <div class="mew-heading-3">
                Dapp status <span class="mew-label">(Required)</span>
              </div>
            </div>
            <div class="border">
              <v-radio-group v-model="form.dappStatus" column class="mt-0">
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
            <div class="title-m">
              <div class="mew-heading-3">Dapp contract audit</div>
              <div>
                Audits are not required for application, but are required by
                final step.
              </div>
            </div>
            <div class="border">
              <v-radio-group v-model="form.contractAudit" column class="mt-0">
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
            <div class="title-m">
              <div class="mew-heading-3">
                Mock user flow <span class="mew-label">(Required)</span>
              </div>
              <div>Dimensions must be 1200px width by 630px height</div>
            </div>
            <div class="border">
              <v-file-input
                v-model="form.mockFlowFile"
                accept="image/jpeg, .pdf"
                label="JPEG, PDF (> 5MB)"
              ></v-file-input>
            </div>

            <!--
          =================================================================
          Dapp icon
          =================================================================
          -->
            <div class="title-m">
              <div class="mew-heading-3">
                Dapp icon <span class="mew-label">(Required)</span>
              </div>
              <div>Dimensions must be 192px width by 192px height</div>
            </div>
            <div class="border">
              <v-file-input
                v-model="form.dappIconFile"
                accept="image/jpeg, image/png"
                label="JPEG, PNG"
              ></v-file-input>
            </div>

            <!--
          =================================================================
          Banner
          =================================================================
          -->
            <div class="title-m">
              <div class="mew-heading-3">
                Banner <span class="mew-label">(Required)</span>
              </div>
              <div>Dimensions must be 1200px width by 206px height</div>
            </div>
            <div class="border">
              <v-file-input
                v-model="form.bannerFile"
                accept="image/jpeg, image/png"
                label="JPEG, PNG"
              ></v-file-input>
            </div>

            <!--
          =================================================================
          Authors
          =================================================================
          -->
            <div class="title-m">
              <div class="mew-heading-3">
                Authors <span class="mew-label">(Required)</span>
              </div>
              <div>Separate names or organizations with a comma</div>
            </div>
            <mew-input
              v-model="form.authors"
              placeholder="e.g.) James Lee, Emilie Roy, Edward McCormick"
            />

            <!--
          =================================================================
          My full name
          =================================================================
          -->
            <div class="title-m">
              <div class="mew-heading-3">
                My full name <span class="mew-label">(Required)</span>
              </div>
            </div>
            <mew-input v-model="form.fullName" />

            <!--
          =================================================================
          My email
          =================================================================
          -->
            <div class="title-m">
              <div class="mew-heading-3">
                My email <span class="mew-label">(Required)</span>
              </div>
            </div>
            <mew-input v-model="form.email" />

            <!--
          =================================================================
          Company social links
          =================================================================
          -->
            <div class="title-m">
              <div class="mew-heading-3">
                Company social links <span class="mew-label">(Required)</span>
              </div>
              <div>Provide at least one social link</div>
            </div>
            <div class="border social-media">
              <div
                v-for="(s, socialIndex) in socialLinks"
                :key="s.name"
                class="d-flex align-center"
              >
                <img :src="s.icon" :alt="s.name" />
                <v-text-field
                  v-model="form.socialLinks[socialIndex]"
                  :label="s.name"
                />
              </div>
            </div>

            <!--
          =================================================================
          Company website
          =================================================================
          -->
            <div class="title-m">
              <div class="mew-heading-3">Company website</div>
            </div>
            <mew-input v-model="form.companyWebsite" />

            <!--
          =================================================================
          Software license
          =================================================================
          -->
            <div class="title-m">
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
            <div class="title-m">
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
          </v-col>

          <v-col cols="12" md="6">
            <mew-button
              title="Submit"
              btn-size="xlarge"
              class="d-block mx-auto mt-10"
              @click.native="submitForm"
            ></mew-button>

            <pre>
            {{ form }}
          </pre
            >

            <div>{{ form.mockFlowFile }}</div>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
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
      additionalNotes: ''
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
    socialLinks: [
      {
        name: 'Facebook',
        icon: require('@/assets/images/icons/socials/svg/facebook.svg')
      },
      {
        name: 'Twitter',
        icon: require('@/assets/images/icons/socials/svg/twitter.svg')
      },
      {
        name: 'LinkedIn',
        icon: require('@/assets/images/icons/socials/svg/linkedin.svg')
      },
      {
        name: 'Reddit',
        icon: require('@/assets/images/icons/socials/svg/reddit.svg')
      },
      {
        name: 'Medium',
        icon: require('@/assets/images/icons/socials/svg/medium.svg')
      },
      {
        name: 'Github',
        icon: require('@/assets/images/icons/socials/svg/github.svg')
      }
    ],
    rules: {
      noEmptyString: value => {
        return value != '' || 'Invalid address';
      },
      validEthAddress: value => {
        return web3.utils.isAddress(value) || 'Invalid address';
      }
    }
  }),
  methods: {
    async submitForm() {
      const formData = new FormData();
      this.form._cc = 'support@stateofthedapps.com';

      for (const key in this.form) {
        formData.append(key, this.form[key]);
      }

      // Remove empty social links
      this.form.socialLinks = await this.removeEmptyArray(
        this.form.socialLinks
      );

      // Validate input field reqirements
      if (this.$refs.form.validate()) {
        axios({
          method: 'post',
          url: 'https://formspree.io/f/xdoyllqr',
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' }
        })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (response) {
            console.log(response);
          });
      }
    },
    removeEmptyArray(arr) {
      arr = arr.filter(entry => entry.trim() != '');
      return arr.filter(function (val) {
        if (val !== null && val !== '') {
          return val;
        }
      });
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

.title-m {
  padding: 40px 0 10px 0;
}

.social-media {
  img {
    width: 18px;
    margin-right: 15px;
    filter: opacity(0.2);
  }
}
</style>
