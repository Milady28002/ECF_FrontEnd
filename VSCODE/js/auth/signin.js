const mailInput = document.getElementById("EmailInput");
const PasswordInput = document.getElementById("PasswordInput");
const btnSignin = document.getElementById("btnSignin");

btnSignin.addEventListener("click", checkCredentials);

function checkCredentials() {
    //ici il faudra appeler l'API pour vérifier les credentials en BDD
    if(mailInput.value == "test@mail.com" && PasswordInput.value == "123") {
        alert("Vous êtes connecté");

        //Il faudra récupérer le vrai token
        const token = "141278";

        //placer ce token en cookie

        window.location.replace("/");
    }
    else{
        mailInput.classList.add("is-invalid");
        PasswordInput.classList.add("is-invalid");
    }
}
