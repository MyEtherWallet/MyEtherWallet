<template>
  <BaseOverlay :open="open" :close="close" :back="false" close-text="Cancel">
    <OverlayTitle title="Settings" />

    <div class="overlay-content">
      <v-expansion-panels flat light>
        <ExpansionPanelContent title="Gas price" subtitle="1 Gwei (Economic)">
          <template v-slot:content>
            <v-item-group>
              <v-row>
                <v-col v-for="n in 4" :key="n" cols="12" md="3">
                  <v-item v-slot:default="{ active, toggle }">
                    <v-card
                      flat
                      :color="active ? 'primary' : 'grey'"
                      class="d-flex align-center"
                      height="200"
                      @click="toggle"
                    >
                      <v-scroll-y-transition>
                        <div v-if="active" class="flex-grow-1 text-center">
                          a
                        </div>
                      </v-scroll-y-transition>
                    </v-card>
                  </v-item>
                </v-col>
              </v-row>
            </v-item-group>
          </template>
        </ExpansionPanelContent>

        <ExpansionPanelContent title="Import configurations">
          <template v-slot:content>
            <div class="descriptions mb-7">
              Please upload the file, and click the button on the left top to
              open and import you configuration file from your local computer.
            </div>
            <div class="d-flex align-start">
              <v-file-input
                color="emerald"
                label="Upload file..."
                filled
              ></v-file-input>
              <StdButton
                buttonclass="button--green-border"
                class="ml-3"
                height="57px"
              >
                Import
              </StdButton>
            </div>
          </template>
        </ExpansionPanelContent>

        <ExpansionPanelContent title="Export configurations">
          <template v-slot:content>
            <div class="descriptions mb-7">
              Please click the button on the left top to download your
              configuration file into your local computer.
            </div>
            <StdButton buttonclass="button--green-border">
              Export
            </StdButton>
          </template>
        </ExpansionPanelContent>

        <ExpansionPanelContent title="Contact address">
          <template v-slot:content>
            <div class="descriptions mb-7">
              You can add up to 10 contact addresses.
            </div>
            <div class="mb-5">
              <v-data-table
                :headers="adresses.headers"
                :items="adresses.desserts"
                :items-per-page="5"
              >
                <template v-slot:item.actions="{ item }">
                  <v-icon small class="mr-2" @click="editItem(item)">
                    mdi-pencil
                  </v-icon>
                  <v-icon small @click="deleteItem(item)">
                    mdi-delete
                  </v-icon>
                </template>
                <template v-slot:item.number>
                  {{ getAddressCount() }}
                </template>
                <template v-slot:item.blockie="{ item }">
                  <blockie
                    :address="item.address"
                    :size="8"
                    :scale="16"
                    width="30px"
                    height="30px"
                    class="blockie-image"
                  />
                </template>
              </v-data-table>
            </div>
            <StdButton buttonclass="button--green-border">
              + Add
            </StdButton>
          </template>
        </ExpansionPanelContent>
      </v-expansion-panels>
    </div>
  </BaseOverlay>
</template>

<script>
import BaseOverlay from '../BaseOverlay';
import OverlayTitle from '@/components/OverlayTitle';
import StdButton from '@/web/components/StdButton';
import ExpansionPanelContent from './components/ExpansionPanelContent';
import Blockie from '@/web/components/Blockie';

export default {
  components: {
    BaseOverlay,
    OverlayTitle,
    StdButton,
    ExpansionPanelContent,
    Blockie
  },
  props: {
    open: { default: false, type: Boolean },
    close: {
      default: function() {
        return {};
      },
      type: Function
    }
  },
  data() {
    return {
      adresses: {
        count: 0,
        headers: [
          {
            text: '#',
            value: 'number'
          },
          {
            text: '',
            value: 'blockie'
          },
          {
            text: 'ADDRESS',
            value: 'address'
          },
          { text: 'NICKNAME', value: 'nickname' },
          { text: '', value: 'actions', sortable: false }
        ],
        desserts: [
          {
            address: '0x4b0959AE0b7F0a56407eD0a47539649F4FD3A599',
            nickname: 'Moms'
          },
          {
            address: '0xd7B9A9b2F665849C4071Ad5af77d8c76aa30fb32',
            nickname: 'Dads'
          },
          {
            address: '0xa192E4eaCB00993ea3DBE1b59aFeb962C09493a5',
            nickname: 'Mikes'
          }
        ]
      }
    };
  },
  methods: {
    getAddressCount() {
      this.adresses.count++;
      return this.adresses.count;
      //return 1;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';

.overlay-content {
  width: 750px;
}

.v-expansion-panel {
  margin-top: 20px !important;
  border-radius: 12px !important;
  box-shadow: $gray-3 0px 0px 15px;

  &:first-child {
    margin-top: 0px !important;
  }
}

.descriptions {
  max-width: 450px;
}
</style>
