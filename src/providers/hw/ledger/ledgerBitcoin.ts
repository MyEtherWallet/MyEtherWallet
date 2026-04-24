import type Transport from '@ledgerhq/hw-transport'
import BtcApp from '@ledgerhq/hw-app-btc'
import { serializeTransactionOutputs } from '@ledgerhq/hw-app-btc/lib-es/serializeTransaction'
import { NetworkNames } from '@enkryptcom/types'
import HDKey from 'hdkey'

import { btcSupportedPaths, type PathType } from './configs'
import { getLedgerTransport } from './transport'
import { ensureLedgerApp } from './ledgerConnect'

export interface AddressResponse {
  address: string
  publicKey: string
}

export interface BtcGetAddressRequest {
  pathIndex: string
  pathType: PathType
  confirmAddress: boolean
}

export interface BtcSignPersonalMessageRequest {
  pathIndex: string
  pathType: PathType
  message: Buffer
  type?: 'classic' | 'bip322-simple'
}

export interface BtcSignTransactionInner {
  rawTxs: string[]
  psbtTx: import('bitcoinjs-lib').Psbt
}

export interface BtcSignTransactionRequest {
  pathIndex: string
  pathType: PathType
  transaction: BtcSignTransactionInner
}

function bufferToHex(b: Buffer | Uint8Array): string {
  return Buffer.from(b).toString('hex')
}

function compressPubkey(pub: Buffer): Buffer {
  if (pub.length === 33) return pub
  if (pub.length !== 65 || pub[0] !== 0x04)
    throw new Error('ledger-bitcoin: unexpected public key format')
  const prefix = (pub[64] & 1) === 0 ? 0x02 : 0x03
  return Buffer.concat([Buffer.from([prefix]), pub.slice(1, 33)])
}

export class LedgerBitcoin {
  readonly network: NetworkNames
  readonly isSegwit: boolean
  private transport: Transport | null = null
  private HDNodes: Record<string, HDKey> = {}

  constructor(network: NetworkNames) {
    this.network = network
    this.isSegwit =
      network === NetworkNames.Bitcoin || network === NetworkNames.Litecoin
  }

  async init(): Promise<boolean> {
    this.transport = await getLedgerTransport()
    return true
  }

  async isConnected(): Promise<boolean> {
    if (!this.transport) await this.init()
    await ensureLedgerApp(this.transport!, this.network)
    return true
  }

  getSupportedPaths(): PathType[] {
    const paths = btcSupportedPaths[this.network]
    if (!paths) return []
    return paths.map(p => ({ ...p }))
  }

  async getAddress(options: BtcGetAddressRequest): Promise<AddressResponse> {
    if (!btcSupportedPaths[this.network]) {
      throw new Error('ledger-bitcoin: Invalid network name')
    }
    if (!this.transport) await this.init()
    const isHardenedLeaf = options.pathType.basePath.split('/').length - 1 === 2
    const btc = new BtcApp({ transport: this.transport! })
    const format = this.isSegwit ? 'bech32' : 'legacy'

    if (!isHardenedLeaf) {
      if (!this.HDNodes[options.pathType.basePath]) {
        const rootPub = await btc.getWalletPublicKey(options.pathType.basePath, {
          format,
        })
        const hdKey = new HDKey()
        hdKey.publicKey = compressPubkey(Buffer.from(rootPub.publicKey, 'hex'))
        hdKey.chainCode = Buffer.from(rootPub.chainCode, 'hex')
        this.HDNodes[options.pathType.basePath] = hdKey
      }
      const pubkey = this.HDNodes[options.pathType.basePath].derive(
        `m/${options.pathIndex}`,
      ).publicKey
      if (!pubkey) {
        throw new Error('ledger-bitcoin: failed to derive public key')
      }
      const hex = bufferToHex(compressPubkey(pubkey))
      return { address: hex, publicKey: hex }
    }

    const fullPath = options.pathType.path.replace('{index}', options.pathIndex)
    const res = await btc.getWalletPublicKey(fullPath, { format })
    const pubkeyHex = bufferToHex(compressPubkey(Buffer.from(res.publicKey, 'hex')))
    return { address: pubkeyHex, publicKey: pubkeyHex }
  }

  async signPersonalMessage(
    options: BtcSignPersonalMessageRequest,
  ): Promise<string> {
    if (options.type === 'bip322-simple') {
      throw new Error('ledger-bitcoin: bip322-simple signing is not supported')
    }
    if (!this.transport) await this.init()
    const btc = new BtcApp({ transport: this.transport! })
    const fullPath = options.pathType.path.replace('{index}', options.pathIndex)
    const result = await btc.signMessage(fullPath, options.message.toString('hex'))
    const v = result.v + 27 + 4
    const sigBuf = Buffer.from(
      v.toString(16).padStart(2, '0') + result.r + result.s,
      'hex',
    )
    return bufferToHex(sigBuf)
  }

  async signTransaction(options: BtcSignTransactionRequest): Promise<string> {
    if (!this.transport) await this.init()
    const btc = new BtcApp({ transport: this.transport! })
    const { rawTxs, psbtTx } = options.transaction

    const txOutputs = psbtTx.txOutputs.map(out => {
      const valLE = Buffer.alloc(8)
      valLE.writeBigInt64LE(BigInt(out.value))
      return { amount: valLE, script: Buffer.from(out.script) }
    })

    const fullPath = options.pathType.path.replace('{index}', options.pathIndex)
    const additionals: string[] = this.isSegwit ? ['bech32'] : []

    const txArg = {
      inputs: rawTxs.map(
        (rTx, idx) =>
          [
            btc.splitTransaction(rTx.replace(/^0x/, ''), true),
            psbtTx.txInputs[idx].index,
            psbtTx.data.inputs[idx].witnessScript
              ? psbtTx.data.inputs[idx].witnessScript!.toString('hex')
              : undefined,
            undefined,
          ] as [
            ReturnType<typeof btc.splitTransaction>,
            number,
            string | undefined,
            number | undefined,
          ],
      ),
      associatedKeysets: rawTxs.map(() => fullPath),
      outputScriptHex: serializeTransactionOutputs({
        outputs: txOutputs,
      } as Parameters<typeof serializeTransactionOutputs>[0]).toString('hex'),
      segwit: this.isSegwit,
      additionals,
    }

    return btc.createPaymentTransaction(
      txArg as Parameters<typeof btc.createPaymentTransaction>[0],
    )
  }

  async close(): Promise<void> {
    // Transport is managed as a singleton.
  }

  static getSupportedNetworks(): NetworkNames[] {
    return Object.keys(btcSupportedPaths) as NetworkNames[]
  }
}
