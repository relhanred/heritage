// src/components/questionnaire/QuestionTypes/ChildrenDistributionQuestion.vue
<template>
  <div class="space-y-4">
    <div>
      <label :for="labelPrefix + '-sons-count'" class="block text-sm font-medium text-gray-700 mb-1">
        Nombre de {{ sonsLabel }}
      </label>
      <input
          type="number"
          :id="labelPrefix + '-sons-count'"
          :value="modelValue.sons"
          @input="updateSons($event.target.value)"
          min="0"
          class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          placeholder="0"
      />
    </div>
    <div>
      <label :for="labelPrefix + '-daughters-count'" class="block text-sm font-medium text-gray-700 mb-1">
        Nombre de {{ daughtersLabel }}
      </label>
      <input
          type="number"
          :id="labelPrefix + '-daughters-count'"
          :value="modelValue.daughters"
          @input="updateDaughters($event.target.value)"
          min="0"
          class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          placeholder="0"
      />
    </div>
    <div v-if="validationError" class="mt-2 text-sm text-red-600">
      {{ validationError }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ sons: '', daughters: '' })
  },
  labelPrefix: {
    type: String,
    default: 'children'
  },
  sonsKey: {
    type: String,
    default: 'sons'
  },
  daughtersKey: {
    type: String,
    default: 'daughters'
  },
  sonsLabel: {
    type: String,
    default: 'fils'
  },
  daughtersLabel: {
    type: String,
    default: 'filles'
  }
});

const emit = defineEmits(['update:modelValue', 'update:validationError']);

const validationError = ref('');

const updateSons = (value) => {
  emit('update:modelValue', {
    ...props.modelValue,
    sons: value
  });
  validateInput(value, props.modelValue.daughters);
};

const updateDaughters = (value) => {
  emit('update:modelValue', {
    ...props.modelValue,
    daughters: value
  });
  validateInput(props.modelValue.sons, value);
};

// Watch for changes in modelValue to validate
watch(() => props.modelValue, (newValue) => {
  validateInput(newValue.sons, newValue.daughters);
}, { deep: true });

const validateInput = (sons, daughters) => {
  validationError.value = '';

  const sonCount = parseInt(sons) || 0;
  const daughterCount = parseInt(daughters) || 0;

  // Vérifier que les valeurs sont valides (nombres positifs)
  if (isNaN(sonCount) || isNaN(daughterCount) || sonCount < 0 || daughterCount < 0) {
    validationError.value = 'Veuillez entrer des nombres valides.';
    emit('update:validationError', validationError.value);
    return false;
  }

  // Vérifier qu'il y a au moins un enfant au total
  if (sonCount + daughterCount === 0) {
    validationError.value = `Veuillez indiquer au moins un ${props.labelPrefix === 'children' ? 'enfant' : props.labelPrefix}.`;
    emit('update:validationError', validationError.value);
    return false;
  }

  emit('update:validationError', '');
  return true;
};
</script>