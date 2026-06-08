<script setup>
import { cn } from '@/lib/utils'

defineProps({
  class: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  disabled: Boolean,
  modelValue: [String, Number],
  id: String,
  required: Boolean,
  autocomplete: String,
  minlength: [String, Number],
})

defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :id="id"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :required="required"
    :autocomplete="autocomplete"
    :minlength="minlength"
    :class="cn(
      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
      'placeholder:text-muted-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      $props.class
    )"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
