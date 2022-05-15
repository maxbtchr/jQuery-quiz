/* ----- FORMULAIRE ------ */

formulaireTemplate = $("#formulaireTemplate").html();
formulaireTemplate = $(formulaireTemplate);
$("#formulaire").append(formulaireTemplate);

let estSoumis = false;
let profil = {};

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
    prenom: $("#prenom").val(),
    nom: $("#nom").val(),
    age: calculerAge(),
    statut: $("#statut").val(),
    reponsesSelectionnes: [],
    "bonnes réponses": 0,
    questionsCorrects: [],
  };
  return profil;
}

/*------ QUIZ -------*/

let questionActuelle = 0;

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
        "réponse":0
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
    }

]
`;

const quizJSON = JSON.parse(quizData);
function creerQuiz() {
  $("#formulaire").hide();
  afficherQuestion();
}

function afficherQuestion() {
  let quiz = $("#quiz");
  quiz.empty();

  if (questionActuelle >= quizJSON.length) {
    afficherResultats();
    return false;
  }

  let progressWidth = (questionActuelle / quizJSON.length) * 100;

  quiz.append(
    `<div class="progress mx-5 mb-5" id="progress-div"><div class="progress-bar bg-info" id="progress-bar" role="progressbar" style="width: ${progressWidth}%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div></div>`
  );

  quiz.append('<h2 id="quelleQuestion" class="mb-3"></h2>');
  $("#quelleQuestion").html(
    `Question ${questionActuelle + 1} de ${quizJSON.length}`
  );

  let question = quizJSON[questionActuelle].question;
  $("#quiz").append(`<h3>${question}</h3>`);

  let reponses = quizJSON[questionActuelle].réponses;
  let value = 0;
  reponses.forEach((reponse) => {
    $("#quiz").append(
      `<div><label class="mr-5 quiz-responses">${reponse}</label><input type="radio" name="choix" value="${value}"></div>`
    );
    value++;
  });

  if (questionActuelle + 1 !== quizJSON.length) {
    $("#quiz").append(
      `<button id="btn-quiz" class="btn btn-outline-info">Question Suivante</button>`
    );
  } else {
    $("#quiz").append(
      `<button id="btn-quiz" class="btn btn-outline-info">Terminer</button>`
    );
  }

  $("#btn-quiz").click(function () {
    verifierReponse();
  });
}

function verifierReponse() {
  let choix = $('input[name="choix"]');
  let choixSelectionne;

  for (let i = 0; i < choix.length; i++) {
    if (choix[i].checked) {
      choixSelectionne = choix[i].value;
      profil.reponsesSelectionnes.push(choixSelectionne);
    }
  }

  if (choixSelectionne == quizJSON[questionActuelle].réponse) {
    profil["bonnes réponses"]++;
    profil.questionsCorrects.push(questionActuelle);
  }

  questionActuelle++;

  afficherQuestion();
}

/* ---- RESULTATS ---- */

function afficherResultats() {
  $("#quiz").hide();
  resultatsTemplate = $("#resultatsTemplate").html();
  resultatsTemplate = $(resultatsTemplate);
  for (let i = 0; i < quizJSON.length; i++) {
    let bonneResponse = quizJSON[i].réponse == profil.reponsesSelectionnes[i];
    let reussi;
    if (bonneResponse) {
      reussi = 'Oui';
    } else {
      reussi = 'Non';
    }

    resultatsTemplate.find('tbody').append(`<tr>
    <td>${i + 1}</td>
    <td>${quizJSON[i].question}</td>
    <td>${reussi}</td>
    </tr>`);
  }
  resultatsTemplate.find('tbody').a;

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

  for (let i = 0; i < quizJSON.length; i++) {
    accordeon = $("#accordeon").html();
    accordeon = $(accordeon);
    accordeon.find("button").html(quizJSON[i].question);
    accordeon.find("#enteteUn").attr("id", "entete" + i);
    accordeon
      .find('[data-target="#retrecirUn"]')
      .attr("data-target", "#retrecir" + i);
    accordeon.find("#retrecirUn").attr("id", "retrecir" + i);
    for (let j = 0; j < quizJSON[i].réponses.length; j++) {
      accordeon.find(".card-body").append(`<div>${j + 1}) ${quizJSON[i].réponses[j]}</div>`);
    }
    $("#accordeonQuestions").append(accordeon);
  }
}
