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
      <spacer />
      <div>
        <tips />
      </div>
    </div>
  </div>
</template>

<script>
import Spacer from '@/components/Common/Spacer';
import Tips from '@/components/Tips';
import InterfaceWrap from '@/components/InterfaceWraps/InterfaceWrap1';

export default {
  components: {
    spacer: Spacer,
    tips: Tips,
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
