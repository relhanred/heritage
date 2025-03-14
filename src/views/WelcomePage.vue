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
            <svg xmlns="http://www.w3.org/2000/svg" class="size-24 mx-auto mb-4 text-[#047857]" viewBox="0 0 16 16">
              <path fill="currentColor" fill-rule="evenodd"
                    d="M6 3.5A1.5 1.5 0 0 1 7.5 2h1A1.5 1.5 0 0 1 10 3.5v1A1.5 1.5 0 0 1 8.5 6v1H14a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 2 7h5.5V6A1.5 1.5 0 0 1 6 4.5zm-6 8A1.5 1.5 0 0 1 1.5 10h1A1.5 1.5 0 0 1 4 11.5v1A1.5 1.5 0 0 1 2.5 14h-1A1.5 1.5 0 0 1 0 12.5zm6 0A1.5 1.5 0 0 1 7.5 10h1a1.5 1.5 0 0 1 1.5 1.5v1A1.5 1.5 0 0 1 8.5 14h-1A1.5 1.5 0 0 1 6 12.5zm6 0a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5z"/>
            </svg>
          </div>
        </div>

        <div class="bg-teal-50 border-l-4 border-teal-500 p-4 mb-8 rounded-r">
          <p class="text-sm text-gray-700 leading-relaxed">
            Vous allez répondre à un questionnaire qui a pour but de déterminer la composition familiale précise du
            défunt <span class="text-gray-600 italic">[qu'Allah lui accorde Sa miséricorde]</span>. Ce questionnaire ne
            pose
            que les questions utiles, en tenant compte de vos réponses. Une synthèse de vos réponses nous parviendra
            ensuite
            automatiquement. Après analyse par un connaisseur des règles d'héritage, un mail détaillé vous sera adressé
            pour
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
      <p>© {{ new Date().getFullYear() }} Questionnaire d'héritages</p>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {useQuestionnaireStore} from '@/stores/questionnaire';

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