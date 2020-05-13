<template>
  <div class="multi-manager-container">
    <div class="title-container">
      <h3>ENS Manager</h3>
      <p>Manage your ENS names or transfer it to someone else</p>
    </div>
    <div class="name-container">
      <div v-for="name in names" :key="name.name">
        <b-btn
          v-b-toggle="`${name.name}`"
          class="collapse-open-button"
          variant="primary"
        >
          <p>{{ name.name }}</p>
        </b-btn>
        <b-collapse
          :id="name.name"
          class="collapse-content ens-multi-manager-content"
          accordion="ens-multi-manager-accordion"
        >
          <div class="items">
            <div
              v-for="(val, key) in name"
              v-show="key !== 'name'"
              :key="`${key}-${val}`"
              class="item-content"
            >
              <div>
                <p class="key-name">{{ key | capitalize }}</p>
                <p class="value">
                  <blockie
                    v-if="showBlockie(key)"
                    :address="val"
                    width="30px"
                    height="30px"
                    class="blockies"
                  />
                  {{ val }}
                </p>
              </div>
              <div>
                button
              </div>
            </div>
          </div>
        </b-collapse>
      </div>
    </div>
  </div>
</template>

<script>
import Blockie from '@/components/Blockie';
export default {
  components: {
    blockie: Blockie
  },
  data: () => {
    return {
      names: [
        {
          tld: 'ETH',
          registrant: '0x00000000',
          controller: '0x00000000',
          expiration: '01/01/69',
          name: 'nameyboi1.eth',
          resolver: '0x00000000'
        },
        {
          tld: 'ETH',
          registrant: '0x00000000',
          controller: '0x00000000',
          expiration: '01/01/69',
          name: 'nameyboi2.eth',
          resolver: '0x00000000'
        },
        {
          tld: 'ETH',
          registrant: '0x00000000',
          controller: '0x00000000',
          expiration: '01/01/69',
          name: 'nameyboi3.eth',
          resolver: '0x00000000'
        }
      ]
    };
  },
  methods: {
    showBlockie(name) {
      return !(
        name !== 'controller' &&
        name !== 'registrant' &&
        name !== 'resolver'
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'EnsMultiManager.scss';
</style>
