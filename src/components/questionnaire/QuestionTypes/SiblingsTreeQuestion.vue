<!-- src/components/questionnaire/QuestionTypes/SiblingsTreeQuestion.vue -->
<template>
  <div class="space-y-4">
    <div class="text-sm text-gray-600 mb-4 text-center">
      Veuillez indiquer le nombre de frères et sœurs du défunt
    </div>

    <!-- Arbre généalogique des frères et sœurs -->
    <div class="siblings-tree">
      <!-- Niveau 0: Parents (non cliquables) -->
      <div class="tree-level level-0">
        <div class="tree-node parent non-clickable">
          Père
        </div>
        <div class="tree-node parent non-clickable">
          Mère
        </div>
      </div>

      <!-- Connecteurs parents vers défunt -->
      <div class="parent-to-child-connectors">
        <div class="left-line"></div>
        <div class="right-line"></div>
        <div class="center-line"></div>
      </div>

      <!-- Niveau 1: Défunt -->
      <div class="tree-level level-1">
        <div class="tree-node deceased">
          {{ deceasedLabel }}
        </div>
      </div>

      <!-- Demi-frères/sœurs (niveau au-dessus des germains) -->
      <div class="half-siblings-level">
        <!-- Côté paternel -->
        <div class="half-sibling-column paternal">
          <div class="half-siblings-box">
            <h4 class="siblings-title">Demi-frères/sœurs<br>(même père)</h4>
            <div class="siblings-inputs">
              <div class="input-row">
                <label for="half-brothers-father">Demi-frères:</label>
                <input
                    type="number"
                    id="half-brothers-father"
                    v-model="modelValue.halfBrothersFather"
                    min="0"
                    class="sibling-input"
                    @input="updateValue"
                />
              </div>
              <div class="input-row">
                <label for="half-sisters-father">Demi-sœurs:</label>
                <input
                    type="number"
                    id="half-sisters-father"
                    v-model="modelValue.halfSistersFather"
                    min="0"
                    class="sibling-input"
                    @input="updateValue"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Côté maternel -->
        <div class="half-sibling-column maternal">
          <div class="half-siblings-box">
            <h4 class="siblings-title">Demi-frères/sœurs<br>(même mère)</h4>
            <div class="siblings-inputs">
              <div class="input-row">
                <label for="half-brothers-mother">Demi-frères:</label>
                <input
                    type="number"
                    id="half-brothers-mother"
                    v-model="modelValue.halfBrothersMother"
                    min="0"
                    class="sibling-input"
                    @input="updateValue"
                />
              </div>
              <div class="input-row">
                <label for="half-sisters-mother">Demi-sœurs:</label>
                <input
                    type="number"
                    id="half-sisters-mother"
                    v-model="modelValue.halfSistersMother"
                    min="0"
                    class="sibling-input"
                    @input="updateValue"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Connecteur défunt vers germains -->
      <div class="child-to-germain-connector">
        <div class="vertical-line"></div>
      </div>

      <!-- Frères/sœurs germains -->
      <div class="germain-siblings-level">
        <div class="germain-siblings-box">
          <h4 class="siblings-title">Frères/sœurs germains (même père et même mère)</h4>
          <div class="siblings-inputs horizontal">
            <div class="input-row">
              <label for="full-brothers">Frères:</label>
              <input
                  type="number"
                  id="full-brothers"
                  v-model="modelValue.brothers"
                  min="0"
                  class="sibling-input"
                  @input="updateValue"
              />
            </div>
            <div class="input-row">
              <label for="full-sisters">Sœurs:</label>
              <input
                  type="number"
                  id="full-sisters"
                  v-model="modelValue.sisters"
                  min="0"
                  class="sibling-input"
                  @input="updateValue"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="validationError" class="validation-error">
      {{ validationError }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      brothers: '0',
      sisters: '0',
      halfBrothersFather: '0',
      halfSistersFather: '0',
      halfBrothersMother: '0',
      halfSistersMother: '0'
    })
  },
  gender: {
    type: Boolean,
    default: true // Par défaut homme (true=homme, false=femme)
  }
});

const emit = defineEmits(['update:modelValue', 'update:validationError']);

// Message d'erreur de validation
const validationError = ref('');

// Label du défunt selon le genre
const deceasedLabel = computed(() => props.gender ? 'Défunt' : 'Défunte');

// Initialiser les valeurs si nécessaire
onMounted(() => {
  const updatedModel = { ...props.modelValue };

  // S'assurer que toutes les propriétés existent
  const properties = [
    'brothers', 'sisters',
    'halfBrothersFather', 'halfSistersFather',
    'halfBrothersMother', 'halfSistersMother'
  ];

  properties.forEach(prop => {
    if (updatedModel[prop] === undefined) {
      updatedModel[prop] = '0';
    } else if (typeof updatedModel[prop] !== 'string') {
      updatedModel[prop] = updatedModel[prop].toString();
    }
  });

  emit('update:modelValue', updatedModel);
  validateInput();
});

