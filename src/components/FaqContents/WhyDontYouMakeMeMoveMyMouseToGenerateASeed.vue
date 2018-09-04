<template>
  <div>
    <h1 
      id="articleTitleWhydontyoumakememovemymousetogenerateaseed" 
      class="page__title" 
      itemprop="headline">Why don't you make me move my mouse to generate a seed?</h1>
    <div class="content">
      <h3 id="some-sites-generate-entropy-seed-the-private-key-via-mouse-movements-">Some sites generate entropy ("seed") the private key via mouse movements.</h3>
      <h5 id="since-myetherwallet-com-doesn-t-do-this-does-it-mean-my-private-key-isn-t-really-random-is-this-safe-">Since MyEtherWallet.com doesn't do this, does it mean my private key isn't really random? Is this safe?</h5>
      <p><img 
        src="https://s3.amazonaws.com/groovehq/uploaded/3ixnwrg3w8ko1uki8tu5tg4mjpurb4sn2xgfr1lx21w8rnfdzi?1494563756" 
        alt=""></p>
      <p>While the mouse shaking thing is clever and we understand why people enjoy it (?), the reality is the Crypto API ensures more entropy than your mouse movements. The mouse movements aren't unsafe, it's just that we (and tons of other crypto experiments) believe in letting a variety of really crazy random data from your browser, operating system, and more generate the entropy.</p>
      <p>We're relying on really really smart groups of people to build and maintain how our keys are generated. There are glorious amount of specs (and even specs about testing those specs). They are going to do a better job than us and ensuring entropy.</p>
      <h3 id="related-reading">Related Reading</h3>
      <ul>
        <li><a href="https://www.reddit.com/r/ethereum/comments/5psp13/ethereum_account_generation_on_airgapped_computer/">Here's a really long comment about how window.crypto generates entropy.</a></li>
        <li>Here's a <a href="https://www.reddit.com/r/ethereum/comments/2bilqg/note_there_is_a_paranoid_highsecurity_way_to/cj5sgrm">conversation between an angry redditor and Vitalik regarding mouse movements v. window.crypto</a></li>
        <li><a href="https://dvcs.w3.org/hg/webcrypto-api/raw-file/tip/spec/Overview.html#dfn-GlobalCrypto">The window.crypto spec itself</a></li>
      </ul>

    </div>

    <br>
    <hr>
    <br>

    <div class="row">
      <p class="col">
        <a 
          href="https://github.com/MyEtherWallet/knowledge-base/blob/master/src/content/faq/why-dont-you-make-me-move-my-mouse-to-generate-seed.md" 
          target="_blank" 
          rel="noopener noreferrer">
          Found a typo? Want to improve this article? <br> It's easy!
        </a>
      </p>
      <p class="col">
        <a 
          href="https://kb.myetherwallet.com/diving-deeper/how-to-submit-pull-request.html" 
          target="_blank" 
          rel="noopener noreferrer">
          Don't know how to submit a pull request? <br> It's also easy!
        </a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import 'FaqContents.scss';
</style>
