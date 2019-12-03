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
              <th class="number-header">#</th>
              <th>{{ $t('dappsAave.token') }}</th>
              <th>
                <div class="sort-enabled-container">
                  {{
                    depositModal
                      ? $t('dappsAave.avail-balance')
                      : $t('dappsAave.avail-for-you')
                  }}
                  <span>
                    <i class="fa fa-caret-up" />
                    <i class="fa fa-caret-down" />
                  </span>
                </div>
              </th>
              <th>
                <div class="sort-enabled-container">
                  {{
                    depositModal
                      ? $t('dappsAave.deposited')
                      : $t('dappsAave.stable-apr')
                  }}
                  <span>
                    <i class="fa fa-caret-up" />
                    <i class="fa fa-caret-down" />
                  </span>
                </div>
              </th>
              <th>
                <div class="sort-enabled-container">
                  {{
                    depositModal
                      ? $t('dappsAave.apr')
                      : $t('dappsAave.variable-apr')
                  }}
                  <span>
                    <i class="fa fa-caret-up" />
                    <i class="fa fa-caret-down" />
                  </span>
                </div>
              </th>
              <th></th>
            </thead>
            <tbody>
              <tr v-for="(token, index) in fakeObj" :key="token.key">
                <td class="number">{{ index + 1 }}.</td>
                <td>{{ token.token }}</td>
                <td>{{ token.avail - balance }}</td>
                <td :class="depositModal ? '' : 'stable-apr'">
                  {{ token.deposited }}
                </td>
                <td :class="depositModal ? '' : 'var-apr'">{{ token.apr }}</td>
                <td>
                  <button class="action-btn" @click="takeAction()">
                    {{
                      depositModal
                        ? $tc('dappsAave.deposit', 1)
                        : $t('dappsAave.borrow')
                    }}
                  </button>
                </td>
              </tr>
            </tbody>
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
          token: 'DAI',
          'avail-balance': '15.42323 DAI',
          deposited: '2.47 DAI',
          apr: '9.72%'
        },
        {
          token: 'DAI',
          'avail-balance': '15.42323 DAI',
          deposited: '2.47 DAI',
          apr: '9.72%'
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
    },
    takeAction() {
      this.$refs['actionModal'].hide();
      this.$router.push('/interface/dapps/aave/action');
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'ActionModal.scss';
</style>

<style lang="scss">
.modal-dialog {
  max-width: 600px !important;
}

.modal-body {
  padding: 0;
}
</style>
