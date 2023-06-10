<template>
  <div class="ad-form-component">
    <img
      src="@/assets/images/backgrounds/wave.png"
      width="100%"
      class="ad-img"
    />
    <div class="ad-form-container pb-15">
      <div class="text-center">
        <img
          src="@/assets/images/backgrounds/mew-spaceman.png"
          alt="mew spaceman"
          class="d-inline d-md-none ad-form-img"
        />
      </div>
      <div class="text-center mew-title font-weight-regular expandHeader--text">
        Are you ready to <br />
        advertise with us?
      </div>
      <div class="expandHeader--text d-flex justify-center mb-5">
        Send us a message and our team will contact you to <br />
        discuss options and answer any questions you have.
      </div>
      <div class="d-flex align-center justify-center ad-form-holder">
        <img
          src="@/assets/images/backgrounds/mew-spaceman.png"
          alt="mew spaceman"
          class="d-none d-md-inline"
        />
        <form class="ad-form">
          <input placeholder="NAME" class="mb-5" required />
          <input placeholder="COMPANY NAME" class="mb-5" required />
          <input placeholder="COMPANY WEBSITE" class="mb-5" />
          <input placeholder="CONTACT NUMBER" class="mb-5" required />
          <input placeholder="EMAIL" class="mb-5" required />
          <textarea placeholder="MESSAGE" class="mb-5" />
          <div class="d-flex align-center justify-center">
            <mew-button
              btn-style="background"
              color-theme="primary"
              btn-size="xlarge"
              title="SUBMIT"
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ad-form-container {
  background-color: #b9e5df;

  .ad-form-img {
    width: 100%;
    max-width: 250px;
  }
}
.ad-img {
  position: relative;
  bottom: -6px;
}

.ad-form-holder {
  position: relative;

  img {
    width: 350px;
    position: absolute;
    top: -8vw;
    right: 12vw;

    @media screen and (max-width: 960px) {
      top: -8vw;
      right: 0;
    }
  }

  .ad-form {
    max-width: 500px;
    width: 100%;

    input,
    textarea {
      width: 100%;
      background: #fcfcfb;
      border-radius: 4px;
      border: 0.347165px solid #b6b6b6;
      padding: 14px;
    }

    textarea {
      min-height: 80px;
    }
  }
}
</style>
