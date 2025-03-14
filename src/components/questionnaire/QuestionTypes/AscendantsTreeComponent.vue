<!-- src/components/questionnaire/QuestionTypes/AscendantsTreeComponent.vue -->
<template>
  <div class="space-y-4">
    <div class="text-sm text-gray-600 mb-4">
      Cliquez sur les ascendants qui sont encore en vie
    </div>
    <div id="ascendants-tree" class="w-full h-96 overflow-auto border border-gray-200 rounded-lg"></div>
    <div class="text-sm text-gray-600 mt-4">
      Ascendants sélectionnés: {{ selectedCount }} sur {{ totalAscendants }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';

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

// On compte les ascendants sélectionnés
const selectedCount = computed(() => {
  return Object.values(props.modelValue).filter(val => val === true).length;
});

// Nombre total d'ascendants possibles
const totalAscendants = ref(14); // Parents + grands-parents + arrière-grands-parents

// Structure des données pour l'arbre
const treeData = computed(() => {
  const deceasedLabel = props.gender ? 'Le défunt' : 'La défunte';

  return {
    name: deceasedLabel,
    id: 'deceased',
    children: [
      {
        name: 'Père',
        id: 'father',
        selectable: true,
        children: [
          {
            name: 'Grand-père paternel',
            id: 'paternal_grandfather',
            selectable: true,
            children: [
              { name: 'Arrière-grand-père paternel (paternel)', id: 'paternal_great_grandfather_1', selectable: true },
              { name: 'Arrière-grand-mère paternelle (paternelle)', id: 'paternal_great_grandmother_1', selectable: true }
            ]
          },
          {
            name: 'Grand-mère paternelle',
            id: 'paternal_grandmother',
            selectable: true,
            children: [
              { name: 'Arrière-grand-père paternel (maternel)', id: 'paternal_great_grandfather_2', selectable: true },
              { name: 'Arrière-grand-mère paternelle (maternelle)', id: 'paternal_great_grandmother_2', selectable: true }
            ]
          }
        ]
      },
      {
        name: 'Mère',
        id: 'mother',
        selectable: true,
        children: [
          {
            name: 'Grand-père maternel',
            id: 'maternal_grandfather',
            selectable: true,
            children: [
              { name: 'Arrière-grand-père maternel (paternel)', id: 'maternal_great_grandfather_1', selectable: true },
              { name: 'Arrière-grand-mère maternelle (paternelle)', id: 'maternal_great_grandmother_1', selectable: true }
            ]
          },
          {
            name: 'Grand-mère maternelle',
            id: 'maternal_grandmother',
            selectable: true,
            children: [
              { name: 'Arrière-grand-père maternel (maternel)', id: 'maternal_great_grandfather_2', selectable: true },
              { name: 'Arrière-grand-mère maternelle (maternelle)', id: 'maternal_great_grandmother_2', selectable: true }
            ]
          }
        ]
      }
    ]
  };
});

// Initialiser toutes les valeurs à false (personne n'est sélectionné par défaut)
const initializeValues = () => {
  const newValues = {};
  function traverse(node) {
    if (node.selectable) {
      newValues[node.id] = false;
    }
    if (node.children) {
      node.children.forEach(child => traverse(child));
    }
  }

  traverse(treeData.value);

  // Émettre les valeurs initiales si aucune valeur n'existe déjà
  if (Object.keys(props.modelValue).length === 0) {
    emit('update:modelValue', newValues);
  }
};

// Dessiner l'arbre
const drawTree = () => {
  const container = document.getElementById('ascendants-tree');
  if (!container) return;

  container.innerHTML = '';

  // Construction simple de l'arbre sans D3.js
  const treeContainer = document.createElement('div');
  treeContainer.className = 'tree-container';

  function createNode(node) {
    const nodeElement = document.createElement('div');
    nodeElement.className = 'tree-node';
    nodeElement.textContent = node.name;

    if (node.selectable) {
      nodeElement.classList.add('selectable');
      if (props.modelValue[node.id]) {
        nodeElement.classList.add('selected');
      }

      nodeElement.addEventListener('click', () => {
        const newValues = { ...props.modelValue };
        newValues[node.id] = !newValues[node.id];
        emit('update:modelValue', newValues);
      });
    }

    return nodeElement;
  }

  function buildTree(node, parentElement) {
    const nodeElement = createNode(node);
    parentElement.appendChild(nodeElement);

    if (node.children && node.children.length > 0) {
      const childrenContainer = document.createElement('div');
      childrenContainer.className = 'children-container';
      parentElement.appendChild(childrenContainer);

      node.children.forEach(child => {
        const childWrapper = document.createElement('div');
        childWrapper.className = 'child-wrapper';
        childrenContainer.appendChild(childWrapper);
        buildTree(child, childWrapper);
      });
    }
  }

  buildTree(treeData.value, treeContainer);
  container.appendChild(treeContainer);
};

// Réagir aux changements dans la valeur du modèle
watch(() => props.modelValue, () => {
  drawTree();
}, { deep: true });

// Initialiser le composant
onMounted(() => {
  initializeValues();
  drawTree();
});
</script>

<style scoped>
.tree-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.children-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.child-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 15px;
}

.tree-node {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f0f9ff;
  margin: 5px;
  text-align: center;
  min-width: 100px;
}

.tree-node.selectable {
  cursor: pointer;
  border-color: #047857;
}

.tree-node.selectable:hover {
  background-color: #e6fffa;
}

.tree-node.selected {
  background-color: #047857;
  color: white;
}
</style>