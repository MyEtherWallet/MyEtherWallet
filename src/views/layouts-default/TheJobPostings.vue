<template>
  <div class="mew-component--jobs">
    <!-- 
    ==========================================================================
    Page header
    ==========================================================================
    -->
    <the-layout-header
      title="Join Us"
      subtitle-line-one="We're on a mission to make crypto more accessable for normal users. Join us and make crypto better here in MEW!"
    />

    <v-container class="my-15">
      <!-- 
      ==========================================================================
      Collage image
      ==========================================================================
      -->
      <img
        style="width: 100%"
        src="@/assets/images/team/mew-collage.jpg"
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
          what we do and why you should join us
        </div>
        <div class="mx-auto text-center" style="max-width: 600px">
          At MEW, we believe that collective success is an integral part of the
          wellbeing of all in the workplace. Whatever the environment in which
          our employees work, we strive to offer them stimulating working
          conditions so they can give the best of themselves: safe and pleasant
          spaces, motivating remuneration, social protection, respect for
          work/life balance.
        </div>
      </div>

      <!-- 
      ==========================================================================
      What we do and why you should join
      ==========================================================================
      -->
      <div class="mb-12">
        <div class="pa-3 mew-heading-1 text-center">Contact us</div>
        <div class="mx-auto text-center" style="max-width: 600px">
          Email us at
          <a href="mailto:support@myetherwallet.com" target="_blank">
            support@myetherwallet.com
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
        <div v-for="(dep, depKey) in jobsData" :key="depKey" class="mt-15">
          <div class="pa-3 mew-heading-2">{{ dep.department }}</div>
          <v-divider class="mb-4" />

          <div
            v-for="(job, jobKey) in dep.jobs"
            :key="jobKey"
            class="job-button cursor--pointer pa-3"
            @click="openDetailsDialog(job, dep.department)"
          >
            <div class="mew-heading-3 orangePrimary--text">
              {{ job.jobTitle }}
            </div>
            <div class="textLight--text">
              {{ dep.department }}
              <v-icon color="textLight">mdi-circle-small</v-icon>
              {{ job.location }}
              <v-icon color="textLight">mdi-circle-small</v-icon>
              {{ job.type }}
            </div>
          </div>
        </div>
      </div>
    </v-container>

    <!-- 
    ==========================================================================
    Clicked job detail info dialog
    ==========================================================================
    -->
    <v-dialog
      v-model="dialog"
      width="900"
      content-class="mew-component--jobs--job-detail-dialog"
    >
      <div
        v-if="jobInfo"
        class="backgroundGrey pa-4 pa-md-10 position--relative"
      >
        <!-- 
        ==========================================================================
        Top close button
        !!! mew-icon-button doesn't work now.
        !!! This will be replaced with mew-icon-button later.
        ==========================================================================
        <mew-icon-button rounded mdi-icon="mdi-close" />
        -->
        <v-btn class="close-btn" icon @click="dialog = !dialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <!-- 
        ==========================================================================
        Dialog title
        ==========================================================================
        -->
        <img
          src="@/assets/images/icons/icon-mew-dark.svg"
          height="40"
          alt="mew logo"
        />
        <div class="mew-heading-1 mb-10">{{ jobInfo.jobTitle }}</div>

        <v-row>
          <!-- 
          ==========================================================================
          Left side col
          ==========================================================================
          -->
          <v-col cols="12" md="3">
            <div>
              <div class="mew-label mb-1 textLight--text">Location</div>
              <div>{{ jobInfo.location }}</div>
            </div>
            <v-divider class="my-3" />

            <div>
              <div class="mew-label mb-1 textLight--text">Type</div>
              <div>{{ jobInfo.type }}</div>
            </div>
            <v-divider class="my-3" />

            <div>
              <div class="mew-label mb-1 textLight--text">Department</div>
              <div>{{ jobInfo.department }}</div>
            </div>
            <v-divider class="my-3" />
          </v-col>

          <!-- 
          ==========================================================================
          Right side col
          ==========================================================================
          -->
          <v-col cols="12" md="9">
            <!-- 
            ==========================================================================
            Right side col top tabs
            ==========================================================================
            -->
            <v-tabs v-model="tab" background-color="transparent">
              <v-tabs-slider color="textLight"></v-tabs-slider>
              <v-tab v-for="item in tabItems" :key="item">
                {{ item }}
              </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab" class="transparent">
              <!-- 
              ==========================================================================
              (Tab1) Overview tab
              ==========================================================================
              -->
              <v-tab-item key="Overview" class="pt-8">
                <div
                  v-for="(details, detailsKey) in jobInfo.jobDetails"
                  :key="detailsKey"
                  class="mb-9"
                >
                  <!-- 
                  ==========================================================================
                  Job details subtitle
                  ==========================================================================
                  -->
                  <div class="mew-heading-2 mb-3 textLight--text">
                    {{ details.subtitle }}
                  </div>

                  <!-- 
                  ==========================================================================
                  Show job details in text
                  ==========================================================================
                  -->
                  <div v-if="typeof details.data === 'string'">
                    {{ details.data }}
                  </div>

                  <!-- 
                  ==========================================================================
                  Show job details in array
                  ==========================================================================
                  -->
                  <div v-else>
                    <ul>
                      <li
                        v-for="(d, dKey) in details.data"
                        :key="dKey"
                        class="mb-1"
                      >
                        - {{ d }}
                      </li>
                    </ul>
                  </div>
                </div>
              </v-tab-item>

              <!-- 
              ==========================================================================
              (Tab2) Application tab
              ==========================================================================
              -->
              <v-tab-item key="Application" class="pt-8">
                <div>
                  <div class="mew-heading-3 mb-3">Name*</div>
                  <mew-input v-model="form.name" />
                </div>

                <div>
                  <div class="mew-heading-3 mb-3">Email*</div>
                  <mew-input v-model="form.email" />
                </div>

                <div>
                  <div class="mew-heading-3">Where are you located?*</div>
                  <div class="mb-3 textLight--text">
                    Please note that we currently only hire in Los Angeles,
                    California area.
                  </div>
                  <mew-input v-model="form.location" />
                </div>

                <div>
                  <div class="mew-heading-3 mb-3">Your Linkedin profile</div>
                  <mew-input v-model="form.linkedIn" />
                </div>

                <div class="mb-5">
                  <div class="mew-heading-3 mb-3">Resume</div>
                  <v-file-input
                    v-model="form.resume"
                    accept="image/jpeg, .pdf"
                    label="JPEG, PDF (> 5MB)"
                    @change="imgPreview($event, 'resumePreviewImg')"
                  ></v-file-input>
                  <img
                    v-if="resumePreviewImg"
                    class="preview"
                    :src="resumePreviewImg"
                    alt="resume"
                  />
                </div>

                <div>
                  <div class="mew-heading-3 mb-3">
                    Please introduce yourself briefly*
                  </div>
                  <v-textarea v-model="form.aboutMyself" outlined />
                </div>

                <div>
                  <div class="mew-heading-3 mb-3">
                    Why do you want to work at MEW?*
                  </div>
                  <v-textarea v-model="form.whyWantToWorkAtMew" outlined />
                </div>

                <mew-button
                  title="Submit your resume"
                  btn-size="xlarge"
                  class="d-block mx-auto mt-10"
                  @click.native="submitForm"
                ></mew-button>
              </v-tab-item>
            </v-tabs-items>
          </v-col>
        </v-row>
      </div>
    </v-dialog>
    <mew-toast
      v-model="successToast"
      text="Thank you. We are currently reviewing your documents and shall get in touch with you shortly."
      toast-type="success"
      can-close
    ></mew-toast>

    <mew-toast
      v-model="failedToast"
      text="There was an error while sending your application. Please contact us at support@myetherwallet.com"
      toast-type="error"
      can-close
    ></mew-toast>
  </div>
