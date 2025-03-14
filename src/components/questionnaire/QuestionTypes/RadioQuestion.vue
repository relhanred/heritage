// src/components/questionnaire/QuestionTypes/RadioQuestion.vue
<template>
  <div class="space-y-3">
    <div
        v-for="option in options"
        :key="option.value"
        class="flex items-center"
    >
      <input
          type="radio"
          :id="'option-' + option.value"
          :name="name"
          :value="option.value"
          :checked="modelValue === option.value"
          @change="updateValue(option.value)"
          class="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
      />
      <label :for="'option-' + option.value" class="ml-3 block text-gray-700">
        {{ option.label }}
      </label>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: null
  },
  options: {
    type: Array,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const updateValue = (value) => {
  emit('update:modelValue', value);
};
</script>