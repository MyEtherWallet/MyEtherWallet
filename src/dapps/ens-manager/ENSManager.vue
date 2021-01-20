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
        <!-- register domain -->
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
          <!-- manage domain -->
          <div class="pa-12">
            <div class="d-flex align-center justify-space-between mb-7">
              <span class="mew-heading-2 font-weight-bold">
                {{ $t('ens.my-domains') }}
                <span class="font-weight-regular"
                  >({{ myDomains.length }})</span
                >
              </span>
              <mew-button
                btn-style="outline"
                :title="$t('ens.manage-domains.add-owned-domain')"
                btn-size="large"
              />
            </div>
            <mew-expand-panel class="my-domains" :panel-items="myDomains">
              <template
                v-for="(domain, idx) in myDomains"
                :slot="'panelBody' + (idx + 1)"
                :class="domain.expired ? 'expired' : 'available'"
              >
                <div :key="idx">
                  <v-row class="justify-space-between">
                    <v-col cols="4" class="d-flex align-center">
                      <div>{{ $t('ens.manage-domains.registrant') }}</div>
                      <mew-blockie
                        :address="domain.registrarAddress"
                        width="25px"
                        height="25px"
                        class="mx-3"
                      />
                      <mew-transform-hash :hash="domain.registrarAddress" />
                      <mew-copy
                        class="ml-2 mew-heading-3"
                        :copy-value="domain.registrarAddress"
                        :is-ref="false"
                      />
                      <a
                        class="address-link"
                        :href="
                          'https://www.ethvm.com/address/' +
                          domain.registrarAddress
                        "
                        target="_blank"
                      >
                        <v-icon small class="call-made"> mdi-call-made </v-icon>
                      </a>
                    </v-col>
                    <v-col cols="4" class="d-flex align-center">
                      <div>{{ $t('ens.manage-domains.controller') }}</div>
                      <mew-blockie
                        :address="domain.controllerAddress"
                        width="25px"
                        height="25px"
                        class="mx-3"
                      />
                      <mew-transform-hash :hash="domain.controllerAddress" />
                      <mew-copy
                        class="ml-2 mew-heading-3"
                        :copy-value="domain.controllerAddress"
                        :is-ref="false"
                      />
                      <a
                        class="address-link"
                        :href="
                          'https://www.ethvm.com/address/' +
                          domain.controllerAddress
                        "
                        target="_blank"
                      >
                        <v-icon small class="call-made"> mdi-call-made </v-icon>
                      </a>
                    </v-col>
                  </v-row>
                  <v-row class="align-center justify-space-between py-5 px-0">
                    <span class="mew-heading-3">
                      {{ $t('ens.manage-domain.what-to-do') }}
                    </span>
                    <!-- not sure what this means -->
                    <span>Parent - ETH</span>
                  </v-row>
                  <v-divider></v-divider>
                  <v-row class="pa-5">
                    <v-col
                      v-for="(f, key) in domainFunctions"
                      :key="key"
                      cols="2"
                      class="text-center"
                    >
                      <mew-icon icon-name="ensManager" :img-height="75" />
                      <div>{{ f.label }}</div>
                      <div v-if="f.expire" class="orange--text">
                        <div>
                          {{
                            $t('ens.manage-domain.expire-at', {
                              date: domain.expire
                            })
                          }}
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </template>
            </mew-expand-panel>
          </div>
        </template>
      </mew-tabs>
    </mew6-white-sheet>
  </div>
</template>

<script>
import ensBgImg from '@/assets/images/backgrounds/bg-ens.png';
import registerDomainOverlay from './register/register-domain/RegisterDomain';
import ENSManager from './index';
import { mapState } from 'vuex';
import { Toast, ERROR } from '@/components/toast';

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
      tabs: [
        { name: this.$t('ens.register-domain') },
        { name: this.$t('ens.manage-domain') }
      ],
      myDomains: [],
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
      const letters = /^[0-9a-zA-Z_.-]+$/;
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
    this.getDomains();
  },
  methods: {
    getDomains() {
      this.ensManager
        .getAllNamesForAddress()
        .then(res => {
          res.forEach(domain => {
            domain.colorTheme = domain.expired
              ? 'errorOutlineActive'
              : 'superPrimary';
            domain.warningBadge = domain.expired
              ? {
                  color: 'error',
                  text: this.$t('ens.expired')
                }
              : '';
          });

          console.error('res', res);
          this.myDomains = res;
        })
        .catch(err => {
          Toast(err, {}, ERROR);
        });
    },
    findDomain() {
      //make sure there is no empty string after '.'
      const strLength = this.name.length;
      const name =
        this.name[strLength - 1] === '.'
          ? this.name.substring(0, strLength - 1)
          : this.name;
      this.ensManager
        .searchName(name)
        .then(res => {
          this.nameModule = res;
          this.onRegister = true;
        })
        .catch(err => {
          Toast(err, {}, ERROR);
        });
    },
    closeRegisterOverlay() {
      this.onRegister = false;
      this.name = '';
      this.nameModule = {};
      this.$refs.registerDomainOverlay.clear();
    },
    setName(name) {
      this.name = name;
    }
  }
};
</script>

<style lang="scss" scoped>
// .my-domains {
//   .v-expansion-panel-content__wrap {
//     padding: 0 !important;
//   }
// }
//
</style>
