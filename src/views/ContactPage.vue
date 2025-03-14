<!-- src/views/ContactPage.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-100 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div class="p-8 text-center">
        <div class="flex justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 class="text-2xl font-bold text-gray-900 mb-4">Consultation particulière requise</h1>

        <div class="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8 rounded-r text-left">
          <p class="text-sm text-gray-700 leading-relaxed">
            Dans le cas d'une épouse en période de viduité ou de grossesse, la situation nécessite une analyse plus
            approfondie pour déterminer correctement la répartition de l'héritage selon les lois d'Allah.
          </p>
        </div>

        <p class="text-gray-600 mb-8">
          Veuillez prendre contact avec nous afin de clarifier cette situation particulière. Nous vous
          accompagnerons dans cette démarche pour assurer une répartition équitable et conforme.
        </p>

        <div class="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <h2 class="text-lg font-medium text-gray-900 mb-2">Nos coordonnées</h2>
          <p class="text-gray-600">
            <strong>Email :</strong>  questions@lamadrassah.com<br>
            <strong>Téléphone :</strong> +33 X XX XX XX XX<br>
            <strong>Horaires :</strong> Du lundi au vendredi, de 9h à 17h
          </p>
        </div>

        <button
            @click="startNew"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useQuestionnaireStore } from '@/stores/questionnaire';

const router = useRouter();
const questionnaireStore = useQuestionnaireStore();

const startNew = () => {
  questionnaireStore.resetQuestionnaire();
  router.push('/');
};
</script>