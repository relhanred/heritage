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
            // Si c'est une femme (mariée ou non), on demande si elle a des enfants
            if (!allAnswers.deceased_gender) {
                return 'woman_has_children';
            }

            // Si c'est un homme marié, demander le nombre d'épouses
            if (answer && allAnswers.deceased_gender) {
                return 'wives_count';
            }

            // Si c'est un homme non marié, demander s'il a des enfants
            return 'man_has_children';
        }
    },
    wives_count: {
        id: 'wives_count',
        text: 'Nombre d\'épouses non divorcées :',
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
                // Si pas enceinte, passer à la question sur les enfants pour un homme
                return 'man_has_children';
            }
        }
    },
    multiple_wives_pregnant: {
        id: 'multiple_wives_pregnant',
        text: 'Au moins une des épouses était-elle enceinte ou en période de viduité ?',
        type: 'boolean',
        next: (answer) => {
            // Si au moins une épouse était enceinte/en période de viduité, rediriger vers contact
            if (answer === true) {
                return 'special_case';
            } else {
                // Si aucune n'est enceinte, passer à la question sur les enfants pour un homme
                return 'man_has_children';
            }
        }
    },
    woman_has_children: {
        id: 'woman_has_children',
        text: 'La défunte a-t-elle un/des enfants musulmans ?',
        type: 'boolean',
        next: (answer) => {
            // Si elle a des enfants, demander combien de fils et de filles
            if (answer === true) {
                return 'children_count';
            } else {
                // Si pas d'enfants, demander si elle a des ascendants musulmans
                return 'has_muslim_ascendants';
            }
        }
    },

    man_has_children: {
        id: 'man_has_children',
        text: 'Le défunt a-t-il un/des enfants musulmans et légitimes (issus d\'un mariage) ?',
        type: 'boolean',
        next: (answer) => {
            // Si il a des enfants, demander combien de fils et de filles
            if (answer === true) {
                return 'children_count';
            } else {
                // Si pas d'enfants, demander s'il a des ascendants musulmans
                return 'has_muslim_ascendants';
            }
        }
    },

    // Nouvelle question sur les ascendants musulmans
    has_muslim_ascendants: {
        id: 'has_muslim_ascendants',
        getText: (answers) => answers.deceased_gender ?
            'Le défunt a-t-il encore des ascendants musulmans en vie  (parents, grands-parents, arrière-grands-parents) ?' :
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
        next: (answer) => {
            // Analyse des ascendants sélectionnés pourrait déterminer la prochaine question
            // Pour l'instant, on termine simplement le questionnaire
            return 'ascendants_summary';
        }
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
    children_count: {
        id: 'children_count',
        getText: (answers) => answers.deceased_gender ?
            'Veuillez indiquer la répartition des enfants du défunt :' :
            'Veuillez indiquer la répartition des enfants de la défunte :',
        type: 'children_distribution',
        next: (answer) => {
            // On peut ajouter une logique conditionnelle basée sur le nombre d'enfants ici
            const totalSons = parseInt(answer.sons) || 0;
            const totalDaughters = parseInt(answer.daughters) || 0;

            // Si aucun fils, demander s'il y a des fils décédés
            if (totalSons === 0) {
                return 'has_deceased_sons';
            }

            // S'il y a au moins un fils, passer à la question sur les ascendants
            if (totalSons > 0) {
                return 'has_muslim_ascendants';
            }
            // Ce cas ne devrait pas se produire, mais par sécurité
            else if (totalSons === 0 && totalDaughters > 0) {
                return 'only_daughters';
            } else {
                // Cas où les deux sont 0, ce qui ne devrait pas arriver si l'utilisateur a répondu oui à la question précédente
                return 'end';
            }
        }
    },
    // Question pour demander s'il y a des fils décédés
    has_deceased_sons: {
        id: 'has_deceased_sons',
        getText: (answers) => answers.deceased_gender ?
            'Le défunt a-t-il des fils décédés ?' :
            'La défunte a-t-elle des fils décédés ?',
        type: 'boolean',
        next: (answer, allAnswers) => {
            if (answer === true) {
                return 'deceased_sons_children';
            } else {
                return 'has_muslim_ascendants';
            }
        }
    },
    // Question pour demander le nombre de petits-enfants issus des fils décédés
    deceased_sons_children: {
        id: 'deceased_sons_children',
        getText: (answers) => answers.deceased_gender ?
            'Veuillez indiquer le nombre de petits-enfants issus des fils décédés du défunt :' :
            'Veuillez indiquer le nombre de petits-enfants issus des fils décédés de la défunte :',
        type: 'grandchildren_distribution',
        next: (answer, allAnswers) => {
            // Logique de navigation basée sur la présence de petits-enfants
            const totalGrandsons = parseInt(answer.grandsons) || 0;
            const totalGranddaughters = parseInt(answer.granddaughters) || 0;

            // Si au moins un petit-fils, aller directement à la question sur les ascendants
            if (totalGrandsons > 0) {
                return 'has_muslim_ascendants';
            }

            // Si aucun petit-fils, demander s'il y a des petits-fils décédés
            if (totalGrandsons === 0) {
                return 'has_deceased_grandsons';
            }

            if (totalGranddaughters > 0) {
                return 'has_grandchildren';
            } else {
                // Si pas de petits-enfants et uniquement des filles
                if (allAnswers.children_count && allAnswers.children_count.daughters > 0) {
                    return 'only_daughters';
                } else {
                    return 'end';
                }
            }
        }
    },
    // Question pour demander s'il y a des petits-fils décédés
    has_deceased_grandsons: {
        id: 'has_deceased_grandsons',
        getText: (answers) => answers.deceased_gender ?
            'Le défunt a-t-il des petits-fils décédés ?' :
            'La défunte a-t-elle des petits-fils décédés ?',
        type: 'boolean',
        next: (answer, allAnswers) => {
            if (answer === true) {
                return 'deceased_grandsons_children';
            } else {
                return 'has_muslim_ascendants';
            }
        }
    },
    // Question pour les arrière-petits-enfants
    deceased_grandsons_children: {
        id: 'deceased_grandsons_children',
        getText: (answers) => answers.deceased_gender ?
            'Veuillez indiquer le nombre d\'arrière-petits-enfants issus des petits-fils décédés du défunt :' :
            'Veuillez indiquer le nombre d\'arrière-petits-enfants issus des petits-fils décédés de la défunte :',
        type: 'great_grandchildren_distribution',
        next: (answer, allAnswers) => {
            return 'has_muslim_ascendants';
        }
    },
    // Affichage d'une information lorsque des arrière-petits-enfants sont présents
    has_great_grandchildren: {
        id: 'has_great_grandchildren',
        text: 'Les arrière-petits-enfants issus des petits-fils décédés seront pris en compte dans la répartition.',
        type: 'info',
        next: (answer, allAnswers) => {
            // Redirection basée sur la composition familiale
            const hasDaughters = allAnswers.children_count && allAnswers.children_count.daughters > 0;
            const hasGranddaughters = allAnswers.deceased_sons_children && allAnswers.deceased_sons_children.granddaughters > 0;

            if (hasDaughters && hasGranddaughters) {
                return 'complex_distribution';
            } else if (hasDaughters) {
                return 'daughters_and_great_grandchildren';
            } else if (hasGranddaughters) {
                return 'granddaughters_and_great_grandchildren';
            } else {
                return 'only_great_grandchildren';
            }
        }
    },
    // Affichage d'une information lorsque des petits-enfants sont présents
    has_grandchildren: {
        id: 'has_grandchildren',
        text: 'Les petits-enfants issus des fils décédés seront pris en compte dans la répartition.',
        type: 'info',
        next: (answer, allAnswers) => {
            // Si uniquement des filles et des petits-enfants (pas de fils vivants)
            if (allAnswers.children_count && allAnswers.children_count.daughters > 0) {
                return 'daughters_and_grandchildren';
            } else {
                return 'only_grandchildren';
            }
        }
    },
    daughters_and_grandchildren: {
        id: 'daughters_and_grandchildren',
        text: 'Le défunt a des filles et des petits-enfants issus de fils décédés.',
        type: 'info',
        next: (answer) => 'end'
    },
    only_grandchildren: {
        id: 'only_grandchildren',
        text: 'Le défunt a uniquement des petits-enfants issus de fils décédés.',
        type: 'info',
        next: (answer) => 'end'
    },
    only_granddaughters: {
        id: 'only_granddaughters',
        text: 'Le défunt a uniquement des petites-filles issues de fils décédés.',
        type: 'info',
        next: (answer) => 'end'
    },
    daughters_and_granddaughters: {
        id: 'daughters_and_granddaughters',
        text: 'Le défunt a des filles et des petites-filles issues de fils décédés.',
        type: 'info',
        next: (answer) => 'end'
    },
    daughters_and_great_grandchildren: {
        id: 'daughters_and_great_grandchildren',
        text: 'Le défunt a des filles et des arrière-petits-enfants issus des petits-fils décédés.',
        type: 'info',
        next: (answer) => 'end'
    },
    granddaughters_and_great_grandchildren: {
        id: 'granddaughters_and_great_grandchildren',
        text: 'Le défunt a des petites-filles et des arrière-petits-enfants issus des petits-fils décédés.',
        type: 'info',
        next: (answer) => 'end'
    },
    only_great_grandchildren: {
        id: 'only_great_grandchildren',
        text: 'Le défunt a uniquement des arrière-petits-enfants issus des petits-fils décédés.',
        type: 'info',
        next: (answer) => 'end'
    },
    complex_distribution: {
        id: 'complex_distribution',
        text: 'Le défunt a une combinaison complexe d\'héritiers sur plusieurs générations qui nécessite une analyse détaillée.',
        type: 'info',
        next: (answer) => 'end'
    },
    sons_and_daughters: {
        id: 'sons_and_daughters',
        text: 'Le défunt a à la fois des fils et des filles.',
        type: 'info',
        next: (answer) => 'end'
    },
    only_sons: {
        id: 'only_sons',
        text: 'Le défunt n\'a que des fils.',
        type: 'info',
        next: (answer) => 'end'
    },
    only_daughters: {
        id: 'only_daughters',
        text: 'Le défunt n\'a que des filles.',
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