<!-- src/views/QuestionnairePage.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-100 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div class="p-8">
        <div class="flex items-center mb-6">
          <button
              @click="goBack"
              class="mr-2 text-gray-500 hover:text-gray-700"
              aria-label="Retour"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          <h1 class="text-xl font-semibold text-gray-900 flex-grow text-center">Questionnaire d'héritage</h1>
        </div>

        <!-- En-tête du questionnaire sans indicateur de progression -->
        <div class="mb-6 border-b pb-3">
          <h2 class="text-sm font-medium text-teal-600">Questionnaire en cours</h2>
        </div>

        <!-- Container de la question courante -->
        <QuestionContainer :questionText="questionText">
          <!-- Champs de réponse en fonction du type de question -->
          <BooleanQuestion
              v-if="currentQuestion.type === 'boolean'"
              :modelValue="currentAnswer"
              @update:modelValue="currentAnswer = $event"
              :options="currentQuestion.options || {}"
          />

          <ChildrenDistributionQuestion
              v-else-if="currentQuestion.type === 'children_distribution'"
              :modelValue="childrenDistribution"
              @update:modelValue="childrenDistribution = $event"
              @update:validationError="childrenValidationError = $event"
          />

          <ChildrenDistributionQuestion
              v-else-if="currentQuestion.type === 'grandchildren_distribution'"
              :modelValue="grandchildrenDistribution"
              @update:modelValue="grandchildrenDistribution = $event"
              labelPrefix="grandchildren"
              sonsKey="grandsons"
              daughtersKey="granddaughters"
              sonsLabel="petits-fils"
              daughtersLabel="petites-filles"
              @update:validationError="grandchildrenValidationError = $event"
          />

          <ChildrenDistributionQuestion
              v-else-if="currentQuestion.type === 'great_grandchildren_distribution'"
              :modelValue="greatGrandchildrenDistribution"
              @update:modelValue="greatGrandchildrenDistribution = $event"
              labelPrefix="great-grandchildren"
              sonsKey="greatGrandsons"
              daughtersKey="greatGranddaughters"
              sonsLabel="arrière-petits-fils"
              daughtersLabel="arrière-petites-filles"
              @update:validationError="greatGrandchildrenValidationError = $event"
          />

          <RadioQuestion
              v-else-if="currentQuestion.type === 'radio'"
              :modelValue="currentAnswer"
              @update:modelValue="currentAnswer = $event"
              :options="currentQuestion.options || []"
              :name="currentQuestion.id"
          />

          <AscendantsTreeQuestion
              v-else-if="currentQuestion.type === 'ascendants_tree'"
              :modelValue="ascendantsSelection"
              @update:modelValue="ascendantsSelection = $event"
              :gender="questionnaireStore.answers.deceased_gender"
          />

          <InfoQuestion
              v-else-if="currentQuestion.type === 'info'"
              :text="currentQuestion.text"
          />
        </QuestionContainer>

        <!-- Actions -->
        <div class="flex justify-between">
          <button
              type="button"
              @click="goBack"
              class="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Précédent
          </button>

          <button
              type="button"
              @click="submitAnswer"
              class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              :disabled="!isAnswerValid"
              :class="{'opacity-50 cursor-not-allowed': !isAnswerValid}"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuestionnaireStore } from '@/stores/questionnaire';
import { questionTree, getQuestionText } from '@/services/questionTreeService';

// Importer les composants
import QuestionContainer from '@/components/questionnaire/QuestionContainer.vue';
import BooleanQuestion from '@/components/questionnaire/QuestionTypes/BooleanQuestion.vue';
import ChildrenDistributionQuestion from '@/components/questionnaire/QuestionTypes/ChildrenDistributionQuestion.vue';
import RadioQuestion from '@/components/questionnaire/QuestionTypes/RadioQuestion.vue';
import InfoQuestion from '@/components/questionnaire/QuestionTypes/InfoQuestion.vue';
import AscendantsTreeQuestion from '@/components/questionnaire/QuestionTypes/AscendantsTreeQuestion.vue';

const router = useRouter();
const questionnaireStore = useQuestionnaireStore();

// Question actuelle
const currentQuestionKey = ref('start');
const questionHistory = ref([]); // Historique des questions pour permettre de revenir en arrière

