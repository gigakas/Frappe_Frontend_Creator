<template>
  <div
    class="flex items-center justify-center rounded-full text-white font-medium overflow-hidden"
    :class="sizeClasses"
    :style="{ backgroundColor: avatarColor }"
  >
    <img
      v-if="image && !imageError"
      :src="image"
      :alt="name"
      class="w-full h-full object-cover"
      @error="imageError = true"
    />
    <span v-else>{{ initials }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

interface Props {
	name?: string;
	image?: string;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const props = withDefaults(defineProps<Props>(), {
	name: "",
	image: "",
	size: "md",
});

const imageError = ref(false);

const initials = computed(() => {
	if (!props.name) return "?";
	const parts = props.name.trim().split(" ");
	if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
	return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
});

const avatarColor = computed(() => {
	if (!props.name) return "#6b7280";
	const colors = [
		"#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6",
		"#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16",
	];
	let hash = 0;
	for (let i = 0; i < props.name.length; i++) {
		hash = props.name.charCodeAt(i) + ((hash << 5) - hash);
	}
	return colors[Math.abs(hash) % colors.length];
});

const sizeClasses = computed(() => {
	const sizes = { xs: "w-6 h-6 text-xs", sm: "w-8 h-8 text-sm", md: "w-10 h-10 text-base", lg: "w-12 h-12 text-lg", xl: "w-16 h-16 text-xl" };
	return sizes[props.size];
});
</script>
