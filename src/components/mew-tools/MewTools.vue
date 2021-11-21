<template>
  <div class="mew-component--mew-tools">
    <v-menu offset-y close-on-click bottom left>
      <!--
      =============================================================
      MEW tools menu
      =============================================================
      -->
      <div
        class="pa-6 white mew-tools-menu"
        :class="[
          $vuetify.breakpoint.md ? 'md' : '',
          $vuetify.breakpoint.sm ? 'sm' : '',
          $vuetify.breakpoint.xs ? 'xs' : ''
        ]"
      >
        <v-row>
          <v-col
            v-for="(t, key) in tools"
            :key="key"
            cols="6"
            sm="4"
            class="text-center"
          >
            <!-- Button with url link -->
            <a v-if="t.link" :href="t.link" target="_blank">
              <div class="tools-btn">
                <img :src="t.img" :alt="t.label" height="50" />
                <h6 class="mt-1 btn-lable basic--text">{{ t.label }}</h6>
              </div>
            </a>
          </v-col>
        </v-row>
      </div>
    </v-menu>
  </div>
</template>

<style lang="scss" scoped>
.mew-component--mew-tools {
  display: inline-block;
}
.mew-tools-menu {
  width: 300px;
  position: relative;

  &.md,
  &.sm {
    &:after {
      right: 10px;
    }
  }

  &.xs {
    width: 190px;
    &:after {
      right: 10px;
    }
  }

  .tools-btn:hover {
    * {
      font-weight: 600;
    }
  }
}

.btn-remove-style {
  margin: 0 !important;
  padding: 0 !important;
  border: 0;
  &::before {
    opacity: 0 !important;
  }
}
</style>

<style lang="scss">
.mew-component--mew-tools {
  .mew-button {
    font-weight: 400 !important;
    height: initial !important;
    > span {
      padding: 16px 10px !important;
    }
    img {
      height: 16px !important;
      margin-right: 6px !important;
    }
  }
}
</style>
