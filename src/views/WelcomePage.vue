<!-- src/views/WelcomePage.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-100 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div class="p-8">
        <div class="flex justify-center mb-6">
          <h1 class="text-2xl font-bold text-gray-900">Questionnaire d'héritages</h1>
        </div>

        <div class="mb-8 text-center">
          <div class="mb-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="#047857" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="size-24 mx-auto mb-4">
              <path d="M6 12H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <path d="M6 8h12"></path>
              <path d="M18.3 17.7 20 16l-3-3-3 3 1.7 1.7"></path>
              <path d="m12.3 17.7 2-1.7-3-3-3 3 2 1.7"></path>
              <path d="M6.3 17.7 8 16l-3-3-3 3 1.7 1.7"></path>
              <path d="m12 16 2 2 2-2"></path>
              <path d="m6 16 2 2 2-2"></path>
              <path d="m18 16 2 2 2-2"></path>
            </svg>
          </div>
        </div>

        <div class="bg-teal-50 border-l-4 border-teal-500 p-4 mb-8 rounded-r">
          <p class="text-sm text-gray-700 leading-relaxed">
            Vous allez répondre à un questionnaire qui a pour but de déterminer la composition familiale précise du
            défunt <span class="text-gray-600 italic">[qu'Allah lui accorde Sa miséricorde]</span>. Ce questionnaire ne pose
            que les questions utiles, en tenant compte de vos réponses. Une synthèse de vos réponses nous parviendra ensuite
            automatiquement. Après analyse par un connaisseur des règles d'héritage, un mail détaillé vous sera adressé pour
            vous permettre de répartir équitablement les biens du défunt selon les lois d'Allah.
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Adresse email</label>
            <div class="mt-1">
              <input
                  id="email"
                  v-model="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  placeholder="votre@email.com"
                  :class="{'border-red-500': emailError}"
              />
              <p v-if="emailError" class="mt-2 text-sm text-red-600">{{ emailError }}</p>
            </div>
          </div>

          <div>
            <button
                type="submit"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out"
            >
              Commencer le questionnaire
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="text-center mt-6 text-sm text-gray-500">
      <p>© {{ new Date().getFullYear() }} Calculateur d'Héritage</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuestionnaireStore } from '@/stores/questionnaire';

const router = useRouter();
const questionnaireStore = useQuestionnaireStore();

const email = ref('');
const emailError = ref('');

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const handleSubmit = () => {
  // Réinitialiser l'erreur
  emailError.value = '';

  // Valider l'email
  if (!validateEmail(email.value)) {
    emailError.value = 'Veuillez entrer une adresse email valide.';
    return;
  }

  // Sauvegarder l'email dans le store
  questionnaireStore.setEmail(email.value);

  // Rediriger vers la première question
  router.push('/questionnaire');
};
</script>