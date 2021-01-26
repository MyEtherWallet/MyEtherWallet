<template>
  <mew-overlay
    left-btn-text=""
    :show-overlay="open"
    right-btn-text="Close"
    @closeOverlay="$emit('close')"
  >
    <template #mewOverlayBody>
      <v-sheet class="transparent" max-width="700px" width="100%">
        <v-sheet
          color="transparent"
          max-width="350px"
          class="d-flex align-center justify-space-between mx-auto mb-6"
        >
          <div>
            <v-icon color="primary" large> mdi-circle-medium </v-icon>
            Succeed1
          </div>
          <div>
            <v-icon color="orange" large> mdi-circle-medium </v-icon>
            Pending
          </div>
          <div>
            <v-icon color="error" large> mdi-circle-medium </v-icon>
            Failed
          </div>
        </v-sheet>
        <h2 class="text-center mb-2">Notifications</h2>
        <div class="d-flex align-center justify-space-between">
          <div>
            <div>6 notifications</div>
            <v-btn depressed x-small color="textSecondary" dark>
              Delete all
            </v-btn>
          </div>
          <v-sheet color="transparent" max-width="150px">
            <v-select
              v-model="selected"
              flat
              solo
              :items="items"
              item-text="label"
              item-value="val"
            ></v-select>
          </v-sheet>
        </div>
        <mew6-white-sheet>
          <div class="pa-4">
            <div class="mt-4">
              <h5 class="text-center font-weight-bold">1/8/2020</h5>
              <v-expansion-panels hover flat>
                <In
                  address="0xabc23787066c571a61274929746895c24fa9dbfc"
                  amount="0.000234 ETH"
                  time="1 min"
                  :data="inData"
                  active
                />
                <Out
                  address="0xabc23787066c571a61274929746895c24fa9dbfc"
                  amount="0.000234 XMR"
                  time="1 min"
                  :data="outData"
                  active
                />
                <Swap
                  address="0xabc23787066c571a61274929746895c24fa9dbfc"
                  from-amount="0.000234 ETH"
                  to-amount="0.000234 XMR"
                  time="1 min"
                  :data="swapData"
                  active
                />
              </v-expansion-panels>
            </div>

            <div class="mt-4">
              <h5 class="text-center font-weight-bold">1/7/2020</h5>
              <v-expansion-panels hover flat>
                <In
                  address="0xabc23787066c571a61274929746895c24fa9dbfc"
                  amount="0.000234 ETH"
                  time="1 min"
                  :data="inData"
                />
                <Out
                  address="0xabc23787066c571a61274929746895c24fa9dbfc"
                  amount="0.000234 XMR"
                  time="1 min"
                  :data="outData"
                />
                <Out
                  address="0xabc23787066c571a61274929746895c24fa9dbfc"
                  amount="0.000234 XMR"
                  time="1 min"
                  :data="outData"
                />
                <Out
                  address="0xabc23787066c571a61274929746895c24fa9dbfc"
                  amount="0.000234 XMR"
                  time="1 min"
                  :data="outData"
                />
                <Out
                  address="0xabc23787066c571a61274929746895c24fa9dbfc"
                  amount="0.000234 XMR"
                  time="1 min"
                  :data="outData"
                />
              </v-expansion-panels>
            </div>
          </div>
        </mew6-white-sheet>
      </v-sheet>
      <div class="text-center py-6">
        <v-pagination v-model="page" :length="6"></v-pagination>
      </div>
    </template>
  </mew-overlay>
</template>

<script>
import In from './components/in/In';
import Out from './components/out/Out';
import Swap from './components/swap/Swap';
import { mapState } from 'vuex';
import utils from 'web3-utils';
import Transfers from '@/apollo/queries/notifications';

