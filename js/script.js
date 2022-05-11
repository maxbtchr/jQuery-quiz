/* ----- FORMULAIRE ------ */


formulaireTemplate = $("#formulaireTemplate").html()
formulaireTemplate = $(formulaireTemplate)
$("#formulaire").append(formulaireTemplate)


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
        let i = 1;
        $("#formulaire").hide()
        quizTemplate = $("#quizTemplate").html()
        quizTemplate = $(quizTemplate)
        quizTemplate.find('h2').html(`Question #${i}`)
        quizTemplate.find('h3').html(`Contenu de la question`)
        quizTemplate.find('#prochaineQuestion').html("Prochaine question")
        $("#quiz").append(quizTemplate)
        $("#formulaire").parent().find("#quiz").show()
        $("#prochaineQuestion").on("click", function () {
            i++
            quizTemplate.find('h2').html(`Question #${i}`)
            quizTemplate.find('h3').html(`Contenu de la question`)
            quizTemplate.find('#prochaineQuestion').html("Prochaine question")
            if (i == 5) {
                quizTemplate.find('#prochaineQuestion').html("Terminer")
                $("#prochaineQuestion").on("click", function () {
                    afficherResultats()
                })
            }
        })
}
    




/* ---- RESULTATS ---- */


function afficherResultats(){
    $("#quiz").hide()
    resultatsTemplate = $("#resultatsTemplate").html()
    resultatsTemplate = $(resultatsTemplate)
    $("#resultats").append(resultatsTemplate)
    $('#tableau').DataTable({
        "language":
        {
            "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/fr-FR.json",
            "sSearchPlaceholder": "Votre recherche..."
        }
    });

    /* ----- ACCORDEON ----- */

    for(let i=0;i<3;i++){
        accordeon = $("#accordeon").html()
        accordeon = $(accordeon)
        accordeon.find('button').html("Titre" + i)
        accordeon.find('#headingOne').attr('id', 'heading' + i)
        accordeon.find('[data-target="#collapseOne"]').attr('data-target', '#collapse' + i)
        accordeon.find('#collapseOne').attr('id','collapse' + i)
        accordeon.find('.card-body').html("Contenu" + i)
        $("#accordeonQuestions").append(accordeon)
    }
}




