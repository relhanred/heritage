<!-- src/components/questionnaire/QuestionTypes/StructuredSummaryQuestion.vue -->
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
        <div v-if="hasAscendants && livingAscendants.length > 0">
          <div v-for="(ascendant, index) in livingAscendants" :key="index" class="info-item">
            <span class="info-value">{{ ascendant }}</span>
          </div>
        </div>
        <div v-else class="info-item">
          <span class="info-value">Aucun ascendant vivant</span>
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

// Ascendants
const hasAscendants = computed(() => answers.value.has_muslim_ascendants);
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