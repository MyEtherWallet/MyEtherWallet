<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="6">
          <CustomerSupport />
        </v-col>
        <v-col cols="6">
          <Community />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import CustomerSupport from './components/CustomerSupport';
import Community from './components/Community';

export default {
  components: { CustomerSupport, Community },
  data: () => ({
    descriptionText:
      'Et voluptua takimata sit clita amet, takimata dolor stet sit accusam tempor at est labore, lorem nonumy lorem vero sadipscing aliquyam invidunt amet, amet lorem sea dolor voluptua diam. Dolor labore ipsum gubergren ea, et sea tempor tempor et est et stet no. Ea accusam ipsum et amet invidunt ea, erat at dolor at no invidunt accusam sadipscing stet. Et amet elitr sea et ipsum ea sea sea. Et sea et et lorem et ut est, et vero no diam sit, et elitr gubergren ea erat, ut amet et no vero et nonumy dolor ipsum magna. Voluptua est duo ipsum rebum, takimata elitr est sadipscing voluptua, sea labore et duo lorem rebum, consetetur sed sadipscing et dolore duo dolor. Amet.'
  })
};
</script>
