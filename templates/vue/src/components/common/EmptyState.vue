<template>
  <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div v-if="$slots.icon" class="mb-4 text-gray-400">
      <slot name="icon" />
    </div>
    <div v-else class="mb-4">
      <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
    </div>
    <h3 class="text-lg font-medium text-gray-900 mb-1">{{ title }}</h3>
    <p v-if="description" class="text-sm text-gray-500 max-w-sm mb-4">{{ description }}</p>
    <div v-if="$slots.action" class="mt-2">
      <slot name="action" />
    </div>
    <Button v-else-if="actionLabel" :variant="actionVariant" @click="$emit('action')">
      {{ actionLabel }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from "frappe-ui";

interface Props {
	title: string;
	description?: string;
	actionLabel?: string;
	actionVariant?: "solid" | "subtle" | "outline" | "ghost";
}

withDefaults(defineProps<Props>(), {
	description: "",
	actionLabel: "",
	actionVariant: "solid",
});

defineEmits<{ (e: "action"): void }>();
</script>
