// src/services/questionTreeService.js (mise à jour)
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
            // Si c'est une femme (mariée ou non), on passe directement à l'arbre des ascendants
            if (!allAnswers.deceased_gender) {
                return 'ascendants_details';
            }

            // Si c'est un homme marié, demander le nombre d'épouses
            if (answer && allAnswers.deceased_gender) {
                return 'wives_count';
            }

            // Si c'est un homme non marié, passer directement à l'arbre des ascendants
            return 'ascendants_details';
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
                // Si pas enceinte, passer à l'arbre des ascendants
                return 'ascendants_details';
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
                // Si aucune n'est enceinte, passer à l'arbre des ascendants
                return 'ascendants_details';
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
        next: (answer) => 'descendants_tree' // On va maintenant aux descendants
    },

    // Arbre des descendants (après les ascendants)
    descendants_tree: {
        id: 'descendants_tree',
        getText: (answers) => answers.deceased_gender ?
            'Veuillez indiquer le nombre de descendants musulmans et en vie du défunt :' :
            'Veuillez indiquer le nombre de descendants musulmans et en vie de la défunte :',
        type: 'descendants_tree',
        next: (answer, allAnswers) => {
            // Vérifier si l'arbre des frères et sœurs doit être affiché

            // Extraire les données sur les descendants
            const descendants = answer || {};
            const hasMaleDescendants = (descendants.sons > 0 || descendants.grandsons > 0 || descendants.greatGrandsons > 0);
            const hasAnyDescendants = (
                descendants.sons > 0 || descendants.daughters > 0 ||
                descendants.grandsons > 0 || descendants.granddaughters > 0 ||
                descendants.greatGrandsons > 0 || descendants.greatGranddaughters > 0
            );

            // Extraire les données sur les ascendants vivants
            const ascendants = allAnswers.ascendants_details || {};
            const isFatherAlive = ascendants.father === true;
            const isMotherAlive = ascendants.mother === true;

            // Condition 1: Aucun descendant mâle ET père non vivant
            const condition1 = !hasMaleDescendants && !isFatherAlive;

            // Condition 2: Aucun descendant (de n'importe quel genre) ET mère vivante
            const condition2 = !hasAnyDescendants && isMotherAlive;

            // Afficher l'arbre des frères et sœurs seulement si l'une des conditions est remplie
            if (condition1 || condition2) {
                return 'siblings_details'; // Afficher l'arbre des frères et sœurs
            } else {
                return 'structured_summary'; // Aller directement au résumé
            }
        }
    },

    // Arbre des frères et sœurs (après les descendants, affiché conditionnellement)
    siblings_details: {
        id: 'siblings_details',
        getText: (answers) => answers.deceased_gender ?
            'Veuillez indiquer le nombre de frères et sœurs musulmans et en vie du défunt :' :
            'Veuillez indiquer le nombre de frères et sœurs musulmans et en vie de la défunte :',
        type: 'siblings_tree',
        next: (answer, allAnswers) => {
            // Vérifier si l'arbre des neveux doit être affiché

            // Condition 1: Aucun frère (germain et consanguin)
            const noPaternalBrothers = (answer.brothers === 0 && answer.halfBrothersFather === 0);

            // Condition 2: Le défunt a au moins une descendante féminine (fille, petite-fille, arrière-petite-fille)
            // ET au moins une sœur
            const descendants = allAnswers.descendants_tree || {};
            const hasFemaleDescendant = (
                descendants.daughters > 0 ||
                descendants.granddaughters > 0 ||
                descendants.greatGranddaughters > 0
            );
            const hasSister = (
                answer.sisters > 0 ||
                answer.halfSistersFather > 0 ||
                answer.halfSistersMother > 0
            );
            const femaleDescendantAndSister = hasFemaleDescendant && hasSister;

            // Si l'une des conditions est remplie, montrer l'arbre des neveux
            if (noPaternalBrothers && !femaleDescendantAndSister) {
                return 'nephews_details';
            } else {
                // Si aucun frère ni neveu, montrer l'arbre des oncles paternels
                return 'uncles_details';
            }
        }
    },

    // Arbre des neveux (après les frères et sœurs, affiché conditionnellement)
    nephews_details: {
        id: 'nephews_details',
        getText: (answers) => answers.deceased_gender ?
            'Veuillez indiquer le nombre de neveux musulmans et en vie du défunt :' :
            'Veuillez indiquer le nombre de neveux musulmans et en vie de la défunte :',
        type: 'nephews_tree',
        next: (answer) => {
            // Vérifier si l'arbre des oncles paternels doit être affiché
            const hasNephews = (
                parseInt(answer.fullBrothersSons) > 0 ||
                parseInt(answer.halfBrothersPaternelSons) > 0
            );

            if (!hasNephews) {
                return 'uncles_details'; // Si pas de neveux, passer aux oncles paternels
            }
            return 'structured_summary'; // Sinon passer au résumé
        }
    },

    // Arbre des oncles paternels (après les neveux si aucun neveu n'est présent)
    uncles_details: {
        id: 'uncles_details',
        getText: (answers) => answers.deceased_gender ?
            'Veuillez indiquer le nombre d\'oncles paternels musulmans et en vie du défunt :' :
            'Veuillez indiquer le nombre d\'oncles paternels musulmans et en vie de la défunte :',
        type: 'uncles_tree',
        next: (answer) => {
            // Vérifier si l'arbre des cousins paternels doit être affiché
            const hasUncles = (
                parseInt(answer.fatherFullBrothers) > 0 ||
                parseInt(answer.fatherHalfBrothers) > 0
            );

            if (!hasUncles) {
                return 'cousins_details'; // Si pas d'oncles, passer aux cousins paternels
            }
            return 'structured_summary'; // Sinon passer au résumé
        }
    },

    // NOUVEL ARBRE: Cousins paternels (après les oncles si aucun oncle n'est présent)
    cousins_details: {
        id: 'cousins_details',
        getText: (answers) => answers.deceased_gender ?
            'Veuillez indiquer le nombre de cousins paternels musulmans et en vie du défunt :' :
            'Veuillez indiquer le nombre de cousins paternels musulmans et en vie de la défunte :',
        type: 'cousins_tree',
        next: (answer) => 'structured_summary' // Après les cousins, passer au résumé
    },

    structured_summary: {
        id: 'structured_summary',
        type: 'structured_summary',
        // Modifier ici pour rediriger directement vers /merci au lieu de passer par une étape 'end'
        finalPage: true, // Ajout d'un indicateur que c'est la dernière question
        next: (answer) => null // Retourner null indique que c'est la fin du questionnaire
    },

    special_case: {
        id: 'special_case',
        text: 'La situation nécessite une consultation particulière.',
        type: 'info',
        specialRedirect: '/contact', // Indique une redirection spéciale
        next: (answer) => null // Ajout d'une fonction next pour éviter des erreurs potentielles
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