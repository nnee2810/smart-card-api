import * as crypto from "crypto"
import * as forge from "node-forge"

export function createPublicKey(value: Buffer<ArrayBufferLike>) {
  const exponentLength = value.readUint16BE(0)
  const exponent = value.subarray(2, 2 + exponentLength)
  const modulusLength = value.readUInt16BE(2 + exponentLength)
  const modulus = value.subarray(
    4 + exponentLength,
    4 + exponentLength + modulusLength,
  )

  const publicKey = forge.pki.setRsaPublicKey(
    new forge.jsbn.BigInteger(modulus.toString("hex"), 16),
    new forge.jsbn.BigInteger(exponent.toString("hex"), 16),
  )
  return forge.pki.publicKeyToPem(publicKey)
}

export function verifySignature(
  publicKey: string,
  signature: number[],
  data: number[],
) {
  return crypto.verify(
    "sha1",
    Buffer.from(data),
    publicKey,
    Buffer.from(signature),
  )
}

export function encodeString(value: string) {
  const encoder = new TextEncoder()
  return Array.from(encoder.encode(value))
}
