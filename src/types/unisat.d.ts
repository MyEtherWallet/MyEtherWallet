// global.d.ts
export {}
interface UnisatType {
  requestAccounts: () => Promise<string[]>
  signPsbt: (
    psbt: string,
    options: { autoFinalized: boolean },
  ) => Promise<string>
  getPublicKey: () => Promise<string>
  getNetwork: () => Promise<string>
  switchNetwork: (network: string) => Promise<void>
  on: (event: string, handler: (...args: unknown[]) => void) => void
  signMessage: (message: string, type?: string) => Promise<string>
}
declare global {
  interface Window {
    unisat?: UnisatType
    enkrypt?: {
      providers: { bitcoin?: UnisatType }
    }
  }
}
