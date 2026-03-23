<template>
  <Dialog
    v-for="dialog in dialogs"
    :key="dialog.key"
    :options="dialog"
    v-model="dialog.show"
  >
    <template #body-content>
      <p v-if="dialog.message" class="text-p-base text-ink-gray-7">
        {{ dialog.message }}
      </p>
      <div v-if="dialog.html" v-html="dialog.html" />
      <ErrorMessage v-if="dialog.error" class="mt-2" :message="dialog.error" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, ErrorMessage } from "frappe-ui";
import { dialogs } from "./dialogState";
</script>
