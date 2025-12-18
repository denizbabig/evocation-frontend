// src/lib/oktaAuth.ts
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js'

const issuer = import.meta.env.VITE_OKTA_ISSUER as string
const clientId = import.meta.env.VITE_OKTA_CLIENT_ID as string
const redirectUri = import.meta.env.VITE_OKTA_REDIRECT_URI as string
const postLogoutRedirectUri = import.meta.env.VITE_OKTA_POST_LOGOUT_REDIRECT_URI as string

const scopes = String(import.meta.env.VITE_OKTA_SCOPES || 'openid,profile,email')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

if (!issuer || !clientId || !redirectUri) {
  // damit du sofort siehst, falls env fehlt
  console.warn('[okta] Missing env config', { issuer, clientId, redirectUri })
}



export const oktaAuth = new OktaAuth({
  issuer,
  clientId,
  redirectUri,
  scopes,
  pkce: true,
  tokenManager: {
  storage: 'localStorage',
  autoRenew: true,
  autoRemove: true,
},
})

export async function loginRedirect(fromUri?: string) {
  if (fromUri) oktaAuth.setOriginalUri(fromUri)
  await oktaAuth.signInWithRedirect()
}

export async function handleLoginRedirect() {
  // nur ausführen, wenn wir wirklich im Okta-Redirect sind
  if (!oktaAuth.isLoginRedirect()) {
    return '/'
  }

  await oktaAuth.handleRedirect()

  const originalUri = oktaAuth.getOriginalUri()
  oktaAuth.removeOriginalUri()

  // relative URL für vue-router
  return originalUri
    ? toRelativeUrl(originalUri, window.location.origin)
    : '/'
}

export async function logoutRedirect() {
  await oktaAuth.signOut({ postLogoutRedirectUri })
}

export async function registerRedirect(fromUri?: string) {
  if (fromUri) oktaAuth.setOriginalUri(fromUri)
  await oktaAuth.signInWithRedirect({
    // Okta Classic: öffnet direkt Sign Up
    // (Wenn du Identity Engine nutzt, funktioniert das i.d.R. auch – sonst fällt er zurück auf Sign In.)
    extraParams: { prompt: 'login' },
  })
}
