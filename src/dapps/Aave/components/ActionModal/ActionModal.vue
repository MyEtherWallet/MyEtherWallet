<template>
  <div class="modal-container">
    <b-modal
      ref="actionModal"
      :title="depositModal ? 'Deposit' : 'Borrow'"
      centered
      hide-footer
      static
      lazy
    >
      <div class="modal-contents">
        <div class="header-container">
          <div class="search-container">
            <i class="fa fa-search" />
            <input
              v-model="search"
              :placeholder="$t('dappsAave.search-tokens')"
            />
          </div>
          <div class="type-token-container">
            <span>{{ $t('dappsAave.type-token') }}</span>
            <div class="tab-container">
              <div
                :class="['action-btn', allTabActive ? 'active-tab' : '']"
                @click="toggleTabs()"
              >
                {{ $t('dappsAave.all') }}
              </div>
              <div
                :class="[
                  'action-btn',
                  'stable-btn',
                  stableTabActive ? 'active-tab' : ''
                ]"
                @click="toggleTabs()"
              >
                {{ $t('dappsAave.stable') }}
              </div>
            </div>
          </div>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <th>#</th>
              <th>{{ $t('dappsAave.token') }}</th>
              <th>
                {{
                  depositModal
                    ? $t('dappsAave.avail-balance')
                    : $t('dappsAave.avail-for-you')
                }}
              </th>
              <th>
                {{
                  depositModal
                    ? $t('dappsAave.deposited')
                    : $t('dappsAave.stable-apr')
                }}
              </th>
              <th>
                {{
                  depositModal
                    ? $t('dappsAave.apr')
                    : $t('dappsAave.variable-apr')
                }}
              </th>
            </thead>
          </table>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    depositModal: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      search: '',
      allTabActive: true,
      stableTabActive: false,
      fakeObj: [
        {
          "token": "DAI",
          "avail-balanc": "15.42323 DAI",
          "deposited": "2.47 DAI",
          "apr": "9.72%"
        }
      ]
    };
  },
  computed: {
    title: function() {
      return this.depositModal ? 'Deposit' : 'Borrow';
    }
  },
  methods: {
    toggleTabs() {
      this.allTabActive = !this.allTabActive;
      this.stableTabActive = !this.stableTabActive;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ActionModal.scss';
</style>
