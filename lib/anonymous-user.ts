// Simple session-based anonymous user ID generation
// This creates a UUID that persists for the browser session

export function getAnonymousUserId(): string {
  // Check if we already have an anonymous user ID in sessionStorage
  let anonymousId = null
  
  if (typeof window !== 'undefined') {
    anonymousId = sessionStorage.getItem('anonymous_user_id')
    
    if (!anonymousId) {
      // Generate a simple UUID-like string for anonymous users
      anonymousId = 'anon-' + crypto.randomUUID()
      sessionStorage.setItem('anonymous_user_id', anonymousId)
    }
  }
  
  return anonymousId || 'anon-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
}