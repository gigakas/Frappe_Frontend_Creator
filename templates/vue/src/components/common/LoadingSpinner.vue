<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <svg
      class="animate-spin"
      :class="[sizeClass, colorClass]"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <span v-if="text" class="ml-2" :class="textClass">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	color?: "primary" | "gray" | "white";
	text?: string;
	fullPage?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	size: "md",
	color: "primary",
	text: "",
	fullPage: false,
});

const sizeClass = computed(() => {
	const sizes = { xs: "w-4 h-4", sm: "w-5 h-5", md: "w-6 h-6", lg: "w-8 h-8", xl: "w-12 h-12" };
	return sizes[props.size];
});

const colorClass = computed(() => {
	const colors = { primary: "text-blue-600", gray: "text-gray-400", white: "text-white" };
	return colors[props.color];
});

const textClass = computed(() => {
	const sizes = { xs: "text-xs", sm: "text-sm", md: "text-base", lg: "text-lg", xl: "text-xl" };
	return [sizes[props.size], colorClass.value];
});

const containerClass = computed(() => props.fullPage ? "fixed inset-0 bg-white/80 z-50" : "");
</script>
