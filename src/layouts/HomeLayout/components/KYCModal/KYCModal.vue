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
      <div ref="kyccontainer" class="kyc-container">
        <div v-show="set === 0">
          <h4>
            Due to changes in the regulatory environment, MEW must comply with
            KYC/AML requirements.
          </h4>
          <p>
            In order to be KYC verified, pelase answer the following questions
          </p>
          <div class="kyc-string-input">
            <label for="question1"> 1. What is your name? </label>
            <input v-validate="'required'" name="question1" type="text" />
          </div>
          <div class="kyc-string-input">
            <label for="question2">
              2. List any other names you have used:
            </label>
            <input
              v-validate="'required'"
              name="question2"
              type="text"
              placeholder="Please separate each name by comma"
            />
          </div>
          <div class="kyc-string-input">
            <label for="question3">
              3. Yes, we also need the name you only ever used that one time in
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
            <label for="question4">
              4. What is your father's maiden name?
            </label>
            <input
              v-validate="'required'"
              name="question4"
              type="text"
              placeholder=""
            />
          </div>
          <div class="kyc-string-input">
            <label for="question5">
              5. What is your favorite sibling's father's maiden name?
            </label>
            <input
              v-validate="'required'"
              name="question5"
              type="text"
              placeholder=""
            />
          </div>
          <div class="kyc-string-input">
            <label for="question6"> 6. Date of birth </label>
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
              7. How many red cars have you seen today? (Please remember this
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
              8. What was the make, model and color of the car in which you
              first got to second base?
            </label>
            <input v-validate="'required'" name="question8" type="text" />
          </div>
          <div class="kyc-string-input">
            <label for="question9">
              9. What was the name of the neighbors’ pet when you were in 3rd
              grade?
            </label>
            <input v-validate="'required'" name="question9" type="text" />
          </div>
          <div class="kyc-string-input">
            <label for="question10">
              10. How many times did you try feeding rocks to this animal?
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
              11. Multiply this number by the number of red cars seen today.
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
              12. Which is the correct longitude and latitude of the location
              where you first discovered crypto?
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
              13. What is your favorite vacation spot for meeting hot young
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
            <p>14. How are you enjoying this KYC process so far?</p>
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
            <p>15. Do you believe in Unicorns?</p>
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
            <p>16. How about Bufficorns?</p>
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
            <p>17. Llamacorns?</p>
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
            <p>18. Dolphicorns?</p>
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
            <p>19. Was it white and gold, or black and blue?</p>
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
            <p>20. Yanny or Laurel?</p>
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
            <p>21. Chicken or the Egg?</p>
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
              22. Is it better to have loved and lost, or never to have loved at
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
              23. If a tree falls in the forest, and no one hears it, does it
              make a sound?
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
            <p>24. To be or not to be?</p>
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
        <div v-show="set === 3">
          <h3>
            Just a few more security questions. You’re almost there.
          </h3>
          <div class="kyc-string-input">
            <label for="question25">
              25. If you had to convince a version of yourself in the past that
              you are in fact yourself from the future, what’s the deepest,
              darkest secret you’d share? (Please provide juicy details for best
              results.)
            </label>
            <input v-validate="'required'" name="question25" type="text" />
          </div>
          <div class="kyc-string-input">
            <label for="question26">
              26. What were you doing on July 30, 2015 at 3:26 PM UTC?
            </label>
            <input v-validate="'required'" name="question26" type="text" />
          </div>
          <div class="kyc-radio-input">
            <p>
              27. Which of these currencies has the highest market cap at the
              moment?
            </p>
            <div class="radio-inputs">
              <div>
                <label for="question27">
                  XRP
                </label>
                <input checked name="question27" type="radio" value="XRP" />
              </div>
              <div>
                <label for="question27">
                  BTC
                </label>
                <input name="question27" type="radio" value="BTC" />
              </div>
              <div>
                <label for="question27">
                  ETH
                </label>
                <input name="question27" type="radio" value="ETH" />
              </div>
              <div>
                <label for="question27">
                  EOS
                </label>
                <input name="question27" type="radio" value="EOS" />
              </div>
              <div>
                <label for="question27">
                  OMG
                </label>
                <input name="question27" type="radio" value="OMG" />
              </div>
              <div>
                <label for="question27">
                  LOL
                </label>
                <input name="question27" type="radio" value="LOL" />
              </div>
              <div>
                <label for="question27">
                  WTF
                </label>
                <input name="question27" type="radio" value="WTF" />
              </div>
              <div>
                <label for="question27">
                  FML
                </label>
                <input name="question27" type="radio" value="FML" />
              </div>
              <div>
                <label for="question27">
                  IDK
                </label>
                <input name="question27" type="radio" value="IDK" />
              </div>
              <div>
                <label for="question27">
                  SMH
                </label>
                <input name="question27" type="radio" value="SMH" />
              </div>
            </div>
          </div>
          <div class="kyc-radio-input">
            <p>29. Who gives away the ETH?</p>
            <div class="radio-inputs">
              <div>
                <label for="question28">
                  Vitalik
                </label>
                <input checked name="question28" type="radio" value="Vitalik" />
              </div>
              <div>
                <label for="question28">
                  the DAO
                </label>
                <input name="question28" type="radio" value="the DAO" />
              </div>
              <div>
                <label for="question28">
                  no one ever
                </label>
                <input name="question28" type="radio" value="no one ever" />
              </div>
              <div>
                <label for="question28">
                  the Ethereum Foundation
                </label>
                <input
                  name="question28"
                  type="radio"
                  value="the Ethereum Foundation"
                />
              </div>
              <div>
                <label for="question28">
                  zero ETHS given
                </label>
                <input name="question28" type="radio" value="zero ETHS given" />
              </div>
            </div>
          </div>
          <div class="kyc-radio-input">
            <p>29. Is winter coming?</p>
            <div class="radio-inputs">
              <div>
                <label for="question29">
                  Have you been living under a rock? Winter is here.
                </label>
                <input
                  checked
                  name="question29"
                  type="radio"
                  value="Have you been living under a rock? Winter is here."
                />
              </div>
              <div>
                <label for="question29">
                  It's all good, HODL and BUIDL
                </label>
                <input
                  name="question29"
                  type="radio"
                  value="It's all good, HODL and BUIDL"
                />
              </div>
            </div>
          </div>
          <div class="kyc-string-input">
            <label for="question30">
              <p>30. Who is this guy?</p>
              <img src="@/assets/images/team/Kosala.jpg" width="200px" />
            </label>
            <input
              v-validate="'required'"
              name="question30"
              type="text"
              placeholder="Hint: He's Mr. MyEtherWallet"
            />
          </div>
          <div class="kyc-radio-input">
            <p>31. What is your most frequently used website?</p>
            <div class="radio-inputs">
              <div>
                <label for="question31">
                  Amazon
                </label>
                <input
                  checked
                  name="question31"
                  type="radio"
                  value="1"
                  @change="mostUsed('1')"
                />
              </div>
              <div>
                <label for="question31">
                  Google
                </label>
                <input
                  name="question31"
                  type="radio"
                  value="2"
                  @change="mostUsed('2')"
                />
              </div>
              <div>
                <label for="question31">
                  Netflix
                </label>
                <input
                  name="question31"
                  type="radio"
                  value="3"
                  @change="mostUsed('3')"
                />
              </div>
              <div>
                <label for="question31">
                  MyEtherWallet
                </label>
                <input
                  name="question31"
                  type="radio"
                  value="4"
                  @change="mostUsed('4')"
                />
              </div>
              <div>
                <label for="question31">
                  Medium
                </label>
                <input
                  name="question31"
                  type="radio"
                  value="5"
                  @change="mostUsed('5')"
                />
              </div>
              <div>
                <label for="question31">
                  Facebook
                </label>
                <input
                  name="question31"
                  type="radio"
                  value="6"
                  @change="mostUsed('6')"
                />
              </div>
            </div>
            {{ usedM }}
          </div>
        </div>
        <div v-show="set === 4">
          <h3>Congratulations! You've reached our bonus round!</h3>
          <div class="kyc-string-input">
            <label for="question32">
              32. How many chucks would a woodchuck chuck if Chuck Norris could
              chuck wood?
            </label>
            <input v-validate="'required'" name="question32" type="text" />
          </div>
          <div class="kyc-radio-input">
            <p>
              33. Raindrops on roses, whiskers on kittens, bright copper kettles
              or warm woolen mittens: which of these are your favorite things?
            </p>
            <div class="radio-inputs">
              <div>
                <label for="question33">
                  Raindrops on roses
                </label>
                <input
                  checked
                  name="question33"
                  type="radio"
                  value="Raindrops on roses"
                />
              </div>
              <div>
                <label for="question33">
                  Whiskers on kittens
                </label>
                <input
                  name="question33"
                  type="radio"
                  value="Whiskers on kittens"
                />
              </div>
              <div>
                <label for="question33">
                  Bright copper kettles
                </label>
                <input
                  name="question33"
                  type="radio"
                  value="Bright copper kettles"
                />
              </div>
              <div>
                <label for="question33">
                  Warm woolen mittens
                </label>
                <input
                  name="question33"
                  type="radio"
                  value="Warm woolen mittens"
                />
              </div>
            </div>
          </div>
          <div class="kyc-string-input">
            <label for="question34"> 34. Quis custodiet ipsos custodes? </label>
            <input v-validate="'required'" name="question34" type="text" />
          </div>
          <div class="kyc-string-input">
            <label for="question35">
              35. What is the meaning of life, the universe and everything?
            </label>
            <input
              v-validate="'required'"
              v-model="meaningOfLife"
              name="question35"
              type="text"
            />
            {{ molM }}
          </div>
        </div>
        <div v-show="set === 5">
          <div class="final-card">
            <h3>
              Please note that filling in this form acts as your agreement to
              follow and be bound by the MyEtherWallet F.O.O.L.D.U. protocol.
              Your data may be used in any and all of the following ways:
            </h3>
            <ol>
              <li>
                Collected, arranged nicely in a scrapbook, and then dispatched
                into space by an incredibly over-sized catapult.
              </li>
              <li>Ignored. Because really, we are very busy.</li>
              <li>Carved into stone and set down as the law of the ages.</li>
              <li>
                Hand-crocheted onto a gigantic quilt, to keep us warm through
                Crypto Winter.
              </li>
              <li>Tattooed onto our COO.</li>
              <li>
                Placed into tiny decorative boxes and arranged in a mystical
                pattern to be discovered by future generations hundreds of years
                from now.
              </li>
              <li>
                Lovingly baked into a cake and shared amongst the MEW team!
              </li>
            </ol>
            <div class="final-button-container">
              <button class="large-round-button-green-filled" @click="next">
                Accept
              </button>
            </div>
          </div>
        </div>
        <div v-show="set === 6">
          <div class="final-final-card">
            <h2>
              You have survived our KYC/AML process! We hope you had fun (we’re
              sorry if it cut too close for comfort). Happy April Fools!
            </h2>
          </div>
        </div>
        <div v-show="set < 5" class="kyc-button-container">
          <button
            class="submit-button large-round-button-green-filled"
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
      userCalc1: 0,
      meaningOfLife: '',
      molM: '',
      website: '1',
      usedM: ''
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
    meaningOfLife(newVal) {
      if (newVal !== '42') {
        this.molM = "That's not the meaning of life.";
      }
    },
    dob(newVal) {
      if (newVal !== 'mm/dd/yyyy') {
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
          this.dobm =
            "Welcome time traveler! How's the ETH prices in your time?";
        } else if (g < 5) {
          this.dobm = "You're quite talented for a baby.";
        } else {
          const s = gs(m, d);
          this.dobm = `Your birth sign is: ${s}. ${prob[ran - 1]}`;
        }
      }
    }
  },
  methods: {
    mostUsed(used) {
      this.website = used;
      switch (this.website) {
        case '1':
          this.usedM = "You're cold!";
          break;
        case '2':
          this.usedM = "You're getting warmer!";
          break;
        case '3':
          this.usedM = "You're on fire!";
          break;
        case '4':
          this.usedM = '';
          break;
        case '6':
          this.usedM = "You're cold!";
          break;
        case '5':
          this.usedM = "You're getting warmer!";
          break;
      }
    },
    hidden() {
      const x = store.get('x') || 0;
      store.set('x', x + 1);
    },
    next() {
      this.set = this.set + 1;
      if (this.set === 6) {
        store.set('x', 5);
      }
    },
    back() {
      if (this.set !== 0) {
        this.set = this.set - 1;
      }
    },
    clearForm() {
      this.$refs.kycModal.$forceUpdate();
      this.set = 0;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'KYCModal.scss';
</style>
