<template>
  <div class="mew-component--dapp-submission">
    <the-layout-header title="Dapp Submission Form" />
    <v-container class="my-10">
      <v-row>
        <v-col cols="12" md="6">
          <!--
          =================================================================
          Dapp name
          =================================================================
          -->
          <div class="title-m">
            <div class="mew-heading-3">Dapp name *</div>
          </div>
          <mew-input v-model="dappName" />

          <!--
          =================================================================
          Category
          =================================================================
          -->
          <div class="title-m">
            <div class="mew-heading-3">Category *</div>
          </div>
          <v-select v-model="category" :items="itemsCategory" outlined />

          <!--
          =================================================================
          Tags
          =================================================================
          -->
          <div class="title-m">
            <div class="mew-heading-3">Tags *</div>
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
            <v-combobox v-model="tags" label="Tags" multiple chips />
          </div>

          <!--
          =================================================================
          Description
          =================================================================
          -->
          <div class="title-m">
            <div class="mew-heading-3">Description *</div>
            <div>800 characters max</div>
          </div>
          <div>{{ description }}</div>
          <mew-text-area v-model="description"></mew-text-area>

          <!--
          =================================================================
          Contract address
          =================================================================
          -->
          <div class="title-m">
            <div class="mew-heading-3">Contract address *</div>
          </div>
          <mew-input v-model="contractAddress" />

          <!--
          =================================================================
          Dapp website
          =================================================================
          -->
          <div class="title-m">
            <div class="mew-heading-3">Dapp website</div>
          </div>
          <mew-input v-model="dappWebsite" />

          <!--
          =================================================================
          Is your Dapp available for use in the United States?
          =================================================================
          -->
          <div class="title-m">
            <div class="mew-heading-3">
              Is your Dapp available for use in the United States? *
            </div>
          </div>
          <div class="border">
            <v-radio-group v-model="availableForUs" column class="mt-0">
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
            <div class="mew-heading-3">Dapp status *</div>
          </div>
          <div class="border">
            <v-radio-group v-model="dappStatus" column class="mt-0">
              <v-radio label="Live" value="live"></v-radio>
              <v-radio label="Beta" value="beta"></v-radio>
              <v-radio label="Prototype" value="prototype"></v-radio>
              <v-radio label="Work in progress" value="inprogress"></v-radio>
              <v-radio label="Concept" value="concept"></v-radio>
              <v-radio label="Stealth" value="stealth"></v-radio>
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
              Audits are not required for application, but are required by final
              step.
            </div>
          </div>
          <div class="border">
            <v-radio-group v-model="dappContractAudit" column class="mt-0">
              <v-radio label="None in process" value="none"></v-radio>
              <v-radio label="In process" value="inprocess"></v-radio>
              <v-radio label="Completed" value="completed"></v-radio>
            </v-radio-group>
          </div>

          <!--
          =================================================================
          Mock user flow
          =================================================================
          -->
          <div class="title-m">
            <div class="mew-heading-3">Mock user flow *</div>
            <div>
              Dimensions must be 1200px width by 630px height (JPEG, PDF less
              than 5MB)
            </div>
          </div>
          <div class="border">
            <v-file-input
              v-model="mockUserFlow"
              accept="image/*"
              label="File input"
            ></v-file-input>
          </div>

          <!--
          =================================================================
          Dapp icon
          =================================================================
          -->
          <div class="title-m">
            <div class="mew-heading-3">Dapp icon *</div>
            <div>
              Dimensions must be 192px width by 192px height (JPEG, PNG)
            </div>
          </div>
          <div class="border">
            <v-file-input
              v-model="dappIcon"
              accept="image/*"
              label="File input"
            ></v-file-input>
          </div>

          <!--
          =================================================================
          Banner
          =================================================================
          -->
          <div class="title-m">
            <div class="mew-heading-3">Banner *</div>
            <div>
              Dimensions must be 1200px width by 206px height (JPEG, PNG)
            </div>
          </div>
          <div class="border">
            <v-file-input
              v-model="banner"
              accept="image/*"
              label="File input"
            ></v-file-input>
          </div>

          <!--
          =================================================================
          Authors
          =================================================================
          -->
          <div class="title-m">
            <div class="mew-heading-3">Authors *</div>
            <div>Separate names or organizations with a comma</div>
          </div>
          <mew-input
            v-model="authors"
            placeholder="e.g.) James Lee, Emilie Roy, Edward McCormick"
          />

          <!--
          =================================================================
          My full name
          =================================================================
          -->
          <div class="title-m">
            <div class="mew-heading-3">My full name *</div>
          </div>
          <mew-input v-model="myFullName" />

          <!--
          =================================================================
          My email
          =================================================================
          -->
          <div class="title-m">
            <div class="mew-heading-3">My email *</div>
          </div>
          <mew-input v-model="myEmail" />

          <!--
          =================================================================
          Company social links
          =================================================================
          -->
          <div class="title-m">
            <div class="mew-heading-3">Company social links *</div>
            <div>Provide at least one social link</div>
          </div>
          <div class="border social-media">
            <div
              v-for="s in socialLinks"
              :key="s.name"
              class="d-flex align-center"
            >
              <img :src="s.icon" :alt="s.name" />
              <v-text-field v-model="s.data" :label="s.name" />
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
          <mew-input v-model="companyWebsite" />

          <!--
          =================================================================
          Software license
          =================================================================
          -->
          <div class="title-m">
            <div class="mew-heading-3">Software license</div>
          </div>
          <mew-input
            v-model="softwareLicense"
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
          <mew-text-area v-model="additionalNotes"></mew-text-area>
        </v-col>

        <v-col cols="12" md="6">aaaa </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import TheLayoutHeader from '../components-default/TheLayoutHeader';

