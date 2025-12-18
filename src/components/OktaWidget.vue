<template>
  <div ref="el" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import OktaSignIn from '@okta/okta-signin-widget'
import '@okta/okta-signin-widget/css/okta-sign-in.min.css'
import { oktaAuth } from '@/lib/oktaAuth'

const props = withDefaults(
  defineProps<{
    flow?: 'login' | 'signup'
    // wohin nach erfolgreichem Login/Signup
    fromUri?: string
  }>(),
  {
    flow: 'login',
    fromUri: '/mapview',
  }
)

const emit = defineEmits<{
  (e: 'success'): void
  (e: 'error', err: unknown): void
}>()

const el = ref<HTMLElement | null>(null)

function getBaseUrlFromIssuer(issuer: string) {
  return issuer.replace(/\/oauth2\/.*/, '')
}

let signIn: any

function patchEnrollmentFields() {
  // First/LastName automatisch setzen + verstecken (für Signup)
  const setAndHide = (selector: string, value: string) => {
    const input = document.querySelector<HTMLInputElement>(selector)
    if (!input) return

    if (!input.value) {
      input.value = value
      input.dispatchEvent(new Event('input', { bubbles: true }))
      input.dispatchEvent(new Event('change', { bubbles: true }))
    }

    const row =
      (input.closest('.o-form-fieldset') ||
        input.closest('.o-form-input') ||
        input.closest('.o-form-field')) as HTMLElement | null

    if (row) row.style.display = 'none'
  }

  // Okta Profile Enrollment names:
  setAndHide('input[name="userProfile.firstName"]', 'Evocation')
  setAndHide('input[name="userProfile.lastName"]', 'User')
}

onMounted(async () => {
  try {
    // wichtig: damit wir nach Erfolg sauber zurücknavigieren können
    oktaAuth.setOriginalUri(props.fromUri)

    const issuer = (oktaAuth.options.issuer as string) || ''
    const baseUrl = getBaseUrlFromIssuer(issuer)

    signIn = new OktaSignIn({
      baseUrl,
      clientId: oktaAuth.options.clientId,
      redirectUri: oktaAuth.options.redirectUri,
      authClient: oktaAuth,

      authParams: {
    scopes: oktaAuth.options.scopes as string[],
    },

      // ✅ direkt "signup" starten, wenn gewünscht
      flow: props.flow,

      // fürs Widget (hilft bei manchen Tenants/Policies)
      features: {
        registration: true,
      },
    })

    // patch nach jedem Render (z.B. wenn man auf Sign up wechselt)
    signIn.on('afterRender', () => {
      if (props.flow === 'signup') patchEnrollmentFields()
    })

    const tokens = await signIn.showSignInToGetTokens({

  el: el.value!,
  scopes: oktaAuth.options.scopes as string[],
})
console.log('[widget tokens keys]', Object.keys(tokens), tokens)

    // Tokens lokal speichern
    oktaAuth.tokenManager.setTokens(tokens)

    // clean up widget
    signIn.remove()

    // Navigation im Parent (Vue Router)
    emit('success')
  } catch (e) {
    console.error('[OktaWidget] failed', e)
    emit('error', e)
  }
})

onBeforeUnmount(() => {
  try {
    signIn?.remove?.()
  } catch {}
})
</script>
