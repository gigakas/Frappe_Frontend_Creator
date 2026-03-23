<template>
  <Dialog v-model="isOpen" :options="dialogOptions">
    <template #body-content>
      <p class="text-gray-600">{{ message }}</p>
    </template>
    <template #actions>
      <div class="flex gap-2 justify-end">
        <Button variant="subtle" @click="handleCancel">{{ cancelLabel }}</Button>
        <Button :variant="confirmVariant" @click="handleConfirm">{{ confirmLabel }}</Button>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { Button, Dialog } from "frappe-ui";
import { computed, ref, watch } from "vue";

interface Props {
	modelValue: boolean;
	title?: string;
	message: string;
	confirmLabel?: string;
	cancelLabel?: string;
	variant?: "danger" | "warning" | "info";
}

const props = withDefaults(defineProps<Props>(), {
	title: "Confirm",
	confirmLabel: "Confirm",
	cancelLabel: "Cancel",
	variant: "danger",
});

const emit = defineEmits<{
	(e: "update:modelValue", value: boolean): void;
	(e: "confirm"): void;
	(e: "cancel"): void;
}>();

const isOpen = ref(props.modelValue);
watch(() => props.modelValue, (val) => { isOpen.value = val; });
watch(isOpen, (val) => { emit("update:modelValue", val); });

const dialogOptions = computed(() => ({ title: props.title, size: "sm" }));

const confirmVariant = computed(() => {
	const variants = { danger: "solid", warning: "subtle", info: "solid" };
	return variants[props.variant] as "solid" | "subtle";
});

function handleConfirm() { emit("confirm"); isOpen.value = false; }
function handleCancel() { emit("cancel"); isOpen.value = false; }
</script>
