<template>
  <div class="mew-component--jobs">
    <!-- 
    ==========================================================================
    Page header
    ==========================================================================
    -->
    <the-layout-header
      :title="$t('careers.header')"
      :subtitle-line-one="$t('careers.subtitle')"
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
        <div class="pa-3 mew-heading-1 text-center">
          {{ $t('careers.join-mew.title') }}
        </div>
        <div class="mx-auto text-center" style="max-width: 600px">
          {{ $t('careers.join-mew.description') }}
        </div>
      </div>

      <!-- 
      ==========================================================================
      What we do and why you should join
      ==========================================================================
      -->
      <!-- Disabling this for now as we don't have a set  -->
      <div class="mb-12">
        <div class="pa-3 mew-heading-1 text-center">
          {{ $t('careers.contact-us.title') }}
        </div>
        <div class="mx-auto text-center" style="max-width: 600px">
          {{ $t('careers.contact-us.email-us') }}
          <a href="mailto:careers@myetherwallet.com" target="_blank">
            {{ $t('careers.contact-us.email') }}
          </a>
          {{ $t('careers.contact-us.email-us-end') }}
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
                <span v-for="(other, indx) in job.other" :key="other + indx">
                  {{ other }}
                  <v-icon v-if="indx !== job.other.length - 1" color="textLight"
                    >mdi-circle-small</v-icon
                  >
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';

import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
export default {
  name: 'TheCareersLayout',
  TheLayoutHeader: () => import('../components-default/TheLayoutHeader'),
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
          'https://raw.githubusercontent.com/MyEtherWallet/dynamic-data/main/careers.json',
          {
            headers: {
              accept: 'application/json, text/plain, */*',
              'Accept-Language': 'en-US,en;q=0.9'
            }
          }
        )
        .then(res => {
          this.loadingCareers = false;
          this.jobs = res.data;
        })
        .catch(e => Toast(e, {}, ERROR));
    }
  }
};
</script>
