<template>
  <v-dialog v-model="dialog" max-width="400px" class="border-radius--10px">
    <v-img src="@/assets/images/backgrounds/bg-erroe-msg.svg">
      <div class="d-flex align-center justify-center height--full">
        <div class="mew-heading-2 white--text">
          {{ $t('errorsGlobal.something-went-wrong') }}
        </div>
      </div>
    </v-img>

    <div style="background-color: white" class="py-6">
      <div class="px-6">
        <div>
          Something goes wrong, would you want to inform to #MEWteam about this
          error?
        </div>
        <v-row class="mt-4 mb-2">
          <v-col>
            <mew-button
              :has-full-width="true"
              btn-style="outline"
              btn-size="xlarge"
              title="Ok"
            />
          </v-col>
          <v-col>
            <mew-button :has-full-width="true" btn-size="xlarge" title="Send" />
          </v-col>
        </v-row>
      </div>

      <v-divider class="mx-6"></v-divider>
      <v-expansion-panels flat>
        <v-expansion-panel>
          <v-expansion-panel-header class="font-weight-bold">
            Error messages
          </v-expansion-panel-header>
          <v-expansion-panel-content> </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-divider class="mx-6"></v-divider>
    </div>
  </v-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    close: {
      type: Function,
      default: () => {}
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return { dialog: true };
  },
  methods: {}
};
</script>

<style lang="scss" scoped></style>
