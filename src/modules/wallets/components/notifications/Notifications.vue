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
            <div>
              <h5 class="text-center font-weight-bold">1/8/2020</h5>
              <v-expansion-panels hover flat>
                <In />
                <Out />
                <Swap />
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
    return {};
  }
};
</script>
