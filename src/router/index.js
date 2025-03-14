import { createRouter, createWebHistory } from 'vue-router'
import WelcomePage from "@/views/WelcomePage.vue";
import QuestionnairePage from "@/views/QuestionnairePage.vue";
import {useQuestionnaireStore} from "@/stores/questionnaire.js";
import ThankYouPage from "@/views/ThankYouPage.vue";
import ContactPage from "@/views/ContactPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: WelcomePage
    },
    {
      path: '/questionnaire',
      name: 'Questionnaire',
      component: QuestionnairePage,
      // Protection de la route: rediriger vers l'accueil si l'email n'est pas défini
      beforeEnter: (to, from, next) => {
        const questionnaireStore = useQuestionnaireStore();
        if (!questionnaireStore.isEmailSet) {
          next({ name: 'Welcome' });
        } else {
          next();
        }
      }
    },
    {
      path: '/merci',
      name: 'ThankYou',
      component: ThankYouPage,
      beforeEnter: (to, from, next) => {
        const questionnaireStore = useQuestionnaireStore();
        if (!questionnaireStore.isEmailSet) {
          next({ name: 'Welcome' });
        } else {
          next();
        }
      }
    },
    {
      path: '/contact',
      name: 'Contact',
      component: ContactPage,
      // Protection de la route: rediriger vers l'accueil si l'email n'est pas défini
      beforeEnter: (to, from, next) => {
        const questionnaireStore = useQuestionnaireStore();
        if (!questionnaireStore.isEmailSet) {
          next({ name: 'Welcome' });
        } else {
          next();
        }
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
})

export default router
