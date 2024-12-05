import crypto from "crypto"

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
