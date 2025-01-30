import { Hardfork, Common } from '@ethereumjs/common'

export const commonGenerator = (
  chainId: bigint,
  defaultHardfork: Hardfork.London | Hardfork.Berlin,
) => {
  return Common.custom({
    chainId: chainId,
    defaultHardfork,
  })
}
