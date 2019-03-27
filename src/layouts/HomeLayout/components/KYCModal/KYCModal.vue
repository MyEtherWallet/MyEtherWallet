<template>
  <div>
    <b-modal
      ref="kycModal"
      hide-footer
      class="bootstrap-modal"
      centered
      title="MEW KYC Agreement"
      @hidden="hidden"
    >
      <div class="kyc-container">
        <div v-show="set === 0">
          <h4>
            Due to changes in the regulatory environment, MEW must comply with
            KYC/AML requirements.
          </h4>
          <p>
            In order to be KYC verified, pelase answer the following questions
          </p>
          <div class="kyc-string-input">
            <label for="question1"> What is your name? </label>
            <input v-validate="'required'" name="question1" type="text" />
          </div>
          <div class="kyc-string-input">
            <label for="question2"> List any other names you have used: </label>
            <input
              v-validate="'required'"
              name="question2"
              type="text"
              placeholder="Please separate each name by comma"
            />
          </div>
          <div class="kyc-string-input">
            <label for="question3">
              Yes, we also need the name you only ever used that one time in
              Vegas
            </label>
            <input
              v-validate="'required'"
              name="question3"
              type="text"
              placeholder="If you haven't been to Vegas, you should go"
            />
          </div>
          <div class="kyc-string-input">
            <label for="question4"> What is your father's maiden name? </label>
            <input
              v-validate="'required'"
              name="question4"
              type="text"
              placeholder=""
            />
          </div>
          <div class="kyc-string-input">
            <label for="question5">
              What is your favorite sibling's father's maiden name?
            </label>
            <input
              v-validate="'required'"
              name="question5"
              type="text"
              placeholder=""
            />
          </div>
          <div class="kyc-string-input">
            <label for="question6"> Date of birth </label>
            <input
              v-validate="'required|date_format:dd/MM/yyyy'"
              v-model="dob"
              name="question6"
              type="date"
              min="1969-12-31"
            />
            <p>{{ dobm }}</p>
          </div>
          <div class="kyc-string-input">
            <label for="question7">
              How many red cars have you seen today? (Please remember this
              number - you will need it later.)
            </label>
            <input
              v-validate="'required'"
              v-model="redcarsC"
              name="question7"
              type="number"
              min="0"
            />
          </div>
        </div>
        <div v-show="set === 1">
          <div class="kyc-string-input">
            <label for="question8">
              What was the make, model and color of the car in which you first
              got to second base?
            </label>
            <input v-validate="'required'" name="question8" type="text" />
          </div>
          <div class="kyc-string-input">
            <label for="question9">
              What was the name of the neighbors’ pet when you were in 3rd
              grade?
            </label>
            <input v-validate="'required'" name="question9" type="text" />
          </div>
          <div class="kyc-string-input">
            <label for="question10">
              How many times did you try feeding rocks to this animal?
            </label>
            <input
              v-validate="'required'"
              v-model="rocksFed"
              name="question10"
              type="number"
              min="0"
            />
          </div>
          <div class="kyc-string-input">
            <label for="question11">
              Multiply this number by the number of red cars seen today.
            </label>
            <input
              v-validate="'required'"
              v-model="userCalc1"
              name="question11"
              type="number"
              min="0"
            />
            <span v-show="rocksPerCar !== userCalc1">Number doesn't match</span>
          </div>
          <div class="kyc-string-input">
            <label for="question12">
              Which is the correct longitude and latitude of the location where
              you first discovered crypto?
            </label>
            <input
              v-validate="'required'"
              name="question12lat"
              type="string"
              placeholder="Latitude"
            />
            <input
              v-validate="'required'"
              name="question12long"
              type="string"
              placeholder="Longitude"
            />
          </div>
          <div class="kyc-string-input">
            <label for="question13">
              What is your favorite vacation spot for meeting hot young
              professionals? (Be as specific as possible. We are making travel
              arrangements.)
            </label>
            <input
              v-validate="'required'"
              name="question13"
              type="string"
              placeholder=""
            />
          </div>
          <div class="kyc-radio-input">
            <p>How are you enjoying this KYC process so far?</p>
            <div class="radio-inputs">
              <div>
                <label for="question14">
                  &#128512;
                </label>
                <input
                  checked
                  name="question14"
                  type="radio"
                  value="&#128512;"
                />
              </div>
              <div>
                <label for="question14">
                  &#128548;
                </label>
                <input name="question14" type="radio" value="&#128548;" />
              </div>
              <div>
                <label for="question14">
                  &#128549;
                </label>
                <input name="question14" type="radio" value="&#128549;" />
              </div>
              <div>
                <label for="question14">
                  &#128579;
                </label>
                <input name="question14" type="radio" value="&#128579;" />
              </div>
              <div>
                <label for="question14">
                  &#129313;
                </label>
                <input name="question14" type="radio" value="&#129313;" />
              </div>
              <div>
                <label for="question14">
                  &#128207;
                </label>
                <input name="question14" type="radio" value="&#128207;" />
              </div>
              <div>
                <label for="question14">
                  &#128565;
                </label>
                <input name="question14" type="radio" value="&#128565;" />
              </div>
              <div>
                <label for="question14">
                  &#127831;
                </label>
                <input name="question14" type="radio" value="&#127831;" />
              </div>
              <div>
                <label for="question14">
                  &#127881;
                </label>
                <input name="question14" type="radio" value="&#127881;" />
              </div>
              <div>
                <label for="question14">
                  &#129327;
                </label>
                <input name="question14" type="radio" value="&#129327;" />
              </div>
            </div>
          </div>
        </div>
        <div v-show="set === 2">
          <h3>
            To make sure that you are really you, we need to establish a
            baseline of your core beliefs.
          </h3>
          <div class="kyc-radio-input">
            <p>Do you believe in Unicorns?</p>
            <div class="radio-inputs">
              <div>
                <label for="question15">
                  Yes
                </label>
                <input checked name="question15" type="radio" value="Yes" />
              </div>
              <div>
                <label for="question15">
                  No
                </label>
                <input name="question15" type="radio" value="No" />
              </div>
              <div>
                <label for="question15">
                  Prefer not to answer
                </label>
                <input name="question15" type="radio" value="No Answer" />
              </div>
            </div>
          </div>
          <div class="kyc-radio-input">
            <p>How about Bufficorns?</p>
            <div class="radio-inputs">
              <div>
                <label for="question16">
                  Yes
                </label>
                <input checked name="question16" type="radio" value="Yes" />
              </div>
              <div>
                <label for="question16">
                  No
                </label>
                <input name="question16" type="radio" value="No" />
              </div>
              <div>
                <label for="question16">
                  Prefer not to answer
                </label>
                <input name="question16" type="radio" value="No Answer" />
              </div>
            </div>
          </div>
          <div class="kyc-radio-input">
            <p>Llamacorns?</p>
            <div class="radio-inputs">
              <div>
                <label for="question17">
                  Yes
                </label>
                <input checked name="question17" type="radio" value="Yes" />
              </div>
              <div>
                <label for="question17">
                  No
                </label>
                <input name="question17" type="radio" value="No" />
              </div>
              <div>
                <label for="question17">
                  Prefer not to answer
                </label>
                <input name="question17" type="radio" value="No Answer" />
              </div>
            </div>
          </div>
          <div class="kyc-radio-input">
            <p>Dolphicorns?</p>
            <div class="radio-inputs">
              <div>
                <label for="question18">
                  Yes
                </label>
                <input checked name="question18" type="radio" value="Yes" />
              </div>
              <div>
                <label for="question18">
                  No
                </label>
                <input name="question18" type="radio" value="No" />
              </div>
              <div>
                <label for="question18">
                  Prefer not to answer
                </label>
                <input name="question18" type="radio" value="No Answer" />
              </div>
            </div>
          </div>
          <div class="kyc-radio-input">
            <p>Was it white and gold, or black and blue?</p>
            <div class="radio-inputs">
              <div>
                <label for="question19">
                  White and Gold
                </label>
                <input
                  checked
                  name="question19"
                  type="radio"
                  value="White and Gold"
                />
              </div>
              <div>
                <label for="question19">
                  Black and Blue
                </label>
                <input name="question19" type="radio" value="Black and Blue" />
              </div>
              <div>
                <label for="question19">
                  Prefer not to answer
                </label>
                <input name="question19" type="radio" value="No Answer" />
              </div>
            </div>
          </div>
          <div class="kyc-radio-input">
            <p>Yanny or Laurel?</p>
            <div class="radio-inputs">
              <div>
                <label for="question20">
                  Yanny
                </label>
                <input checked name="question20" type="radio" value="Yanny" />
              </div>
              <div>
                <label for="question20">
                  Laurel
                </label>
                <input name="question20" type="radio" value="Laurel" />
              </div>
              <div>
                <label for="question20">
                  Prefer not to answer
                </label>
                <input name="question20" type="radio" value="No Answer" />
              </div>
            </div>
          </div>
          <div class="kyc-radio-input">
            <p>Chicken or the Egg?</p>
            <div class="radio-inputs">
              <div>
                <label for="question21">
                  Chicken
                </label>
                <input checked name="question21" type="radio" value="Chicken" />
              </div>
              <div>
                <label for="question21">
                  Egg
                </label>
                <input name="question21" type="radio" value="Egg" />
              </div>
              <div>
                <label for="question21">
                  Prefer not to answer
                </label>
                <input name="question21" type="radio" value="No Answer" />
              </div>
            </div>
          </div>
          <div class="kyc-radio-input">
            <p>
              Is it better to have loved and lost, or never to have loved at
              all?
            </p>
            <div class="radio-inputs">
              <div>
                <label for="question22">
                  Better to have loved and lost
                </label>
                <input
                  checked
                  name="question22"
                  type="radio"
                  value="Better to have loved and lost"
                />
              </div>
              <div>
                <label for="question22">
                  Never to have loved at all
                </label>
                <input
                  name="question22"
                  type="radio"
                  value="Never to have loved at all"
                />
              </div>
              <div>
                <label for="question22">
                  Prefer not to answer
                </label>
                <input name="question22" type="radio" value="No Answer" />
              </div>
            </div>
          </div>
          <div class="kyc-radio-input">
            <p>
              If a tree falls in the forest, and no one hears it, does it make a
              sound?
            </p>
            <div class="radio-inputs">
              <div>
                <label for="question23">
                  Yes
                </label>
                <input checked name="question23" type="radio" value="Yes" />
              </div>
              <div>
                <label for="question23">
                  No
                </label>
                <input name="question23" type="radio" value="No" />
              </div>
              <div>
                <label for="question23">
                  Prefer not to answer
                </label>
                <input name="question23" type="radio" value="No Answer" />
              </div>
            </div>
          </div>
          <div class="kyc-radio-input">
            <p>To be or not to be?</p>
            <div class="radio-inputs">
              <div>
                <label for="question24">
                  To be
                </label>
                <input checked name="question24" type="radio" value="To be" />
              </div>
              <div>
                <label for="question24">
                  Not to be
                </label>
                <input name="question24" type="radio" value="Not to be" />
              </div>
              <div>
                <label for="question24">
                  Doo be doo be doo
                </label>
                <input
                  name="question24"
                  type="radio"
                  value="Doo be doo be doo"
                />
              </div>
              <div>
                <label for="question24">
                  Prefer not to answer
                </label>
                <input name="question24" type="radio" value="No Answer" />
              </div>
            </div>
          </div>
        </div>
        <div v-show="set === 3"></div>
        <div v-show="set === 4"></div>
        <div v-show="set === 5"></div>
        <div v-show="set === 6"></div>
        <div class="kyc-button-container">
          <button
            :class="[
              setHasError ? 'disabled' : '',
              'submit-button large-round-button-green-filled'
            ]"
            @click="clearForm"
          >
            Reset
          </button>
          <div class="move-on-buttons">
            <span
              :class="[setHasError ? 'disable-forward' : '', 'back']"
              @click="back(set)"
            >
              &#60; Back
            </span>
            <span class="border-span"></span>
            <span
              :class="[setHasError ? 'disable-forward' : '', 'next']"
              @click="next(set)"
            >
              Next >
            </span>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import store from 'store';
