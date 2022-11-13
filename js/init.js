const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = `https://japceibal.github.io/emercado-api/cats_products/${localStorage.getItem("catID")}.json`;
const PRODUCT_INFO_URL = `https://japceibal.github.io/emercado-api/products/${localStorage.getItem("product-info")}.json`;
const PRODUCT_INFO_COMMENTS_URL = `https://japceibal.github.io/emercado-api/products_comments/${localStorage.getItem("product-info")}.json`;
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function (url) {
  let result = {};
  showSpinner();
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
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
}

/* Entrega 2, pauta 1: mostrar, en la barra de navegación superior, el nombre de usuario ingresado en la pantalla de inicio de sesión */
let array_of_li = document.querySelectorAll("ul.navbar-nav > li");

/* Entrega 4, pauta 2: convertir el nombre de usuario en un menú desplegable */
array_of_li[3].classList.add('dropdown');
array_of_li[3].innerHTML = `
    <div>
      <a class="nav-link dropdown-toggle" href="#" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        ${localStorage.getItem("User")}
      </a>
      <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDarkDropdownMenuLink">
        <li><a class="dropdown-item" href="cart.html">Mi carrito</a></li>
        <li><a class="dropdown-item" href="my-profile.html">Mi perfil</a></li>
        <li onclick="logout()"><a class="dropdown-item" href="login.html">Cerrar sesión</a></li>
      </ul>
    </div>
`

function logout() {
  localStorage.removeItem("User");
}