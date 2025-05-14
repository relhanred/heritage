<!-- src/components/questionnaire/QuestionTypes/DescendantsTreeQuestion.vue -->
<template>
  <div class="space-y-4">
    <div class="text-sm text-gray-600 mb-4 text-center">
      Indiquez le nombre de descendants musulmans et légitimes pour chaque catégorie
    </div>

    <!-- Arbre généalogique des descendants -->
    <div class="descendants-tree">
      <!-- Niveau 0: Défunt -->
      <div class="tree-level level-0">
        <div class="tree-node deceased">
          {{ deceasedLabel }}
        </div>
      </div>

      <!-- Connecteur niveau 0 à 1 -->
      <div class="tree-connectors level-0-1">
        <div class="connector"></div>
      </div>

      <!-- Niveau 1: Enfants -->
      <div class="tree-level level-1">
        <div class="children-container">
          <!-- Fils -->
          <div class="child-group">
            <div class="tree-node input-node">
              <div class="node-label">Fils</div>
              <input
                  type="number"
                  v-model="modelValue.sons"
                  min="0"
                  class="node-input"
                  @input="updateValue"
                  @change="updateValue"
              />
            </div>

            <!-- Connecteur fils vers petits-enfants -->
            <div class="tree-connectors child-to-grandchild">
              <div class="connector"></div>
            </div>

            <!-- Petits-enfants (niveau 2 issu des fils) -->
            <div class="grandchildren-container">
              <!-- Petits-fils -->
              <div class="grandchild-group">
                <div class="tree-node input-node">
                  <div class="node-label">Petits-fils</div>
                  <input
                      type="number"
                      v-model="modelValue.grandsons"
                      min="0"
                      class="node-input"
                      @input="updateValue"
                      @change="updateValue"
                  />
                </div>

                <!-- Connecteur petits-fils vers arrière-petits-enfants -->
                <div class="tree-connectors grandchild-to-greatgrandchild">
                  <div class="connector"></div>
                </div>

                <!-- Arrière-petits-enfants (niveau 3 issu des petits-fils) -->
                <div class="greatgrandchildren-container">
                  <div class="tree-node input-node">
                    <div class="node-label">Arrière-petits-fils</div>
                    <input
                        type="number"
                        v-model="modelValue.greatGrandsons"
                        min="0"
                        class="node-input"
                        @input="updateValue"
                        @change="updateValue"
                    />
                  </div>
                  <div class="tree-node input-node">
                    <div class="node-label">Arrière-petites-filles</div>
                    <input
                        type="number"
                        v-model="modelValue.greatGranddaughters"
                        min="0"
                        class="node-input"
                        @input="updateValue"
                        @change="updateValue"
                    />
                  </div>
                </div>
              </div>

              <!-- Petites-filles -->
              <div class="grandchild-group petites-filles">
                <div class="tree-node input-node">
                  <div class="node-label">Petites-filles</div>
                  <input
                      type="number"
                      v-model="modelValue.granddaughters"
                      min="0"
                      class="node-input"
                      @input="updateValue"
                      @change="updateValue"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Filles -->
          <div class="child-group">
            <div class="tree-node input-node">
              <div class="node-label">Filles</div>
              <input
                  type="number"
                  v-model="modelValue.daughters"
                  min="0"
                  class="node-input"
                  @input="updateValue"
                  @change="updateValue"
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
      sons: '0',
      daughters: '0',
      grandsons: '0',
      granddaughters: '0',
      greatGrandsons: '0',
      greatGranddaughters: '0'
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
  const properties = ['sons', 'daughters', 'grandsons', 'granddaughters', 'greatGrandsons', 'greatGranddaughters'];
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
    sons: parseInt(props.modelValue.sons) || 0,
    daughters: parseInt(props.modelValue.daughters) || 0,
    grandsons: parseInt(props.modelValue.grandsons) || 0,
    granddaughters: parseInt(props.modelValue.granddaughters) || 0,
    greatGrandsons: parseInt(props.modelValue.greatGrandsons) || 0,
    greatGranddaughters: parseInt(props.modelValue.greatGranddaughters) || 0
  };

  // Vérifier que les valeurs sont valides (nombres positifs)
  for (const [key, value] of Object.entries(values)) {
    if (value < 0) {
      validationError.value = 'Toutes les valeurs doivent être positives ou nulles.';
      emit('update:validationError', validationError.value);
      return false;
    }
  }

  // Vérifier qu'il y a au moins un descendant au total OU accepter zéro
  const totalDescendants = Object.values(values).reduce((sum, val) => sum + val, 0);
  /* Nous n'exigeons plus de descendant minimum
  if (totalDescendants === 0) {
    validationError.value = 'Veuillez indiquer au moins un descendant.';
    emit('update:validationError', validationError.value);
    return false;
  }
  */

  emit('update:validationError', '');
  return true;
};

