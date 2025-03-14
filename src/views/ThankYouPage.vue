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

// Récupérer l'email enregistré
const email = computed(() => questionnaireStore.email);

// Commencer un nouveau questionnaire
const startNew = () => {
  questionnaireStore.resetQuestionnaire();
  router.push('/');
};
</script>