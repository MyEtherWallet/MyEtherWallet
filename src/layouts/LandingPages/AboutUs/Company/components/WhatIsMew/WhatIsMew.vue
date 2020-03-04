<template>
  <div>
    <v-container>
      <v-row align="center">
        <v-col cols="5">
          <BlockTitle :data="titleData" class="pr-8" />
        </v-col>
        <v-col cols="7">
          <v-img
            src="@/assets/images/Etc/AboutUs/spaceman.png"
            max-width="100%"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import BlockTitle from '../../../../components/BlockTitle';

export default {
  components: { BlockTitle },
  data: () => ({
    titleData: {
      textProps: '',
      toptitle: '',
      title: 'What is MEW?',
      description:
        'Still though still lost followed and by angels december in flown. Ungainly angels so what the, so much the morrow opened my heart or, gloating with on nevermore wondering moment chamber weary, till we liftednevermore usby feather eagerly before stillness, spoken borrow my opened before ah upon bust chamber. Rapping or parting angels lattice still ah, i still till a discourse nevermore spoken soul. I for my the on you, of my my angels more lamplight me lenore the, there all in implore above blessed the sitting raven my. This angels gileadtell straight with distinctly meant the discourse, mystery whose.',
      centered: false
    }
  })
};
</script>