// Réponses
const currentAnswer = ref(null);
const childrenDistribution = ref({ sons: '', daughters: '' });
const grandchildrenDistribution = ref({ grandsons: '', granddaughters: '' });
const greatGrandchildrenDistribution = ref({ greatGrandsons: '', greatGranddaughters: '' });
const ascendantsSelection = ref({}); // Nouvelle variable pour la sélection des ascendants

// Messages d'erreur
const childrenValidationError = ref('');
const grandchildrenValidationError = ref('');
const greatGrandchildrenValidationError = ref('');

// Obtenir la question actuelle
const currentQuestion = computed(() => questionTree[currentQuestionKey.value] || {});

// Obtenir le texte de la question
const questionText = computed(() =>
    getQuestionText(currentQuestion.value, questionnaireStore.answers)
);

// Vérifier si la réponse est valide
const isAnswerValid = computed(() => {
  const type = currentQuestion.value.type;

  if (type === 'boolean' || type === 'radio' || type === 'select') {
    return currentAnswer.value !== null && currentAnswer.value !== '';
  }
  else if (type === 'children_distribution') {
    return !childrenValidationError.value;
  }
  else if (type === 'grandchildren_distribution') {
    return !grandchildrenValidationError.value;
  }
  else if (type === 'great_grandchildren_distribution') {
    return !greatGrandchildrenValidationError.value;
  }
  else if (type === 'ascendants_tree') {
    // Pour l'arbre généalogique, on considère que c'est toujours valide
    // car la personne peut n'avoir aucun ascendant vivant
    return true;
  }
  else if (type === 'info') {
    // Pour les questions de type info, pas besoin de réponse
    return true;
  }

  return false;
});

// Chargement initial des données
onMounted(() => {
  loadSavedAnswer();
});

const loadSavedAnswer = () => {
  const savedAnswer = questionnaireStore.answers[currentQuestion.value.id];

  if (currentQuestion.value.type === 'children_distribution') {
    if (savedAnswer) {
      childrenDistribution.value = {
        sons: savedAnswer.sons?.toString() || '',
        daughters: savedAnswer.daughters?.toString() || ''
      };
    } else {
      childrenDistribution.value = { sons: '', daughters: '' };
    }
  }
  else if (currentQuestion.value.type === 'grandchildren_distribution') {
    if (savedAnswer) {
      // Conversion explicite en chaînes pour assurer la compatibilité avec les inputs
      grandchildrenDistribution.value = {
        grandsons: savedAnswer.grandsons?.toString() || '',
        granddaughters: savedAnswer.granddaughters?.toString() || ''
      };
    } else {
      grandchildrenDistribution.value = { grandsons: '', granddaughters: '' };
    }
  }
  else if (currentQuestion.value.type === 'great_grandchildren_distribution') {
    if (savedAnswer) {
      greatGrandchildrenDistribution.value = {
        greatGrandsons: savedAnswer.greatGrandsons?.toString() || '',
        greatGranddaughters: savedAnswer.greatGranddaughters?.toString() || ''
      };
    } else {
      greatGrandchildrenDistribution.value = { greatGrandsons: '', greatGranddaughters: '' };
    }
  }
  else if (currentQuestion.value.type === 'ascendants_tree') {
    if (savedAnswer) {
      ascendantsSelection.value = { ...savedAnswer };
    } else {
      ascendantsSelection.value = {};
    }
  }
  else if (currentQuestion.value.type === 'boolean') {
    // Traitement spécial pour les questions booléennes
    currentAnswer.value = savedAnswer === true ? true : savedAnswer === false ? false : null;
  }
  else if (savedAnswer !== undefined) {
    // Pour les autres types de questions
    currentAnswer.value = savedAnswer;
  } else {
    currentAnswer.value = null;
  }
};

