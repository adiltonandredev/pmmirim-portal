// eslint-disable-next-line @typescript-eslint/no-require-imports
const otplib = require("otplib") as {
  generateSecret: () => string
  generateURI: (opts: { label: string; issuer: string; secret: string; type: string }) => string
  verifySync: (opts: { secret: string; token: string }) => { valid: boolean }
}

export function generateTOTPSecret(): string {
  return otplib.generateSecret()
}

export function generateTOTPUri(secret: string, email: string): string {
  return otplib.generateURI({
    label: email,
    issuer: "Portal PMM Irim",
    secret,
    type: "totp",
  })
}

export function verifyTOTP(code: string, secret: string): boolean {
  try {
    const result = otplib.verifySync({ secret, token: code })
    return result.valid
  } catch {
    return false
  }
}
