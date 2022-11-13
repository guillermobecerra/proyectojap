let email = document.getElementById("email");
let password = document.getElementById("password");
let form = document.getElementById("loginForm");

document.addEventListener("DOMContentLoaded", function (e) {
    form.addEventListener("submit", function (event) {
        form.classList.add('was-validated');
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            event.stopPropagation();
            localStorage.setItem("User", email.value);
            createUser(email.value);
            if (localStorage.getItem("PreviousPage")) {
                window.location = localStorage.getItem("PreviousPage")
            } else {
                window.location = "index.html"
            }
        }
    })
})

/* Función para crear el objeto del usuario actual en la lista de usuarios del localstorage, si es que no existe allí */
function createUser(email) {
    let userExists = false;
    if (localStorage.getItem("Users")) {
        let users = JSON.parse(localStorage.getItem("Users"));
        for (let i = 0; i < users.length; i++) {
            if (users[i].username == email) {
                userExists = true;
            }
        }
        if (userExists == false) {
            let user = {
                username: email,
                data: [{
                    name1: "",
                    name2: "",
                    lastname1: "",
                    lastname2: "",
                    avatar: "",
                    phone: "",
                }]
            }
            users[users.length] = user;
            localStorage.setItem("Users", JSON.stringify(users));
        }
    } else {
        let user = [{
            username: email,
            data: [{
                name1: "",
                name2: "",
                lastname1: "",
                lastname2: "",
                avatar: "",
                phone: "",
            }]
        }]
        localStorage.setItem("Users", JSON.stringify(user));
    }
}