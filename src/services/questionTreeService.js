export const questionTree = {
    start: {
        id: 'deceased_gender',
        text: 'Le défunt est :',
        type: 'boolean',
        options: { true: 'Un homme', false: 'Une femme' },
        next: (answer) => 'marital_status' // Question suivante (même pour les deux réponses)
    },
    marital_status: {
        id: 'marital_status',
        // Le texte de la question change en fonction du genre
        getText: (answers) => answers.deceased_gender ?
            'Le défunt était-il marié ?' :
            'La défunte était-elle mariée ?',
        type: 'boolean',
        next: (answer, allAnswers) => {
            // Si c'est une femme (mariée ou non), on passe directement à l'arbre des descendants
            if (!allAnswers.deceased_gender) {
                return 'descendants_tree';
            }

            // Si c'est un homme marié, demander le nombre d'épouses
            if (answer && allAnswers.deceased_gender) {
                return 'wives_count';
            }

            // Si c'est un homme non marié, passer directement à l'arbre des descendants
            return 'descendants_tree';
        }
    },
    wives_count: {
        id: 'wives_count',
        text: 'Combien d\'épouses non divorcées le défunt avait-il ?',
        type: 'radio',
        options: [
            { value: 1, label: '1' },
            { value: 2, label: '2' },
            { value: 3, label: '3' },
            { value: 4, label: '4' }
        ],
        next: (answer) => {
            // Si une seule épouse, demander si elle était enceinte
            if (answer === 1) {
                return 'single_wife_pregnant';
            }
            // Si plusieurs épouses, demander si au moins une était enceinte
            else {
                return 'multiple_wives_pregnant';
            }
        }
    },
    single_wife_pregnant: {
        id: 'single_wife_pregnant',
        text: 'L\'épouse était-elle enceinte ou en période de viduité ?',
        type: 'boolean',
        next: (answer) => {
            // Si l'épouse était enceinte/en période de viduité, rediriger vers contact
            if (answer === true) {
                return 'special_case';
            } else {
                // Si pas enceinte, passer directement à l'arbre des descendants
                return 'descendants_tree';
            }
        }
    },
    multiple_wives_pregnant: {
        id: 'multiple_wives_pregnant',
        text: 'Au moins une de ses épouses était-elle enceinte ou en période de viduité ?',
        type: 'boolean',
        next: (answer) => {
            // Si au moins une épouse était enceinte/en période de viduité, rediriger vers contact
            if (answer === true) {
                return 'special_case';
            } else {
                // Si aucune n'est enceinte, passer directement à l'arbre des descendants
                return 'descendants_tree';
            }
        }
    },

    // Nouvel arbre des descendants (directement sans question préalable)
    descendants_tree: {
        id: 'descendants_tree',
        getText: (answers) => answers.deceased_gender ?
            'Veuillez indiquer le nombre de descendants musulmans et en vie du défunt :' :
            'Veuillez indiquer le nombre de descendants musulmans et en vie de la défunte :',
        type: 'descendants_tree',
        next: (answer) => 'descendants_summary'
    },

    // Résumé des descendants sélectionnés
    descendants_summary: {
        id: 'descendants_summary',
        getText: (answers) => {
            const descendants = answers.descendants_tree || {};

            // Récupérer les nombres (convertir en entiers)
            const sons = parseInt(descendants.sons) || 0;
            const daughters = parseInt(descendants.daughters) || 0;
            const grandsons = parseInt(descendants.grandsons) || 0;
            const granddaughters = parseInt(descendants.granddaughters) || 0;
            const greatGrandsons = parseInt(descendants.greatGrandsons) || 0;
            const greatGranddaughters = parseInt(descendants.greatGranddaughters) || 0;

            // Construire un résumé des descendants
            const parts = [];

            if (sons > 0) {
                parts.push(`${sons} fils`);
            }

            if (daughters > 0) {
                parts.push(`${daughters} fille${daughters > 1 ? 's' : ''}`);
            }

            if (grandsons > 0) {
                parts.push(`${grandsons} petit${grandsons > 1 ? 's' : ''}-fils`);
            }

            if (granddaughters > 0) {
                parts.push(`${granddaughters} petite${granddaughters > 1 ? 's' : ''}-fille${granddaughters > 1 ? 's' : ''}`);
            }

            if (greatGrandsons > 0) {
                parts.push(`${greatGrandsons} arrière-petit${greatGrandsons > 1 ? 's' : ''}-fils`);
            }

            if (greatGranddaughters > 0) {
                parts.push(`${greatGranddaughters} arrière-petite${greatGranddaughters > 1 ? 's' : ''}-fille${greatGranddaughters > 1 ? 's' : ''}`);
            }

            const prefix = answers.deceased_gender ? 'Le défunt a ' : 'La défunte a ';

            if (parts.length === 0) {
                return 'Aucun descendant n\'a été indiqué.';
            } else if (parts.length === 1) {
                return `${prefix}${parts[0]}.`;
            } else {
                const lastPart = parts.pop();
                return `${prefix}${parts.join(', ')} et ${lastPart}.`;
            }
        },
        type: 'info',
        next: (answer) => 'has_muslim_ascendants'
    },

    // Nouvelle question sur les ascendants musulmans
    has_muslim_ascendants: {
        id: 'has_muslim_ascendants',
        getText: (answers) => answers.deceased_gender ?
            'Le défunt a-t-il encore des ascendants musulmans en vie (parents, grands-parents, arrière-grands-parents) ?' :
            'La défunte a-t-elle encore des ascendants musulmans en vie (parents, grands-parents, arrière-grands-parents) ?',
        type: 'boolean',
        next: (answer) => {
            // Si la personne a des ascendants musulmans, on pourrait poser des questions plus spécifiques
            if (answer === true) {
                return 'ascendants_details';
            } else {
                // Si pas d'ascendants, on termine le questionnaire
                return 'end';
            }
        }
    },

    // Question pour sélectionner les ascendants vivants
    ascendants_details: {
        id: 'ascendants_details',
        getText: (answers) => answers.deceased_gender ?
            'Veuillez sélectionner les ascendants du défunt qui sont encore en vie :' :
            'Veuillez sélectionner les ascendants de la défunte qui sont encore en vie :',
        type: 'ascendants_tree',
        next: (answer) => 'ascendants_summary'
    },

    // Résumé des ascendants sélectionnés
    ascendants_summary: {
        id: 'ascendants_summary',
        getText: (answers) => {
            const ascendants = answers.ascendants_details || {};
            const livingAscendants = Object.entries(ascendants)
                .filter(([_, isAlive]) => isAlive)
                .map(([id, _]) => {
                    switch(id) {
                        case 'father': return 'le père';
                        case 'mother': return 'la mère';
                        case 'paternal_grandfather': return 'le grand-père paternel';
                        case 'paternal_grandmother': return 'la grand-mère paternelle';
                        case 'maternal_grandfather': return 'le grand-père maternel';
                        case 'maternal_grandmother': return 'la grand-mère maternelle';
                        default:
                            if (id.includes('great')) {
                                return 'un(e) arrière-grand-parent';
                            }
                            return 'un ascendant';
                    }
                });

            if (livingAscendants.length === 0) {
                return 'Aucun ascendant vivant n\'a été sélectionné.';
            }

            return `Ascendants vivants sélectionnés : ${livingAscendants.join(', ')}.`;
        },
        type: 'info',
        next: (answer) => 'end'
    },

    special_case: {
        id: 'special_case',
        text: 'La situation nécessite une consultation particulière.',
        type: 'info',
        specialRedirect: '/contact', // Indique une redirection spéciale
        next: (answer) => null // Ajout d'une fonction next pour éviter des erreurs potentielles
    },

    end: {
        id: 'end',
        text: 'Merci d\'avoir répondu aux questions',
        type: 'info',
        next: null // Fin du questionnaire
    }
};

export const getNextQuestion = (currentQuestion, answer, allAnswers) => {
    if (!currentQuestion || !currentQuestion.next) return null;

    const nextQuestionKey = currentQuestion.next(answer, allAnswers);
    if (!nextQuestionKey) return null;

    return {
        key: nextQuestionKey,
        question: questionTree[nextQuestionKey]
    };
};

export const getQuestionText = (question, answers) => {
    if (question.getText && typeof question.getText === 'function') {
        return question.getText(answers);
    }
    return question.text || '';
};