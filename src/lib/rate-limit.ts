type RateLimitStore = {
  [key: string]: { count: number; resetTime: number }
}

const store: RateLimitStore = {}

const RATE_LIMIT_WINDOW = 15 * 60 * 1000
const MAX_ATTEMPTS = 5

export function checkRateLimit(identifier: string): { allowed: boolean; remainingAttempts: number; resetTime?: number } {
  const now = Date.now()
  const record = store[identifier]

  if (!record || now > record.resetTime) {
    store[identifier] = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    }
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 }
  }

  if (record.count >= MAX_ATTEMPTS) {
    return { 
      allowed: false, 
      remainingAttempts: 0,
      resetTime: record.resetTime 
    }
  }

  record.count++
  return { 
    allowed: true, 
    remainingAttempts: MAX_ATTEMPTS - record.count 
  }
}

export function resetRateLimit(identifier: string): void {
  delete store[identifier]
}

setInterval(() => {
  const now = Date.now()
  Object.keys(store).forEach(key => {
    if (now > store[key].resetTime) {
      delete store[key]
    }
  })
}, 60 * 1000)
