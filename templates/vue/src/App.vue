<template>
  <FrappeUIProvider>
    <RouterView />
  </FrappeUIProvider>
  <Dialogs />
</template>

<script setup lang="ts">
import Dialogs from "@/components/Dialogs.vue";
import { FrappeUIProvider, toast } from "frappe-ui";
import { h, onMounted } from "vue";
import Wifi from "~icons/lucide/wifi";
import WifiOff from "~icons/lucide/wifi-off";

onMounted(() => {
	window.addEventListener("online", () => {
		toast.create({ message: "You are now online", icon: h(Wifi) });
	});
	window.addEventListener("offline", () => {
		toast.create({ message: "You are now offline", icon: h(WifiOff) });
	});
});
</script>
