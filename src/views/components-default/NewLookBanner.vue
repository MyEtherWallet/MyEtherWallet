<template>
  <div class="new-look-banner d-flex align-center">
    <div class="container">
      <div class="row no-gutters">
        <div class="col-12">
          <p>
            MEW got a new look! It's the same secure wallet. More info:
            <a href="https://x.com/myetherwallet" target="_blank"
              >@MyEtherWallet</a
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import '@/assets/styles/headerStyles/theme.less';

.new-look-banner {
  height: 52px;
  background: linear-gradient(90deg, #0c5876 0%, #1896a4 100%), #0c5876;
  position: absolute;
  width: 100%;
  left: 0;
  z-index: 3;

  .container {
    .screen-mobile({
      padding-top: 0 !important;
    });
  }
  .col-12 {
    .screen-mobile({
      padding-top: 0 !important;
    });
  }

  p {
    .text7 !important;
    font-size: 20px !important;
    color: @white !important;
    margin: 11px 0;
    text-align: center;
    margin: 0 !important;
    font-family: @font !important;
    font-weight: 400 !important;

    .screen-tablet-min({
            margin: 2px 0;
            font-size: 16px !important;
        });

    a {
      color: @white;
      text-decoration: underline;

      &:hover {
        text-decoration: none;
      }
    }
  }
}
</style>
