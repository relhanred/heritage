<!-- src/components/questionnaire/QuestionTypes/AscendantsTreeQuestion.vue -->
<template>
  <div class="space-y-4">
    <div class="text-sm text-gray-600 mb-4 text-center">
      Cliquez sur les ascendants qui sont encore en vie
    </div>

    <!-- Arbre généalogique visuel -->
    <div class="family-tree">
      <!-- Niveau 3: Arrière-grands-parents -->
      <div class="tree-level level-3">
        <div class="branch-group">
          <!-- Mère de la mère de la mère (clickable) -->
          <div class="tree-node"
               :class="{ selected: modelValue['maternal_great_grandmother_2'], clickable: true }"
               @click="toggleSelection('maternal_great_grandmother_2')">
            Arrière-GM
          </div>
          <!-- Père de la mère de la mère (non-clickable) -->
          <div class="tree-node non-clickable">
            Arrière-GP
          </div>
        </div>

        <div class="branch-group">
          <!-- Mère du père de la mère (non-clickable) -->
          <div class="tree-node non-clickable">
            Arrière-GM
          </div>
          <!-- Père du père de la mère (non-clickable) -->
          <div class="tree-node non-clickable">
            Arrière-GP
          </div>
        </div>

        <div class="branch-group">
          <!-- Mère de la mère du père (clickable) -->
          <div class="tree-node"
               :class="{ selected: modelValue['paternal_great_grandmother_2'], clickable: true }"
               @click="toggleSelection('paternal_great_grandmother_2')">
            Arrière-GM
          </div>
          <!-- Père de la mère du père (non-clickable) -->
          <div class="tree-node non-clickable">
            Arrière-GP
          </div>
        </div>

        <div class="branch-group">
          <!-- Mère du père du père (non-clickable) -->
          <div class="tree-node non-clickable">
            Arrière-GM
          </div>
          <!-- Père du père du père (clickable) -->
          <div class="tree-node"
               :class="{ selected: modelValue['paternal_great_grandfather_1'], clickable: true }"
               @click="toggleSelection('paternal_great_grandfather_1')">
            Arrière-GP
          </div>
        </div>
      </div>

      <!-- Connecteurs niveau 3 à 2 -->
      <div class="tree-connectors level-3-2">
        <div class="connector-group">
          <div class="connector"></div>
        </div>
        <div class="connector-group">
          <div class="connector"></div>
        </div>
        <div class="connector-group">
          <div class="connector"></div>
        </div>
        <div class="connector-group">
          <div class="connector"></div>
        </div>
      </div>

      <!-- Niveau 2: Grands-parents -->
      <div class="tree-level level-2">
        <!-- Grand-mère maternelle (clickable) -->
        <div class="tree-node"
             :class="{ selected: modelValue['maternal_grandmother'], clickable: true }"
             @click="toggleSelection('maternal_grandmother')">
          Grand-mère
        </div>
        <!-- Grand-père maternel (non-clickable) -->
        <div class="tree-node non-clickable">
          Grand-père
        </div>
        <!-- Grand-mère paternelle (clickable) -->
        <div class="tree-node"
             :class="{ selected: modelValue['paternal_grandmother'], clickable: true }"
             @click="toggleSelection('paternal_grandmother')">
          Grand-mère
        </div>
        <!-- Grand-père paternel (clickable) -->
        <div class="tree-node"
             :class="{ selected: modelValue['paternal_grandfather'], clickable: true }"
             @click="toggleSelection('paternal_grandfather')">
          Grand-père
        </div>
      </div>

      <!-- Connecteurs niveau 2 à 1 -->
      <div class="tree-connectors level-2-1">
        <div class="connector left"></div>
        <div class="connector right"></div>
      </div>

      <!-- Niveau 1: Parents -->
      <div class="tree-level level-1">
        <!-- Mère (clickable) -->
        <div class="tree-node"
             :class="{ selected: modelValue['mother'], clickable: true }"
             @click="toggleSelection('mother')">
          Mère
        </div>
        <!-- Père (clickable) -->
        <div class="tree-node"
             :class="{ selected: modelValue['father'], clickable: true }"
             @click="toggleSelection('father')">
          Père
        </div>
      </div>

      <!-- Connecteur niveau 1 à 0 -->
      <div class="tree-connectors level-1-0">
        <div class="connector"></div>
      </div>

      <!-- Niveau 0: Défunt -->
      <div class="tree-level level-0">
        <div class="tree-node deceased">
          {{ deceasedLabel }}
        </div>
      </div>
    </div>

    <div class="text-sm legend">
      <div class="legend-item">
        <div class="legend-color clickable"></div>
        <span>Ascendants pouvant hériter</span>
      </div>
      <div class="legend-item">
        <div class="legend-color non-clickable"></div>
        <span>Ascendants ne pouvant pas hériter</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  gender: {
    type: Boolean,
    default: true // Par défaut homme (true=homme, false=femme)
  }
});

