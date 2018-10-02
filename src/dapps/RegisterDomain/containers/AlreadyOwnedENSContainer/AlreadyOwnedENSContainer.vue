<template lang="html">
  <div class="already-owned-container">
    <h3>{{ domainName }}.eth is already owned.</h3>
    <div class="content-container">
      <p class="label"> Labelhash({{ domainName }}.eth): </p>
      <p class="content"> {{ labelHash }} </p>
    </div>
    <div class="content-container">
      <p class="label"> Namehash({{ domainName }}): </p>
      <p class="content"> {{ nameHash }} </p>
    </div>
    <div class="content-container">
      <p class="label"> Owner: </p>
      <p class="content"> {{ owner }} </p>
    </div>
    <div class="content-container">
      <p class="label"> Highest Bidder(Deed Owner): </p>
      <p class="content"> {{ deedOwner }} </p>
    </div>
    <div class="content-container">
      <p class="label"> Resolver Address: </p>
      <p class="content"> {{ resolverAddress }} </p>
    </div>

    <interface-bottom-text
      :link-text="$t('interface.learnMore')"
      :question="$t('interface.haveIssues')"
      link="/"/>
  </div>
</template>

<script>
import InterfaceBottomText from '@/components/InterfaceBottomText';
export default {
  components: {
    'interface-bottom-text': InterfaceBottomText
  },
  props: {
    labelHash: {
      type: String,
      default: ''
    },
    nameHash: {
      type: String,
      default: ''
    },
    owner: {
      type: String,
      default: ''
    },
    deedOwner: {
      type: String,
      default: ''
    },
    resolverAddress: {
      type: String,
      default: ''
    },
    domainName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      receivedProps: [
        {
          label: `Labelhash(${this.domainName}.eth)`,
          data: this.labelHash
        },
        {
          label: `Namehash(${this.domainName})`,
          data: this.nameHash
        },
        {
          label: `Owner`,
          data: this.owner
        },
        {
          label: `Highest Bidder(Deed Owner)`,
          data: this.deedOwner
        },
        {
          label: `Resolver Address`,
          data: this.resolverAddress
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'AlreadyOwnedENSContainer.scss';
</style>
