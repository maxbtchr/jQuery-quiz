/* ---------------------------- */
/*           FORMULAIRE         */
/* ---------------------------- */

formulaireTemplate = $("#formulaireTemplate").html();
formulaireTemplate = $(formulaireTemplate);
$("#formulaire").append(formulaireTemplate);
$("#quiz").hide();

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
    dateDeNaissance: {
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
    dateDeNaissance: {
      required: "La date de naissance est requise",
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
      divAlert.attr("role", "alerte");
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


function calculerAge(dateString) {
  let dateTableau = dateString.split('-');
  let annee = dateTableau[0];
  let mois = dateTableau[1];
  let jour = dateTableau[2];

  const anniversaire = new Date(`${mois}/${jour}/${annee}`);
  const differenceDeMois = Date.now() - anniversaire.getTime();
  const differnceConverti = new Date(differenceDeMois);
  const anneeExtrait = differnceConverti.getUTCFullYear();
  const age = Math.abs(anneeExtrait - 1970);
  return age; 
}



function sauvegarderProfil() {
  profil = {
    "Prénom": $("#prenom").val(),
    "Nom": $("#nom").val(),
    "Âge": calculerAge($('#dateDeNaissance').val()),
    "Statut": $("#statut").val(),
    "Réponses sélectionnées": [],
    "Bonnes réponses": 0,
    "Questions réussies": [],
  };
  return profil;
}


/* ---------------------------- */
/*              QUIZ            */
/* ---------------------------- */

let questionActuelle = 0;

/*----- CONTENU DU QUIZ -----*/

const quizData = `
[
	{
		"question":"De quel pays les Beatles sont-ils originaires ?",
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
        "réponse":2
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


/*----- CRÉER QUIZ -----*/

function creerQuiz() {
  $("#formulaire").hide();
  $("#quiz").show();
  afficherQuestion();
}

function afficherQuestion() {

  if (questionActuelle >= quizJSON.length) {
    $("#quiz").empty();
    afficherResultats();
    return false;
  } 

/*----- ANIMATION -----*/

  $('#questionsDiv').fadeIn(1000);


/*----- BARRE DE PROGRESSION -----*/ 

  let progressWidth = (questionActuelle / quizJSON.length) * 100 + 20;

  $(" #progress-bar ").css("width", `${progressWidth}%`);
  $(" #progress-bar ").attr("aria-valuenow", `${progressWidth}`);

  $("#numeroQuestion").text(
    `Question ${questionActuelle + 1} de ${quizJSON.length}`
  );


/*----- AFFICHER LA QUESTION ET LES RÉPONSES -----*/

  let question = quizJSON[questionActuelle].question;
  $("#question").text(`${question}`);

  let reponses = quizJSON[questionActuelle].réponses;
  let value = 0;
  reponses.forEach((reponse) => {
    $("#choixDeReponses").append(
      `<div class="form-check">
          <input class="form-check-input" type="radio" name="choix" value="${value}" aria-label="${reponse}">
          <label class="form-check-label" for="${reponse}">${reponse}</label>
        </div>`
    );
    value++;
  });

  if (questionActuelle + 1 !== quizJSON.length) {
    $("#btn-quiz").text("Question Suivante");
    $("#btn-quiz").attr("aria-label", "question suivante");
  } else {
    $("#btn-quiz").text("Terminer");
    $("#btn-quiz").attr("aria-label", "terminer quiz");
  }

  $("#btn-quiz").on("click", function () {
    verifierReponse();
  });
}


/*----- VÉRIFIER LES RÉPONSES -----*/

function verifierReponse() {
  let choix = $('input[name="choix"]');
  let choixSelectionne;


  for (let i = 0; i < choix.length; i++) {
    if (choix[i].checked) {
      choixSelectionne = choix[i].value;
      profil["Réponses sélectionnées"].push(choixSelectionne);
    }
  }

  if (choixSelectionne == quizJSON[questionActuelle].réponse) {
    profil["Bonnes réponses"]++;
    profil["Questions réussies"].push(questionActuelle);
  }

  if (choixSelectionne) {
    questionActuelle++;
    $("#choixDeReponses").empty();
    $('#questionsDiv').hide(500);
    afficherQuestion();
  }
}


/* ---------------------------- */
/*           RESULTATS          */
/* ---------------------------- */

function afficherResultats() {

  resultatsTemplate = $("#resultatsTemplate").html();
  resultatsTemplate = $(resultatsTemplate);
  $("#resultats").append(resultatsTemplate);

/*---- MODAL & ALERTE POINTAGE ----*/

  $('#modal').modal('show');

  if (profil["Bonnes réponses"] < 3) {
    $('.modal-title').text("Échec !");
    $('.modal-body').append("<p>Vous avez échoué. </p>");
    $('#pointage').addClass("alert-danger");
    $('#pointage').html("Échec !</br>Vous avez obtenu " + profil['Bonnes réponses'] + " sur " + quizJSON.length);
  }

  if (profil["Bonnes réponses"] == 3) {
    $('.modal-title').text("Réussite !");
    $('.modal-body').append("<p>Vous avez réussi. </p>");
    $('#pointage').addClass("alert-warning");
    $('#pointage').html("Vous avez réussi de justesse !</br>Vous avez obtenu " + profil['Bonnes réponses'] + " sur " + quizJSON.length);
  }

  if (profil["Bonnes réponses"] > 3) {
    $('.modal-title').text("Réussite !");
    $('.modal-body').append("<p>Vous avez réussi. </p>");
    $('#pointage').addClass("alert-success");
    $('#pointage').html("Succès !</br>Vous avez obtenu " + profil['Bonnes réponses'] + " sur " + quizJSON.length);
  }

/*----- TABLEAU -----*/

  for (let i = 0; i < quizJSON.length; i++) {
    let bonneReponse = quizJSON[i].réponse == profil["Réponses sélectionnées"][i];
    let reussi;
    if (bonneReponse) {
      reussi = "Oui";
    } else {
      reussi = "Non";
    }

    resultatsTemplate.find("tbody").append(`<tr>
    <td>${i + 1}</td>
    <td>${quizJSON[i].question}</td>
    <td>${reussi}</td>
    </tr>`);
  }

  $("#tableau").DataTable({
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.11.5/i18n/fr-FR.json",
      sSearchPlaceholder: "Votre recherche...",
    },
  });

/*----- AFFICHAGE PROFIL -----*/

  let listeProfil = resultatsTemplate.find("ul");
  Object.entries(profil).forEach((entry) => {
    let [key, value] = entry;
    if (key == "Réponses sélectionnées") {
      listeProfil.append(`<li class="list-group-item">${key}<ul id="select"></ol></li>`)
      listeSelect = listeProfil.find("#select")
      let rep = value.map(r => parseInt(r) + 1)
      for (let i = 0; i < quizJSON.length; i++) {
        listeSelect.append(`<li>Question ${i + 1}: réponse #${rep[i]}</li>`)
      }
    } else if (key == "Questions réussies") {
      let ques = value.map(q => parseInt(q) + 1)
      listeProfil.append(`<li class="list-group-item">${key}: ${ques.join(", ")}</li>`)
    } else {
      listeProfil.append(`<li class="list-group-item">${key}: ${value}</li>`);
    }

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
      accordeon
        .find(".card-body")
        .append(`<div>${j + 1}) ${quizJSON[i].réponses[j]}</div>`);
    }
    $("#accordeonQuestions").append(accordeon);
  }
}
