<template>
  <div class="development-resources">
    <div class="wrap">
      <div class="page-container">
        <div class="title-block">Development Resources</div>
        <div class="contents-container">
          <div class="element">
            <div class="element__browser">
              <div class="mew-custom-form__radio-button">
                <div>
                  <input
                    id="huey"
                    type="radio"
                    name="drone"
                    value="huey"
                    checked
                  />
                  <label for="huey">Huey</label>
                </div>
                <div>
                  <input id="dewey" type="radio" name="drone" value="dewey" />
                  <label for="dewey">Dewey</label>
                </div>
                <div>
                  <input id="louie" type="radio" name="drone" value="louie" />
                  <label for="louie">Louie</label>
                </div>
              </div>
            </div>

            <div class="html">
              <textarea>
                <div>
                <input type="radio" id="huey" name="drone" value="huey" checked />
                <label for="huey">Huey</label>
                </div>
                <div>
                <input type="radio" id="dewey" name="drone" value="dewey" />
                <label for="dewey">Dewey</label>
                </div>
                <div>
                <input type="radio" id="louie" name="drone" value="louie" />
                <label for="louie">Louie</label>
                </div>
              </textarea>
            </div>

            <div class="css"><textarea /></div>
          </div>
        </div>
      </div>
      <!-- .page-container -->
    </div>
    <!-- .wrap -->
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import 'DevelopmentResources.scss';
</style>
