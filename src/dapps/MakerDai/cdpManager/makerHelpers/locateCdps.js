import { toChecksumAddress } from '@/helpers/addressUtils';

async function locateCdps(self, _cdpService) {
  self.cdpsWithoutProxy = [];
  const cdpsWithoutProxy = await locateCdpsWithoutProxy(self, _cdpService);
  self.cdps = [];
  const cdps = await locateCdpsProxy(self, _cdpService);

  self.allCdpIds = [...cdpsWithoutProxy, ...cdps];
  console.log(self.allCdpIds); // todo remove dev item
  return { withProxy: cdps, withoutProxy: cdpsWithoutProxy };
}

async function getMcdCdp() {}

async function locateCdpsWithoutProxy(self, _cdpService) {
  const directCdps = await _cdpService.getCdpIds(self.account.address);
  const directCdpsCheckSum = await _cdpService.getCdpIds(
    toChecksumAddress(self.account.address)
  );
  return directCdps.concat(directCdpsCheckSum);
}


async function locateCdpsProxy(self, _cdpService) {
  self.proxyAddress = await self.getProxy();
  return await _cdpService.getCdpIds(self.proxyAddress);
}

export {
  locateCdps,
  getMcdCdp,
  locateCdpsWithoutProxy,
  locateCdpsProxy
};