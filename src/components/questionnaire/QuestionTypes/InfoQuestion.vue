<template>
  <div class="text-center py-2">
    <p class="text-gray-600">{{ text }}</p>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    required: true
  }
});
</script>