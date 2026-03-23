<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center px-4">
      <h1 class="text-9xl font-bold text-gray-200">404</h1>
      <h2 class="text-2xl font-semibold text-gray-900 mt-4">Page Not Found</h2>
      <p class="text-gray-600 mt-2 mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <RouterLink to="/">
        <Button variant="solid">Go to Home</Button>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "frappe-ui";
</script>
