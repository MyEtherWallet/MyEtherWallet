<template>
  <v-sheet
    :outlined="true"
    color="transparent"
    :rounded="true"
    :max-width="740"
    :min-width="475"
    :min-height="340"
  >
    <v-container>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <mew-expand-panel
            :interactive-content="true"
            :panel-items="panelItems"
          >
            <template #panelBody1>
              <div class="network-container">
                <v-radio-group v-model="selectedNetwork">
                  <div v-for="type in networkTypes" :key="type">
                    <p class="text-capitalize mew-header-block">
                      {{ type }}
                    </p>
                    <v-container>
                      <v-row align="center" justify="space-between">
                        <v-col
                          v-for="(item, idx) in Networks[type]"
                          :key="item.service + idx"
                          cols="6"
                        >
                          <v-radio :label="item.service" :value="item.url" />
                        </v-col>
                      </v-row>
                    </v-container>
                  </div>
                </v-radio-group>
              </div>
            </template>
            <template #panelBody2>
              <div>
                <v-radio-group v-model="selectedAddress">
                  <table width="100%">
                    <thead>
                      <tr class="table-header">
                        <th width="50%" class="align-center">Address</th>
                        <th width="25%" class="align-center">Eth Balance</th>
                        <th width="25%" class="align-center"># of Tokens</th>
                      </tr>
                    </thead>
                    <tbody class="table-row-class">
                      <tr
                        v-for="acc in accounts"
                        v-show="accounts.length > 0"
                        :key="acc.address"
                      >
                        <td>
                          <v-row justify="space-around">
                            <v-col cols="1">
                              <v-radio label="" :value="acc.address" />
                            </v-col>
                            <v-col cols="8" class="text-truncate">
                              <v-row justify="space-around">
                                <mew-blockie
                                  width="25px"
                                  height="25px"
                                  :address="acc.address"
                                />
                                <span>{{ acc.address | concatAddress }}</span>
                              </v-row>
                              <input
                                :ref="acc.address"
                                :value="acc.address"
                                class="address-copy-input"
                              />
                            </v-col>
                            <v-col cols="2">
                              <v-row>
                                <v-icon
                                  small
                                  class="cursor--pointer"
                                  @click="copy(acc.address)"
                                  >mdi-content-copy</v-icon
                                >
                                <v-icon
                                  small
                                  class="cursor--pointer"
                                  @click="launchExplorrer(acc.address)"
                                  >mdi-launch</v-icon
                                >
                              </v-row>
                            </v-col>
                          </v-row>
                        </td>
                        <td>
                          {{
                            acc.balance === 'Loading..'
                              ? acc.balance
                              : `${acc.balance} ${network.type.name}`
                          }}
                        </td>
                        <td>{{ acc.tokens }}</td>
                      </tr>
                      <tr v-show="accounts.length === 0">
                        Loading...
                      </tr>
                    </tbody>
                  </table>
                </v-radio-group>
                <br />
                <v-row align="center" justify="center">
                  <div>
                    <mew-button
                      title="Previous"
                      color-theme="basic"
                      icon="mdi-chevron-left"
                      icon-type="mdi"
                      :has-full-width="false"
                      btn-size="small"
                      icon-align="left"
                      btn-style="transparent"
                      :disabled="addressPage <= 1"
                      @click.native="previousAddressSet"
                    />
                    <mew-button
                      title="Next"
                      color-theme="basic"
                      icon="mdi-chevron-right"
                      icon-type="mdi"
                      :has-full-width="false"
                      btn-size="small"
                      icon-align="right"
                      btn-style="transparent"
                      @click.native="nextAddressSet"
                    />
                  </div>
                </v-row>
              </div>
            </template>
          </mew-expand-panel>
          <div class="d-flex align-center flex-column">
            <mew-button
              title="Access My Wallet"
              btn-size="large"
              :disabled="!(selectedAddress && acceptTerms)"
              @click.native="
                () => {
                  setHardwareWallet(wallet.account);
                }
              "
            />
            <mew-checkbox
              v-model="acceptTerms"
              label="To access my wallet, I accept "
              :link="link"
              class="justify-center"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
table {
  border-spacing: 0;
}

.table-header {
  text-align: center;
  background-color: #f0f0f0;
  th {
    color: #96a8b6;
    font-weight: bold;
    text-transform: uppercase;
  }
}

.table-row-class {
  tr:nth-child(odd) {
    background-color: #f9f9f9;
  }
}

.network-container {
  max-height: 250px;
  overflow: scroll;
}

.address-copy-input {
  opacity: 0;
  position: absolute;
  z-index: -1;
}
</style>
