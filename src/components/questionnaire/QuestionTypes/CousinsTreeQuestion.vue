<!-- src/components/questionnaire/QuestionTypes/CousinsTreeQuestion.vue -->
<template>
  <div class="space-y-4">
    <!-- Arbre généalogique des cousins paternels -->
    <div class="cousins-tree">
      <!-- Niveau 1: Grand-père paternel (ancêtre commun) -->
      <div class="tree-level level-ancestor">
        <div class="ancestor-node">
          <div class="tree-node ancestor">Grand-père paternel</div>
        </div>
      </div>

      <!-- Connecteur du grand-père vers ses fils -->
      <div class="tree-connectors grandfather-to-sons">
        <!-- Ligne verticale centrale descendant du grand-père -->
        <div class="main-vertical-line"></div>
        <!-- Ligne horizontale reliant tous les fils -->
        <div class="horizontal-line"></div>
        <!-- Lignes verticales vers chaque fils -->
        <div class="vertical-branches">
          <div class="branch left"></div>
          <div class="branch center"></div>
          <div class="branch right"></div>
        </div>
      </div>

      <!-- Niveau 2: Père et ses frères (oncles paternels) sur la même ligne -->
      <div class="tree-level level-parents">
        <!-- Demi-frères du père (même père) -->
        <div class="uncle-node">
          <div class="tree-node info-node">
            <div class="node-label">Demi-frères du père (même père)</div>
            <div class="node-count">{{ unclesCount.fatherHalfBrothers }}</div>
          </div>
        </div>

        <!-- Père au centre -->
        <div class="father-node">
          <div class="tree-node parent-node">
            Père du défunt
          </div>
        </div>

        <!-- Frères germains du père -->
        <div class="uncle-node">
          <div class="tree-node info-node">
            <div class="node-label">Frères germains du père</div>
            <div class="node-count">{{ unclesCount.fatherFullBrothers }}</div>
          </div>
        </div>
      </div>

      <!-- Connecteurs de niveau 2 à 3 -->
      <div class="tree-connectors parents-to-children">
        <div class="vertical-line left"></div>
        <div class="vertical-line right"></div>
      </div>

      <!-- Niveau 3: Défunt et cousins sur la même ligne -->
      <div class="tree-level level-children">
        <!-- Fils des demi-frères du père (cousins) -->
        <div class="cousin-column">
          <div class="tree-node input-node cousin-node">
            <div class="node-label">Fils des demi-frères du père</div>
            <input
                type="number"
                v-model="modelValue.halfUnclesSons"
                min="0"
                class="node-input"
                @input="updateValue"
                @change="updateValue"
            />
          </div>
        </div>

        <!-- Défunt au centre -->
        <div class="deceased-column">
          <div class="tree-node deceased">
            {{ deceasedLabel }}
          </div>
        </div>

        <!-- Fils des frères germains du père (cousins) -->
        <div class="cousin-column">
          <div class="tree-node input-node cousin-node">
            <div class="node-label">Fils des frères germains du père</div>
            <input
                type="number"
                v-model="modelValue.fullUnclesSons"
                min="0"
                class="node-input"
                @input="updateValue"
                @change="updateValue"
            />
          </div>
        </div>
      </div>

      <!-- Cadre des cousins qui englobe les deux types de cousins -->
      <div class="cousins-box">
        <h4 class="cousins-title">Cousins paternels</h4>
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
      fullUnclesSons: '0',
      halfUnclesSons: '0'
    })
  },
  gender: {
    type: Boolean,
    default: true // Par défaut homme (true=homme, false=femme)
  },
  uncles: {
    type: Object,
    default: () => ({
      fatherFullBrothers: 0,
      fatherHalfBrothers: 0
    })
  }
});

const emit = defineEmits(['update:modelValue', 'update:validationError']);

// Message d'erreur de validation
const validationError = ref('');

// Label du défunt selon le genre
const deceasedLabel = computed(() => props.gender ? 'Défunt' : 'Défunte');

// Nombre d'oncles (lecture seule)
const unclesCount = computed(() => ({
  fatherFullBrothers: props.uncles.fatherFullBrothers || 0,
  fatherHalfBrothers: props.uncles.fatherHalfBrothers || 0
}));

// Initialiser les valeurs si nécessaire
onMounted(() => {
  const updatedModel = { ...props.modelValue };

  // S'assurer que toutes les propriétés existent
  const properties = ['fullUnclesSons', 'halfUnclesSons'];
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
    fullUnclesSons: parseInt(props.modelValue.fullUnclesSons) || 0,
    halfUnclesSons: parseInt(props.modelValue.halfUnclesSons) || 0
  };

  // Vérifier que les valeurs sont valides (nombres positifs)
  for (const [key, value] of Object.entries(values)) {
    if (value < 0) {
      validationError.value = 'Toutes les valeurs doivent être positives ou nulles.';
      emit('update:validationError', validationError.value);
      return false;
    }
  }

  emit('update:validationError', '');
  return true;
};

// Observer les changements dans le modèle
watch(() => props.modelValue, validateInput, { deep: true });
</script>

<style scoped>
.cousins-tree {
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 20px 0 80px;
  padding: 20px 10px 40px;
  max-width: 100%;
}

