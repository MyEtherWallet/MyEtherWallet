interface TokenToHydrate {
  address: string
  price?: number
}

export interface TokenBalanceSource {
  address: string
  balance: string
  price?: number
}

interface HydrateTokenBalancesOptions {
  balanceSources: readonly TokenBalanceSource[]
  mainTokenAddress: string
  nativeBalance?: string
  nativePrice?: number
  hydrate?: boolean
  freeze?: boolean
}

type HydratedToken<T> = T & {
  balance: string
  price: number | undefined
}

export function hydrateTokenBalances<T extends TokenToHydrate>(
  tokens: readonly T[],
  options: HydrateTokenBalancesOptions,
): HydratedToken<T>[] {
  const {
    balanceSources,
    mainTokenAddress,
    nativeBalance,
    nativePrice = 0,
    hydrate = true,
    freeze = false,
  } = options
  const balancesByAddress = new Map(
    balanceSources.map(source => [source.address.toLowerCase(), source]),
  )

  return tokens.map(token => {
    let balance = '0'
    let price = token.price

    if (hydrate) {
      const address = token.address.toLowerCase()
      if (
        address === mainTokenAddress.toLowerCase() &&
        nativeBalance !== undefined
      ) {
        balance = nativeBalance
        price = price || nativePrice || 0
      } else {
        const source = balancesByAddress.get(address)
        if (source) {
          balance = source.balance
          price = price || source.price || 0
        }
      }
    }

    const hydrated = { ...token, balance, price } as HydratedToken<T>
    return freeze ? Object.freeze(hydrated) : hydrated
  })
}
