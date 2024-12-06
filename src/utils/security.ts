import crypto from "crypto"

interface MessageData {
  action: string
  targetId: string
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
