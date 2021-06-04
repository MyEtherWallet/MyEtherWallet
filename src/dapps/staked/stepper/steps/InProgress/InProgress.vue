<template>
  <div>
    <v-row class="mx-0 bottom-pad">
      <v-col class="pr-0" cols="12">
        <h3>{{ $t('dappsStaked.hang-on') }}</h3>
        <i18n tag="p" class="subtitle" path="dappsStaked.please-do-not-close">
          <p slot="creating-validators">
            {{ $t('dappsStaked.creating-validators') }}
          </p>
        </i18n>
      </v-col>
    </v-row>
    <v-row class="mx-0 bottom-pad">
      <v-col class="pr-0" cols="12">
        <v-progress-linear
          color="teal"
          buffer-value="0"
          :value="current"
          stream
        ></v-progress-linear>
        <!--        <mew-progress-bar
          :balance-obj="details.currentValidatorsStaked"
          :animated="details.currentValidatorsStaked !== total"
        />-->
      </v-col>
    </v-row>
    <v-row class="mx-0 bottom-pad">
      <v-col class="pr-0" cols="12">
        <p class="validator-progress">
          <strong
            >{{
              details.currentValidatorsStaked
                ? details.currentValidatorsStaked
                : '0'
            }}
            / {{ total }}</strong
          >
          {{
            $tc(
              'dappsStaked.completed-validators',
              details.currentValidatorsStaked > 1 ? 2 : 1
            )
          }}
        </p>
      </v-col>
    </v-row>
    <v-row class="mx-0">
      <v-col class="pl-4" cols="8">
        <mew-button
          :loading="false"
          :disabled="buttonDisable"
          :has-full-width="true"
          btn-size="xlarge"
          :title="$t('dappsStaked.stake-on-eth2')"
          @click.native="doNext"
        />
      </v-col>
    </v-row>
    {{ details }}
    <!--      <b-progress
        v-if="details.currentValidatorsStaked"
        :max="total"
        class="w-100"
        height="2rem"
        :variant="
          details.currentValidatorsStaked === total ? 'success' : 'primary'
        "
      >-->

    <!--      </b-progress>-->
    <!--      <b-progress
        v-if="!details.currentValidatorsStaked"
        :max="100"
        class="w-100"
        height="2rem"
        variant="secondary"
      >
        <b-progress-bar :value="100" animated>
          <span>Loading</span>
        </b-progress-bar>
      </b-progress>-->
  </div>
</template>

<script>
export default {
  props: {
    details: {
      type: Object,
      default: () => {}
    },
    next: {
      type: Function,
      default: function () {}
    }
  },
  data() {
    return {
      buttonDisable: true
    };
  },
  computed: {
    total() {
      return this.details.amount / 32;
    },
    current() {
      const val = parseInt(
        this.details.currentValidatorsStaked?.toString() / this.total.toString()
      );
      if (val) return val * 100;
      return 0;
    }
  },
  watch: {
    details: {
      handler: function (newVal) {
        if (newVal && newVal.currentValidatorsStaked === this.total) {
          this.$emit('completed', true, { key: 'stake', value: true });
          this.buttonDisable = false;
          // this.$emit('validatorsstaked')
          this.next();
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    doNext() {
      console.log('do next'); // todo remove dev item
      this.next();
    }
  }
};
</script>

<style lang="scss" scoped>
//@import 'InProgress.scss';
</style>
