<!-- src/views/QuestionnairePage.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-100 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div class="p-8">
        <div class="flex items-center mb-6">
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

          <SiblingsTreeQuestion
              v-else-if="currentQuestion.type === 'siblings_tree'"
              :modelValue="siblingsTree"
              @update:modelValue="siblingsTree = $event"
              :gender="questionnaireStore.answers.deceased_gender"
              @update:validationError="siblingsValidationError = $event"
          />

          <DescendantsTreeQuestion
              v-else-if="currentQuestion.type === 'descendants_tree'"
              :modelValue="descendantsTree"
              @update:modelValue="descendantsTree = $event"
              :gender="questionnaireStore.answers.deceased_gender"
              @update:validationError="descendantsValidationError = $event"
          />

          <StructuredSummaryQuestion
              v-else-if="currentQuestion.type === 'structured_summary'"
          />

          <InfoQuestion
              v-else-if="currentQuestion.type === 'info'"
              :text="currentQuestion.text"
          />
        </QuestionContainer>

        <!-- Actions -->
        <div class="flex justify-between mt-6">
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
            {{ getFinalButtonText }}
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
import RadioQuestion from '@/components/questionnaire/QuestionTypes/RadioQuestion.vue';
import InfoQuestion from '@/components/questionnaire/QuestionTypes/InfoQuestion.vue';
import AscendantsTreeQuestion from '@/components/questionnaire/QuestionTypes/AscendantsTreeQuestion.vue';
import SiblingsTreeQuestion from '@/components/questionnaire/QuestionTypes/SiblingsTreeQuestion.vue';
import DescendantsTreeQuestion from '@/components/questionnaire/QuestionTypes/DescendantsTreeQuestion.vue';
import StructuredSummaryQuestion from '@/components/questionnaire/QuestionTypes/StructuredSummaryQuestion.vue';

const router = useRouter();
const questionnaireStore = useQuestionnaireStore();

// Question actuelle
const currentQuestionKey = ref('start');
const questionHistory = ref([]); // Historique des questions pour permettre de revenir en arrière

// Réponses
const currentAnswer = ref(null);
const ascendantsSelection = ref({}); // Variable pour la sélection des ascendants
const siblingsTree = ref({
  brothers: '0',
  sisters: '0',
  halfBrothersFather: '0',
  halfSistersFather: '0',
  halfBrothersMother: '0',
  halfSistersMother: '0'
}); // Variable pour l'arbre des frères et sœurs
const descendantsTree = ref({
  sons: '0',
  daughters: '0',
  grandsons: '0',
  granddaughters: '0',
  greatGrandsons: '0',
  greatGranddaughters: '0'
}); // Variable pour l'arbre des descendants

// Messages d'erreur
const siblingsValidationError = ref('');
const descendantsValidationError = ref('');

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
  else if (type === 'siblings_tree') {
    return !siblingsValidationError.value;
  }
  else if (type === 'descendants_tree') {
    return !descendantsValidationError.value;
  }
  else if (type === 'ascendants_tree') {
    // Pour l'arbre généalogique, on considère que c'est toujours valide
    // car la personne peut n'avoir aucun ascendant vivant
    return true;
  }
  else if (type === 'info' || type === 'structured_summary') {
    // Pour les questions de type info ou résumé, pas besoin de réponse
    return true;
  }

  return false;
});

// Texte personnalisé pour le bouton en fonction de l'étape
const getFinalButtonText = computed(() => {
  // Si c'est la dernière étape (résumé), afficher "Finaliser"
  if (currentQuestion.value && currentQuestion.value.finalPage) {
    return 'Finaliser';
  }
  // Sinon, afficher "Suivant"
  return 'Suivant';
});

// Chargement initial des données
onMounted(() => {
  loadSavedAnswer();
});