export default {
  name: 'DappSubmition',
  components: { TheLayoutHeader },
  data: () => ({
    dappName: '',
    category: '',
    tags: [],
    description: '',
    contractAddress: '',
    dappWebsite: '',
    availableForUs: undefined,
    dappStatus: '',
    dappContractAudit: '',
    mockUserFlow: {},
    dappIcon: {},
    banner: {},
    authors: '',
    myFullName: '',
    myEmail: '',
    socialFacebook: '',
    socialTwitter: '',
    socialLinkedIn: '',
    socialReddit: '',
    socialMedium: '',
    socialGithub: '',
    companyWebsite: '',
    softwareLicense: '',
    additionalNotes: '',
    itemsCategory: [
      { state: 'Florida', abbr: 'FL' },
      { state: 'Georgia', abbr: 'GA' },
      { state: 'Nebraska', abbr: 'NE' },
      { state: 'California', abbr: 'CA' },
      { state: 'New York', abbr: 'NY' }
    ],
    socialLinks: [
      {
        name: 'Facebook',
        icon: require('@/assets/images/icons/socials/svg/facebook.svg'),
        data: this.socialFacebook
      },
      {
        name: 'Twitter',
        icon: require('@/assets/images/icons/socials/svg/twitter.svg'),
        data: this.socialTwitter
      },
      {
        name: 'LinkedIn',
        icon: require('@/assets/images/icons/socials/svg/linkedin.svg'),
        data: this.socialLinkedIn
      },
      {
        name: 'Reddit',
        icon: require('@/assets/images/icons/socials/svg/reddit.svg'),
        data: this.socialReddit
      },
      {
        name: 'Medium',
        icon: require('@/assets/images/icons/socials/svg/medium.svg'),
        data: this.socialMedium
      },
      {
        name: 'Github',
        icon: require('@/assets/images/icons/socials/svg/github.svg'),
        data: this.socialGithub
      }
    ]
  }),
  watch: {},
  mounted() {},
  methods: {}
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
