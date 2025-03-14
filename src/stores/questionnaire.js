import { defineStore } from 'pinia';

export const useQuestionnaireStore = defineStore('questionnaire', {
    state: () => ({
        email: '',
        currentStep: 'welcome',
        answers: {},
    }),

    actions: {
        setEmail(email) {
            this.email = email;
        },

        setCurrentStep(step) {
            this.currentStep = step;
        },

        saveAnswer(questionId, answer) {
            this.answers[questionId] = answer;
        },

        resetQuestionnaire() {
            this.currentStep = 'welcome';
            this.answers = {};
        }
    },

    getters: {
        isEmailSet: (state) => !!state.email,
    }
});