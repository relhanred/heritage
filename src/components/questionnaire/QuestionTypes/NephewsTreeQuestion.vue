<!-- src/components/questionnaire/QuestionTypes/NephewsTreeQuestion.vue -->
<template>
  <div class="space-y-4">
    <!-- Arbre généalogique des neveux -->
    <div class="nephews-tree">
      <!-- Niveau 1: Défunt au centre avec frères de part et d'autre -->
      <div class="tree-level level-0">
        <!-- Demi-frères consanguins (même père) à gauche -->
        <div class="left-branch">
          <div class="tree-node info-node brother-node">
            <div class="node-label">Demi-frères (même père)</div>
            <div class="node-count">{{ halfBrothersFatherCount }}</div>
          </div>
        </div>

        <!-- Défunt au centre -->
        <div class="center-branch">
          <div class="tree-node deceased center-node">
            {{ deceasedLabel }}
          </div>
        </div>

        <!-- Frères germains à droite -->
        <div class="right-branch">
          <div class="tree-node info-node brother-node">
            <div class="node-label">Frères germains (même père et même mère)</div>
            <div class="node-count">{{ brothersCount }}</div>
          </div>
        </div>
      </div>

      <!-- Connecteurs horizontaux pour relier le défunt aux frères -->
      <div class="horizontal-connectors">
        <div class="connector-line-horizontal left"></div>
        <div class="connector-line-horizontal right"></div>
      </div>

      <!-- Connecteurs verticaux vers les neveux -->
      <div class="vertical-connectors">
        <div class="connector-line-vertical left"></div>
        <div class="connector-line-vertical right"></div>
      </div>

      <!-- Niveau 2: Fils des frères (neveux) -->
      <div class="tree-level level-1">
        <!-- Fils des demi-frères (neveux) -->
        <div class="left-branch">
          <div class="tree-node input-node nephew-node">
            <div class="node-label">Fils des demi-frères (même père)</div>
            <input
                type="number"
                v-model="modelValue.halfBrothersPaternelSons"
                min="0"
                class="node-input"
                @input="updateValue"
                @change="updateValue"
            />
          </div>
        </div>

        <div class="center-space"></div>

        <!-- Fils des frères germains (neveux) -->
        <div class="right-branch">
          <div class="tree-node input-node nephew-node">
            <div class="node-label">Fils des frères germains</div>
            <input
                type="number"
                v-model="modelValue.fullBrothersSons"
                min="0"
                class="node-input"
                @input="updateValue"
                @change="updateValue"
            />
          </div>
        </div>
      </div>

      <!-- Cadre des neveux qui englobe les deux types de neveux -->
      <div class="nephews-box">
        <h4 class="nephews-title">Neveux</h4>
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
      fullBrothersSons: '0',
      halfBrothersPaternelSons: '0'
    })
  },
  gender: {
    type: Boolean,
    default: true // Par défaut homme (true=homme, false=femme)
  },
  siblings: {
    type: Object,
    default: () => ({
      brothers: 0,
      sisters: 0,
      halfBrothersFather: 0,
      halfSistersFather: 0,
      halfBrothersMother: 0,
      halfSistersMother: 0
    })
  }
});

const emit = defineEmits(['update:modelValue', 'update:validationError']);

// Message d'erreur de validation
const validationError = ref('');

// Label du défunt selon le genre
const deceasedLabel = computed(() => props.gender ? 'Défunt' : 'Défunte');

// Nombre de frères (lecture seule)
const brothersCount = computed(() => props.siblings.brothers || 0);
const halfBrothersFatherCount = computed(() => props.siblings.halfBrothersFather || 0);

// Initialiser les valeurs si nécessaire
onMounted(() => {
  const updatedModel = { ...props.modelValue };

  // S'assurer que toutes les propriétés existent
  const properties = ['fullBrothersSons', 'halfBrothersPaternelSons'];
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
    fullBrothersSons: parseInt(props.modelValue.fullBrothersSons) || 0,
    halfBrothersPaternelSons: parseInt(props.modelValue.halfBrothersPaternelSons) || 0
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
.nephews-tree {
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

/* Niveau du défunt et frères sur la même ligne */
.level-0 {
  justify-content: space-between;
  align-items: center;
  margin-bottom: 60px;
}

/* Niveau des neveux */
.level-1 {
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  margin-top: 20px;  /* Espacement après les connecteurs verticaux */
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

.center-space {
  width: 30%;
}

/* Connecteurs horizontaux reliant le défunt aux frères */
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

/* Connecteurs verticaux vers les neveux */
.vertical-connectors {
  position: absolute;
  top: 100px;  /* Ajusté pour commencer après les cards des frères */
  width: 100%;
  z-index: 0;
}

.connector-line-vertical {
  position: absolute;
  width: 1px;
  height: 40px;  /* Hauteur égale pour les deux connecteurs */
  background-color: #9ca3af;
}

.connector-line-vertical.left {
  left: 25%;  /* Aligné avec le centre de la branche gauche */
}

.connector-line-vertical.right {
  right: 25%;  /* Aligné avec le centre de la branche droite */
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

.tree-node.info-node {
  border-color: #3b82f6;
  background-color: #f0f9ff;
  cursor: default;
  height: 80px;  /* Hauteur fixe pour les cards des frères */
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centrage vertical du contenu */
}

.tree-node.brother-node {
  margin: 0 5px;
}

.tree-node.nephew-node {
  z-index: 1;
  margin-top: 15px;
  height: 80px;  /* Hauteur fixe pour les cards des neveux */
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centrage vertical du contenu */
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

.node-count {
  font-weight: 600;
  color: #3b82f6;
  font-size: 1.1rem;
}

.tree-node.input-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 12px;
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

/* Cadre pointillé des neveux */
.nephews-box {
  position: absolute;
  bottom: 60px;
  left: 10%;
  right: 10%;
  height: 40%;  /* Ajusté pour bien englober les deux cards des neveux */
  border: 1px dashed #9ca3af;
  border-radius: 8px;
  z-index: 0;
}

.nephews-title {
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
  .nephews-tree {
    padding: 10px 5px 120px;
  }

  .level-0 {
    flex-direction: column;
    align-items: center;
    margin-bottom: 30px;
  }

  .level-1 {
    flex-direction: column;
    align-items: center;
  }

  .left-branch, .right-branch, .center-branch {
    width: 80%;
    margin: 10px 0;
  }

  .center-space {
    display: none;
  }

  .horizontal-connectors,
  .vertical-connectors {
    display: none;
  }

  .tree-node.nephew-node {
    margin-top: 0;
  }

  .nephews-box {
    height: 60%;
    bottom: 0;
  }
}
</style>