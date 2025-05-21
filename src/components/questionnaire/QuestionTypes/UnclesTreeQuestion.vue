<!-- src/components/questionnaire/QuestionTypes/UnclesTreeQuestion.vue -->
<template>
  <div class="space-y-4">
    <!-- Arbre généalogique des oncles paternels -->
    <div class="uncles-tree">
      <!-- Niveau 0: Grand-père paternel (non affiché mais implicite) -->
      <!-- Niveau 1: Père et ses frères -->
      <div class="tree-level level-0">
        <!-- Demi-frères du père (même père) à gauche -->
        <div class="left-branch">
          <div class="tree-node input-node uncle-node">
            <div class="node-label">Demi-frères du père (même père)</div>
            <input
                type="number"
                v-model="modelValue.fatherHalfBrothers"
                min="0"
                class="node-input mx-auto"
                @input="updateValue"
                @change="updateValue"
            />
          </div>
        </div>

        <!-- Père au centre -->
        <div class="center-branch">
          <div class="tree-node parent-node center-node">
            Père du défunt
          </div>
        </div>

        <!-- Frères germains du père à droite -->
        <div class="right-branch">
          <div class="tree-node input-node uncle-node">
            <div class="node-label">Frères germains du père (même père et mère)</div>
            <input
                type="number"
                v-model="modelValue.fatherFullBrothers"
                min="0"
                class="node-input mx-auto"
                @input="updateValue"
                @change="updateValue"
            />
          </div>
        </div>
      </div>

      <!-- Connecteurs horizontaux pour relier le père aux frères -->
      <div class="horizontal-connectors">
        <div class="connector-line-horizontal left"></div>
        <div class="connector-line-horizontal right"></div>
      </div>

      <!-- Connecteur vertical du père au défunt -->
      <div class="vertical-connector">
        <div class="connector-line-vertical"></div>
      </div>

      <!-- Niveau 2: Défunt -->
      <div class="tree-level level-1">
        <div class="tree-node deceased">
          {{ deceasedLabel }}
        </div>
      </div>

      <!-- Cadre des oncles qui englobe les deux types d'oncles -->
      <div class="uncles-box">
        <h4 class="uncles-title">Oncles paternels</h4>
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
      fatherFullBrothers: '0',
      fatherHalfBrothers: '0'
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
  const properties = ['fatherFullBrothers', 'fatherHalfBrothers'];
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
    fatherFullBrothers: parseInt(props.modelValue.fatherFullBrothers) || 0,
    fatherHalfBrothers: parseInt(props.modelValue.fatherHalfBrothers) || 0
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
.uncles-tree {
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 40px 0;
  max-width: 100%;
  padding: 10px 5px 100px;
}

.tree-level {
  display: flex;
  justify-content: space-around;
  width: 100%;
  position: relative;
}

/* Niveau du père et frères sur la même ligne */
.level-0 {
  justify-content: space-between;
  align-items: center;
  margin-bottom: 60px;
}

/* Niveau du défunt */
.level-1 {
  justify-content: center;
  width: 100%;
  margin-top: 20px;  /* Espacement après le connecteur vertical */
}

.left-branch, .right-branch {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 35%;  /* Taille égale pour les deux branches */
  position: relative;
}

.center-branch {
  width: 25%;  /* Légèrement plus large pour le centre */
  display: flex;
  justify-content: center;
}

/* Connecteurs horizontaux reliant le père aux frères */
.horizontal-connectors {
  position: absolute;
  top: 35px;
  width: 100%;
  height: 1px;
  z-index: 0;
}

.connector-line-horizontal {
  position: absolute;
  height: 1px;
  background-color: #9ca3af;
  top: 0;
  width: 17.5%;  /* Exactement la moitié de la largeur des branches (35%/2) */
}

.connector-line-horizontal.left {
  left: 25%;  /* Aligné avec le centre de la branche gauche */
  right: auto;
}

.connector-line-horizontal.right {
  right: 25%;  /* Aligné avec le centre de la branche droite */
  left: auto;
}

/* Connecteur vertical du père au défunt */
.vertical-connector {
  position: absolute;
  top: 90px;  /* Ajusté pour commencer après la card du père */
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 0;
}

.connector-line-vertical {
  width: 1px;
  height: 40px;  /* Hauteur du connecteur vertical */
  background-color: #9ca3af;
}

.tree-node {
  padding: 10px 15px;
  border: 1.5px solid #047857;
  border-radius: 12px;
  background-color: white;
  color: #4b5563;
  text-align: center;
  min-width: 120px;  /* Taille minimale égale pour toutes les cards */
  width: 90%;       /* Largeur en pourcentage pour s'adapter au contenant */
  max-width: 200px;  /* Largeur maximale pour éviter des cards trop larges */
  transition: all 0.2s;
  font-size: 0.8rem;
  z-index: 2;
  position: relative;
  box-sizing: border-box;  /* Pour que le padding soit inclus dans la largeur */
}

.tree-node.deceased {
  background-color: #f3f4f6;
  border-color: #9ca3af;
  cursor: default;
  font-weight: 500;
  font-size: 0.9rem;
}

.tree-node.parent-node {
  border-color: #9ca3af;  /* Même bordure que le défunt */
  background-color: #f3f4f6;  /* Même fond que le défunt */
  font-weight: 500;
  cursor: default;
}

.tree-node.input-node {
  border-color: #047857;  /* Vert pour les oncles */
  background-color: white;
  height: 80px;  /* Hauteur fixe pour les cards des oncles */
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centrage vertical du contenu */
}

.tree-node.uncle-node {
  margin: 0 5px;
}

.center-node {
  margin: 0 auto;
}

.node-label {
  font-size: 0.75rem;
  margin-bottom: 5px;
  font-weight: 500;
  color: #4b5563;
}

.node-input {
  width: 60px;
  padding: 3px 5px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  text-align: center;
  font-size: 0.8rem;
  margin-top: 2px;
}

/* Cadre pointillé des oncles */
.uncles-box {
  position: absolute;
  top: 0;
  left: 10%;
  right: 10%;
  height: 50%;  /* Ajusté pour bien englober les deux cards des oncles */
  border: 1px dashed #9ca3af;
  border-radius: 8px;
  z-index: 0;
}

.uncles-title {
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
  .uncles-tree {
    padding: 10px 5px 120px;
  }

  .level-0 {
    flex-direction: column;
    align-items: center;
    margin-bottom: 30px;
  }

  .left-branch, .right-branch, .center-branch {
    width: 80%;
    margin: 10px 0;
  }

  .horizontal-connectors {
    display: none;
  }

  .vertical-connector {
    top: 170px;  /* Ajusté pour le layout mobile */
  }

  .uncles-box {
    height: 70%;
    top: 0;
  }
}
</style>