// Observer les changements dans le modèle
watch(() => props.modelValue, validateInput, { deep: true });
</script>

<style scoped>
.descendants-tree {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
  max-width: 100%;
  overflow-x: auto;
  padding: 10px 5px;
}

.tree-level {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 5px 0;
}

.level-0 {
  /* Niveau du défunt */
  width: 100%;
}

.tree-node {
  padding: 5px 8px;
  border: 1.5px solid #047857;
  border-radius: 12px;
  background-color: white;
  color: #4b5563;
  margin: 0 5px;
  text-align: center;
  min-width: 60px;
  transition: all 0.2s;
  font-size: 0.8rem;
}

.tree-node.deceased {
  background-color: #f3f4f6;
  border-color: #9ca3af;
  cursor: default;
  font-weight: 500;
  font-size: 0.85rem;
}

.tree-node.input-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px 8px;
  min-width: 90px;
}

.node-label {
  font-size: 0.75rem;
  margin-bottom: 3px;
  font-weight: 500;
  color: #4b5563;
}

.node-input {
  width: 45px;
  padding: 1px 3px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  text-align: center;
  font-size: 0.8rem;
}

/* Connecteurs */
.tree-connectors {
  display: flex;
  justify-content: center;
  width: 100%;
  position: relative;
}

.level-0-1 {
  height: 20px;
}

.connector {
  height: 20px;
  width: 1px;
  background-color: #9ca3af;
}

.children-container {
  display: flex;
  justify-content: center;
  gap: 40px;
  width: 100%;
}

.child-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.child-to-grandchild {
  height: 20px;
}

.grandchildren-container {
  display: flex;
  justify-content: center;
  gap: 10px; /* Réduit l'écart entre les petits-fils et petites-filles */
}

.grandchild-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.grandchild-to-greatgrandchild {
  height: 20px;
}

.greatgrandchildren-container {
  display: flex;
  justify-content: center;
  gap: 10px; /* Réduit l'écart entre les arrière-petits-fils et arrière-petites-filles */
  border: 1px dashed #d97706; /* Couleur ambre pour différencier du niveau précédent */
  border-radius: 8px;
  padding: 10px;
  margin-top: 5px;
  position: relative;
}

/* Étiquette qui indique que ce sont des descendants du petit-fils */
.greatgrandchildren-container::before {
  content: "Descendants du petit-fils";
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  padding: 0 5px;
  font-size: 0.65rem;
  color: #92400e; /* Couleur ambre plus foncée pour l'étiquette */
}

.validation-error {
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 8px;
  text-align: center;
}

/* Suppression de la marge négative qui peut créer une confusion visuelle */
.petites-filles {
  margin-left: 0;
}

/* Ajout d'une bordure pointillée pour regrouper visuellement les petits-enfants */
.grandchildren-container {
  border: 1px dashed #9ca3af;
  border-radius: 8px;
  padding: 10px;
  margin-top: 5px;
  position: relative;
  margin-bottom: 5px; /* Ajoute un peu d'espace en dessous pour séparer des autres éléments */
}

/* Étiquette qui indique que ce sont des descendants du fils */
.grandchildren-container::before {
  content: "Descendants du fils";
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  padding: 0 5px;
  font-size: 0.65rem;
  color: #6b7280;
}

@media (max-width: 640px) {
  .descendants-tree {
    padding: 5px;
  }

  .tree-node.input-node {
    min-width: 75px; /* Légèrement plus petit sur mobile */
    padding: 4px 5px;
  }

  .node-label {
    font-size: 0.7rem;
  }

  .node-input {
    width: 40px;
    font-size: 0.75rem;
  }

  .children-container {
    gap: 15px; /* Écart réduit sur mobile */
  }

  .grandchildren-container {
    gap: 5px; /* Écart minimal sur mobile */
    padding: 8px 5px;
  }

  .greatgrandchildren-container {
    gap: 5px;
  }

  .grandchildren-container::before {
    font-size: 0.6rem;
  }

  .greatgrandchildren-container {
    gap: 5px;
    padding: 8px 5px;
  }

  .greatgrandchildren-container::before {
    font-size: 0.6rem;
  }
}
</style>