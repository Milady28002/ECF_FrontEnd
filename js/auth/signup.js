const inputNom = document.getElementById("NomInput");
const inputPrenom = document.getElementById("PrenomInput");
const inputAdressePostale = document.getElementById("AdressePostaleInput");
const inputTelephone = document.getElementById("TelephoneInput");
const inputMail = document.getElementById("EmailInput");
const inputPassword = document.getElementById("PasswordInput");
const inputValidationPassword = document.getElementById("ValidatePasswordInput");
const btnValidation = document.getElementById("btn-validation-inscription");
const formInscrition = document.getElementById("formulaireInscrition");

btnValidation.disabled = true;

inputNom.addEventListener("keyup", validateForm);
inputPrenom.addEventListener("keyup", validateForm);
inputAdressePostale.addEventListener("keyup", validateForm);
inputTelephone.addEventListener("keyup", validateForm);
inputMail.addEventListener("keyup", validateForm);
inputPassword.addEventListener("keyup", validateForm);
inputValidationPassword.addEventListener("keyup", validateForm);

formInscrition.addEventListener("submit", inscrireUtilisateur);

function validateForm() {
    const nomOk = validateRequired(inputNom);
    const prenomOk = validateRequired(inputPrenom);
    const adressePostaleOk = validateRequired(inputAdressePostale);
    const telephoneOk = validateRequired(inputTelephone);
    const mailOk = validateMail(inputMail);
    const passwordOk = validatePassword(inputPassword);
    const passwordConfirmOk = validateConfirmationPassword(inputPassword, inputValidationPassword);

    btnValidation.disabled = !(nomOk && prenomOk && telephoneOk && adressePostaleOk && mailOk && passwordOk && passwordConfirmOk);

    return nomOk && prenomOk && telephoneOk && adressePostaleOk && mailOk && passwordOk && passwordConfirmOk;
    }

function validateMail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mailUser = input.value.trim();

    if (emailRegex.test(mailUser)) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}

function validatePassword(input) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,}$/;
    const passwordUser = input.value;

    if (passwordRegex.test(passwordUser)) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}

function validateConfirmationPassword(inputPwd, inputConfirmPwd) {
    if (inputPwd.value === inputConfirmPwd.value && inputConfirmPwd.value !== "") {
        inputConfirmPwd.classList.add("is-valid");
        inputConfirmPwd.classList.remove("is-invalid");
        return true;
    } else {
        inputConfirmPwd.classList.add("is-invalid");
        inputConfirmPwd.classList.remove("is-valid");
        return false;
    }
}

function validateRequired(input) {
    if (input.value.trim() !== "") {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}

function inscrireUtilisateur(event) {
    event.preventDefault();
    console.log("submit inscription déclenché");

    if (!validateForm()) {
        alert("Veuillez corriger le formulaire avant de continuer.");
        return;
    }

    const dataForm = new FormData(formInscrition);

    const raw = JSON.stringify({
        name: dataForm.get("nom"),
        firstname: dataForm.get("prenom"),
        adresse_postale: dataForm.get("adresse_postale"),
        telephone: dataForm.get("telephone"),
        email: dataForm.get("email"),
        password: dataForm.get("mdp"),
        ville: "",
        pays: "",
    });

    console.log("payload envoyé :", raw);

    fetch(apiUrl + "registration", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: raw
    })
        .then(async (response) => {
            const result = await response.json();
            console.log("status:", response.status);
            console.log("réponse API:", result);

            if (!response.ok) {
                throw new Error(result.message || "Erreur lors de l'inscription");
            }

            return result;
        })
        .then(() => {
            alert("Bravo " + dataForm.get("prenom") + ", vous êtes maintenant inscrit(e), vous pouvez vous connecter !");
            document.location.href = "#/signin";
        })
        .catch((error) => {
            console.error("erreur inscription :", error);
            alert(error.message);
        });
}