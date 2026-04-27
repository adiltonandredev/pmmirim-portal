import { prisma } from "@/lib/prisma"

type Action = "login" | "login-ip" | "forgot-password" | "reset-password"

const CONFIG: Record<Action, { max: number; windowMs: number }> = {
  "login":           { max: 5,  windowMs: 15 * 60 * 1000 },
  "login-ip":        { max: 20, windowMs: 15 * 60 * 1000 },
  "forgot-password": { max: 3,  windowMs: 15 * 60 * 1000 },
  "reset-password":  { max: 10, windowMs: 60 * 60 * 1000 },
}

export async function checkRateLimit(
  action: Action,
  identifier: string
): Promise<{ allowed: boolean; remainingAttempts: number; resetTime?: number }> {
  const key = `${action}:${identifier}`
  const { max, windowMs } = CONFIG[action]
  const now = new Date()
  const newResetAt = new Date(Date.now() + windowMs)

  const record = await prisma.rateLimitAttempt.findUnique({
    where: { identifier: key },
  })

  if (!record || record.resetAt < now) {
    await prisma.rateLimitAttempt.upsert({
      where: { identifier: key },
      create: { identifier: key, attempts: 1, resetAt: newResetAt },
      update: { attempts: 1, resetAt: newResetAt },
    })
    return { allowed: true, remainingAttempts: max - 1 }
  }

  if (record.attempts >= max) {
    return { allowed: false, remainingAttempts: 0, resetTime: record.resetAt.getTime() }
  }

  await prisma.rateLimitAttempt.update({
    where: { identifier: key },
    data: { attempts: { increment: 1 } },
  })

  return { allowed: true, remainingAttempts: max - record.attempts - 1 }
}

export async function resetRateLimit(action: Action, identifier: string): Promise<void> {
  await prisma.rateLimitAttempt.deleteMany({
    where: { identifier: `${action}:${identifier}` },
  })
}
