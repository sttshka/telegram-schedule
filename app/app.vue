<template>
  <UApp :toaster="toaster">
    <NuxtPage />
  </UApp>
</template>
<script setup lang="ts">
const toaster = { position: 'bottom-right' };
</script>