/* Niveau de l'ancêtre (grand-père paternel) */
.level-ancestor {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.ancestor-node {
  display: flex;
  justify-content: center;
}

.tree-node.ancestor {
  background-color: #f3f4f6;
  border: 1.5px solid #6b7280;
  color: #4b5563;
  font-weight: 500;
  font-size: 0.85rem;
  padding: 7px 12px;
  z-index: 3;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Connecteurs du grand-père aux fils */
.grandfather-to-sons {
  position: relative;
  height: 40px;
}

.main-vertical-line {
  position: absolute;
  left: 50%;
  top: 0;
  height: 20px;
  width: 1px;
  background-color: #9ca3af;
  transform: translateX(-50%);
}

.horizontal-line {
  position: absolute;
  left: 16%;
  right: 16%;
  top: 20px;
  height: 1px;
  background-color: #9ca3af;
}

.vertical-branches {
  position: absolute;
  width: 100%;
  top: 20px;
  height: 20px;
}

.branch {
  position: absolute;
  width: 1px;
  height: 20px;
  background-color: #9ca3af;
}

.branch.left {
  left: 16%;
}

.branch.center {
  left: 50%;
  transform: translateX(-50%);
}

.branch.right {
  right: 16%;
}

/* Niveaux de l'arbre */
.tree-level {
  display: flex;
  justify-content: space-around;
  width: 100%;
  position: relative;
  margin: 15px 0;
}

/* Niveau des parents (père et oncles) */
.level-parents {
  display: flex;
  justify-content: space-around;
  padding: 0 20px;
}

.uncle-node, .father-node {
  flex: 1;
  display: flex;
  justify-content: center;
  margin: 0 5px;
}

.father-node {
  /* Le père est mis en évidence au centre */
  z-index: 2;
}

/* Niveau des enfants (défunt et cousins) */
.level-children {
  display: flex;
  justify-content: space-around;
  margin-top: 5px;
  padding: 0 20px;
}

.cousin-column, .deceased-column {
  flex: 1;
  display: flex;
  justify-content: center;
  margin: 0 5px;
}

.deceased-column {
  /* Le défunt est mis en évidence au centre */
  z-index: 2;
}

/* Connecteurs entre les parents et les enfants */
.parents-to-children {
  width: 100%;
  position: relative;
  height: 30px;
}

.vertical-line {
  position: absolute;
  width: 1px;
  background-color: #9ca3af;
  height: 30px;
}

.vertical-line.left {
  left: 16%;
}

.vertical-line.center {
  left: 50%;
  transform: translateX(-50%);
}

.vertical-line.right {
  right: 16%;
}

/* Styles de base des nœuds */
.tree-node {
  padding: 10px 15px;
  border-radius: 12px;
  background-color: white;
  color: #4b5563;
  text-align: center;
  min-width: 120px;
  width: 90%;
  max-width: 180px;
  font-size: 0.8rem;
  position: relative;
  z-index: 2;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Nœud du défunt */
.tree-node.deceased {
  background-color: #f3f4f6;
  border: 1.5px solid #9ca3af;
  font-weight: 500;
  font-size: 0.9rem;
}

/* Nœud du père */
.tree-node.parent-node {
  border: 1.5px solid #9ca3af;
  background-color: #f3f4f6;
  font-weight: 500;
}

/* Nœuds d'information (oncles) */
.tree-node.info-node {
  border: 1.5px solid #9ca3af;
  background-color: #f3f4f6;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Nœuds d'entrée de données (cousins) */
.tree-node.input-node {
  border: 1.5px solid #047857;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.cousin-node {
  z-index: 1;
}

/* Étiquettes et compteurs */
.node-label {
  font-size: 0.75rem;
  margin-bottom: 5px;
  font-weight: 500;
  color: #4b5563;
}

.node-count {
  font-weight: 600;
  color: #9ca3af;
  font-size: 1.1rem;
}

.node-input {
  width: 60px;
  padding: 3px 5px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  text-align: center;
  font-size: 0.8rem;
  margin: 5px auto 0;
}

/* Cadre pointillé des cousins */
.cousins-box {
  position: absolute;
  bottom: 25px;
  left: 5%;
  right: 5%;
  height: 30%;
  border: 1px dashed #9ca3af;
  border-radius: 8px;
  z-index: 0;
}

.cousins-title {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  padding: 0 10px;
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.validation-error {
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 8px;
  text-align: center;
}

/* Responsive */
@media (max-width: 640px) {
  .cousins-tree {
    padding: 20px 10px 120px;
  }

  .horizontal-line, .vertical-branches, .main-vertical-line {
    display: none;
  }

  .cousin-column, .deceased-column {
    flex: none;
    width: 100%;
    margin-bottom: 15px;
  }

  .level-parents, .level-children {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }

  .uncle-node, .father-node {
    flex: none;
    width: 100%;
    margin-bottom: 15px;
  }

  .vertical-line {
    display: none;
  }

  .cousins-box {
    height: 65%;
    top: auto;
    bottom: 0;
  }

  .tree-node {
    max-width: 240px;
    width: 100%;
  }
}
</style>