const loadSavedAnswer = () => {
  const savedAnswer = questionnaireStore.answers[currentQuestion.value.id];

  if (currentQuestion.value.type === 'siblings_tree') {
    if (savedAnswer) {
      siblingsTree.value = {
        brothers: savedAnswer.brothers?.toString() || '0',
        sisters: savedAnswer.sisters?.toString() || '0',
        halfBrothersFather: savedAnswer.halfBrothersFather?.toString() || '0',
        halfSistersFather: savedAnswer.halfSistersFather?.toString() || '0',
        halfBrothersMother: savedAnswer.halfBrothersMother?.toString() || '0',
        halfSistersMother: savedAnswer.halfSistersMother?.toString() || '0'
      };
    } else {
      siblingsTree.value = {
        brothers: '0',
        sisters: '0',
        halfBrothersFather: '0',
        halfSistersFather: '0',
        halfBrothersMother: '0',
        halfSistersMother: '0'
      };
    }
  }
  else if (currentQuestion.value.type === 'descendants_tree') {
    if (savedAnswer) {
      descendantsTree.value = {
        sons: savedAnswer.sons?.toString() || '0',
        daughters: savedAnswer.daughters?.toString() || '0',
        grandsons: savedAnswer.grandsons?.toString() || '0',
        granddaughters: savedAnswer.granddaughters?.toString() || '0',
        greatGrandsons: savedAnswer.greatGrandsons?.toString() || '0',
        greatGranddaughters: savedAnswer.greatGranddaughters?.toString() || '0'
      };
    } else {
      descendantsTree.value = {
        sons: '0',
        daughters: '0',
        grandsons: '0',
        granddaughters: '0',
        greatGrandsons: '0',
        greatGranddaughters: '0'
      };
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

const saveCurrentAnswer = () => {
  if (currentQuestion.value.type === 'siblings_tree') {
    // Sauvegarder l'arbre des frères et sœurs
    questionnaireStore.saveAnswer(currentQuestion.value.id, {
      brothers: parseInt(siblingsTree.value.brothers) || 0,
      sisters: parseInt(siblingsTree.value.sisters) || 0,
      halfBrothersFather: parseInt(siblingsTree.value.halfBrothersFather) || 0,
      halfSistersFather: parseInt(siblingsTree.value.halfSistersFather) || 0,
      halfBrothersMother: parseInt(siblingsTree.value.halfBrothersMother) || 0,
      halfSistersMother: parseInt(siblingsTree.value.halfSistersMother) || 0
    });
  }
  else if (currentQuestion.value.type === 'descendants_tree') {
    // Sauvegarder l'arbre des descendants
    questionnaireStore.saveAnswer(currentQuestion.value.id, {
      sons: parseInt(descendantsTree.value.sons) || 0,
      daughters: parseInt(descendantsTree.value.daughters) || 0,
      grandsons: parseInt(descendantsTree.value.grandsons) || 0,
      granddaughters: parseInt(descendantsTree.value.granddaughters) || 0,
      greatGrandsons: parseInt(descendantsTree.value.greatGrandsons) || 0,
      greatGranddaughters: parseInt(descendantsTree.value.greatGranddaughters) || 0
    });
  }
  else if (currentQuestion.value.type === 'ascendants_tree') {
    // Sauvegarder les sélections d'ascendants
    questionnaireStore.saveAnswer(currentQuestion.value.id, ascendantsSelection.value);
  }
  else if (currentQuestion.value.type !== 'info' && currentQuestion.value.type !== 'structured_summary') {
    // Pour les autres types de questions (sauf info et résumé)
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
  if (currentQuestion.value.type === 'siblings_tree') {
    return {
      brothers: parseInt(siblingsTree.value.brothers) || 0,
      sisters: parseInt(siblingsTree.value.sisters) || 0,
      halfBrothersFather: parseInt(siblingsTree.value.halfBrothersFather) || 0,
      halfSistersFather: parseInt(siblingsTree.value.halfSistersFather) || 0,
      halfBrothersMother: parseInt(siblingsTree.value.halfBrothersMother) || 0,
      halfSistersMother: parseInt(siblingsTree.value.halfSistersMother) || 0
    };
  }
  else if (currentQuestion.value.type === 'descendants_tree') {
    return {
      sons: parseInt(descendantsTree.value.sons) || 0,
      daughters: parseInt(descendantsTree.value.daughters) || 0,
      grandsons: parseInt(descendantsTree.value.grandsons) || 0,
      granddaughters: parseInt(descendantsTree.value.granddaughters) || 0,
      greatGrandsons: parseInt(descendantsTree.value.greatGrandsons) || 0,
      greatGranddaughters: parseInt(descendantsTree.value.greatGranddaughters) || 0
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
  siblingsTree.value = {
    brothers: '0',
    sisters: '0',
    halfBrothersFather: '0',
    halfSistersFather: '0',
    halfBrothersMother: '0',
    halfSistersMother: '0'
  };
  descendantsTree.value = {
    sons: '0',
    daughters: '0',
    grandsons: '0',
    granddaughters: '0',
    greatGrandsons: '0',
    greatGranddaughters: '0'
  };
  ascendantsSelection.value = {};
  siblingsValidationError.value = '';
  descendantsValidationError.value = '';
};

// Soumettre la réponse actuelle et passer à la question suivante
const submitAnswer = () => {
  if (!isAnswerValid.value) return;

  // Sauvegarder la réponse selon le type de question
  saveCurrentAnswer();

  // Si la question actuelle est la dernière (résumé structuré), rediriger directement
  if (currentQuestion.value.finalPage) {
    router.push('/merci');
    return;
  }

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