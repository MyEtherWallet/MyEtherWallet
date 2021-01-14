<template>
  <div>
    <register-domain-overlay
      ref="registerDomainOverlay"
      :on-register="onRegister"
      :close="closeRegisterOverlay"
      :name-module="nameModule"
    />
    <mew6-white-sheet>
      <mew-banner :text-obj="topBanner" :banner-img="ensBgImg" />
      <mew-tabs :items="tabs" has-underline>
        <template #tabContent1>
          <v-sheet max-width="700px" color="transparent" class="py-15 mx-auto">
            <div class="mb-5">
              <div class="mew-heading-2 mb-8 ml-2">
                {{ $t('ens.search-domain') }}
              </div>
              <div class="d-flex align-start">
                <mew-input
                  :value="name"
                  :has-clear-btn="true"
                  :rules="rules"
                  :label="$t('ens.register.domain-name')"
                  :placeholder="$t('ens.ph.three-char')"
                  class="mr-3 flex-grow-1"
                  @input="setName"
                />
                <mew-button
                  :disabled="name.length <= 0"
                  :has-full-width="false"
                  btn-size="xlarge"
                  :title="$t('ens.register-domain')"
                  @click.native="findDomain"
                />
              </div>
            </div>
          </v-sheet>
        </template>
        <template #tabContent2>
          <div class="pa-12">
            <div class="d-flex align-center justify-space-between mb-7">
              <h4 class="font-weight-bold">
                {{ $t('ens.my-domains') }}
                <span class="font-weight-regular">(1)</span>
              </h4>
              <mew-button
                btn-style="outline"
                title="+ Add domain you own"
                btn-size="large"
              />
            </div>
            <div>
              <mew-expand-panel :panel-items="myDomains">
                <template #panelBody1>
                  <div>
                    <div class="header-block bg_datablock">
                      <v-row>
                        <v-col cols="6">
                          <div class="d-flex align-center">
                            <div>Registrant</div>
                            <mew-blockie
                              width="25px"
                              height="25px"
                              class="mx-3"
                            />
                            <div class="monospace truncate">
                              0xD4289C524f3A75b783497EB5a459a54F6F4df8D1aaaaaaaaaaaaaa
                            </div>
                          </div>
                        </v-col>
                        <v-col cols="6">
                          <div class="d-flex align-center">
                            <div>Controller</div>
                            <mew-blockie
                              width="25px"
                              height="25px"
                              class="mx-3"
                            />
                            <div class="monospace truncate">
                              0xD4289C524f3A75b783497EB5a459a54F6F4df8D1aaaaaaaaaaaaaa
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </div>
                    <div>
                      <div
                        class="d-flex align-center justify-space-between border-bottom py-5 px-0"
                      >
                        <div class="mew-heading-3">
                          What do you want to do with the domain?
                        </div>
                        <div>Parent - ETH</div>
                      </div>
                      <v-divider></v-divider>
                      <div class="pa-5">
                        <v-row>
                          <v-col
                            v-for="(f, key) in domainFunctions"
                            :key="key"
                            cols="2"
                            class="text-center"
                          >
                            <mew-icon icon-name="ensManager" :img-height="75" />
                            <div>{{ f.label }}</div>
                            <div v-if="f.expire" class="orange--text">
                              <div>Expire at</div>
                              <div>{{ f.expire }}</div>
                            </div>
                          </v-col>
                        </v-row>
                      </div>
                    </div>
                  </div>
                </template>
                <template #panelBody2>
                  <div>
                    <div class="header-block bg_datablock">
                      <v-row>
                        <v-col cols="6">
                          <div class="d-flex align-center">
                            <div>Registrant</div>
                            <mew-blockie
                              width="25px"
                              height="25px"
                              class="mx-3"
                            />
                            <div class="monospace truncate">
                              0xD4289C524f3A75b783497EB5a459a54F6F4df8D1aaaaaaaaaaaaaa
                            </div>
                          </div>
                        </v-col>
                        <v-col cols="6">
                          <div class="d-flex align-center">
                            <div>Controller</div>
                            <mew-blockie
                              width="25px"
                              height="25px"
                              class="mx-3"
                            />
                            <div class="monospace truncate">
                              0xD4289C524f3A75b783497EB5a459a54F6F4df8D1aaaaaaaaaaaaaa
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </div>
                    <div>
                      <div
                        class="d-flex align-center justify-space-between border-bottom py-5 px-0"
                      >
                        <div class="mew-heading-3">
                          What do you want to do with the domain?
                        </div>
                        <div>Parent - ETH</div>
                      </div>
                      <v-divider></v-divider>
                      <div class="pa-5">
                        <v-row>
                          <v-col
                            v-for="(f, key) in domainFunctions"
                            :key="key"
                            cols="2"
                            class="text-center"
                          >
                            <mew-icon icon-name="ensManager" :img-height="75" />
                            <div>{{ f.label }}</div>
                            <div v-if="f.expire" class="orange--text">
                              <div>Expire at</div>
                              <div>{{ f.expire }}</div>
                            </div>
                          </v-col>
                        </v-row>
                      </div>
                    </div>
                  </div>
                </template>
              </mew-expand-panel>
              <!-- <domain-btn domain="iamexpired.eth" badge="expired" />
              <domain-btn domain="almostexpired.eth" badge="expired" /> -->
            </div>
          </div>
        </template>
      </mew-tabs>
    </mew6-white-sheet>
  </div>
