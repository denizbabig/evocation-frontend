<template>
  <div ref="el" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import OktaSignIn from '@okta/okta-signin-widget'
import '@okta/okta-signin-widget/css/okta-sign-in.min.css'
import { oktaAuth } from '@/lib/oktaAuth'

const props = withDefaults(defineProps<{
  flow?: 'login' | 'signup'
  fromUri?: string
}>(), {
  flow: 'login',
  fromUri: '/mapview',
})

const emit = defineEmits<{
  (e: 'success'): void
  (e: 'error', err: unknown): void
}>()

const el = ref<HTMLElement | null>(null)

let signIn: any

function getBaseUrlFromIssuer(issuer: string) {
  return issuer.replace(/\/oauth2\/.*/, '')
}

function patchEnrollmentFields() {
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

  setAndHide('input[name="userProfile.firstName"]', 'Evocation')
  setAndHide('input[name="userProfile.lastName"]', 'User')
}

onMounted(async () => {
  try {
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
      flow: props.flow,
      features: {
        registration: true,
      },
    })

    signIn.on('afterRender', () => {
      if (props.flow === 'signup') patchEnrollmentFields()
    })

    const tokens = await signIn.showSignInToGetTokens({
      el: el.value!,
      scopes: oktaAuth.options.scopes as string[],
    })

    oktaAuth.tokenManager.setTokens(tokens)

    signIn.remove()
    emit('success')
  } catch (e) {
    emit('error', e)
  }
})

onBeforeUnmount(() => {
  try {
    signIn?.remove?.()
  } catch {}
})
</script>
