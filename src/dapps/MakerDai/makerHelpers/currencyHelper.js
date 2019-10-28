import Maker from '@makerdao/dai';

import * as TKNS from '@makerdao/dai-plugin-mcd';

const { DAI } = Maker;

export function getMakerCurrencies() {
  const vals = { DAI, ...TKNS };
  console.log(vals); // todo remove dev item
  return vals;
}
