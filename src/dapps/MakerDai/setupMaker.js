// using http preset and kovan.infura.io results in error: "Failed to subscribe
// to new newBlockHeaders to confirm the transaction receipts", because HTTP
// provider doesn't support subscriptions.
// const KOVAN_INFURA_URL = 'https://kovan.infura.io';
// import * as unit from 'ethjs-unit';
import utils from 'web3-utils';
import BigNumber from 'bignumber.js'
export const WAD = new BigNumber(utils.toWei(1));

// Multiply WAD values
const wmul = (a, b) => {
  return new BigNumber(a).times(b).div(WAD);
}

//Divide WAD values
const wdiv = (a, b) => {
  return new BigNumber(a).times(WAD).div(b);
}

export default class makerOps {
  constructor(maker) {
    this.maker = maker;
  }

  calculateLiquidationPrice(par, per, mat, skr, dai) {
    return wdiv(wmul(wmul(dai, par), mat), wmul(skr, per));
  }

  calculateRatio(tag, par, skr, dai) {
    return wdiv(wmul(skr, tag).round(0), wmul(dai, par));
  }

  tab(cup, chi) {
    return wmul(cup.art, chi).round(0);
  }

  rap(cup, rhi, chi) {
    return wmul(cup.ire, rhi)
      .minus(this.tab(cup, chi))
      .round(0);
  }

  calculateLiquidationPrice  (skr, dai) {
    return this.calculateLiquidationPrice(
      this.vox.par,
      this.tub.per,
      this.tub.mat,
      skr,
      dai
    );
  };

  calculateRatio = (skr, dai) => {
    return this.calculateRatio(this.tub.tag, this.vox.par, skr, dai);
  };
}
