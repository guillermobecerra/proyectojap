let name1 = document.getElementById("name1");
let name2 = document.getElementById("name2");
let lastname1 = document.getElementById("lastname1");
let lastname2 = document.getElementById("lastname2");
let email = document.getElementById("email");
let avatar = document.getElementById("avatar");
let avatarImg = document.getElementById("avatarImg");
let phone = document.getElementById("phone");
let form = document.getElementById("profile-form");

document.addEventListener("DOMContentLoaded", function (e) {
    importProfileData();
    form.addEventListener("submit", function (event) {
        form.classList.add('was-validated');
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            exportProfileData();
        }
    })
})

/* Función que, al entrar en la página de perfil, trae desde localstorage los datos del usuario actual */
function importProfileData() {
    localStorage.removeItem("Avatar");
    let currentUser = localStorage.getItem("User");
    let users = JSON.parse(localStorage.getItem("Users"));
    for (let i = 0; i < users.length; i++) {
        if (currentUser == users[i].username) {
            email.value = users[i].username;
            name1.value = users[i].data[0].name1;
            name2.value = users[i].data[0].name2;
            lastname1.value = users[i].data[0].lastname1;
            lastname2.value = users[i].data[0].lastname2;
            phone.value = users[i].data[0].phone;
            if (users[i].data[0].avatar == "") {
                avatarImg.src = "img/img_perfil.png";
            } else {
                const url = users[i].data[0].avatar;
                const img = new Image();
                img.src = url;
                avatarImg.src = img.src
            }
        }
    }
}

/* Función que, al actualizar los datos en la página de pefil, reemplaza dichos datos del usuario en cuestión en el localstorage */
function exportProfileData() {
    let currentUser = localStorage.getItem("User");
    let users = JSON.parse(localStorage.getItem("Users"));
    for (let i = 0; i < users.length; i++) {
        if (currentUser == users[i].username) {
            users[i].username = email.value;
            users[i].data[0].name1 = name1.value;
            users[i].data[0].name2 = name2.value;
            users[i].data[0].lastname1 = lastname1.value;
            users[i].data[0].lastname2 = lastname2.value;
            users[i].data[0].phone = phone.value;
            if (localStorage.getItem("Avatar")) {
                users[i].data[0].avatar = localStorage.getItem("Avatar");
            }
        }
    }
    localStorage.setItem("User", email.value);
    localStorage.setItem("Users", JSON.stringify(users));
}

/* Función para cambiar la imagen de perfil en tiempo real */
function uploadAvatar() {
    const newAvatar = new FileReader();
    newAvatar.readAsDataURL(avatar.files[0]);
    newAvatar.addEventListener("load", () => {
        const exrportURL = newAvatar.result;
        localStorage.setItem("Avatar", exrportURL);
        const importURL = localStorage.getItem("Avatar");
        const img = new Image();
        img.src = importURL;
        avatarImg.src = img.src;
    })
}