</template>

<script>
import ensBgImg from '@/assets/images/backgrounds/bg-ens.png';
import registerDomainOverlay from './register/register-domain/RegisterDomain';
// import domainBtn from '@/modules/wallets/components/domain-btn/DomainBtn';
import ENSManager from './index';
import { mapState } from 'vuex';

export default {
  components: { registerDomainOverlay },
  data() {
    return {
      name: '',
      nameModule: {},
      ensManager: {},
      onRegister: false,
      domainFunctions: [
        { label: this.$t('ens.transfer-domain') },
        { label: 'Renew Domain', expire: '07/21/2020' },
        { label: 'ENS Configurations' },
        { label: 'Manage Multicoins' },
        { label: 'Manage Text Records' },
        { label: 'Upload Website' },
        { label: 'Return Funds' }
      ],
      tabs: [{ name: 'Register domain' }, { name: 'Manage domain' }],
      myDomains: [
        {
          name: 'mewdev009.eth',
          subtext: '',
          colorTheme: 'superPrimary',
          warningBadge: {
            color: 'warning darken-2',
            text: 'Expire soon'
          }
        },
        {
          name: 'mewdev008.eth',
          subtext: '',
          colorTheme: 'superPrimary',
          warningBadge: {
            color: 'warning darken-2',
            text: 'Expire soon'
          }
        }
      ],
      ensBgImg: ensBgImg,
      topBanner: {
        title: this.$t('ens.title'),
        subtext: this.$t('ens.dapp-desc'),
        exit: this.$t('common.exit-dapp')
      },
      tab: 1
    };
  },
  computed: {
    ...mapState('wallet', ['network', 'address', 'web3', 'ens', 'gasPrice']),
    rules() {
      return [
        this.name.length > 2 || this.$t('ens.warning.not-enough-char'),
        !this.hasInvalidChars || this.$t('ens.warning.invalid-symbol')
      ];
    },
    hasInvalidChars() {
      const letters = /^[0-9a-zA-Z]+$/;
      if (!letters.test(this.name)) {
        return true;
      }
      return false;
    }
  },
  mounted() {
    this.ensManager = new ENSManager(
      this.network,
      this.address,
      this.web3,
      this.ens,
      this.gasPrice
    );
    // this.getDomains();
  },
  methods: {
    getDomains() {
      this.ensManager
        .getAllNamesForAddress()
        .then(res => {
          console.error('res', res);
        })
        .catch(err => {
          console.error('err', err);
        });
    },
    findDomain() {
      const name = this.name + '.eth';
      this.ensManager
        .searchName(name)
        .then(res => {
          this.nameModule = res;
          this.onRegister = true;
        })
        .catch(err => {
          console.error('err', err);
        });
    },
    closeRegisterOverlay() {
      this.onRegister = false;
      this.name = '';
      this.$refs.registerDomainOverlay.clear();
    },
    setName(name) {
      this.name = name;
    }
  }
};
</script>
