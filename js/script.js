/* ----- FORMULAIRE ------ */

formulaireTemplate = $("#formulaireTemplate").html();
formulaireTemplate = $(formulaireTemplate);
$("#formulaire").append(formulaireTemplate);

let estSoumis = false;
let profil;

$("#enregistrement").validate({
  rules: {
    prenom: {
      required: true,
      maxlength: 50,
      alphanumerique: true,
    },
    nom: {
      required: true,
      maxlength: 50,
      alphanumerique: true,
    },
    date: {
      required: true,
      datePlusPetite: true,
    },
    statut: {
      statutRequis: true,
    },
  },
  messages: {
    prenom: {
      required: "Le prénom est obligatoire",
      maxlength: "Le prénom ne peut être plus long que 50 caractères",
    },
    nom: {
      required: "Le nom est obligatoire",
      maxlength: "Le nom ne peut être plus long que 50 caractères",
    },
    date: {
      required: "La date est requise",
    },
    statut: {
      required: "Veuillez choisir un statut",
    },
  },
  submitHandler: function () {
    profil = sauvegarderProfil();
    creerQuiz();
  },
  showErrors: function (errorMap, errorList) {
    if (estSoumis) {
      let divAlert = $(`<div></div>`).addClass("alert alert-danger");
      let sommaire = "";
      $.each(errorList, function () {
        sommaire += this.message + " <br/> ";
      });
      divAlert.html(sommaire);
      $("#afficherErreurs").html(divAlert);
      estSoumis = false;
    }
    this.defaultShowErrors();
  },
  invalidHandler: function (form, validator) {
    estSoumis = true;
  },
});

$.validator.addMethod(
  "alphanumerique",
  function (value, element) {
    return this.optional(element) || /^[\w.]+$/i.test(value);
  },
  `Lettres, nombres et soulignements seulement`
);

$.validator.addMethod(
  "datePlusPetite",
  function (value, element) {
    const dateActuelle = new Date();
    return this.optional(element) || dateActuelle >= new Date(value);
  },
  "La date de naissance doit être inférieure à la date d'aujourd'hui"
);

$.validator.addMethod(
  "statutRequis",
  function (value) {
    return value != "0";
  },
  "Veuillez entrer un statut"
);

$("#date").datepicker();

function calculerAge() {
  var a = new Date();
  annee = a.getFullYear();
  selectedDate = $("#date").datepicker("getDate").getFullYear();
  return annee - selectedDate;
}

function sauvegarderProfil() {
  profil = {
    Prénom: $("#prenom").val(),
    Nom: $("#nom").val(),
    Âge: calculerAge(),
    Statut: $("#statut").val(),
    "Bonnes réponses": "",
  };
  return profil;
}

/*------ QUIZ -------*/

const quizData = `
[
	{
		"question":"De quel pays, les Beatles sont-ils originaires ?",
		"réponses":[
		"États-Unis",
		"Allemagne", 
		"Angleterre",
        "Irlande"
		], 
		"réponse":2
	},
	{
		"question":"Comment était surnommé le saxophoniste Charlie Parker ?",
		"réponses":[
			"The Boss",
			"The Duke", 
			"The Bird",
            "The Fly"
		], 
		"réponse":2
	},
    {
        "question":"Quel groupe a interprété la chanson « Paranoid Android » ?",
        "réponses":[
            "Radiohead",
            "Franz Ferdinand", 
            "Oasis",
            "The Police"
        ], 
        "réponse":2
    },
    {
        "question":" À quel âge Mozart a-t-il composé son premier menuet ?",
        "réponses":[
            "À 3 ans",
            "À 5 ans", 
            "À 6 ans",
            "À 7 ans"
        ], 
        "réponse":3
    },
    {
        "question":"Quand est sorti le premier single de Sean Paul ?",
        "réponses":[
            "2000",
            "2005", 
            "1996",
            "1992"
        ], 
        "réponse":2
    },

]
`;

const quizJSON = JSON.parse(quizData);

function creerQuiz() {
  let i = 1;
  $("#formulaire").hide();
  quizTemplate = $("#quizTemplate").html();
  quizTemplate = $(quizTemplate);
  quizTemplate.find("h2").html(`Question #${i}`);
  quizTemplate.find("h3").html(`Contenu de la question`);
  quizTemplate.find("#prochaineQuestion").html("Prochaine question");
  $("#quiz").append(quizTemplate);
  $("#formulaire").parent().find("#quiz").show();
  $("#prochaineQuestion").on("click", function () {
    i++;
    quizTemplate.find("h2").html(`Question #${i}`);
    quizTemplate.find("h3").html(`Contenu de la question`);
    quizTemplate.find("#prochaineQuestion").html("Prochaine question");
    if (i == 5) {
      quizTemplate.find("#prochaineQuestion").html("Terminer");
      $("#prochaineQuestion").on("click", function () {
        afficherResultats();
      });
    }
  });
}

/* ---- RESULTATS ---- */

function afficherResultats() {
  $("#quiz").hide();
  resultatsTemplate = $("#resultatsTemplate").html();
  resultatsTemplate = $(resultatsTemplate);
  $("#resultats").append(resultatsTemplate);
  $("#tableau").DataTable({
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.11.5/i18n/fr-FR.json",
      sSearchPlaceholder: "Votre recherche...",
    },
  });

  let listeProfil = resultatsTemplate.find("ul");
  Object.entries(profil).forEach((entry) => {
    let [key, value] = entry;
    listeProfil.append(`<li>${key}: ${value}</li>`);
  });

  /* ----- ACCORDEON ----- */

  for (let i = 0; i < 3; i++) {
    accordeon = $("#accordeon").html();
    accordeon = $(accordeon);
    accordeon.find("button").html("Titre" + i);
    accordeon.find("#headingOne").attr("id", "heading" + i);
    accordeon
      .find('[data-target="#collapseOne"]')
      .attr("data-target", "#collapse" + i);
    accordeon.find("#collapseOne").attr("id", "collapse" + i);
    accordeon.find(".card-body").html("Contenu" + i);
    $("#accordeonQuestions").append(accordeon);
  }
}
