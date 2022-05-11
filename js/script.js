/* ----- FORMULAIRE ------ */


let profil
let estSoumis = false


$('#formulaire').validate(
    {
        rules: {
            prenom: {
                required: true,
                maxlength: 50,
                alphanumerique: true
            },
            nom: {
                required: true,
                maxlength: 50,
                alphanumerique: true
            },
            date: {
                required: true,
                datePlusPetite: true
            },
            statut: {
                statutRequis: true
            }
        },
        messages: {
            prenom: {
                required: "Le prénom est obligatoire",
                maxlength: "Le prénom ne peut être plus long que 50 caractères"
            },
            nom: {
                required: "Le nom est obligatoire",
                maxlength: "Le nom ne peut être plus long que 50 caractères"
            },
            date: {
                required: "La date est requise"
            },
            statut: {
                required: "Veuillez choisir un statut"
            }
        },
        submitHandler: function() {
            // profil = sauvegarderProfil()
            creerQuiz()
        },
        showErrors: function (errorMap, errorList) {
            if (estSoumis) {
                $.each(errorList, function () {
                    let divAlert = $(`<div>${this.message}</div>`).addClass('alert alert-danger')
                    $('#afficherErreurs').append(divAlert)
                })
                estSoumis = false
            }
            this.defaultShowErrors()
        },
        invalidHandler: function(form, validator) {
            estSoumis = true
        }
    }
)


$.validator.addMethod(
    "alphanumerique",
    function (value, element) {
        return this.optional(element) || /^[\w.]+$/i.test(value)
    },
    `Lettres, nombres et soulignements seulement`
);


$.validator.addMethod(
    "datePlusPetite",
    function (value, element) {
        const dateActuelle = new Date();
        return this.optional(element) || dateActuelle >= new Date(value)
    },
    "La date de naissance doit être inférieure à la date d'aujourd'hui"
)


$.validator.addMethod(
    'statutRequis',
    function (value) {
        return (value != '0')
    },
    "Veuillez entrer un statut"
);





/*------ QUIZ -------*/

const quizData = `
[
	{
		"question":"À quoi sert un aria-label?",
		"réponses":[
		"Ajouter du contenu textuel sur une balise pour aider les lecteurs d'écran",
		"À rien", 
		"Je ne sais pas"
		], 
		"réponse":0
	},
	{
		"question":"HTML vient de :",
		"réponses":[
			"Hyper Typo Meta Lol",
			"Hypertext markup language", 
			"Je ne sais pas"
		], 
		"réponse":1
	}
]
`;

const quizJSON = JSON.parse(quizData);


function creerQuiz(){
    alert('allo')
}
