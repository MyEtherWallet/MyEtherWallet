import BigNumber from 'bignumber.js';
import {
  ETH,
  REP,
  ZRX,
  OMG,
  BAT,
  GNT,
  DGD,
  MDAI,
  MKR
} from '@makerdao/dai-plugin-mcd';
import Maker from '@makerdao/dai';
const { DAI } = Maker;

const toBigNumber = num => {
  return new BigNumber(num);
};

export async function setupServices(self, maker) {
  self._priceService = maker.service('price');
  self._cdpService = await maker.service('cdp');
  self._proxyService = await maker.service('proxy');
  self._tokenService = await maker.service('token');
  self._mcdManager = maker.service('mcd:cdpManager');
  return self;
}

export async function setupPriceAndRatios(self, _priceService, _cdpService) {
  self.pethMin = toBigNumber(0.005);

  self.ethPrice = toBigNumber((await _priceService.getEthPrice()).toNumber());

  self.pethPrice = toBigNumber((await _priceService.getPethPrice()).toNumber());

  self._targetPrice = toBigNumber(
    (await _priceService.getPethPrice()).toNumber()
  );

  self.liquidationRatio = toBigNumber(await _cdpService.getLiquidationRatio());
  self.liquidationPenalty = toBigNumber(
    await _cdpService.getLiquidationPenalty()
  );
  self.stabilityFee = toBigNumber(await _cdpService.getAnnualGovernanceFee());

  self.wethToPethRatio = toBigNumber(await _priceService.getWethToPethRatio());
  return self;
}

export async function getDetailsForTokens(self, collateralTokens) {
  self.balances = {};
  self.tokens = {};
  self.daiToken = self._tokenService.getToken(DAI);
  self.daiBalance = (await self.daiToken.balance()).toBigNumber();
  self.mkrToken = self._tokenService.getToken(MKR);
  self.mkrBalance = (await self.mkrToken.balance()).toBigNumber();

  for (let i = 0; i < collateralTokens.length; i++) {
    const token = self._tokenService.getToken(collateralTokens[i].currency);
    self.tokens[collateralTokens[i].currency.symbol] = token;
    self.balances[
      collateralTokens[i].currency.symbol
    ] = (await token.balance()).toBigNumber();
  }

  self.balances['DAI'] = self.daiBalance;
  self.balances['MKR'] = self.mkrBalance;
}
