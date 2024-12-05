import crypto from "crypto"

interface MessageData {
  action: string
  sourceId: string
  targetId: string
}

export function verifyMessage(message: string, data: MessageData) {
  const messageParts = message.split("|")
  return !(
    messageParts.length !== 4 ||
    messageParts[0] !== data.action ||
    messageParts[1] !== data.sourceId ||
    messageParts[2] !== data.targetId ||
    isNaN(+messageParts[3]) ||
    +messageParts[3] > new Date().getTime() - 5 * 1000
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
