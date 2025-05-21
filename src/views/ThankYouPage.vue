<!-- src/views/ThankYouPage.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-100 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div class="p-8 text-center">
        <div class="flex justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 class="text-2xl font-bold text-gray-900 mb-4">Merci pour vos réponses</h1>

        <div class="bg-teal-50 border-l-4 border-teal-500 p-4 mb-8 rounded-r text-left">
          <p class="text-sm text-gray-700">
            Un connaisseur des règles d'héritage va maintenant examiner votre situation et vous fournira des informations précises sur la façon de répartir équitablement les biens du défunt.
          </p>
        </div>

        <!-- Résumé des informations collectées avec un design amélioré -->
        <div class="summary-container mb-8">
          <!-- Carte d'identité de base -->
          <div class="main-info-card">
            <div class="identity-info">
              <div class="identity-avatar" :class="{'male': isGenderMale, 'female': !isGenderMale}">
                <svg v-if="isGenderMale" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <div class="identity-details">
                <div class="deceased-label">{{ isGenderMale ? 'Défunt' : 'Défunte' }}</div>
                <div class="marital-status">
                  <span class="status-badge" :class="isMarried ? 'married' : 'single'">
                    {{ isMarried ? 'Marié(e)' : 'Célibataire' }}
                  </span>
                  <span v-if="isGenderMale && isMarried && wivesCount" class="wives-count">
                    {{ wivesCount }} épouse{{ wivesCount > 1 ? 's' : '' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Section Ascendants -->
          <div class="section-card">
            <div class="section-header">
              <svg xmlns="http://www.w3.org/2000/svg" class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 17l-2-4h4l-2 4z"></path>
                <path d="M8 17l-2-4h4l-2 4z"></path>
                <path d="M14 13l-2-4h4l-2 4z"></path>
                <path d="M2 21h20"></path>
                <path d="M14 21v-3.5a2.5 2.5 0 0 0-5 0V21"></path>
                <path d="M8 21v-3.5"></path>
                <path d="M20 21v-3.5"></path>
              </svg>
              <h4 class="section-title">Ascendants en vie</h4>
            </div>

            <div class="section-content">
              <div v-if="livingAscendants.length > 0" class="relatives-grid">
                <div v-for="(ascendant, index) in livingAscendants" :key="index" class="relative-item">
                  <span class="relative-icon">◆</span>
                  <span class="relative-name">{{ ascendant }}</span>
                </div>
              </div>
              <div v-else class="empty-state">
                Aucun ascendant en vie n'a été indiqué
              </div>
            </div>
          </div>

          <!-- Section Frères et Sœurs -->
          <div class="section-card" v-if="hasSiblings || siblingsDataExists">
            <div class="section-header">
              <svg xmlns="http://www.w3.org/2000/svg" class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="8" cy="7" r="4"></circle>
                <circle cx="16" cy="7" r="4"></circle>
                <path d="M8 11v6"></path>
                <path d="M16 11v6"></path>
                <path d="M3 17h18"></path>
              </svg>
              <h4 class="section-title">Frères et Sœurs</h4>
            </div>

            <div class="section-content">
              <div v-if="hasSiblings" class="siblings-grid">
                <div v-if="siblingsData.brothers > 0" class="sibling-item">
                  <div class="sibling-count">{{ siblingsData.brothers }}</div>
                  <div class="sibling-type">{{ siblingsData.brothers > 1 ? 'Frères' : 'Frère' }}</div>
                </div>
                <div v-if="siblingsData.sisters > 0" class="sibling-item">
                  <div class="sibling-count">{{ siblingsData.sisters }}</div>
                  <div class="sibling-type">{{ siblingsData.sisters > 1 ? 'Sœurs' : 'Sœur' }}</div>
                </div>
                <div v-if="siblingsData.halfBrothersFather > 0" class="sibling-item half-sibling">
                  <div class="sibling-count">{{ siblingsData.halfBrothersFather }}</div>
                  <div class="sibling-type">{{ siblingsData.halfBrothersFather > 1 ? 'Demi-frères (père)' : 'Demi-frère (père)' }}</div>
                </div>
                <div v-if="siblingsData.halfSistersFather > 0" class="sibling-item half-sibling">
                  <div class="sibling-count">{{ siblingsData.halfSistersFather }}</div>
                  <div class="sibling-type">{{ siblingsData.halfSistersFather > 1 ? 'Demi-sœurs (père)' : 'Demi-sœur (père)' }}</div>
                </div>
                <div v-if="siblingsData.halfBrothersMother > 0 && shouldShowMaternalHalfSiblings" class="sibling-item half-sibling">
                  <div class="sibling-count">{{ siblingsData.halfBrothersMother }}</div>
                  <div class="sibling-type">{{ siblingsData.halfBrothersMother > 1 ? 'Demi-frères (mère)' : 'Demi-frère (mère)' }}</div>
                </div>
                <div v-if="siblingsData.halfSistersMother > 0 && shouldShowMaternalHalfSiblings" class="sibling-item half-sibling">
                  <div class="sibling-count">{{ siblingsData.halfSistersMother }}</div>
                  <div class="sibling-type">{{ siblingsData.halfSistersMother > 1 ? 'Demi-sœurs (mère)' : 'Demi-sœur (mère)' }}</div>
                </div>
              </div>
              <div v-else class="empty-state">
                Aucun frère ou sœur n'a été indiqué
              </div>
            </div>
          </div>

          <!-- Section Descendants -->
          <div class="section-card">
            <div class="section-header">
              <svg xmlns="http://www.w3.org/2000/svg" class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 3h20"></path>
                <path d="M10 3v3.5a2.5 2.5 0 0 1-5 0V3"></path>
                <path d="M16 3v3.5a2.5 2.5 0 0 0 5 0V3"></path>
                <path d="M4 7l2 4H2l2-4z"></path>
                <path d="M16 7l2 4h-4l2-4z"></path>
                <path d="M10 11l2 4h-4l2-4z"></path>
              </svg>
              <h4 class="section-title">Descendants</h4>
            </div>

            <div class="section-content">
              <div v-if="hasDescendants" class="descendants-grid">
                <div v-if="sons > 0" class="descendant-item">
                  <div class="descendant-count">{{ sons }}</div>
                  <div class="descendant-type">{{ sons > 1 ? 'Fils' : 'Fils' }}</div>
                </div>
                <div v-if="daughters > 0" class="descendant-item">
                  <div class="descendant-count">{{ daughters }}</div>
                  <div class="descendant-type">{{ daughters > 1 ? 'Filles' : 'Fille' }}</div>
                </div>
                <div v-if="grandsons > 0" class="descendant-item">
                  <div class="descendant-count">{{ grandsons }}</div>
                  <div class="descendant-type">{{ grandsons > 1 ? 'Petits-fils' : 'Petit-fils' }}</div>
                </div>
                <div v-if="granddaughters > 0" class="descendant-item">
                  <div class="descendant-count">{{ granddaughters }}</div>
                  <div class="descendant-type">{{ granddaughters > 1 ? 'Petites-filles' : 'Petite-fille' }}</div>
                </div>
                <div v-if="greatGrandsons > 0" class="descendant-item">
                  <div class="descendant-count">{{ greatGrandsons }}</div>
                  <div class="descendant-type">{{ greatGrandsons > 1 ? 'Arrière-petits-fils' : 'Arrière-petit-fils' }}</div>
                </div>
                <div v-if="greatGranddaughters > 0" class="descendant-item">
                  <div class="descendant-count">{{ greatGranddaughters }}</div>
                  <div class="descendant-type">{{ greatGranddaughters > 1 ? 'Arrière-petites-filles' : 'Arrière-petite-fille' }}</div>
                </div>
              </div>
              <div v-else class="empty-state">
                Aucun descendant n'a été indiqué
              </div>
            </div>
          </div>
        </div>

        <p class="text-xs text-gray-500 italic mb-6">
          Un email contenant ces informations et le calcul de la répartition de l'héritage sera envoyé à {{ email }}
        </p>

        <button
            @click="startNew"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          Démarrer un nouveau questionnaire
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuestionnaireStore } from '@/stores/questionnaire';

const router = useRouter();
const questionnaireStore = useQuestionnaireStore();

// Informations de base
const email = computed(() => questionnaireStore.email);
const answers = computed(() => questionnaireStore.answers);

// Informations personnelles
const isGenderMale = computed(() => answers.value.deceased_gender);
const isMarried = computed(() => answers.value.marital_status);
const wivesCount = computed(() => answers.value.wives_count);

// Ascendants
const livingAscendants = computed(() => {
  const ascendants = answers.value.ascendants_details || {};

  return Object.entries(ascendants)
      .filter(([_, isAlive]) => isAlive === true) // Vérification stricte sur true
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
const siblingsData = computed(() => answers.value.siblings_details || {
  brothers: 0,
  sisters: 0,
  halfBrothersFather: 0,
  halfSistersFather: 0,
  halfBrothersMother: 0,
  halfSistersMother: 0
});

// Vérifier si les données sur les frères et sœurs existent
const siblingsDataExists = computed(() => answers.value.siblings_details !== undefined);

// Vérifier si au moins un frère ou une sœur est présent
const hasSiblings = computed(() =>
    siblingsData.value.brothers > 0 ||
    siblingsData.value.sisters > 0 ||
    siblingsData.value.halfBrothersFather > 0 ||
    siblingsData.value.halfSistersFather > 0 ||
    siblingsData.value.halfBrothersMother > 0 ||
    siblingsData.value.halfSistersMother > 0
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

// Commencer un nouveau questionnaire
const startNew = () => {
  questionnaireStore.resetQuestionnaire();
  router.push('/');
};
</script>

<style scoped>
.summary-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.summary-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #047857;
}

.summary-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #047857;
}

.main-info-card {
  background: linear-gradient(135deg, #047857 0%, #10b981 100%);
  border-radius: 0.75rem;
  padding: 1.25rem;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.identity-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.identity-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.identity-avatar svg {
  width: 1.75rem;
  height: 1.75rem;
  stroke: currentColor;
}

.identity-avatar.male {
  background-color: rgba(59, 130, 246, 0.2);
}

.identity-avatar.female {
  background-color: rgba(236, 72, 153, 0.2);
}

.identity-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.deceased-label {
  font-size: 1.25rem;
  font-weight: 600;
}

.marital-status {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.status-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 500;
}

.status-badge.married {
  background-color: rgba(255, 255, 255, 0.2);
}

.status-badge.single {
  background-color: rgba(255, 255, 255, 0.15);
}

.wives-count {
  font-size: 0.75rem;
  background-color: rgba(255, 255, 255, 0.15);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
}

.section-card {
  background-color: white;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.section-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #047857;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.section-content {
  padding: 1rem;
}

.relatives-grid, .descendants-grid, .siblings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
}

.relative-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
}

.relative-icon {
  color: #059669;
  font-size: 0.625rem;
}

.descendant-item, .sibling-item {
  background-color: #f9fafb;
  border-radius: 0.5rem;
  padding: 0.75rem;
  text-align: center;
}

.sibling-item.half-sibling {
  background-color: #f0f9ff; /* Un fond légèrement bleuté pour différencier les demi-frères/sœurs */
  border-left: 3px solid #3b82f6;
}

.descendant-count, .sibling-count {
  font-size: 1.5rem;
  font-weight: 600;
  color: #047857;
}

.descendant-type, .sibling-type {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.empty-state {
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
  text-align: center;
  padding: 1rem 0;
}

/* Responsive */
@media (max-width: 480px) {
  .relatives-grid, .descendants-grid, .siblings-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .descendant-count, .sibling-count {
    font-size: 1.25rem;
  }

  .descendant-type, .sibling-type {
    font-size: 0.7rem;
  }
}
</style>