<!-- src/components/questionnaire/QuestionTypes/StructuredSummaryQuestion.vue (Mis à jour) -->
<template>
  <div class="space-y-4">
    <div class="text-sm text-gray-600 mb-4 text-center">
      Récapitulatif complet de votre situation
    </div>

    <div class="summary-container">
      <!-- Informations personnelles -->
      <div class="summary-section">
        <h3 class="section-title">Informations personnelles</h3>
        <div class="info-item">
          <span class="info-label">Genre:</span>
          <span class="info-value">{{ gender ? 'Homme' : 'Femme' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Statut marital:</span>
          <span class="info-value">{{ maritalStatus ? 'Marié(e)' : 'Non marié(e)' }}</span>
        </div>
        <div v-if="gender && maritalStatus" class="info-item">
          <span class="info-label">Nombre d'épouses:</span>
          <span class="info-value">{{ wivesCount }}</span>
        </div>
      </div>

      <!-- Ascendants vivants -->
      <div class="summary-section">
        <h3 class="section-title">Ascendants vivants</h3>
        <div v-if="livingAscendants.length > 0">
          <div v-for="(ascendant, index) in livingAscendants" :key="index" class="info-item">
            <span class="info-value">{{ ascendant }}</span>
          </div>
        </div>
        <div v-else class="info-item">
          <span class="info-value">Aucun ascendant vivant</span>
        </div>
      </div>

      <!-- Frères et sœurs -->
      <div class="summary-section" v-if="hasSiblings || siblingsDataExists">
        <h3 class="section-title">Frères et sœurs</h3>
        <div v-if="hasSiblings">
          <div v-if="siblings.brothers > 0" class="info-item">
            <span class="info-label">Frères:</span>
            <span class="info-value">{{ siblings.brothers }}</span>
          </div>
          <div v-if="siblings.sisters > 0" class="info-item">
            <span class="info-label">Sœurs:</span>
            <span class="info-value">{{ siblings.sisters }}</span>
          </div>
          <div v-if="siblings.halfBrothersFather > 0" class="info-item">
            <span class="info-label">Demi-frères (père):</span>
            <span class="info-value">{{ siblings.halfBrothersFather }}</span>
          </div>
          <div v-if="siblings.halfSistersFather > 0" class="info-item">
            <span class="info-label">Demi-sœurs (père):</span>
            <span class="info-value">{{ siblings.halfSistersFather }}</span>
          </div>
          <div v-if="siblings.halfBrothersMother > 0 && shouldShowMaternalHalfSiblings" class="info-item">
            <span class="info-label">Demi-frères (mère):</span>
            <span class="info-value">{{ siblings.halfBrothersMother }}</span>
          </div>
          <div v-if="siblings.halfSistersMother > 0 && shouldShowMaternalHalfSiblings" class="info-item">
            <span class="info-label">Demi-sœurs (mère):</span>
            <span class="info-value">{{ siblings.halfSistersMother }}</span>
          </div>
        </div>
        <div v-else class="info-item">
          <span class="info-value">Aucun frère ou sœur</span>
        </div>
      </div>

      <!-- Neveux (nouveau) -->
      <div class="summary-section" v-if="nephewsDataExists">
        <h3 class="section-title">Neveux</h3>
        <div v-if="hasNephews">
          <div v-if="nephews.fullBrothersSons > 0" class="info-item">
            <span class="info-label">Fils des frères germains:</span>
            <span class="info-value">{{ nephews.fullBrothersSons }}</span>
          </div>
          <div v-if="nephews.halfBrothersPaternelSons > 0" class="info-item">
            <span class="info-label">Fils des demi-frères (père):</span>
            <span class="info-value">{{ nephews.halfBrothersPaternelSons }}</span>
          </div>
        </div>
        <div v-else class="info-item">
          <span class="info-value">Aucun neveu</span>
        </div>
      </div>

      <!-- Oncles Paternels (nouveau) -->
      <div class="summary-section" v-if="unclesDataExists">
        <h3 class="section-title">Oncles Paternels</h3>
        <div v-if="hasUncles">
          <div v-if="uncles.fatherFullBrothers > 0" class="info-item">
            <span class="info-label">Frères germains du père:</span>
            <span class="info-value">{{ uncles.fatherFullBrothers }}</span>
          </div>
          <div v-if="uncles.fatherHalfBrothers > 0" class="info-item">
            <span class="info-label">Demi-frères du père (même grand-père):</span>
            <span class="info-value">{{ uncles.fatherHalfBrothers }}</span>
          </div>
        </div>
        <div v-else class="info-item">
          <span class="info-value">Aucun oncle paternel</span>
        </div>
      </div>

      <!-- Descendants vivants -->
      <div class="summary-section">
        <h3 class="section-title">Descendants</h3>
        <div v-if="hasDescendants">
          <div v-if="sons > 0" class="info-item">
            <span class="info-label">Fils:</span>
            <span class="info-value">{{ sons }}</span>
          </div>
          <div v-if="daughters > 0" class="info-item">
            <span class="info-label">Filles:</span>
            <span class="info-value">{{ daughters }}</span>
          </div>
          <div v-if="grandsons > 0" class="info-item">
            <span class="info-label">Petits-fils:</span>
            <span class="info-value">{{ grandsons }}</span>
          </div>
          <div v-if="granddaughters > 0" class="info-item">
            <span class="info-label">Petites-filles:</span>
            <span class="info-value">{{ granddaughters }}</span>
          </div>
          <div v-if="greatGrandsons > 0" class="info-item">
            <span class="info-label">Arrière-petits-fils:</span>
            <span class="info-value">{{ greatGrandsons }}</span>
          </div>
          <div v-if="greatGranddaughters > 0" class="info-item">
            <span class="info-label">Arrière-petites-filles:</span>
            <span class="info-value">{{ greatGranddaughters }}</span>
          </div>
        </div>
        <div v-else class="info-item">
          <span class="info-value">Aucun descendant</span>
        </div>
      </div>

      <!-- Note finale -->
      <div class="summary-footer">
        Ces informations seront utilisées pour établir le calcul exact de la répartition de l'héritage selon les lois islamiques.
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useQuestionnaireStore } from '@/stores/questionnaire';

const questionnaireStore = useQuestionnaireStore();
const answers = computed(() => questionnaireStore.answers);

// Informations personnelles
const gender = computed(() => answers.value.deceased_gender);
const maritalStatus = computed(() => answers.value.marital_status);
const wivesCount = computed(() => answers.value.wives_count);

// Ascendants - La propriété has_muslim_ascendants n'existe pas dans les données
// nous devons la supprimer car elle empêche l'affichage correct
const ascendants = computed(() => answers.value.ascendants_details || {});

// Liste des ascendants vivants
const livingAscendants = computed(() => {
  if (!ascendants.value) return [];

  return Object.entries(ascendants.value)
      .filter(([_, isAlive]) => isAlive)
      .map(([id, _]) => {
        switch(id) {
          case 'father': return 'Père';
          case 'mother': return 'Mère';
          case 'paternal_grandfather': return 'Grand-père paternel';
          case 'paternal_grandmother': return 'Grand-mère paternelle';
          case 'maternal_grandfather': return 'Grand-père maternel';
          case 'maternal_grandmother': return 'Grand-mère maternelle';
          case 'paternal_great_grandfather_1': return 'Arrière-grand-père paternel (côté paternel)';
          case 'paternal_great_grandmother_1': return 'Arrière-grand-mère paternelle (côté paternel)';
          case 'paternal_great_grandfather_2': return 'Arrière-grand-père paternel (côté maternel)';
          case 'paternal_great_grandmother_2': return 'Arrière-grand-mère paternelle (côté maternel)';
          case 'maternal_great_grandfather_1': return 'Arrière-grand-père maternel (côté paternel)';
          case 'maternal_great_grandmother_1': return 'Arrière-grand-mère maternelle (côté paternel)';
          case 'maternal_great_grandfather_2': return 'Arrière-grand-père maternel (côté maternel)';
          case 'maternal_great_grandmother_2': return 'Arrière-grand-mère maternelle (côté maternel)';
          default: return 'Autre ascendant';
        }
      });
});

// Frères et sœurs
const siblings = computed(() => answers.value.siblings_details || {
  brothers: 0,
  sisters: 0,
  halfBrothersFather: 0,
  halfSistersFather: 0,
  halfBrothersMother: 0,
  halfSistersMother: 0
});

// Vérifier si des données sur les frères et sœurs existent
// (même si tous sont à 0, ça signifie que l'étape a été affichée)
const siblingsDataExists = computed(() => {
  return answers.value.siblings_details !== undefined;
});

// Vérifier si au moins un frère ou une sœur est présent
const hasSiblings = computed(() =>
    siblings.value.brothers > 0 ||
    siblings.value.sisters > 0 ||
    siblings.value.halfBrothersFather > 0 ||
    siblings.value.halfSistersFather > 0 ||
    siblings.value.halfBrothersMother > 0 ||
    siblings.value.halfSistersMother > 0
);

// Neveux (nouveau)
const nephews = computed(() => answers.value.nephews_details || {
  fullBrothersSons: 0,
  halfBrothersPaternelSons: 0
});

// Vérifier si des données sur les neveux existent
const nephewsDataExists = computed(() => {
  return answers.value.nephews_details !== undefined;
});

// Vérifier si au moins un neveu est présent
const hasNephews = computed(() =>
    nephews.value.fullBrothersSons > 0 ||
    nephews.value.halfBrothersPaternelSons > 0
);

// Oncles paternels (nouveau)
const uncles = computed(() => answers.value.uncles_details || {
  fatherFullBrothers: 0,
  fatherHalfBrothers: 0
});

// Vérifier si des données sur les oncles paternels existent
const unclesDataExists = computed(() => {
  return answers.value.uncles_details !== undefined;
});

// Vérifier si au moins un oncle paternel est présent
const hasUncles = computed(() =>
    uncles.value.fatherFullBrothers > 0 ||
    uncles.value.fatherHalfBrothers > 0
);

// Descendants
const descendants = computed(() => answers.value.descendants_tree || {});
const sons = computed(() => parseInt(descendants.value.sons) || 0);
const daughters = computed(() => parseInt(descendants.value.daughters) || 0);
const grandsons = computed(() => parseInt(descendants.value.grandsons) || 0);
const granddaughters = computed(() => parseInt(descendants.value.granddaughters) || 0);
const greatGrandsons = computed(() => parseInt(descendants.value.greatGrandsons) || 0);
const greatGranddaughters = computed(() => parseInt(descendants.value.greatGranddaughters) || 0);

// Vérifier si au moins un descendant est présent
const hasDescendants = computed(() =>
    sons.value > 0 || daughters.value > 0 || grandsons.value > 0 ||
    granddaughters.value > 0 || greatGrandsons.value > 0 || greatGranddaughters.value > 0
);

// Vérifier si on doit afficher les demi-frères/sœurs du côté maternel
const shouldShowMaternalHalfSiblings = computed(() => {
  // Vérifier s'il n'y a aucun descendant
  const hasNoDescendants = !hasDescendants.value;

  // Extraire les données sur les ascendants vivants
  const ascendantsData = answers.value.ascendants_details || {};

  // Vérifier s'il n'y a aucun ascendant masculin
  const hasNoMaleAscendants =
      ascendantsData.father !== true &&
      ascendantsData.paternal_grandfather !== true &&
      ascendantsData.paternal_great_grandfather_1 !== true &&
      ascendantsData.paternal_great_grandfather_2 !== true &&
      ascendantsData.maternal_great_grandfather_1 !== true &&
      ascendantsData.maternal_great_grandfather_2 !== true;

  // Afficher uniquement si les deux conditions sont remplies
  return hasNoDescendants && hasNoMaleAscendants;
});
</script>

<style scoped>
.summary-container {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e5e7eb;
}

.summary-section {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px dashed #d1d5db;
}

.summary-section:last-of-type {
  border-bottom: none;
}

.section-title {
  font-weight: 600;
  font-size: 1rem;
  color: #047857;
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #047857;
}

.info-item {
  display: flex;
  margin: 6px 0;
  font-size: 0.9rem;
}

.info-label {
  font-weight: 500;
  min-width: 140px;
  color: #4b5563;
}

.info-value {
  color: #1f2937;
}

.summary-footer {
  font-size: 0.8rem;
  color: #6b7280;
  font-style: italic;
  text-align: center;
  margin-top: 16px;
  padding-top: 8px;
  border-top: 1px solid #e5e7eb;
}

@media (max-width: 640px) {
  .info-item {
    flex-direction: column;
  }

  .info-label {
    min-width: auto;
    margin-bottom: 2px;
  }
}
</style>