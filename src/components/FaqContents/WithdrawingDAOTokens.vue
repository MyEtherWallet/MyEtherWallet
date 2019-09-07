<template>
  <div>
    <h5>
      The old DAO MyEtherWallet doesn't seem to want to stay online &
      functioning. We're sorry.
    </h5>
    <p>
      New instructions & where you can go to get help:
      <a
        href="https://www.reddit.com/r/ethereum/comments/7ojy4h/there_are_still_200_million_unclaimed_funds_in/dsap0gr/"
        target="_blank"
        rel="noopener noreferrer"
        >https://www.reddit.com/r/ethereum/comments/7ojy4h/there_are_still_200_million_unclaimed_funds_in/dsap0gr/</a
      >
    </p>

    <ul>
      <li>
        Check which funds you can withdraw:
        <a
          href="https://refunds.thedao.fund/"
          target="_blank"
          rel="noopener noreferrer"
          >https://refunds.thedao.fund/</a
        >
      </li>
      <li>
        A general over view of what you can collect is here:
        <a
          href="https://medium.com/curator-multisig-phf-official-channel/dao-token-holders-come-claim-your-money-b428f186572a#.9ur5tfm26"
          target="_blank"
          rel="noopener noreferrer"
          >https://medium.com/curator-multisig-phf-official-channel/dao-token-holders-come-claim-your-money-b428f186572a#.9ur5tfm26</a
        >
      </li>
    </ul>

    <h5>Walkthru for DAO Main withdraw</h5>
    <ol>
      <li>
        Have ETH in the account that has DAO tokens in it so you can collect the
        refund.
      </li>
      <li>
        Go to
        <a
          href="https://www.myetherwallet.com/#send-transaction"
          target="_blank"
          rel="noopener noreferrer"
          >https://www.myetherwallet.com/#send-transaction</a
        >
        (the current version)
      </li>
      <li>
        Make sure the ETH node in the top right corner is selected (Try out
        Giveth.io's donated node ;-) )
      </li>
      <li>
        At the top of the screen there is a slider for gasPrice. Make sure you
        have selected a gasPrice that will make your tx go thru. If the
        CryptoKitties are still breeding like CryptoBunnies this might need to
        be 61 Gwei or more! If the network isnt under much load 1 Gwei or less
        will work, check
        <a
          href="https://ethgasstation.info/"
          target="_blank"
          rel="noopener noreferrer"
          >https://ethgasstation.info/</a
        >
        to find the Standard gasPrice that will work immediately.
      </li>
      <li>
        Access the key for the address holding your DAO tokens (this usu means
        selecting "Keystore / JSON File" finding your keystore file on your
        computer and then typing in the password) and then put this info into
        the boxes that pop up on the screen to approve the withdraw token
        contract to take your DAO tokens:
      </li>
    </ol>

    <p>4a. TO <abbr>0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413</abbr></p>
    <p>4b. Value: <abbr>0</abbr>!!!!!!!</p>
    <p>4c. gasLimit: <abbr>100000</abbr></p>
    <p>
      4d. DATA:
      <abbr
        >0x095ea7b3000000000000000000000000bf4ed7b27f1d666546e30d74d50d173d20bca7540000000000000000000000000000000000000000da0da0da0da0da0da0da0da0</abbr
      >
    </p>
    <p>4e. Click Generate Tx and then click Send Tx</p>

    <ol>
      <li>Stay on this screen and make a second tx, but this time with:</li>
    </ol>

    <p>5a. TO <abbr>0xbf4ed7b27f1d666546e30d74d50d173d20bca754</abbr></p>
    <p>5b. Value: <abbr>0</abbr>!!!!!!!</p>
    <p>5c. gasLimit: <abbr>100000</abbr></p>
    <p>5d. DATA: <abbr>0x3ccfd60b</abbr></p>
    <p>5e. Click Generate Tx and then click Send Tx</p>
    <p>
      Now wait for the Ethereum Blockchain to work its magic and you will have a
      bunch of ETH delivered to you :-) Remember that a lot of people worked
      hard to make this possible, the whole Ethereum network hard forked for
      this! Pay it forward to the people around you, if this was built on
      Bitcoin, you would have lost all your funds #gratitude ;-D
    </p>

    <h5>Walk thru for ExtraBalance Refund</h5>
    <p>
      This short explainer is to help you understand what is happening in the
      code, if you don't really care and just want that sweet sweet ether, dont
      worry about it and skip to the numbered steps.
    </p>
    <p>
      Withdrawing from the ExtraBal Withdraw contract is a 2 step process. There
      were ExtraBal Tokens sent to everyone that contributed to The DAO's
      ExtraBalance contract, these tokens are the accounting for the ExtraBal
      Withdraw contract (Special thx goes to Bokky Poobah, Nick Johnson, Beltran
      Berrocal, and Alexey Akunhov for setting this all up). The first tx tells
      the ExtraBal TOKEN contract to <abbr>approve()</abbr> the ExtraBal
      WITHDRAW contract to take all your ExtraBal tokens , the second
      transaction tells the ExtraBal WITHDRAW contract to count your tokens and
      give you the money.
    </p>

    <ol>
      <li>Have ETH in the account that can collect the refund.</li>
      <li>
        Go to
        <a
          href="https://www.myetherwallet.com/#send-transaction"
          target="_blank"
          rel="noopener noreferrer"
          >https://www.myetherwallet.com/#send-transaction</a
        >
        (the current version)
      </li>
      <li>
        Make sure the ETH node in the top right corner is selected (Try out
        Giveth.io's donated node ;-) )
      </li>
      <li>
        At the top of the screen there is a slider for gasPrice. Make sure you
        have selected a gasPrice that will make your tx go thru. If the
        CryptoKitties are still breeding like CryptoBunnies this might need to
        be 61 Gwei or more! If the network isnt under much load 1 Gwei or less
        will work, check
        <a
          href="https://ethgasstation.info/"
          target="_blank"
          rel="noopener noreferrer"
          >https://ethgasstation.info/</a
        >
        to find the Standard gasPrice that will work immediately.
      </li>
      <li>
        Access your key (this usu means selecting "Keystore / JSON File" finding
        your keystore file on your computer and then typing int he password) and
        then put this info into the boxes that pop up on the screen to approve
        the withdraw token contract to take your tokens:
      </li>
    </ol>

    <p>4a. TO <abbr>0x5c40eF6f527f4FbA68368774E6130cE6515123f2</abbr></p>
    <p>4b. Value: <abbr>0</abbr>!!!!!!!</p>
    <p>4c. gasLimit: <abbr>100000</abbr></p>
    <p>
      4d. DATA:
      <abbr
        >0x095ea7b3000000000000000000000000755cdba6ae4f479f7164792b318b2a06c759833b0000000000000000000000000000000000000000000000da0da0da0da0da0da0</abbr
      >
    </p>
    <p>4e. Click Generate Tx and then click Send Tx</p>

    <ol>
      <li>Stay on this screen and make a second tx, but this time with:</li>
    </ol>

    <p>5a. TO <abbr>0x755cdba6ae4f479f7164792b318b2a06c759833b</abbr></p>
    <p>5b. Value: <abbr>0</abbr>!!!!!!!</p>
    <p>5c. gasLimit: <abbr>100000</abbr></p>
    <p>5d. DATA: <abbr>0x3ccfd60b</abbr></p>
    <p>5e. Click Generate Tx and then click Send Tx</p>
    <p>
      Now wait for the Ethereum Blockchain to work its magic and you will have a
      bunch of ETH delivered to you :-) Remember that a lot of people worked
      hard to make this possible, the whole Ethereum network hard forked for
      this! Pay it forward to the people around you, if this was built on
      Bitcoin, this wouldn't have happened. ;-D
    </p>

    <h5>Walk thru for ETC (don't be afraid to tip the whitehats)</h5>

    <ol>
      <li>
        Have ETC in the account that you are using to interact with your wallet
        account.
      </li>
      <li>
        Go to
        <a
          href="https://www.myetherwallet.com/#send-transaction"
          target="_blank"
          rel="noopener noreferrer"
          >https://www.myetherwallet.com/#send-transaction</a
        >
        (the current version)
      </li>
      <li>Select the ETC node in the top right corner</li>
      <li>
        Access your key (this usually means selecting "Keystore / JSON File"
        finding your keystore file on your computer and then typing int he
        password)
      </li>
      <li>TO <abbr>0x9f5304da62a5408416ea58a17a92611019bd5ce3</abbr></li>
      <li>Value: <abbr>0</abbr>!!!!!!!</li>
      <li>gasLimit: <abbr>100000</abbr></li>
      <li>DATA: insert something that looks like this BUT IS NOT THIS DATA:</li>
    </ol>

    <p>
      <abbr
        >0xf3fef3a3000000000000000000000000839395e20bbB182fa440d08F850E6c7A8f6F0780000000000000000000000000000000000000000000000000000000000000000a</abbr
      >
    </p>
    <p>--------pause---------</p>
    <p>
      I am going to use this as a chance to explain what you are doing. so this
      isnt just annoying but hopefully you get something fun out of it :-)
    </p>
    <p>
      <a
        href="https://github.com/BitySA/whetcwithdraw/blob/master/whetcwithdraw.sol#L155"
        target="_blank"
        rel="noopener noreferrer"
        >https://github.com/BitySA/whetcwithdraw/blob/master/whetcwithdraw.sol#L155</a
      >
    </p>
    <p>you are calling that line ^^^. The data breaks down like this:</p>

    <ul>
      <li><abbr>0x</abbr> is in front of everything always</li>
      <li>
        <abbr>f3fef3a3</abbr> is actually the withdraw function (in bytecode)
      </li>
      <li>
        <abbr
          >000000000000000000000000839395e20bbB182fa440d08F850E6c7A8f6F0780</abbr
        >
        is the address that should receive the ETC (without 0x in front). This
        can be an exchange address, but I recommend you send it to your DAO
        Token address and then send it to an exchange from there using MEW.
      </li>
      <li>
        <abbr
          >000000000000000000000000000000000000000000000000000000000000000a</abbr
        >
        is the donation % but in hex, so if you wanted to donate 1% the last
        digit would be <abbr>1</abbr>, 10% the last digit would be
        <abbr>a</abbr>, 15% the last digit would be <abbr>f</abbr>, and 17% the
        last two digits would be <abbr>11</abbr> (Crazy right!)
      </li>
    </ul>

    <p>-------continue--------</p>

    <ol>
      <li>Click Generate Transaction and then Sign Transaction</li>
      <li>All Done</li>
    </ol>

    <h3>Old Instructions (probably doesn't work anymore)</h3>

    <h5>
      You need to run the older version of MyEtherWallet (v3.3.7) to access the
      old DAO pages:
    </h5>

    <ul>
      <li>
        <a
          href="https://github.com/kvhnuke/etherwallet/releases/tag/v3.3.7"
          target="_blank"
          rel="noopener noreferrer"
          >MyEtherWallet (v3.3.7)</a
        >
      </li>
      <li>Click on <abbr>dist-v3.3.7.zip</abbr></li>
      <li>Unzip it</li>
      <li>Double-click <abbr>index.html</abbr></li>
      <li>MyEtherWallet is now running entirely on your computer</li>
    </ul>

    <p>
      In case you are not familiar, you need to keep the entire folder in order
      to run the website, not just <abbr>index.html</abbr>. Don't touch or move
      anything around in the folder.
    </p>

    <h5>Once you've got the site up:</h5>
    <ul>
      <li>Click the <strong>Withdraw DAO page</strong> in the footer</li>
      <li>
        You will see three tabs:
        <ul>
          <li>1 for withdrawing ETH</li>
          <li>1 for withdrawing ETC</li>
          <li>1 for withdrawing your ExtraBalance</li>
        </ul>
      </li>
      <li>Click the three red buttons on the three DAO tabs to withdraw.</li>
      <li>Done!</li>
    </ul>

    <p>
      <strong>
        Note: You will need minimum 0.01 ETH and 0.01 ETC in order to cover the
        cost of gas necessary to process the withdrawals.
      </strong>
    </p>

    <p>
      <em>
        Etherscan.io was kind enough to host this older version of MyEtherWallet
        on their site for 1.5 years. Thank you etherscan!
        <a
          href="https://etherscan.io/myetherwallet/"
          target="_blank"
          rel="noopener noreferrer"
          >https://etherscan.io/myetherwallet/</a
        >
      </em>
    </p>

    <p class="col">
      <a
        href="https://github.com/MyEtherWallet/knowledge-base/blob/master/src/content/faq/withdrawing-dao-tokens.md"
        target="_blank"
        rel="noopener noreferrer"
        >Found a typo? Want to improve this article? <br />It's easy!
      </a>
    </p>
    <p class="col">
      <a
        href="https://kb.myetherwallet.com/diving-deeper/how-to-submit-pull-request.html"
        target="_blank"
        rel="noopener noreferrer"
        >Don't know how to submit a pull request? <br />It's also easy!
      </a>
    </p>
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
