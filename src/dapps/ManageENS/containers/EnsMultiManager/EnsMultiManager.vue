<template>
  <div class="multi-manager-container">
    <div class="title-container">
      <h3>ENS Manager</h3>
      <p>Manage your ENS names or transfer it to someone else</p>
    </div>
    <div v-if="account.ensNames.length === 0">
      No ENS name found for account {{ account.address }}!
    </div>
    <div v-else class="name-container">
      <div v-for="name in account.ensNames" :key="name['name']">
        <b-btn
          v-b-toggle="`${name['name']}`"
          class="collapse-open-button"
          variant="primary"
        >
          <p>
            {{
              name['name'].substr(0, 2) === '0x'
                ? `[${name['name']}]`
                : name['name']
            }}.{{ network.type.ens ? network.type.ens.registrarTLD : '' }}
          </p>
        </b-btn>
        <b-collapse
          :id="name['name']"
          class="collapse-content ens-multi-manager-content"
          accordion="ens-multi-manager-accordion"
        >
          <div class="items">
            <div class="item-content">
              <div class="item-info">
                <p class="key-name">TLD</p>
                <p class="value">
                  {{
                    network.type.ens
                      ? network.type.ens.registrarTLD
                      : 'ENS not supported'
                  }}
                </p>
              </div>
            </div>
            <div class="item-content">
              <div class="item-info">
                <p class="key-name">Registrant</p>
                <a
                  class="value"
                  :href="
                    network.type.blockExplorerAddr.replace(
                      '[[address]',
                      account.address
                    )
                  "
                  rel="noopener noreferrer"
                >
                  <blockie
                    :address="account.address"
                    width="30px"
                    height="30px"
                    class="blockies"
                  />
                  {{ account.address | concatAddr }}
                </a>
              </div>
            </div>
            <div
              v-for="(val, key) in name"
              v-show="shouldHide(key, name)"
              :key="`${key}-${val}`"
              class="item-content"
            >
              <div class="item-info">
                <p class="key-name">{{ key | capitalize }}</p>
                <a
                  v-if="isAddress(val)"
                  class="value"
                  :href="
                    network.type.blockExplorerAddr.replace('[[address]', val)
                  "
                  rel="noopener noreferrer"
                >
                  <blockie
                    v-if="showBlockie(key)"
                    :address="val"
                    width="30px"
                    height="30px"
                    class="blockies"
                  />
                  {{ val | concatAddr }}
                </a>
                <p v-else class="value">
                  {{ val }}
                </p>
              </div>
              <div>
                <button
                  v-if="name['name'].substr(0, 2) !== '0x'"
                  v-show="key === 'expiration' && name['expired']"
                  class="action-button"
                  @click="callRenew(name['name'])"
                >
                  Renew
                </button>
                <p v-else>
                  Currently in Grace Period
                </p>
                <button
                  v-show="key === 'controller'"
                  class="action-button"
                  @click="
                    checkDomain(`${name.name}.${network.type.ens.registrarTLD}`)
                  "
                >
                  Set
                </button>
              </div>
            </div>
            <div
              class="view-button-container"
              @click="
                checkDomain(`${name.name}.${network.type.ens.registrarTLD}`)
              "
            >
              <button class="view-button">
                View
              </button>
            </div>
          </div>
        </b-collapse>
      </div>
    </div>
  </div>
</template>

<script>
import Blockie from '@/components/Blockie';
import { isAddress } from '@/helpers/addressUtils';
import { mapState, mapActions } from 'vuex';

export default {
  components: {
    blockie: Blockie
  },
  props: {
    getController: {
      type: Function,
      default: () => {}
    },
    renewName: {
      type: Function,
      default: () => {}
    },
    checkDomain: {
      type: Function,
      default: () => {}
    }
  },
  data: () => {
    return {};
  },
  computed: {
    ...mapState('main', ['account', 'network'])
  },
  methods: {
    ...mapActions('main', ['storeEnsNames']),
    callRenew(name) {
      this.renewName(`${name}.${this.network.type.ens.registrarTLD}`);
    },
    showBlockie(name) {
      return !(
        name !== 'controller' &&
        name !== 'registrant' &&
        name !== 'resolver'
      );
    },
    shouldHide(key, name) {
      const exclusion = ['name', 'id', 'description', 'image', 'expired'];
      if (exclusion.includes(key)) {
        return false;
      } else if (key === 'controller' && name['expired']) {
        return false;
      }
      return true;
    },
    isAddress: isAddress
  }
};
</script>

<style lang="scss" scoped>
@import 'EnsMultiManager.scss';
</style>
