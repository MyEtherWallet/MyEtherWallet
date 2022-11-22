<template>
  <v-container class="py-12">
    <h1 class="mb-5 text-center">MyEtherWallet security policy</h1>
    <p>
      MyEtherWallet (MEW) looks forward to working with the security community
      to identify vulnerabilities in order to keep our users and MEW safe.
    </p>
    <p>
      MEW is passionate about providing a seamless and secure experience to our
      community. We are devoted to protecting our users private information and
      providing them an opportunity to interact with the Ethereum blockchain in
      the safest manner possible. Security is our first priority and obligation
      and we always appreciate the valuable contributions! If you have any
      information regarding security vulnerabilities on the
      <strong>
        MyEtherWallet website, MEW wallet App, MEWconnect App and MEW CX
      </strong>
      report it to
      <a href="mailto:bugbounty@myetherwallet.com">
        bugbounty@myetherwallet.com
      </a>
      according to our guidelines (jump to reporting rules)!
    </p>
    <p>
      Any vulnerabilities submitted under this policy will be used for the
      purposes of improving MyEtherWallet security as well as the user
      experience. We aim to establish a positive feedback between MEW and
      researchers that will contribute to this program - we appreciate your
      patience as we strive to perfect this process.
    </p>
    <div class="mb-3">
      <div class="mb-2">
        This program is aimed in finding security vulnerabilities in
      </div>
      <ul class="pl-5">
        <li>MEW wallet App (Beta version Included)</li>
        <li>MEWconnect App (Beta version Included)</li>
        <li>Current live version of MyEtherWallet . com</li>
        <li>MEW CX</li>
      </ul>
    </div>
    <p>
      <strong>
        Please review, understand, and agree to the following terms and
        conditions before conducting any testing for MEW and before submitting a
        report.
      </strong>
    </p>
    <p>Thank you.</p>
    <table class="main-table my-12">
      <tbody>
        <tr>
          <td class="pa-5">Scope</td>
          <td class="pa-5">
            <div>
              <strong>MyEtherWallet.com</strong>
              <div class="pl-5">
                Code base can be found:
                <a
                  href="https://github.com/MyEtherWallet/MyEtherWallet"
                  target="_blank"
                >
                  https://github.com/MyEtherWallet/MyEtherWallet
                </a>
              </div>
            </div>
            <div class="mt-3">
              <strong>MEW wallet App</strong>
              <div class="pl-5">
                Code base can be found:
                <ul class="px-5">
                  <li>
                    iOS:
                    <a
                      href="https://apps.apple.com/app/id1464614025"
                      target="_blank"
                    >
                      https://apps.apple.com/app/id1464614025
                    </a>
                  </li>
                  <li>
                    Android:
                    <a
                      href="https://play.google.com/store/apps/details?id=com.myetherwallet.mewwallet"
                      target="_blank"
                      >https://play.google.com/store/apps/details?id=com.myetherwallet.mewwallet</a
                    >
                  </li>
                </ul>
              </div>
            </div>
            <div class="mt-3">
              <strong>MEWconnect App</strong>
              <div class="pl-5">
                Code base Android:
                <a
                  href="https://github.com/MyEtherWallet/MEWconnect-Android"
                  target="_blank"
                >
                  https://github.com/MyEtherWallet/MEWconnect-Android
                </a>
                <br />
                Code base iOS:
                <a
                  href="https://github.com/MyEtherWallet/MEWconnect-iOS"
                  target="_blank"
                >
                  https://github.com/MyEtherWallet/MEWconnect-iOS
                </a>
              </div>
            </div>
            <div class="mt-3">
              <strong>Enkrypt</strong>
              <div class="pl-5">
                Code base can be found:
                <a href="https://github.com/enkryptcom/enKrypt" target="_blank">
                  https://github.com/enkryptcom/enKrypt
                </a>
                <br />
                Website:
                <a href="https://www.enkrypt.com" target="_blank">
                  Enkrypt.com
                </a>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td class="pa-5">Rewards</td>
          <td class="pa-5">
            <div>
              Our rewards are based on the severity per CVSS (the Common
              Vulnerability Scoring Standard
              <a
                href="https://en.wikipedia.org/wiki/Common_Vulnerability_Scoring_System"
                target="_blank"
              >
                https://en.wikipedia.org/wiki/Common_Vulnerability_Scoring_System
              </a>
              ). Please note these are general guidelines, and that reward
              decisions are up to the discretion of MyEtherWallet.
              <strong>
                Each bounty reward will be paid in ETH with equivalent USD
                value, at the time of transfer:
              </strong>
            </div>

            <table class="sub-table mt-3 mb-1">
              <tr>
                <td class="py-1 px-2">
                  <strong>Critical (9.0 - 10.0)</strong>
                </td>
                <td class="py-1 px-2"><strong>High (7.0 - 8.9)</strong></td>
                <td class="py-1 px-2"><strong>Medium (4.0 - 6.9)</strong></td>
                <td class="py-1 px-2"><strong>Low (0.1 - 3.9)</strong></td>
              </tr>
              <tr>
                <td class="py-1 px-2">$2,000</td>
                <td class="py-1 px-2">$1,000</td>
                <td class="py-1 px-2">$500</td>
                <td class="py-1 px-2">$250</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td class="pa-5">SLA</td>
          <td class="pa-5">
            <div>
              MyEtherWallet will make a best effort to meet the following SLAs
              for researches participating in our bug bounty program:
              <br /><br />
              <strong
                >* Time to first response (from report submit) - 3 business
                days</strong
              >
              <br />
              <strong
                >* Time to triage (from report submit) - 5 business days</strong
              >
              <br />
              <strong>* Time to bounty (from triage) - 5 business days</strong>
              <br /><br />
              We take every report seriously and very much appreciate the
              efforts of researchers that contribute to this program. Please be
              patient as we’ll try to keep you informed about our progress
              throughout the process.
            </div>
          </td>
        </tr>
        <tr>
          <td class="pa-5">Disclosure Policy</td>
          <td class="pa-5">
            <div>
              Please do not discuss this program or any vulnerabilities (even
              resolved ones) outside, without express consent from
              MyEtherWallet.
            </div>
          </td>
        </tr>
        <tr>
          <td class="pa-5">Reporting Rules</td>
          <td class="pa-5">
            <div class="mb-3">
              Report eligible vulnerability to EMAIL Please provide detailed
              reports with reproducible steps. If the report is not detailed
              enough to reproduce the issue, the issue will not be eligible for
              a reward.
            </div>
            <div class="mb-3">
              Submit one vulnerability per report, unless you need to chain
              vulnerabilities to provide impact.
            </div>
            <div class="mb-3">
              When duplicates occur, we only award the first report that was
              received (provided that it can be fully reproduced).
            </div>
            <div class="mb-3">
              Multiple vulnerabilities caused by one underlying issue will be
              awarded one bounty.
            </div>
            <div class="mb-3">
              Social engineering (e.g. phishing, vishing, smishing) is
              prohibited.
            </div>
            <div>
              Make a good faith effort to avoid privacy violations, destruction
              of data, and interruption or degradation of our service.
              <strong>
                Only interact with accounts you own or with explicit permission
                of the account holder.
              </strong>
            </div>
          </td>
        </tr>
        <tr>
          <td class="pa-5">In Scope Vulnerabilities</td>
          <td class="pa-5">
            <div class="mb-3">
              In general, any bug that can lead to loss of finances or leak of
              users’ personal data.
            </div>
            <div class="mb-3">
              These includes bugs with sufficient severity and not limited to:
            </div>
            <div class="mb-2">
              <strong>MyEtherWallet Website and MEW CX:</strong>
            </div>
            <ul class="mb-3 px-5">
              <li>Clickjacking</li>
              <li>XSS</li>
              <li>Remote code execution</li>
              <li>CSRF</li>
              <li>Authentication bypass or privilege escalation</li>
              <li>Accessing users private keys and personal data</li>
            </ul>
            <div class="mb-2">
              <strong>MEW wallet and MEWconnect apps:</strong>
            </div>
            <ul class="px-5">
              <li>Injection, Manipulation of account balance</li>
              <li>
                Authentication bypasses, Loss of privileged information
                (passwords, private keys, etc.)
              </li>
              <li>Unauthorised Transaction signing</li>
              <li>Unauthorised P2P connection</li>
              <li>
                Modification of request received by the Mobile application on
                MCBeta.myetherwallet.com
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <td class="pa-5">Out of scope vulnerabilities</td>
          <td class="pa-5">
            <div class="mb-3">
              When reporting vulnerabilities, please consider (1) attack
              scenario / exploitability, and (2) security impact of the bug. The
              following issues are considered out of scope:
            </div>
            <div class="mb-2">
              <strong>MyEtherWallet Website and MEW CX</strong>
            </div>
            <ul class="px-5">
              <li>Clickjacking on pages with no sensitive information.</li>
              <li>Self-XSS</li>
              <li>Logout CSRF</li>
              <li>Lack of password length restrictions</li>
              <li>
                Previously known vulnerable libraries without a working Proof of
                Concept.
              </li>
              <li>
                Comma Separated Values (CSV) injection without demonstrating a
                vulnerability.
              </li>
              <li>
                Content spoofing and text injection issues without showing an
                attack vector/without being able to modify HTML/CSS
              </li>
              <li>
                Merely showing that a page can be iFramed without finding a link
                on the page to be click-jacked.
              </li>
              <li>DNS vulnerabilities</li>
              <li>Denial of service</li>
              <li>Spamming</li>
              <li>
                Vulnerabilities in third party applications which make use of
                the MEW’s API
              </li>
              <li>
                Vulnerabilities which involve privileged access (e.g. rooting a
                phone) to a victim's device(s)
              </li>
              <li>
                Reports from automated tools or scans (without accompanying
                demonstration of exploitability)
              </li>
              <li>Text-only injection in error pages</li>
              <li>
                Any other service not directly hosted or controlled by
                MyEtherWallet.com. MEW will determine at its discretion whether
                a vulnerability is eligible for a reward and the amount of the
                award.
              </li>
              <li>WebRTC protocol and implementation.</li>
              <li>Socket.io protocol</li>
            </ul>
          </td>
        </tr>
        <tr>
          <td class="pa-5">MEW wallet and MEWconnect Mobile App</td>
          <td class="pa-5">
            <div>
              <ul class="px-5">
                <li>Software bugs that have no security impact.</li>
                <li>
                  Public User data, such as, public address, balances,
                  transaction information etc. stored unencrypted on external
                  storage and private directory.
                </li>
                <li>
                  Runtime hacking exploits (exploits only possible in a
                  jailbroken environment)
                </li>
                <li>
                  Require physical connection to the device with developer-level
                  debugging tool.
                </li>
                <li>
                  Result in an application-level crash, or simply mention the
                  possibility of MITM without an exploit.
                </li>
                <li>
                  Reports based on information taken or obtained through illegal
                  access and confidential information
                </li>
                <li>
                  Vulnerabilities on sites hosted by third parties unless they
                  lead to a vulnerability on the app.
                </li>
                <li>Known Bugs</li>
              </ul>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div>Thank you for helping keep MyEtherWallet and our community safe!</div>
  </v-container>
</template>

<style lang="scss" scoped>
a {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-all;
}
ul {
  li {
    &::before {
      content: '- ';
    }
  }
}

.main-table {
  border: 1px solid var(--v-black-base);
  border-collapse: collapse;
  tr {
    border-bottom: 1px solid var(--v-black-base);
  }
}
.sub-table {
  border-collapse: collapse;
  tr {
    border: 1px solid black;
    td {
      border-right: 1px solid black;
    }
  }
}
@media (max-width: 600px) {
  .main-table {
    tbody > tr {
      > td {
        display: block;
        &:first-child {
          font-size: 25px;
        }
      }
    }
  }
}
</style>
