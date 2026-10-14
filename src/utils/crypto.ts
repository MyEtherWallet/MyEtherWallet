const PBKDF2_ITERATIONS = 100_000
const SALT_BYTES = 16
const IV_BYTES = 12

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: new Uint8Array(salt), iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

export async function encrypt(data: string, password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES))
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES))
  const key = await deriveKey(password, salt)
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(data),
  )
  const result = new Uint8Array(SALT_BYTES + IV_BYTES + ciphertext.byteLength)
  result.set(salt, 0)
  result.set(iv, SALT_BYTES)
  result.set(new Uint8Array(ciphertext), SALT_BYTES + IV_BYTES)
  return btoa(String.fromCharCode(...result))
}

export async function decrypt(encoded: string, password: string): Promise<string> {
  const bytes = Uint8Array.from(atob(encoded), c => c.charCodeAt(0))
  const salt = bytes.slice(0, SALT_BYTES)
  const iv = bytes.slice(SALT_BYTES, SALT_BYTES + IV_BYTES)
  const ciphertext = bytes.slice(SALT_BYTES + IV_BYTES)
  const key = await deriveKey(password, salt)
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext)
  return new TextDecoder().decode(plaintext)
}
