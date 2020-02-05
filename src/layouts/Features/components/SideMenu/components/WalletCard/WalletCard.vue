<template>
  <div class="component--wallet-card">
    <div class="background-image">
      <img src="@/assets/images/Etc/Features/SideMenu/WalletCard.png" />
    </div>
    <div class="info-container pa-5">
      <div class="d-flex">
        <div class="blockie-img">
          <blockie
            :address="address"
            :size="8"
            :scale="16"
            width="50px"
            height="50px"
            class="blockie-image"
          />
          <img src="@/assets/images/Common/Icons/QRcode.svg" />
        </div>
        <div class="ml-4">
          <div class="mb-n2 mt-n2 font-weight-medium d-flex align-center">
            <div>Dennis wallet</div>
            <Tooltip text="Change your wallet information">
              <v-btn class="ml-n1" text icon :color="iconColor"
                ><v-icon class="color--white body-1">mdi-pencil</v-icon></v-btn
              >
            </Tooltip>
          </div>
          <div class="headline font-weight-bold monospace">$7,244.58</div>
        </div>
      </div>
      <Address
        class="mt-1 mb-1"
        address="0x5a35a33b4aad23378a12396b28a500acc4621668"
      />
      <div class="d-flex align-center">
        <Tooltip text="Print">
          <v-btn text icon :color="iconColor">
            <img src="@/assets/images/Common/Icons/printer.svg" />
          </v-btn>
        </Tooltip>

        <Tooltip text="Click to print out your wallet">
          <v-btn text icon :color="iconColor">
            <img src="@/assets/images/Common/Icons/document.svg" />
          </v-btn>
        </Tooltip>

        <Tooltip text="Click to print out your wallet">
          <v-btn text icon :color="iconColor">
            <v-icon class="color--white">mdi-dots-vertical</v-icon>
          </v-btn>
        </Tooltip>

        <v-btn class="ml-auto" outlined small color="white">Switch ></v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import Blockie from '@/components/Blockie';
import Address from './components/Address';
import Tooltip from '@/components/Tooltip';

export default {
  components: { Blockie, Address, Tooltip },
  data() {
    return {
      iconColor: 'white'
    };
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/GlobalVariables.scss';

.component--wallet-card {
  position: relative;
  width: 100%;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;

  img {
    width: 100%;
  }
}

.blockie-img {
  position: relative;
  img {
    position: absolute;
    bottom: 0px;
    right: -5px;
    cursor: pointer;
  }
}

.info-container {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;

  * {
    color: white;
  }
}

.color--white {
  color: white !important;
}
</style>