const emit = defineEmits(['update:modelValue']);

// Label du défunt selon le genre
const deceasedLabel = computed(() => props.gender ? 'Défunt' : 'Défunte');

// Liste des ascendants cliquables
const clickableAscendants = [
  'mother',                        // mère
  'father',                        // père
  'maternal_grandmother',          // mère de la mère
  'maternal_great_grandmother_2',  // mère de la mère de la mère
  'paternal_grandmother',          // mère du père
  'paternal_great_grandmother_2',  // mère de la mère du père
  'paternal_grandfather',          // père du père
  'paternal_great_grandfather_1'   // père du père du père
];

// On compte les ascendants sélectionnés
const selectedCount = computed(() => {
  // Uniquement compter les ascendants cliquables qui sont sélectionnés
  return clickableAscendants.filter(id => props.modelValue[id] === true).length;
});

// Initialiser toutes les valeurs à false (personne n'est sélectionné par défaut)
const initializeValues = () => {
  if (Object.keys(props.modelValue).length > 0) return;

  const newValues = {};
  // Initialiser uniquement les ascendants cliquables
  clickableAscendants.forEach(id => { newValues[id] = false; });

  emit('update:modelValue', newValues);
};

// Basculer la sélection d'un ascendant (seulement pour ceux qui sont cliquables)
const toggleSelection = (id) => {
  if (clickableAscendants.includes(id)) {
    const newValues = { ...props.modelValue };
    newValues[id] = !newValues[id];
    emit('update:modelValue', newValues);
  }
};

// Initialiser le composant
onMounted(() => {
  initializeValues();
});
</script>

<style scoped>
.family-tree {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
  max-width: 100%;
  overflow-x: auto;
  padding: 0 5px;
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

.level-1 {
  /* Niveau des parents */
  width: 80%;
  padding: 0 3.5rem;
  justify-content: space-between;
}

.level-2 {
  /* Niveau des grands-parents */
  width: 90%;
  justify-content: space-between;
}

.level-3 {
  /* Niveau des arrière-grands-parents */
  width: 95%;
  justify-content: space-between;
}

.branch-group {
  display: flex;
  justify-content: center;
  gap: 5px;
}

.tree-node {
  padding: 5px 8px;
  border: 1.5px solid #047857;
  border-radius: 12px;
  background-color: white;
  color: #4b5563;
  cursor: pointer;
  margin: 0 2px;
  text-align: center;
  font-size: 0.7rem;
  min-width: 60px;
  transition: all 0.2s;
  user-select: none;
}

.tree-node.non-clickable {
  border-color: #d1d5db;
  color: #9ca3af;
  cursor: default;
  background-color: #f9fafb;
}

.tree-node.non-clickable:hover {
  background-color: #f9fafb;
}

.tree-node.selected {
  background-color: #047857;
  color: white;
}

.tree-node.deceased {
  background-color: #f3f4f6;
  border-color: #9ca3af;
  cursor: default;
}

/* Connecteurs */
.tree-connectors {
  display: flex;
  justify-content: center;
  width: 100%;
  position: relative;
}

.level-3-2 {
  height: 15px;
  width: 90%;
  display: flex;
  justify-content: space-between;
}

.connector-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20%;
}

.level-3-2 .connector {
  height: 15px;
  width: 1px;
  background-color: #9ca3af;
}

.level-2-1 {
  height: 20px;
  width: 60%;
  position: relative;
}

.level-2-1 .connector {
  position: absolute;
  top: 0;
  width: 50%;
  height: 10px;
  border-bottom: 1px solid #9ca3af;
}

.level-2-1 .connector:before {
  content: '';
  position: absolute;
  top: 0;
  width: 1px;
  height: 10px;
  background-color: #9ca3af;
}

.level-2-1 .connector.left {
  left: 0;
  border-right: none;
}

.level-2-1 .connector.left:before {
  right: 0;
}

.level-2-1 .connector.right {
  right: 0;
  border-left: none;
}

.level-2-1 .connector.right:before {
  left: 0;
}

.level-1-0 {
  height: 20px;
  display: flex;
  justify-content: center;
}

.level-1-0 .connector {
  height: 20px;
  width: 1px;
  background-color: #9ca3af;
}

/* Styles pour la légende */
.legend {
  gap: 5px;
  font-size: 0.75rem;
  color: #4b5563;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 20px;
  height: 12px;
  border-radius: 4px;
}

.legend-color.clickable {
  border: 1.5px solid #047857;
  background-color: white;
}

.legend-color.non-clickable {
  border: 1.5px solid #d1d5db;
  background-color: #f9fafb;
}

/* Pour les écrans plus petits */
@media (max-width: 640px) {
  .tree-node {
    font-size: 0.6rem;
    padding: 3px 6px;
    min-width: 50px;
  }

  .level-3 {
    flex-wrap: wrap;
  }

  .branch-group {
    margin-bottom: 5px;
  }
}
</style>