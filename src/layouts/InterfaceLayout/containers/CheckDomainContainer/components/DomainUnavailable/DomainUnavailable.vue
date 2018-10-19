<template>
  <div class="domain-unavailable">
    <div class="container__content">
      <div class="block__content">
        <div class="domain-availability">
          bestkat1234.eth is already owned
        </div>
        
        <div class="domain-info-blocks">
          <ul>
            <li v-for="info in alreadyTakenDomainInfo" v-bind:key="info.key" class="domain-info">
              <p class="title">{{ info.title }}</p>
              <p class="data">{{ info.data }}</p>
            </li>
          </ul>
        </div>

      </div><!-- .block__content -->

      <div class="block__submit-button">
        <standard-button 
          :options="buttonCheckDomain"
          class="the-submit-button"
          @click.native="modalStatusDomainTaken = 'show'"
        />
        <interface-bottom-text
          :link-text="$t('interface.etherscanIO')"
          :question="$t('interface.ethNodeProvidedBy')"
          link="/"/>
      </div>
    </div><!-- .content-container -->

    <domain-confirm-modal />
    <success-modal />
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
import DropdownBidInfo from '../DropdownBidInfo';
import DomainConfirmModal from '@/containers/ConfirmationContainer/components/DomainConfirmModal';
import SuccessModal from '@/containers/ConfirmationContainer/components/SuccessModal';

export default {
  components: {
    'interface-bottom-text': InterfaceBottomText,
    'dropdown-bid-info': DropdownBidInfo,
    'domain-confirm-modal': DomainConfirmModal,
    'success-modal': SuccessModal
  },
  props: {},
  data() {
    return {
      buttonCheckDomain: {
        title: 'Finalize',
        buttonStyle: 'green',
        rightArrow: false,
        fullWidth: false,
        isThisMobileBottomButton: false
      },
      alreadyTakenDomainInfo: [
        {
          title: 'Labelhash(mewtopia)',
          data: '0xfe22322bde32dd6902662ea21f37a8e11d7e297387cb4021bd901747e8faffd1',
        },
        {
          title: 'Namehash(mewtopia.eth)',
          data: '0xfa9b74be0e8599f12c6604a4fc3d31bd8bb6143b4685aef709bdc4e10ca620d1'
        },
        {
          title: 'Owner',
          data: '0x00004242ca3469e30ae4a62775fee6584ed3fdca'
        },
        {
          title: 'Highest Bidder(Deed Owner)',
          data: '0x00004242ca3469e30ae4a62775fee6584ed3fdca'
        },
        {
          title: 'Resolved Address',
          data: '0x00004242ca3469e30ae4a62775fee6584ed3fdca'
        }
      ]
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import 'DomainUnavailable-desktop.scss';
@import 'DomainUnavailable-tablet.scss';
@import 'DomainUnavailable-mobile.scss';
</style>