export default {
  components: { In, Out, Swap },
  props: {
    open: { default: false, type: Boolean }
  },
  data() {
    return {
      convertedNotifications: [],
      selected: 'all',
      items: [
        { label: 'All', val: 'all' },
        { label: 'In', val: 'in' },
        { label: 'Out', val: 'out' },
        { label: 'Swap', val: 'swap' }
      ],
      page: null,
      inData: [
        {
          label: 'Transaction hash',
          value: '0xabc23787066c571a61274929746895c24fa9dbfc',
          color: 'primary',
          ellipsis: true
        },
        {
          label: 'Gas price',
          value: '41 Gwei'
        },
        {
          label: 'Gas limit',
          value: '400000'
        },
        {
          label: 'Max transaction fee',
          value: '0.0002342 ETH ($0.09)'
        },
        {
          label: 'Nonce',
          value: '2534'
        },
        {
          label: 'Time',
          value: '13:22:22'
        },
        {
          label: 'Status',
          value: 'Succeed',
          color: 'primary'
        },
        {
          label: 'Error message',
          value: 'None'
        }
      ],
      outData: [
        {
          label: 'Transaction hash',
          value: '0xabc23787066c571a61274929746895c24fa9dbfc',
          color: 'primary',
          ellipsis: true
        },
        {
          label: 'Gas price',
          value: '41 Gwei'
        },
        {
          label: 'Gas limit',
          value: '400000'
        },
        {
          label: 'Max transaction fee',
          value: '0.0002342 ETH ($0.09)'
        },
        {
          label: 'Nonce',
          value: '2534'
        },
        {
          label: 'Time',
          value: '13:22:22'
        },
        {
          label: 'Status',
          value: 'Succeed',
          color: 'primary'
        },
        {
          label: 'Error message',
          value: 'None'
        }
      ],
      swapData: [
        {
          label: 'Transaction hash',
          value: '0xabc23787066c571a61274929746895c24fa9dbfc',
          color: 'primary',
          ellipsis: true
        },
        {
          label: 'Gas price',
          value: '41 Gwei'
        },
        {
          label: 'Gas limit',
          value: '400000'
        },
        {
          label: 'Max transaction fee',
          value: '0.0002342 ETH ($0.09)'
        },
        {
          label: 'Nonce',
          value: '2534'
        },
        {
          label: 'Time',
          value: '13:22:22'
        },
        {
          label: 'Status',
          value: 'In progress',
          color: 'orange'
        },
        {
          label: 'Error message',
          value: 'None'
        }
      ],
      transfers: {},
      recentTransfersEthVM: []
    };
  },
  computed: {
    ...mapState('wallet', ['notifications', 'address'])
  },
  mounted() {
    console.log(this.notifications); // todo remove dev item
    this.transfers = new Transfers(this.$apollo);
    this.transfers.getEthTransfers(this.address).then(res => {
      this.recentTransfersEthVM = res.transfers;
      this.convert();
      console.log(res); // todo remove dev item
    });
  },
  methods: {
    convert() {
      /*
      * amount: "100000000000000"
blockNumber: "9748862"
error: false
errorMessage: ""
gasLimit: "21000"
gasPrice: "3000000000"
gasUsed: "21000"
hash: "0xc607158b323f0bf12909b1db1dfa7bc6c48c3cf822729a4de74dd40dc407267d"
nonce: "2"
to: "0x8d57beb45207389b6041d33d1871c54b138c8f34"
tokenSymbol: ""
tokenTransferTo: ""
tokenTransferVal: ""
* */
      const notificationArray = this.notifications[this.address].map(item => {
        let direction = 'out';
        const details = this.recentTransfersEthVM.find(thing => {
          return thing.transfer.transactionHash === item.body.hash;
        });
        console.log('details', details); // todo remove dev item
        if (details) {
          if (details.transfer.from !== this.address) {
            direction = 'in';

            return [
              {
                label: 'ethVM'
              },
              {
                label: 'TimeStamp',
                type: item.timestamp
              },
              {
                label: 'Type',
                type: item.type
              },
              {
                label: 'Direction',
                type: 'in'
              },
              {
                label: 'Transaction hash',
                value: item.body.hash,
                color: 'primary',
                ellipsis: true
              },
              {
                label: 'Gas price',
                value: utils.fromWei(item.body.gasPrice, 'gwei')
              },
              {
                label: 'Gas limit',
                value: item.body.gasLimit
              },
              {
                label: 'Max transaction fee',
                value: '0.0002342 ETH ($0.09)'
              },
              {
                label: 'Nonce',
                value: item.body.nonce
              },
              {
                label: 'Time',
                value: '13:22:22'
              },
              {
                label: 'Status',
                value: 'In progress',
                color: 'orange'
              },
              {
                label: 'Error message',
                value: 'None'
              }
            ];
          } else if (item.type === 'swap') {
            return [
              {
                label: 'TimeStamp',
                type: item.timestamp
              },
              {
                label: 'Type',
                type: item.type
              },
              {
                label: 'Direction',
                type: 'out'
              },
              {
                label: 'Transaction hash',
                value: item.body.hash,
                color: 'primary',
                ellipsis: true
              },
              {
                label: 'Gas price',
                value: utils.fromWei(item.body.gasPrice, 'gwei')
              },
              {
                label: 'Gas limit',
                value: item.body.gasLimit
              },
              {
                label: 'Max transaction fee',
                value: '0.0002342 ETH ($0.09)'
              },
              {
                label: 'Nonce',
                value: item.body.nonce
              },
              {
                label: 'Time',
                value: '13:22:22'
              },
              {
                label: 'Status',
                value: 'In progress',
                color: 'orange'
              },
              {
                label: 'Error message',
                value: 'None'
              }
            ];
          }
          return [
            {
              label: 'TimeStamp',
              type: item.timestamp
            },
            {
              label: 'Type',
              type: item.type
            },
            {
              label: 'Direction',
              type: 'out'
            },
            {
              label: 'Transaction hash',
              value: item.body.hash,
              color: 'primary',
              ellipsis: true
            },
            {
              label: 'Gas price',
              value: utils.fromWei(item.body.gasPrice, 'gwei')
            },
            {
              label: 'Gas limit',
              value: item.body.gasLimit
            },
            {
              label: 'Max transaction fee',
              value: '0.0002342 ETH ($0.09)'
            },
            {
              label: 'Nonce',
              value: item.body.nonce
            },
            {
              label: 'Time',
              value: '13:22:22'
            },
            {
              label: 'Status',
              value: 'In progress',
              color: 'orange'
            },
            {
              label: 'Error message',
              value: 'None'
            }
          ];
        }
        return [
          {
            label: 'Type',
            type: item.type
          },
          {
            label: 'Direction',
            type: direction
          },
          {
            label: 'Transaction hash',
            value: item.body.hash,
            color: 'primary',
            ellipsis: true
          },
          {
            label: 'Gas price',
            value: utils.fromWei(item.body.gasPrice, 'gwei')
          },
          {
            label: 'Gas limit',
            value: item.body.gasLimit
          },
          {
            label: 'Max transaction fee',
            value: '0.0002342 ETH ($0.09)'
          },
          {
            label: 'Nonce',
            value: item.body.nonce
          },
          {
            label: 'Time',
            value: '13:22:22'
          },
          {
            label: 'Status',
            value: 'In progress',
            color: 'orange'
          },
          {
            label: 'Error message',
            value: 'None'
          }
        ];
      });
      console.log(notificationArray); // todo remove dev item
    },
    convert2() {
      /*
      * amount: "100000000000000"
blockNumber: "9748862"
error: false
errorMessage: ""
gasLimit: "21000"
gasPrice: "3000000000"
gasUsed: "21000"
hash: "0xc607158b323f0bf12909b1db1dfa7bc6c48c3cf822729a4de74dd40dc407267d"
nonce: "2"
to: "0x8d57beb45207389b6041d33d1871c54b138c8f34"
tokenSymbol: ""
tokenTransferTo: ""
tokenTransferVal: ""
*
* block: (...)
from: (...)
status: (...)
timestamp: (...)
to: (...)
transactionHash: (...)
txFee: (...)
* */
      const notificationArray = this.recentTransfersEthVM.map(item => {
        let direction = 'out';
        const details = this.notifications[this.address].find(thing => {
          return item.transfer.transactionHash === thing.body.hash;
        });
        console.log('details', details); // todo remove dev item
        if (details) {
          return [
            {
              label: 'ethVM'
            },
            {
              label: 'TimeStamp',
              type: item.timestamp
            },
            {
              label: 'Type',
              type: item.type
            },
            {
              label: 'Direction',
              type: 'in'
            },
            {
              label: 'Transaction hash',
              value: item.body.hash,
              color: 'primary',
              ellipsis: true
            },
            {
              label: 'Gas price',
              value: utils.fromWei(item.body.gasPrice, 'gwei')
            },
            {
              label: 'Gas limit',
              value: item.body.gasLimit
            },
            {
              label: 'Max transaction fee',
              value: '0.0002342 ETH ($0.09)'
            },
            {
              label: 'Nonce',
              value: item.body.nonce
            },
            {
              label: 'Time',
              value: '13:22:22'
            },
            {
              label: 'Status',
              value: 'In progress',
              color: 'orange'
            },
            {
              label: 'Error message',
              value: 'None'
            }
          ];
        }
        return [
          {
            label: 'Type',
            type: item.type
          },
          {
            label: 'Direction',
            type: direction
          },
          {
            label: 'Transaction hash',
            value: item.body.hash,
            color: 'primary',
            ellipsis: true
          },
          {
            label: 'Gas price',
            value: utils.fromWei(item.body.gasPrice, 'gwei')
          },
          {
            label: 'Gas limit',
            value: item.body.gasLimit
          },
          {
            label: 'Max transaction fee',
            value: '0.0002342 ETH ($0.09)'
          },
          {
            label: 'Nonce',
            value: item.body.nonce
          },
          {
            label: 'Time',
            value: '13:22:22'
          },
          {
            label: 'Status',
            value: 'In progress',
            color: 'orange'
          },
          {
            label: 'Error message',
            value: 'None'
          }
        ];
      });
      console.log(notificationArray); // todo remove dev item
    }
  }
};
</script>

<style lang="scss" scoped>
.edit {
  width: 37px;
  height: 37px;
  border-radius: 100%;
  background-color: var(--v-primary-base);
  cursor: pointer;
}
</style>
