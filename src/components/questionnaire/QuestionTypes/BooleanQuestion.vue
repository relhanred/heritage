// src/components/questionnaire/QuestionTypes/BooleanQuestion.vue
<template>
  <div class="space-y-3">
    <div class="flex items-center">
      <input
          type="radio"
          :id="'answer-yes'"
          name="boolean-answer"
          :value="true"
          :checked="modelValue === true"
          @change="updateValue(true)"
          class="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
      />
      <label for="answer-yes" class="ml-3 block text-gray-700">
        {{ trueLabel }}
      </label>
    </div>
    <div class="flex items-center">
      <input
          type="radio"
          :id="'answer-no'"
          name="boolean-answer"
          :value="false"
          :checked="modelValue === false"
          @change="updateValue(false)"
          class="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
      />
      <label for="answer-no" class="ml-3 block text-gray-700">
        {{ falseLabel }}
      </label>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: null
  },
  options: {
    type: Object,
    default: () => ({ true: 'Oui', false: 'Non' })
  }
});

const emit = defineEmits(['update:modelValue']);

const updateValue = (value) => {
  emit('update:modelValue', value);
};

const trueLabel = computed(() => props.options.true || 'Oui');
const falseLabel = computed(() => props.options.false || 'Non');
</script>