// 2. Assurez-vous que la fonction saveCurrentAnswer() fonctionne correctement
const saveCurrentAnswer = () => {
  if (currentQuestion.value.type === 'children_distribution') {
    questionnaireStore.saveAnswer(currentQuestion.value.id, {
      sons: parseInt(childrenDistribution.value.sons) || 0,
      daughters: parseInt(childrenDistribution.value.daughters) || 0
    });
  }
  else if (currentQuestion.value.type === 'grandchildren_distribution') {
    // S'assurer que les valeurs sont converties en nombres pour stockage
    questionnaireStore.saveAnswer(currentQuestion.value.id, {
      grandsons: parseInt(grandchildrenDistribution.value.grandsons) || 0,
      granddaughters: parseInt(grandchildrenDistribution.value.granddaughters) || 0
    });
  }
  else if (currentQuestion.value.type === 'great_grandchildren_distribution') {
    questionnaireStore.saveAnswer(currentQuestion.value.id, {
      greatGrandsons: parseInt(greatGrandchildrenDistribution.value.greatGrandsons) || 0,
      greatGranddaughters: parseInt(greatGrandchildrenDistribution.value.greatGranddaughters) || 0
    });
  }
  else if (currentQuestion.value.type === 'ascendants_tree') {
    // Sauvegarder les sélections d'ascendants
    questionnaireStore.saveAnswer(currentQuestion.value.id, ascendantsSelection.value);
  }
  else if (currentQuestion.value.type !== 'info') {
    // Pour les autres types de questions (sauf info)
    questionnaireStore.saveAnswer(currentQuestion.value.id, currentAnswer.value);
  }
};

// Naviguer à la question précédente
const goBack = () => {
  if (questionHistory.value.length > 0) {
    // Obtenir la dernière question de l'historique
    const previousQuestionKey = questionHistory.value.pop();
    currentQuestionKey.value = previousQuestionKey;

    // Charger la réponse pour cette question
    loadSavedAnswer();
  } else {
    // Si pas d'historique, revenir à la page d'accueil
    router.push('/');
  }
};

// Obtenir la valeur de la réponse actuelle selon le type de question
const getCurrentAnswerValue = () => {
  if (currentQuestion.value.type === 'children_distribution') {
    return {
      sons: parseInt(childrenDistribution.value.sons) || 0,
      daughters: parseInt(childrenDistribution.value.daughters) || 0
    };
  }
  else if (currentQuestion.value.type === 'grandchildren_distribution') {
    return {
      grandsons: parseInt(grandchildrenDistribution.value.grandsons) || 0,
      granddaughters: parseInt(grandchildrenDistribution.value.granddaughters) || 0
    };
  }
  else if (currentQuestion.value.type === 'great_grandchildren_distribution') {
    return {
      greatGrandsons: parseInt(greatGrandchildrenDistribution.value.greatGrandsons) || 0,
      greatGranddaughters: parseInt(greatGrandchildrenDistribution.value.greatGranddaughters) || 0
    };
  }
  else if (currentQuestion.value.type === 'ascendants_tree') {
    return ascendantsSelection.value;
  }
  else {
    return currentAnswer.value;
  }
};


// Réinitialiser les réponses pour une nouvelle question
const resetAnswers = () => {
  currentAnswer.value = null;
  childrenDistribution.value = { sons: '', daughters: '' };
  grandchildrenDistribution.value = { grandsons: '', granddaughters: '' };
  greatGrandchildrenDistribution.value = { greatGrandsons: '', greatGranddaughters: '' };
  ascendantsSelection.value = {};
  childrenValidationError.value = '';
  grandchildrenValidationError.value = '';
  greatGrandchildrenValidationError.value = '';
};

// Soumettre la réponse actuelle et passer à la question suivante
const submitAnswer = () => {
  if (!isAnswerValid.value) return;

  // Sauvegarder la réponse selon le type de question
  saveCurrentAnswer();

  // Déterminer la réponse pour la navigation
  let nextAnswer = getCurrentAnswerValue();

  // Déterminer la question suivante
  const nextQuestionKey = currentQuestion.value.next ?
      currentQuestion.value.next(nextAnswer, questionnaireStore.answers) : null;

  if (nextQuestionKey) {
    // Obtenir la prochaine question
    const nextQuestion = questionTree[nextQuestionKey];

    // Vérifier s'il y a une redirection spéciale
    if (nextQuestion && nextQuestion.specialRedirect) {
      // Ajouter la question actuelle à l'historique avant de rediriger
      questionHistory.value.push(currentQuestionKey.value);

      // Passer à la question suivante (qui contient la redirection)
      currentQuestionKey.value = nextQuestionKey;

      // Effectuer la redirection
      router.push(nextQuestion.specialRedirect);
      return;
    }

    // Ajouter la question actuelle à l'historique
    questionHistory.value.push(currentQuestionKey.value);

    // Passer à la question suivante
    currentQuestionKey.value = nextQuestionKey;

    // Réinitialiser les réponses
    resetAnswers();

    // Charger la réponse existante pour la nouvelle question
    loadSavedAnswer();
  } else {
    // Fin du questionnaire
    router.push('/merci');
  }
};
</script>