// Mettre à jour la valeur et valider les entrées
const updateValue = () => {
  validateInput();
  emit('update:modelValue', { ...props.modelValue });
};

// Valider les entrées
const validateInput = () => {
  validationError.value = '';

  // Convertir toutes les valeurs en nombres
  const values = {
    brothers: parseInt(props.modelValue.brothers) || 0,
    sisters: parseInt(props.modelValue.sisters) || 0,
    halfBrothersFather: parseInt(props.modelValue.halfBrothersFather) || 0,
    halfSistersFather: parseInt(props.modelValue.halfSistersFather) || 0,
    halfBrothersMother: parseInt(props.modelValue.halfBrothersMother) || 0,
    halfSistersMother: parseInt(props.modelValue.halfSistersMother) || 0
  };

  // Vérifier que les valeurs sont valides (nombres positifs)
  for (const [key, value] of Object.entries(values)) {
    if (value < 0) {
      validationError.value = 'Toutes les valeurs doivent être positives ou nulles.';
      emit('update:validationError', validationError.value);
      return false;
    }
  }

  // Contrairement à l'arbre des descendants, nous acceptons zéro frère et sœur
  emit('update:validationError', '');
  return true;
};

// Observer les changements dans le modèle
watch(() => props.modelValue, validateInput, { deep: true });
</script>

<style scoped>
.siblings-tree {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px 10px;
  position: relative;
}

/* Niveau des parents */
.level-0 {
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
}

.tree-node {
  padding: 8px 12px;
  border-radius: 12px;
  text-align: center;
  background-color: white;
}

.tree-node.parent {
  border: 1.5px solid #9ca3af;
  background-color: #f3f4f6;
  color: #4b5563;
  min-width: 80px;
}

.tree-node.deceased {
  border: 1.5px solid #047857;
  background-color: #f3f4f6;
  color: #4b5563;
  font-weight: 500;
  min-width: 80px;
  margin: 0 auto;
}

/* Connecteurs des parents au défunt */
.parent-to-child-connectors {
  height: 30px;
  position: relative;
  margin-bottom: 5px;
}

.left-line, .right-line, .center-line {
  position: absolute;
  background-color: #9ca3af;
}

.left-line {
  width: 1px;
  height: 15px;
  left: 25%;
  top: 0;
}

.right-line {
  width: 1px;
  height: 15px;
  right: 25%;
  top: 0;
}

.center-line {
  height: 1px;
  width: 50%;
  left: 25%;
  top: 15px;
}

/* Niveau du défunt */
.level-1 {
  margin: 0 auto;
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

/* Niveau des demi-frères/sœurs */
.half-siblings-level {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.half-sibling-column {
  width: 45%;
  position: relative;
}

.half-siblings-box {
  border: 1px dashed #d1d5db;
  border-radius: 8px;
  padding: 10px;
}

.half-sibling-column.paternal .half-siblings-box {
  border-left: 2px solid #059669;
}

.half-sibling-column.maternal .half-siblings-box {
  border-left: 2px solid #db2777;
}

/* Connecteur défunt vers germains */
.child-to-germain-connector {
  height: 25px;
  position: relative;
  margin-bottom: 5px;
}

.vertical-line {
  position: absolute;
  width: 1px;
  height: 25px;
  background-color: #9ca3af;
  left: 50%;
  transform: translateX(-50%);
}

/* Niveau des frères/sœurs germains */
.germain-siblings-level {
  margin: 0 auto;
  max-width: 90%;
}

.germain-siblings-box {
  border: 1px dashed #d1d5db;
  border-radius: 8px;
  padding: 10px;
  border-left: 2px solid #047857;
  border-right: 2px solid #047857;
}

/* Style des titres et inputs */
.siblings-title {
  font-size: 0.8rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 10px;
  text-align: center;
}

.siblings-inputs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.siblings-inputs.horizontal {
  flex-direction: row;
  justify-content: center;
  gap: 20px;
}

.input-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.input-row label {
  font-size: 0.75rem;
  color: #6b7280;
}

.sibling-input {
  width: 50px;
  padding: 4px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  text-align: center;
  font-size: 0.8rem;
}

.validation-error {
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 8px;
  text-align: center;
}

/* Responsive */
@media (max-width: 640px) {
  .half-siblings-level {
    flex-direction: column;
    gap: 20px;
  }

  .half-sibling-column {
    width: 100%;
  }

  .siblings-inputs.horizontal {
    flex-direction: column;
  }
}
</style>