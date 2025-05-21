// src/components/questionnaire/QuestionContainer.vue
<template>
  <div class="bg-gray-50 p-2 rounded-lg mb-6">
    <h2 class="font-medium text-gray-900 mb-4">{{ questionText }}</h2>

    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  questionText: {
    type: String,
    required: true
  }
});
</script>