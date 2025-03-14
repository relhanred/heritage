// Modification du ChildrenDistributionQuestion.vue pour mieux gérer les valeurs

<template>
  <div class="space-y-4">
    <div>
      <label :for="labelPrefix + '-sons-count'" class="block text-sm font-medium text-gray-700 mb-1">
        Nombre de {{ sonsLabel }}
      </label>
      <input
          type="number"
          :id="labelPrefix + '-sons-count'"
          :value="modelValue[sonsKey]"
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
          :value="modelValue[daughtersKey]"
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
import { ref, watch, onMounted } from 'vue';

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

// Assurez-vous que le modelValue a les bonnes clés lors de l'initialisation
onMounted(() => {
  // Vérifier que les clés attendues existent dans modelValue
  const updatedModel = { ...props.modelValue };

  if (typeof updatedModel[props.sonsKey] !== 'string') {
    updatedModel[props.sonsKey] = updatedModel[props.sonsKey]?.toString() || '';
  }

  if (typeof updatedModel[props.daughtersKey] !== 'string') {
    updatedModel[props.daughtersKey] = updatedModel[props.daughtersKey]?.toString() || '';
  }

  emit('update:modelValue', updatedModel);
});

const updateSons = (value) => {
  const updatedModel = { ...props.modelValue };
  updatedModel[props.sonsKey] = value;

  emit('update:modelValue', updatedModel);
  validateInput(value, props.modelValue[props.daughtersKey]);
};

const updateDaughters = (value) => {
  const updatedModel = { ...props.modelValue };
  updatedModel[props.daughtersKey] = value;

  emit('update:modelValue', updatedModel);
  validateInput(props.modelValue[props.sonsKey], value);
};

// Watch for changes in modelValue to validate
watch(() => props.modelValue, (newValue) => {
  validateInput(newValue[props.sonsKey], newValue[props.daughtersKey]);
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