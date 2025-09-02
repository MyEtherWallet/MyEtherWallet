import { isAddress, toChecksumAddress } from '@/utils/addressUtils'
import NameResolver, { type CoinType } from '@enkryptcom/name-resolution'
import { createWeb3Name } from '@web3-name-sdk/core'

import { normalize } from 'viem/ens'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const enkryptType: { [key: string]: string } = {
  '1': 'ETH',
  '137': 'MATIC',
}

const ROOTSTOCK_CHAIN = '30'
const ROOTSTOCK_TEST_CHAIN = '31'

export default class ENSNameResolver {
  networkId: string
  web3Name: ReturnType<typeof createWeb3Name>
  resolver: NameResolver

  constructor(networkId: string) {
    this.networkId = networkId
    this.web3Name = createWeb3Name()
    this.resolver = new NameResolver({
      ens: {
        node: 'https://nodes.mewapi.io/rpc/eth',
      },
      sid: {
        node: {
          bnb: 'https://nodes.mewapi.io/rpc/bsc',
          arb: 'https://nodes.mewapi.io/rpc/arb',
        },
      },
    })
  }

  isValidName(name: string): boolean {
    const splitName = name.split('.')
    if (splitName.length > 1) {
      try {
        return normalize(name).indexOf('.') > 0
      } catch {
        return false
      }
    }
    return false
  }

  async resolveName(name: string): Promise<string> {
    if (!this.isValidName(name)) {
      throw new Error('Invalid name')
    }
    const normalized = normalize(name)
    let address: string | null = await this.resolver.resolveAddress(
      normalized,
      enkryptType[this.networkId] as CoinType,
    )
    if (
      this.networkId === ROOTSTOCK_CHAIN ||
      this.networkId === ROOTSTOCK_TEST_CHAIN
    ) {
      address = toChecksumAddress(address as string)
    }
    if (isAddress(address as string) && address !== ZERO_ADDRESS) {
      return address as string
    }

    return ''
  }

  async resolveAddress(address: string): Promise<object | undefined> {
    if (isAddress(address) && address !== ZERO_ADDRESS) {
      let resolvedName: string | null =
        await this.resolver.resolveReverseName(address)

      if (!resolvedName) {
        resolvedName = await this.web3Name.getDomainName({
          address: address,
          queryChainIdList: [Number(this.networkId)],
        })
      }

      return {
        name: resolvedName ? resolvedName : '',
      }
    }
    return undefined
  }
}
