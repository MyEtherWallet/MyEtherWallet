<template>
  <mew6-white-sheet>
    <InterfaceWrap title="Deploy contract">
      <mew-input label="Byte code" placeholder=" " />

      <v-textarea
        no-resize
        outlined
        name="input-7-4"
        label="ABI/JSON Interface"
        value=""
        placeholder=" "
      ></v-textarea>

      <mew-input label="Contract name" placeholder=" " />

      <div class="text-center mt-3">
        <mew-button
          title="Sign Transaction"
          :has-full-width="false"
          button-size="xlarge"
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
  }
};
</script>
