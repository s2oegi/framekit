/** Local-only credential hashing (Web Crypto). Ready to swap for server auth later. */

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function randomSalt(bytes = 16) {
  const arr = new Uint8Array(bytes)
  crypto.getRandomValues(arr)
  return toHex(arr.buffer)
}

export async function hashSecret(secret: string, salt: string) {
  const data = new TextEncoder().encode(`${salt}:${secret}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return toHex(digest)
}

export async function verifySecret(
  secret: string,
  salt: string,
  expectedHash: string,
) {
  const actual = await hashSecret(secret, salt)
  return actual === expectedHash
}
