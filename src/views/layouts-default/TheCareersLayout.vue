<template>
  <div class="mew-component--jobs">
    <!-- 
    ==========================================================================
    Page header
    ==========================================================================
    -->
    <the-layout-header
      title="Join Us"
      subtitle-line-one="At MEW we're on a mission to make crypto and the blockchain more accessible for everyone. Join us in creating the technology and systems of the future. "
    />

    <v-container class="my-15">
      <!-- 
      ==========================================================================
      Collage image
      ==========================================================================
      -->
      <img
        style="width: 100%"
        src="@/assets/images/team/mew-collage-small.jpg"
        alt="Members"
        class="mb-8 mt-0 mt-md-10"
      />

      <!-- 
      ==========================================================================
      What we do and why you should join
      ==========================================================================
      -->
      <div class="mb-15">
        <div class="pa-3 mew-heading-1 text-center">Why Join MEW?</div>
        <div class="mx-auto text-center" style="max-width: 600px">
          We believe that a rising tide lifts all spaceships. We are excited to
          collaborate with every team member on our mission of bringing
          cryptocurrency and blockchain technologies to everyone. We strive to
          offer all our employees a fantastic work experience. At MEW, we truly
          respect the work/life balance. With a strong emphasis on a great
          company culture fit, we have fun with our teams. We would love to see
          if you would be a good fit. Check out our open positions below.
        </div>
      </div>

      <!-- 
      ==========================================================================
      What we do and why you should join
      ==========================================================================
      -->
      <!-- Disabling this for now as we don't have a set  -->
      <div class="mb-12">
        <div class="pa-3 mew-heading-1 text-center">Contact us</div>
        <div class="mx-auto text-center" style="max-width: 600px">
          Email us at
          <a href="mailto:careers@myetherwallet.com" target="_blank">
            careers@myetherwallet.com
          </a>
          if you have any questions about available positions or use resume
          submit form to send us your resume.
        </div>
      </div>

      <!-- 
      ==========================================================================
      Clickable job lists
      ==========================================================================
      -->
      <div style="max-width: 600px" class="mx-auto pt-1">
        <div v-for="(value, name) in jobs" :key="name" class="mt-15">
          <div v-if="value.length > 0">
            <div class="pa-3 mew-heading-2">{{ name }}</div>
            <v-divider class="mb-4" />
            <a
              v-for="(job, idx) in value"
              :key="job.title + idx"
              :href="job.link"
              target="_blank"
              class="pa-3"
            >
              <div class="mew-heading-3 orangePrimary--text">
                {{ job.title }}
              </div>
              <div class="textLight--text">
                {{ job.other[0] }}
                <v-icon color="textLight">mdi-circle-small</v-icon>
                {{ job.other[1] }}
              </div>
            </a>
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import TheLayoutHeader from '../components-default/TheLayoutHeader';
import axios from 'axios';

export default {
  name: 'TheCareersLayout',
  components: { TheLayoutHeader },
  data() {
    return {
      loadingCareers: true,
      jobs: {}
    };
  },
  created() {
    this.fetchJobs();
  },
  methods: {
    fetchJobs() {
      axios
        .get(
          'https://raw.githubusercontent.com/MyEtherWallet/dynamic-data/main/careers.json'
        )
        .then(res => {
          this.loadingCareers = false;
          this.jobs = res.data;
        });
    }
  }
};
</script>

<style lang="scss">
.job-button {
  &:hover {
    background-color: var(--v-backgroundGrey-base);
  }
}
</style>

<style lang="scss">
.mew-component--jobs--job-detail-dialog {
  margin: 0 !important;

  .close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
  }
}
</style>
