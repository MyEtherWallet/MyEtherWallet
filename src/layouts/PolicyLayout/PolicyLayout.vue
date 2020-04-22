<template>
  <div class="page-container">
    <div>
      MyEtherWallet (MEW) looks forward to working with the security community
      to identify vulnerabilities in order to keep our users and MEW safe. MEW
      is passionate about providing a seamless and secure experience to our
      community. We are devoted to protecting our users private information and
      providing them an opportunity to interact with the Ethereum blockchain in
      the safest manner possible. Security is our first priority and obligation
      and we always appreciate the valuable contributions! If you have any
      information regarding security vulnerabilities on the MyEtherWallet
      website, MEW wallet App, MEWconnect App and MEW CX report it to
      bugbounty@myetherwallet.com according to our guidelines (jump to reporting
      rules)! Any vulnerabilities submitted under this policy will be used for
      the purposes of improving MyEtherWallet security as well as the user
      experience. We aim to establish a positive feedback between MEW and
      researchers that will contribute to this program - we appreciate your
      patience as we strive to perfect this process. This program is aimed in
      finding security vulnerabilities in MEW wallet App (Beta version Included)
      MEWconnect App (Beta version Included) Current live version of
      MyEtherWallet . com MEW CX Please review, understand, and agree to the
      following terms and conditions before conducting any testing for MEW and
      before submitting a report. Thank you.
    </div>
    <table>
      <tbody>
        <tr>
          <td>Scope</td>
          <td>
            <div>MyEtherWallet.com</div>
            <div>
              Code base can be found:
              https://github.com/MyEtherWallet/MyEtherWallet
            </div>
            <div>MEW wallet App</div>
            <div>
              Code base can be found: iOS:
              https://apps.apple.com/app/id1464614025 Android:
              https://play.google.com/store/apps/details?id=com.myetherwallet.mewwallet
            </div>
            <div>* MEWconnect App</div>
            <div>
              Code base Android:
              https://github.com/MyEtherWallet/MEWconnect-Android Code base iOS:
              https://github.com/MyEtherWallet/MEWconnect-iOS iOS store:
              https://apps.apple.com/us/app/mewconnect/id1391097156 Android:
              https://play.google.com/store/apps/details?id=com.myetherwallet.mewconnect
            </div>
            <div>* MEW CX Code base can be</div>
            <div>
              found:https://github.com/MyEtherWallet/MyEtherWallet Chrome Web
              Store:
              https://chrome.google.com/webstore/detail/mew-cx/nlbmnnijcnlegkjjpcfjclmcfggfefdm?hl=en
            </div>
          </td>
        </tr>
        <tr>
          <td>Rewards</td>
          <td>
            <div>
              Our rewards are based on the severity per CVSS (the Common
              Vulnerability Scoring Standard
              https://en.wikipedia.org/wiki/Common_Vulnerability_Scoring_System
              ). Please note these are general guidelines, and that reward
              decisions are up to the discretion of MyEtherWallet. Each bounty
              reward will be paid in ETH with equivalent USD value, at the time
              of transfer:
            </div>

            <table>
              <tr>
                <td>Critical (9.0 - 10.0)</td>
                <td>High (7.0 - 8.9)</td>
                <td>Medium (4.0 - 6.9)</td>
                <td>Low (0.1 - 3.9)</td>
              </tr>
              <tr>
                <td>$2,000</td>
                <td>$1,000</td>
                <td>$500</td>
                <td>$250</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td>SLA</td>
          <td>
            <div>
              MyEtherWallet will make a best effort to meet the following SLAs
              for researches participating in our bug bounty program: * Time to
              first response (from report submit) - 3 business days * Time to
              triage (from report submit) - 5 business days * Time to bounty
              (from triage) - 5 business days We take every report seriously and
              very much appreciate the efforts of researchers that contribute to
              this program. Please be patient as we’ll try to keep you informed
              about our progress throughout the process.
            </div>
          </td>
        </tr>
        <tr>
          <td>Disclosure Policy</td>
          <td>
            <div>
              Please do not discuss this program or any vulnerabilities (even
              resolved ones) outside, without express consent from
              MyEtherWallet.
            </div>
          </td>
        </tr>
        <tr>
          <td>Reporting Rules</td>
          <td>
            <div>
              Report eligible vulnerability to EMAIL Please provide detailed
              reports with reproducible steps. If the report is not detailed
              enough to reproduce the issue, the issue will not be eligible for
              a reward. Submit one vulnerability per report, unless you need to
              chain vulnerabilities to provide impact. When duplicates occur, we
              only award the first report that was received (provided that it
              can be fully reproduced). Multiple vulnerabilities caused by one
              underlying issue will be awarded one bounty. Social engineering
              (e.g. phishing, vishing, smishing) is prohibited. Make a good
              faith effort to avoid privacy violations, destruction of data, and
              interruption or degradation of our service. Only interact with
              accounts you own or with explicit permission of the account
              holder.
            </div>
          </td>
        </tr>
        <tr>
          <td>In Scope Vulnerabilities</td>
          <td>
            In general, any bug that can lead to loss of finances or leak of
            users’ personal data. These includes bugs with sufficient severity
            and not limited to: MyEtherWallet Website: * Clickjacking * XSS *
            Remote code execution * CSRF * Authentication bypass or privilege
            escalation * Accessing users private keys and personal data MEW
            wallet and MEWconnect apps: * Injection, Manipulation of account
            balance * Authentication bypasses, Loss of privileged information
            (passwords, private keys, etc.) * Unauthorised Transaction signing *
            Unauthorised P2P connection * Modification of request received by
            the Mobile application on MCBeta.myetherwallet.com
          </td>
        </tr>
        <tr>
          <td>Out of scope vulnerabilities</td>
          <td>
            When reporting vulnerabilities, please consider (1) attack scenario
            / exploitability, and (2) security impact of the bug. The following
            issues are considered out of scope: MyEtherWallet.com * Clickjacking
            on pages with no sensitive information. * Self-XSS * Logout CSRF *
            Lack of password length restrictions * Previously known vulnerable
            libraries without a working Proof of Concept. * Comma Separated
            Values (CSV) injection without demonstrating a vulnerability. *
            Content spoofing and text injection issues without showing an attack
            vector/without being able to modify HTML/CSS * Merely showing that a
            page can be iFramed without finding a link on the page to be
            click-jacked. * DNS vulnerabilities * Denial of service * Spamming *
            Vulnerabilities in third party applications which make use of the
            MEW’s API * Vulnerabilities which involve privileged access (e.g.
            rooting a phone) to a victim's device(s) * Reports from automated
            tools or scans (without accompanying demonstration of
            exploitability) * Text-only injection in error pages * Any other
            service not directly hosted or controlled by MyEtherWallet.com. MEW
            will determine at its discretion whether a vulnerability is eligible
            for a reward and the amount of the award. * WebRTC protocol and
            implementation. * Socket.io protocol
          </td>
        </tr>
        <tr>
          <td>MEW wallet and MEWconnect Mobile App</td>
          <td>
            <div>
              * Software bugs that have no security impact. * Public User data,
              such as, public address, balances, transaction information etc.
              stored unencrypted on external storage and private directory. *
              Runtime hacking exploits (exploits only possible in a jailbroken
              environment) * Require physical connection to the device with
              developer-level debugging tool. * Result in an application-level
              crash, or simply mention the possibility of MITM without an
              exploit. * Reports based on information taken or obtained through
              illegal access and confidential information * Vulnerabilities on
              sites hosted by third parties unless they lead to a vulnerability
              on the app. * Known Bugs
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div>
      Thank you for helping keep MyEtherWallet and our community safe!
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
        { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
        { age: 89, first_name: 'Geneva', last_name: 'Wilson' },
        { age: 38, first_name: 'Jami', last_name: 'Carney' }
      ]
    };
  }
};
</script>

<style lang="scss" scoped></style>
