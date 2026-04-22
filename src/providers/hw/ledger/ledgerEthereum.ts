import type Transport from '@ledgerhq/hw-transport'
import EthApp from '@ledgerhq/hw-app-eth'
import ledgerService from '@ledgerhq/hw-app-eth/lib-es/services/ledger/index'
import { NetworkNames } from '@enkryptcom/types'
import { toRpcSig, publicToAddress } from '@ethereumjs/util'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import HDKey from 'hdkey'
import { TypedDataUtils, SignTypedDataVersion } from '@metamask/eth-sig-util'

import { evmSupportedPaths, type PathType } from './configs'
import { getLedgerTransport } from './transport'
import { ensureLedgerApp } from './ledgerConnect'

export interface AddressResponse {
  address: string
  publicKey: string
}

export interface SignTypedMessageRequest {
  pathIndex: string
  pathType: PathType
  domain: Record<string, unknown>
  message: Record<string, unknown>
  types: Record<string, unknown>
  primaryType: string
  version: 'V3' | 'V4'
}

export interface SignPersonalMessageRequest {
  pathIndex: string
  pathType: PathType
  message: Buffer
}

export interface SignTransactionRequest {
  pathIndex: string
  pathType: PathType
  transaction: FeeMarketEIP1559Transaction
}

export interface GetAddressRequest {
  pathIndex: string
  pathType: PathType
  confirmAddress: boolean
}

function bufferToHex(b: Buffer | Uint8Array, prefix = false): string {
  const hex = Buffer.from(b).toString('hex')
  return prefix ? `0x${hex}` : hex
}

function hexToBuffer(h: string): Buffer {
  return Buffer.from(h.startsWith('0x') ? h.slice(2) : h, 'hex')
}

export class LedgerEthereum {
  readonly network: NetworkNames
  private transport: Transport | null = null
  private HDNodes: Record<string, HDKey> = {}

  constructor(network: NetworkNames) {
    this.network = network
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
    const paths = evmSupportedPaths[this.network]
    if (!paths) return []
    return paths.map(p => ({ ...p }))
  }

  async getAddress(options: GetAddressRequest): Promise<AddressResponse> {
    if (!evmSupportedPaths[this.network]) {
      throw new Error('ledger-ethereum: Invalid network name')
    }
    if (!this.transport) await this.init()
    const isHardenedLeaf = options.pathType.basePath.split('/').length - 1 === 2
    const eth = new EthApp(this.transport!)

    if (!isHardenedLeaf) {
      if (!this.HDNodes[options.pathType.basePath]) {
        const rootPub = await eth.getAddress(
          options.pathType.basePath,
          options.confirmAddress,
          true,
        )
        const hdKey = new HDKey()
        hdKey.publicKey = Buffer.from(rootPub.publicKey, 'hex')
        hdKey.chainCode = Buffer.from(rootPub.chainCode!, 'hex')
        this.HDNodes[options.pathType.basePath] = hdKey
      }
      const pubkey = this.HDNodes[options.pathType.basePath].derive(
        `m/${options.pathIndex}`,
      ).publicKey
      if (!pubkey) {
        throw new Error('ledger-ethereum: failed to derive public key')
      }
      return {
        address: bufferToHex(publicToAddress(pubkey, true), true),
        publicKey: bufferToHex(pubkey, true),
      }
    }

    const fullPath = options.pathType.path.replace('{index}', options.pathIndex)
    const res = await eth.getAddress(fullPath, options.confirmAddress)
    return {
      address: res.address.toLowerCase(),
      publicKey: `0x${res.publicKey}`,
    }
  }

  async signPersonalMessage(
    options: SignPersonalMessageRequest,
  ): Promise<string> {
    if (!this.transport) await this.init()
    const eth = new EthApp(this.transport!)
    const fullPath = options.pathType.path.replace('{index}', options.pathIndex)
    const result = await eth.signPersonalMessage(
      fullPath,
      options.message.toString('hex'),
    )
    return `0x${result.r}${result.s}${result.v.toString(16)}`
  }

  async signTransaction(options: SignTransactionRequest): Promise<string> {
    if (!this.transport) await this.init()
    const eth = new EthApp(this.transport!)
    const fullPath = options.pathType.path.replace('{index}', options.pathIndex)

    const raw = options.transaction.getMessageToSign()
    const msgToSign = bufferToHex(raw, false)
    const resolution = await ledgerService.resolveTransaction(
      msgToSign,
      {},
      {},
    )
    const result = await eth.signTransaction(fullPath, msgToSign, resolution)

    return toRpcSig(
      BigInt(`0x${result.v}`),
      hexToBuffer(result.r),
      hexToBuffer(result.s),
    )
  }

  async signTypedMessage(request: SignTypedMessageRequest): Promise<string> {
    if (!this.transport) await this.init()
    const eth = new EthApp(this.transport!)
    const fullPath = request.pathType.path.replace('{index}', request.pathIndex)

    try {
      const result = await eth.signEIP712Message(
        fullPath,
        request as unknown as Parameters<typeof eth.signEIP712Message>[1],
      )
      const v = BigInt(result.v - 27)
      return toRpcSig(v, hexToBuffer(result.r), hexToBuffer(result.s))
    } catch {
      const version =
        request.version === 'V3'
          ? SignTypedDataVersion.V3
          : SignTypedDataVersion.V4
      const typedData = {
        types: request.types as Parameters<typeof TypedDataUtils.hashStruct>[2],
        primaryType: request.primaryType,
        domain: request.domain,
        message: request.message,
      }
      const messageHash = TypedDataUtils.hashStruct(
        typedData.primaryType,
        typedData.message,
        typedData.types,
        version,
      )
      const domainHash = TypedDataUtils.hashStruct(
        'EIP712Domain',
        typedData.domain,
        typedData.types,
        version,
      )
      const result = await eth.signEIP712HashedMessage(
        fullPath,
        bufferToHex(Uint8Array.from(domainHash), true),
        bufferToHex(Uint8Array.from(messageHash), true),
      )
      const v = BigInt(result.v - 27)
      return toRpcSig(v, hexToBuffer(result.r), hexToBuffer(result.s))
    }
  }

  async close(): Promise<void> {
    // Transport is managed as a singleton; individual providers do not close it.
  }

  static getSupportedNetworks(): NetworkNames[] {
    return Object.keys(evmSupportedPaths) as NetworkNames[]
  }
}
