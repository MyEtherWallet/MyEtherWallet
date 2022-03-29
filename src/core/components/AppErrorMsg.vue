<template>
  <v-dialog
    :value="show"
    max-width="400px"
    class="border-radius--10px"
    @close="close"
    @click:outside="close"
  >
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
          Something went wrong, would you like to inform to #MEWteam about this
          error?
        </div>
        <v-row class="mt-4 mb-2">
          <v-col>
            <mew-button
              :has-full-width="true"
              btn-style="outline"
              btn-size="xlarge"
              title="No"
              @click.native="resolve(false)"
            />
          </v-col>
          <v-col>
            <mew-button
              :has-full-width="true"
              btn-size="xlarge"
              title="Send"
              @click.native="resolve(true)"
            />
          </v-col>
        </v-row>
      </div>

      <v-divider class="mx-6"></v-divider>
      <v-expansion-panels flat>
        <v-expansion-panel>
          <v-expansion-panel-header class="font-weight-bold">
            Error messages
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <textarea
              v-model="errorDetails"
              readonly
              class="error-detail px-8 pb-6"
            ></textarea>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-divider class="mx-6"></v-divider>
    </div>
  </v-dialog>
</template>

<script>
export default {
  props: {
    close: {
      type: Function,
      default: () => {}
    },
    show: {
      type: Boolean,
      default: false
    },
    resolve: {
      type: Function,
      default: () => {}
    },
    error: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    errorDetails() {
      return JSON.stringify(this.error, null, 2);
    }
  }
};
</script>

<style lang="scss" scoped>
.error-detail {
  width: 100%;
  height: 150px;
  border: 0;
  color: black;
  font-size: 12px;
  resize: none;
}
</style>
