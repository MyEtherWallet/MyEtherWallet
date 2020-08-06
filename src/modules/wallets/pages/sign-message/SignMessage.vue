<template>
  <div>
    <div class="d-flex">
      <div class="flex-grow-1">
        <mew6-white-sheet>
          <interface-wrap title="Sign Message">
            <v-textarea
              outlined
              no-resize
              name="message"
              label="Message"
              value="This is a message I wish to send to someone who can validate that I own the signing address."
            ></v-textarea>

            <div class="text-center mt-3">
              <mew-button
                title="Sign"
                :has-full-width="false"
                button-size="xlarge"
                @click.native="openOverlay('SignMessageConfirmation')"
              />
            </div>
            <div class="text-center mt-2">
              <mew-button
                title="Clear all"
                :has-full-width="false"
                button-size="xlarge"
                btn-style="transparent"
              />
            </div>
          </interface-wrap>
        </mew6-white-sheet>
      </div>
      <div class="pa-4"></div>
      <div>
        <tips />
      </div>
    </div>
  </div>
</template>

<script>
import tips from '@/modules/wallets/components/tips';
import InterfaceWrap from '@/components/interface-wrap/InterfaceWrap';

export default {
  components: {
    tips,
    'interface-wrap': InterfaceWrap
  },
  data() {
    return {};
  },
  methods: {
    openOverlay(name) {
      this.$store.commit('openOverlay', name);
    }
  }
};
</script>
