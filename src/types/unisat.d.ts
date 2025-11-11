// global.d.ts
export { };
declare global {
  interface Window {
    unisat?: {
      requestAccounts: () => Promise<string[]>;
      signPsbt: (psbt: string, options: { autoFinalized: boolean }) => Promise<string>;
      getPublicKey: () => Promise<string>;
      getNetwork: () => Promise<string>;
      switchNetwork: (network: string) => Promise<void>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
    }
  }
}