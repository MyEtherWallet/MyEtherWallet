import {
  startAuthentication,
  startRegistration,
  type AuthenticationResponseJSON,
  type PublicKeyCredentialCreationOptionsJSON,
  type PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/browser'
import type { MfaSubmitArgs } from '@privy-io/js-sdk-core'
import { privy } from './client'
import type { PrivyUser } from './user'

/**
 * Passkeys of a Privy account. A passkey here is wallet MFA: once enrolled,
 * Privy asks for it before the wallet signs or is exported. It is not a way
 * to log in.
 *
 * Privy's SDK leaves the browser's passkey prompt to the app and speaks
 * snake_case, where the browser speaks camelCase; this module is the
 * translation between the two. Reach it through a dynamic `import()` only,
 * like every module that loads the Privy client.
 */

type RegistrationOptions = Awaited<
  ReturnType<typeof privy.auth.passkey.generateRegistrationOptions>
>['options']
type AssertionOptions = Awaited<
  ReturnType<typeof privy.mfa.passkey.generateAuthenticationOptions>
>['options']
type CredentialDescriptor = NonNullable<
  AssertionOptions['allow_credentials']
>[number]

/** A passkey proof in the shape Privy's MFA check takes. */
export type PasskeyProof = Exclude<MfaSubmitArgs['mfaCode'], string>

/** The user dismissed the browser's passkey prompt, or left it unanswered. */
export class PasskeyCancelledError extends Error {
  constructor() {
    super('The passkey prompt was dismissed')
    this.name = 'PasskeyCancelledError'
  }
}

/** How a browser names the error of a prompt the user did not complete. */
const DISMISSED = new Set(['NotAllowedError', 'AbortError'])

/** Run a browser passkey prompt, telling a dismissal apart from a failure. */
const prompted = async <T>(prompt: () => Promise<T>): Promise<T> => {
  try {
    return await prompt()
  } catch (error) {
    if (error instanceof Error && DISMISSED.has(error.name)) {
      throw new PasskeyCancelledError()
    }
    throw error
  }
}

const toDescriptor = ({ id, type, transports }: CredentialDescriptor) => ({
  id,
  type,
  transports,
})

// Privy types the WebAuthn enumerations (attestation, user verification,
// transports…) as plain strings; the browser's own types are unions and the
// browser checks the values. Hence the one assertion in each converter.
const toCreationOptions = (
  options: RegistrationOptions,
): PublicKeyCredentialCreationOptionsJSON =>
  ({
    challenge: options.challenge,
    rp: options.rp,
    user: {
      id: options.user.id,
      name: options.user.name,
      displayName: options.user.display_name,
    },
    pubKeyCredParams: options.pub_key_cred_params,
    timeout: options.timeout,
    attestation: options.attestation,
    authenticatorSelection: options.authenticator_selection && {
      authenticatorAttachment:
        options.authenticator_selection.authenticator_attachment,
      requireResidentKey: options.authenticator_selection.require_resident_key,
      residentKey: options.authenticator_selection.resident_key,
      userVerification: options.authenticator_selection.user_verification,
    },
    excludeCredentials: options.exclude_credentials?.map(toDescriptor),
    extensions: options.extensions && {
      appid: options.extensions.app_id,
      credProps: options.extensions.cred_props ? true : undefined,
      hmacCreateSecret: options.extensions.hmac_create_secret,
    },
  }) as PublicKeyCredentialCreationOptionsJSON

const toRequestOptions = (
  options: AssertionOptions,
): PublicKeyCredentialRequestOptionsJSON =>
  ({
    challenge: options.challenge,
    rpId: options.rp_id,
    timeout: options.timeout,
    userVerification: options.user_verification,
    allowCredentials: options.allow_credentials?.map(toDescriptor),
    extensions: options.extensions && {
      appid: options.extensions.app_id,
      credProps: options.extensions.cred_props,
      hmacCreateSecret: options.extensions.hmac_create_secret,
    },
  }) as PublicKeyCredentialRequestOptionsJSON

/** The browser's proof as Privy takes it: the SDK's own (private) conversion. */
const toProof = (assertion: AuthenticationResponseJSON): PasskeyProof => ({
  type: assertion.type,
  id: assertion.id,
  raw_id: assertion.rawId,
  response: {
    signature: assertion.response.signature,
    client_data_json: assertion.response.clientDataJSON,
    authenticator_data: assertion.response.authenticatorData,
    user_handle: assertion.response.userHandle || undefined,
  },
  authenticator_attachment: assertion.authenticatorAttachment || undefined,
  client_extension_results: {
    app_id: assertion.clientExtensionResults.appid || undefined,
    cred_props: assertion.clientExtensionResults.credProps || undefined,
    hmac_create_secret:
      assertion.clientExtensionResults.hmacCreateSecret || undefined,
  },
})

/**
 * Have the user make a passkey on this device and link it to their Privy
 * account. A linked passkey protects nothing until it is enrolled.
 *
 * @returns the user, who now has the passkey among their linked accounts
 * @throws {PasskeyCancelledError} when the user dismisses the prompt
 */
export const linkPasskey = async (): Promise<PrivyUser> => {
  const { options } = await privy.auth.passkey.generateRegistrationOptions()
  const registration = await prompted(() =>
    startRegistration({ optionsJSON: toCreationOptions(options) }),
  )
  const { user } = await privy.auth.passkey.linkWithPasskey(registration)
  return user
}

/**
 * Make these passkeys the check Privy asks for before the wallet is used.
 * The list replaces the one before it, so pass every passkey that counts.
 */
export const enrollPasskeys = async (
  credentialIds: string[],
): Promise<void> => {
  await privy.mfa.submitEnrollMfa({ method: 'passkey', credentialIds })
}

/** Remove a passkey from the account and from the check. Privy asks for a passkey first. */
export const unlinkPasskey = (credentialId: string): Promise<void> =>
  privy.mfa.unlinkPasskey({ credentialId, removeAsMfa: true })

/**
 * Have the user prove one of their passkeys, for Privy's check.
 *
 * @throws {PasskeyCancelledError} when the user dismisses the prompt
 */
export const passkeyAssertion = async (): Promise<PasskeyProof> => {
  const { options } = await privy.mfa.passkey.generateAuthenticationOptions({})
  const assertion = await prompted(() =>
    startAuthentication({ optionsJSON: toRequestOptions(options) }),
  )
  return toProof(assertion)
}
