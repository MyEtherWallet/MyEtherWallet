<template>
  <mew6-white-sheet>
    <InterfaceWrap title="Sign Message">
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
    </InterfaceWrap>
  </mew6-white-sheet>
</template>

<script>
import InterfaceWrap from '@/web/components/InterfaceWraps/InterfaceWrap1';

export default {
  components: { InterfaceWrap },
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
