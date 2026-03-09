const inputNom = document.getElementById("NomInput");
const inputPrenom = document.getElementById("PrenomInput");
const inputTelephone = document.getElementById("TelephoneInput");
const inputMail = document.getElementById("EmailInput");
const inputPassword = document.getElementById("PasswordInput");
const inputValidationPassword = document.getElementById("ValidatePasswordInput");
const btnValidation = document.getElementById("btn-validation-inscription");
const formInscrition = document.getElementById("formulaireInscrition");

// bouton désactivé au départ
btnValidation.disabled = true;

// écouteurs
inputNom.addEventListener("keyup", validateForm);
inputPrenom.addEventListener("keyup", validateForm);
inputTelephone.addEventListener("keyup", validateForm);
inputMail.addEventListener("keyup", validateForm);
inputPassword.addEventListener("keyup", validateForm);
inputValidationPassword.addEventListener("keyup", validateForm);

btnValidation.addEventListener("click", inscrireUtilisateur);

// Validation globale du formulaire
function validateForm() {
    const nomOk = validateRequired(inputNom);
    const prenomOk = validateRequired(inputPrenom);
    const telephoneOk = validateRequired(inputTelephone);
    const mailOk = validateMail(inputMail);
    const passwordOk = validatePassword(inputPassword);
    const passwordConfirmOk = validateConfirmationPassword(inputPassword, inputValidationPassword);

    btnValidation.disabled = !(nomOk && prenomOk && telephoneOk && mailOk && passwordOk && passwordConfirmOk);
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
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
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

// Fetch inscription
function inscrireUtilisateur() {
    const dataForm = new FormData(formInscrition);

    const raw = JSON.stringify({
        firstName: dataForm.get("prenom"),
        lastName: dataForm.get("nom"),
        telephone: dataForm.get("telephone"),
        email: dataForm.get("email"),
        password: dataForm.get("mdp"),
    });

    fetch(apiUrl + "registration", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: raw
    })
        .then(async (response) => {
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Erreur lors de l'inscription");
            }

            return result;
        })
        .then((result) => {
            alert("Bravo " + dataForm.get("prenom") + ", vous êtes maintenant inscrit(e), vous pouvez vous connecter !");
            document.location.href = "#/signin";
        })
        .catch((error) => {
            console.error(error);
            alert(error.message);
        });
}