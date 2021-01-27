<template>
  <div>
    <register-domain
      ref="registerDomain"
      :on-register="onRegister"
      :close="closeRegister"
      :register="register"
      :loading-commit="loadingCommit"
      :commited="committed"
      :minimum-age="minimumAge"
      :commit="commit"
      :name="nameHandler.name"
      :parsed-host-name="nameHandler.parsedHostName"
      :is-available="nameHandler.isAvailable"
      :checking-domain-avail="nameHandler.checkingDomainAvail"
      :generate-key-phrase="generateKeyPhrase"
    />
    <manage-domain
      ref="manageDomain"
      :setting-ipfs="settingIpfs"
      :on-manage="onManage"
      :close="closeManage"
      :type="manageType"
      :transfer="transfer"
      :renew="renew"
      :upload-file="uploadFile"
      :set-text-records="setTextRecords"
      :set-multicoin="setMulticoin"
      :set-ipfs="setIpfs"
      :host-name="manageDomainHandler.parsedHostName"
    />
    <mew6-white-sheet>
      <mew-banner :text-obj="topBanner" :banner-img="ensBgImg" />
      <mew-tabs class="pt-5" :items="tabs" :is-centered="true" has-underline>
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
            </div>
            <mew-expand-panel
              :idx-to-expand="null"
              class="my-domains"
              :panel-items="myDomains"
            >
              <template
                v-for="(domain, idx) in myDomains"
                :slot="'panelBody' + (idx + 1)"
                :class="domain.expired ? 'expired' : 'available'"
              >
                <div :key="idx">
                  <div :class="['d-flex justify-space-between pt-5']">
                    <!-- domain.expired ? 'errorOutlineActive' : 'superPrimary' -->
                    <div class="d-flex align-center">
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
                    </div>
                    <div class="d-flex align-center">
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
                    </div>
                  </div>
                  <div
                    class="mt-3 d-flex align-center justify-space-between py-5 px-0"
                  >
                    <span class="mew-heading-3">
                      {{ $t('ens.manage-domains.what-to-do') }}
                    </span>
                  </div>
                  <v-divider></v-divider>
                  <v-row class="pa-5">
                    <v-col
                      v-for="(option, key) in manageDomainOptions"
                      :key="key"
                      cols="2"
                      class="text-center"
                    >
                      <mew-icon
                        class="cursor-pointer"
                        icon-name="ensManager"
                        :img-height="70"
                        @click.native="manage(option.type, idx)"
                      />
                      <div>{{ option.label }}</div>
                      <div
                        v-if="domain.expiration && key === 1"
                        class="orange--text"
                      >
                        <div>
                          {{
                            $t('ens.manage-domains.expire-at', {
                              date: domain.expiration
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
import registerDomain from './modules/ModuleRegisterDomain';
import manageDomain from './modules/ModuleManageDomain';
import ENSManager from './handlers/handlerEnsManager';
import { mapState } from 'vuex';
import { Toast, ERROR } from '@/components/toast';
import BigNumber from 'bignumber.js';
import { EventBus } from '@/plugins/eventBus';
import EventNames from '@/utils/web3-provider/events.js';

export default {
  components: { registerDomain, manageDomain },
  data() {
    return {
      loadingCommit: false,
      minimumAge: '',
      committed: false,
      settingIpfs: false,
      manageDomainHandler: {},
      manageType: '',
      onManage: false,
      name: '',
      nameHandler: {},
      ensManager: {},
      onRegister: false,
      manageDomainOptions: [
        { label: this.$t('ens.transfer-domain'), type: 'transfer' },
        {
          label: this.$t('ens.manage-domains.renew-domain'),
          type: 'renew'
        },
        {
          label: this.$t('ens.manage-domains.manage-multi'),
          type: 'manageMulticoin'
        },
        {
          label: this.$t('ens.manage-domains.manage-txt'),
          type: 'manageTxtRecord'
        },
        {
          label: this.$t('ens.manage-domains.upload-site'),
          type: 'manageUpload'
        }
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
    ...mapState('wallet', [
      'network',
      'balance',
      'address',
      'web3',
      'ens',
      'gasPrice'
    ]),
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
    },
    // figure out if wei should be the saved value
    balanceToWei() {
      return this.web3.utils.toWei(BigNumber(this.balance).toString(), 'ether');
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
    //manage domain
    manage(type, idx) {
      this.onManage = true;
      this.manageType = type;
      this.manageDomainHandler = this.myDomains[idx];
    },
    getDomains() {
      this.ensManager
        .getAllNamesForAddress()
        .then(res => {
          res.forEach(domain => {
            domain.disabled = domain.expired;
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

          this.myDomains = res;
        })
        .catch(err => {
          Toast(err, {}, ERROR);
        });
    },
    closeManage() {
      this.onManage = false;
      this.settingIpfs = false;
    },
    transfer(address) {
      this.manageDomainHandler
        .transfer(address)
        .then(this.getDomains)
        .catch(err => {
          Toast(err, {}, ERROR);
        });
      this.closeManage();
    },
    renew(duration) {
      this.manageDomainHandler
        .renew(duration, this.balanceToWei)
        .then(this.getDomains)
        .catch(err => {
          Toast(err, {}, ERROR);
        });
      this.closeManage();
    },
    setMulticoin(coin) {
      this.manageDomainHandler
        .setMulticoin(coin)
        .then(this.getDomains)
        .catch(err => {
          Toast(err, {}, ERROR);
        });
      this.closeManage();
    },
    setTextRecords(records) {
      this.manageDomainHandler
        .setTxtRecord(records)
        .then(this.getDomains)
        .catch(err => {
          Toast(err, {}, ERROR);
        });
      this.closeManage();
    },
    uploadFile(file) {
      this.settingIpfs = true;
      this.manageDomainHandler
        .uploadFile(file)
        .then(this.manageDomainHandler.setIPFSHash)
        .then(resp => {
          this.settingIpfs = false;
          this.uploadedHash = resp;
          this.closeManage();
        })
        .catch(err => {
          Toast(err, {}, ERROR);
        });
    },
    setIpfs(hash) {
      this.settingIpfs = true;
      this.manageDomainHandler
        .setIPFSHash(hash)
        .then(() => {
          this.settingIpfs = false;
        })
        .catch(err => {
          Toast(err, {}, ERROR);
        });
      this.closeManage();
    },
    // register domain
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
          this.nameHandler = res;
          this.onRegister = true;
        })
        .catch(err => {
          Toast(err, {}, ERROR);
        });
    },
    closeRegister() {
      this.onRegister = false;
      this.name = '';
      this.nameHandler = {};
      this.$refs.registerDomain.reset();
    },
    setName(name) {
      this.name = name;
    },
    register() {
      this.nameHandler
        .register(this.duration, this.balanceToWei)
        .then(this.closeRegister)
        .catch(err => {
          Toast(err, {}, ERROR);
        });
    },
    commit() {
      this.nameHandler.getMinimumAge().then(resp => {
        this.minimumAge = resp;
      });
      // start timer after confirming tx
      EventBus.$on(EventNames.CONFIRMED_TX, () => {
        this.loadingCommit = true;
      });
      this.nameHandler
        .createCommitment()
        .then(() => {
          this.loadingCommit = false;
          this.committed = true;
        })
        .catch(err => {
          this.closeRegister();
          Toast(err, {}, ERROR);
        });
    },
    generateKeyPhrase() {
      if (this.nameHandler.generateKeyPhrase) {
        this.nameHandler.generateKeyPhrase();
      }
    }
  }
};
</script>
