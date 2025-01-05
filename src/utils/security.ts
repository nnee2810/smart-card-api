import crypto from "crypto"
import * as forge from "node-forge"

interface MessageData {
  action: string
  targetId: string
}

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

export function verifyMessage(message: string, data: MessageData) {
  const messageParts = message.split("|")
  return !(
    messageParts.length !== 3 ||
    messageParts[0] !== data.action ||
    messageParts[1] !== data.targetId ||
    isNaN(+messageParts[2]) ||
    +messageParts[2] > new Date().getTime() - 1000
  )
}

export function verifySignature(
  publicKey: string,
  signature: string,
  message: string,
) {
  const verify = crypto.createVerify("SHA256")
  verify.update(message)
  verify.end()
  return verify.verify(publicKey, signature)
}