</template>

<script>
import TheLayoutHeader from '../components-default/TheLayoutHeader';
import axios from 'axios';
import jobs from '@/jobs/jobs';

export default {
  name: 'TheJobPostings',
  components: { TheLayoutHeader },
  data() {
    return {
      successToast: false,
      failedToast: false,
      jobsData: jobs,
      jobInfo: null,
      dialog: false,
      tab: null,
      tabItems: ['Overview', 'Application'],
      resumePreviewImg: '',
      form: {
        name: '',
        email: '',
        location: '',
        linkedIn: '',
        resume: null,
        aboutMyself: '',
        whyWantToWorkAtMew: ''
      },
      areAllRequiredFormsValid: true
    };
  },
  methods: {
    /*
    openDetailsDialog(job, department) {
      this.jobInfo = job;
      this.jobInfo.department = department;

      this.dialog = true;
    },
    */
    openDetailsDialog(job) {
      if (job.indeedLink) {
        window.location = job.indeedLink;
      }
    },
    imgPreview(e, targetVar) {
      if (e) {
        this[targetVar] = URL.createObjectURL(e);
      } else {
        this[targetVar] = '';
      }
    },
    submitForm() {
      const formData = new FormData();

      for (const key in this.form) {
        formData.append(key, this.form[key]);
      }

      if (this.areAllRequiredFormsValid) {
        axios({
          method: 'post',
          url: 'https://formspree.io/f/xnqwanzk',
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' }
        })
          .then(() => {
            this.successToast = !this.successToast;
          })
          .catch(() => {
            this.failedToast = !this.failedToast;
          });
      }
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
