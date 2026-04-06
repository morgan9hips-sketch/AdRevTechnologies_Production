import { createHmac, timingSafeEqual } from 'crypto'

type ActivationPayload = {
  email: string
  reference: string
  issuedAt: number
}

const ACTIVATION_TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 30

function encodeBase64Url(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url')
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8')
}

function signPayload(payload: string, secret: string) {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

export function createFoundingMemberActivationToken(
  payload: ActivationPayload,
  secret: string,
) {
  const encodedPayload = encodeBase64Url(JSON.stringify(payload))
  const signature = signPayload(encodedPayload, secret)
  return `${encodedPayload}.${signature}`
}

export function verifyFoundingMemberActivationToken(
  token: string,
  secret: string,
) {
  const [encodedPayload, signature] = token.split('.')

  if (!encodedPayload || !signature) {
    return null
  }

  const expectedSignature = signPayload(encodedPayload, secret)

  if (expectedSignature.length !== signature.length) {
    return null
  }

  if (
    !timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature))
  ) {
    return null
  }

  try {
    const payload = JSON.parse(
      decodeBase64Url(encodedPayload),
    ) as ActivationPayload

    if (
      !payload.email ||
      !payload.reference ||
      typeof payload.issuedAt !== 'number'
    ) {
      return null
    }

    if (Date.now() - payload.issuedAt > ACTIVATION_TOKEN_TTL_MS) {
      return null
    }

    return payload
  } catch {
    return null
  }
}
