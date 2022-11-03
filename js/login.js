let loginForm = document.getElementById("loginForm");
/* Entrega 5, pauta 1: importar en el carrito de compras el producto del json de la consigna */
let getJSONData = function (url) {
    let result = {};
    return fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw Error(response.statusText);
            }
        })
        .then(function (response) {
            result.status = 'ok';
            result.data = response;
            return result;
        })
        .catch(function (error) {
            result.status = 'error';
            result.data = error;
            return result;
        });
}

loginForm.innerHTML = `
<img src="img/login.png" alt="e-mercado logo" class="logo">
<h1>Inicio de sesión</h1>
<div class="emailForm form" id="emailForm">
    <label for="emailInput">Email</label>
    <div class="input">
        <input type="email" placeholder="Email" id="emailInput">
    </div>
    <p class="textError" id="emailTextError">Ingresa tu e-mail</p>
</div>
<div class="passForm form" id="passForm">
    <label for="passInput">Contraseña</label>
    <div class="input">
        <input type="password" placeholder="Contraseña" id="passInput">
    </div>
    <p class="textError" id="passTextError">Ingresa tu contraseña</p>
</div>
<button type="submit" id="loginButton">Ingresar</button>
`

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginButton").addEventListener("click", function () {
        let email = document.getElementById("emailInput");
        let password = document.getElementById("passInput");
        let emailForm = document.getElementById("emailForm");
        let passForm = document.getElementById("passForm");
        let emailTextError = document.getElementById("emailTextError");
        let passTextError = document.getElementById("passTextError");

        function addError(form, text) { form.classList.add('formError'); text.classList.add('textError-active') };
        function removeError(form, text) { form.classList.remove('formError'); text.classList.remove('textError-active') };

        let loginflag = true;

        if (email.value == "") {
            loginflag = false;
            addError(emailForm, emailTextError);
        } else {
            removeError(emailForm, emailTextError);
        }

        if (password.value == "") {
            loginflag = false;
            addError(passForm, passTextError);
        } else {
            removeError(passForm, passTextError);
        }

        if (loginflag) {
            /* Entrega 2, pauta 1: mostrar, en la barra de navegación superior, el nombre de usuario ingresado en la pantalla de inicio de sesión */
            localStorage.setItem('User', email.value);
            /* Entrega 5, pauta 1: importar en el carrito de compras el producto del json de la consigna */
            getJSONData("https://japceibal.github.io/emercado-api/user_cart/25801.json").then(function (resultObj) {
                if (resultObj.status === "ok") {
                    let cart = resultObj.data;
                    localStorage.setItem("Cart", JSON.stringify(cart));
                }

                if (localStorage.getItem("PreviousPage")) {
                    window.location = localStorage.getItem("PreviousPage");
                } else {
                    window.location = "index.html";
                }
            })
        }
    })
});