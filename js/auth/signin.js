const mailInput = document.getElementById("EmailInput");
const passwordInput = document.getElementById("PasswordInput");
const btnSignin = document.getElementById("btnSignin");
const signinForm = document.getElementById("signinForm");

btnSignin.addEventListener("click", checkCredentials);

function checkCredentials() {
    const dataForm = new FormData(signinForm);

    const raw = JSON.stringify({
        username: dataForm.get("email"),
        password: dataForm.get("mdp"),
    });

    fetch(apiUrl + "login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: raw
    })
        .then(async (response) => {
            const result = await response.json();

            if (!response.ok) {
                mailInput.classList.add("is-invalid");
                passwordInput.classList.add("is-invalid");
                throw new Error(result.message || "Email ou mot de passe incorrect");
            }

            return result;
        })
        .then((result) => {
            const token = result.apiToken;

            // stockage du token
            setToken(token);

            // stockage du rôle
            setCookie(roleCookieName, result.roles[0], 7);

            // nettoyage visuel si succès
            mailInput.classList.remove("is-invalid");
            passwordInput.classList.remove("is-invalid");

            // redirection
            window.location.replace("/");
        })
        .catch((error) => {
            console.error(error);
            alert(error.message);
        });
}