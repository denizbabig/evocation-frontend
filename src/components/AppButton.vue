<template>
  <component
    :is="tag"
    v-bind="bindProps"
    class="group relative inline-flex items-center justify-center overflow-hidden rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
    :class="[
      variantClasses[variant],
      sizeClasses[size],
      disabled ? 'cursor-not-allowed opacity-70 pointer-events-none' : 'cursor-pointer',
    ]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'

interface Props {
  to?: RouteLocationRaw
  href?: string
  variant?: 'primary' | 'secondary' | 'nav'
  size?: 'lg' | 'md' | 'sm'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  type: 'button',
})

const tag = computed(() => {
  if (props.to) return RouterLink
  if (props.href) return 'a'
  return 'button'
})

const bindProps = computed(() => {
  if (props.to) return { to: props.to }
  if (props.href) return { href: props.href }
  return { type: props.type }
})

const variantClasses: Record<NonNullable<Props['variant']>, string> = {
  primary:
    'bg-white text-[#5a2fa3] border-2 border-black/40 shadow-lg shadow-purple-900/30 hover:scale-105 hover:shadow-[0_0_50px_-10px_rgba(255,255,255,0.6)]',
  secondary:
    'border-2 border-white/30 bg-white/5 text-white backdrop-blur-md hover:border-white hover:bg-white/10 hover:scale-105',
  nav:
    'bg-white text-[#5a2fa3] shadow-lg shadow-purple-900/30 hover:scale-105 hover:shadow-[0_0_40px_-12px_rgba(255,255,255,0.8)]',
}

const sizeClasses: Record<NonNullable<Props['size']>, string> = {
  lg: 'px-10 py-3 min-w-[280px] min-h-[56px] text-xl font-bold',
  md: 'px-8 py-3 text-base font-semibold',
  sm: 'px-6 py-2 text-sm font-semibold',
}
</script>
