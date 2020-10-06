<template>
  <mew-overlay
    left-btn-text=""
    :show-overlay="open"
    right-btn-text="Close"
    @closeOverlay="$emit('close')"
  >
    <template v-slot:mewOverlayBody>
      <v-sheet class="transparent" max-width="700px" width="100%">
        <h2 class="text-center mb-10">Notifications</h2>
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
                />
                <Out
                  address="0xabc23787066c571a61274929746895c24fa9dbfc"
                  amount="0.000234 XMR"
                  time="1 min"
                  :data="outData"
                />
                <Swap
                  address="0xabc23787066c571a61274929746895c24fa9dbfc"
                  from-amount="0.000234 ETH"
                  to-amount="0.000234 XMR"
                  time="1 min"
                  :data="swapData"
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
    </template>
  </mew-overlay>
</template>

<script>
import In from './components/in/In';
import Out from './components/out/Out';
import Swap from './components/swap/Swap';

export default {
  components: { In, Out, Swap },
  props: {
    open: { default: false, type: Boolean }
  },
  data() {
    return {
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
      ]
    };
  }
};
</script>