import { gs } from '../../helpers.js';
export default {
  data() {
    return {
      set: 0,
      dob: '',
      dobm: '',
      redcarsC: 0,
      rocksFed: 0,
      userCalc1: 0
    };
  },
  computed: {
    setHasError() {
      return this.errors.items.length > 0;
    },
    rocksPerCar() {
      return this.redcarsC * this.rocksFed;
    }
  },
  watch: {
    dob(newVal) {
      const prob = [
        'Congratulations!',
        'It is not in the stars to hold our destiny but ourselves.',
        'Good luck with that.'
      ];
      const ran = Math.floor(Math.random() * (prob.length * 1) + 1);
      const t = new Date();
      const dob = new Date(newVal);
      const g = t.getFullYear() - dob.getFullYear();
      const m = dob.getMonth();
      const d = dob.getDate();
      if (t.getTime() < dob.getTime()) {
        this.dobm = "Welcome time traveler! How's the ETH prices in your time?";
      } else if (g < 5) {
        this.dobm = "You're quite talented for a baby.";
      } else {
        const s = gs(m, d);
        this.dobm = `Your birth sign is: ${s}. ${prob[ran - 1]}`;
      }
    }
  },
  methods: {
    hidden() {
      const x = store.get('x') || 0;
      store.set('x', x + 1);
    },
    next() {
      if (this.set < 7) {
        this.set = this.set + 1;
      } else {
        this.set = 0;
      }
    },
    back() {
      if (this.set !== 0) {
        this.set = this.set - 1;
      }
    },
    clearForm() {
      this.set = 0;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'KYCModal.scss';
</style>
