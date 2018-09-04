<template>
  <div class="convert-units">
    <div class="wrap">

      <div class="page-container">
        <div class="page-title">
          <h2>Debugs</h2>
          <p>
            MyEtherWallet is comprised of talented, inspiring, and hardworking
            indivisuals from around the world. We share the passion to code.
          </p>
        </div>

        <div class="accordion-container" role="tablist">
          <b-card no-body class="accordion-block">
            <b-card-header header-tag="header" class="" role="tab">
              <b-btn block href="#" v-b-toggle.accordion1 variant="info">
                <div class="arrow">
                  <i class="fa fa-angle-up up" aria-hidden="true"></i>
                </div>

                <p class="accordion-title">ENS Debugger & Data Grabber</p>
                <p class="header-description">
                  This is meant to be a helpful tool for debugging and checking and generating
                  manual reveals when necessary. Use at your own risk. There is no validation on these fields.
                </p>
              </b-btn>
            </b-card-header>
            <b-collapse id="accordion1" visible accordion="my-accordion" role="tabpanel">
              <b-card-body>

                <div class="form-grid form-grid-1fr">
                  <h4>Address You Bid From</h4>
                  <div class="mew-custom-form__text">
                    <input type="" name="">
                  </div>
                </div>

                <div class="form-grid form-grid-1fr">
                  <h4>ENS Name You Bid On (No ".eth" at The End!)</h4>
                  <div class="mew-custom-form__text">
                    <input type="" name="">
                  </div>
                </div>

                <div class="form-grid form-grid-1fr">
                  <h4>Hashed ENS Name (Label Hash)</h4>
                  <div class="mew-custom-form__text">
                    <input type="" name="">
                  </div>
                </div>

                <div class="form-grid form-grid-2fr">
                  <div>
                    <h4>Amount Your ETH Bid</h4>
                    <div class="mew-custom-form__text">
                      <input type="" name="">
                    </div>
                  </div>
                  <div>
                    <h4>Amount Your Wei Bid</h4>
                    <div class="mew-custom-form__text">
                      <input type="" name="">
                    </div>
                  </div>
                </div>

                <div class="form-grid form-grid-2fr">
                  <div>
                    <h4>Your Secret</h4>
                    <div class="mew-custom-form__text">
                      <input type="" name="">
                    </div>
                  </div>
                  <div>
                    <h4>Your Secret (Hashed)</h4>
                    <div class="mew-custom-form__text">
                      <input type="" name="">
                    </div>
                  </div>
                </div>

                <div class="form-grid form-grid-1fr">
                  <h4>Hashed ENS Name (Label Hash)</h4>
                  <div class="mew-custom-form__text">
                    <input type="" name="">
                  </div>
                </div>

              </b-card-body>
            </b-collapse>
          </b-card>
          <b-card no-body class="accordion-block">
            <b-card-header header-tag="header" class="" role="tab">
              <b-btn block href="#" v-b-toggle.accordion2 variant="info">
                <div class="arrow">
                  <i class="fa fa-angle-up up" aria-hidden="true"></i>
                </div>

                <p class="accordion-title">Convert Decimal to Hexadecimal & Hex to Decimal</p>
                <p class="header-description">
                  This is meant to be a helpful tool for debugging and checking and generating
                  manual reveals when necessary. Use at your own risk. There is no validation on these fields.
                </p>
              </b-btn>
            </b-card-header>
            <b-collapse id="accordion2" accordion="my-accordion" role="tabpanel">
              <b-card-body>
                <p class="card-text">
                  {{ text }}
                </p>
              </b-card-body>
            </b-collapse>
          </b-card>
          <b-card no-body class="accordion-block">
            <b-card-header header-tag="header" class="" role="tab">
              <b-btn block href="#" v-b-toggle.accordion3 variant="info">
                <div class="arrow">
                  <i class="fa fa-angle-up up" aria-hidden="true"></i>
                </div>

                <p class="accordion-title">ENS Debugger & Data Grabber</p>
                <p class="header-description">
                  This is meant to be a helpful tool for debugging and checking and generating
                  manual reveals when necessary. Use at your own risk. There is no validation on these fields.
                </p>
              </b-btn>
            </b-card-header>
            <b-collapse id="accordion3" accordion="my-accordion" role="tabpanel">
              <b-card-body>
                <p class="card-text">
                  {{ text }}
                </p>
              </b-card-body>
            </b-collapse>
          </b-card>
          <b-card no-body class="accordion-block">
            <b-card-header header-tag="header" class="" role="tab">
              <b-btn block href="#" v-b-toggle.accordion4 variant="info">
                <div class="arrow">
                  <i class="fa fa-angle-up up" aria-hidden="true"></i>
                </div>

                <p class="accordion-title">"SHA3" (Keccak-256) It!</p>
                <p class="header-description">
                  This is meant to be a helpful tool for debugging and checking and generating
                  manual reveals when necessary. Use at your own risk. There is no validation on these fields.
                </p>
              </b-btn>
            </b-card-header>
            <b-collapse id="accordion4" accordion="my-accordion" role="tabpanel">
              <b-card-body>
                <p class="card-text">
                  {{ text }}
                </p>
              </b-card-body>
            </b-collapse>
          </b-card>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
export default {
  components: {

  },
  data () {
    return {

      text: `
        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
        richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor
        brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon
        tempor, sunt aliqua put a bird on it squid single-origin coffee nulla
        assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore
        wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher
        vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic
        synth nesciunt you probably haven't heard of them accusamus labore VHS.
      `
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "DebugsLayout.scss";
</style>
