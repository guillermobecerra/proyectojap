let subtotalCost = 0;
let shippingCost = 0;
let formSubmitAttempt = false;
let selectedPaymentMethod = document.getElementById("selectedPaymentMethod");
let creditCard = document.getElementById("creditCard");
let cardNumber = document.getElementById("cardNumber");
let secCode = document.getElementById("secCode");
let expDate = document.getElementById("expDate");
let wireTranser = document.getElementById("wireTransfer");
let accNumber = document.getElementById("accNumber");

document.addEventListener("DOMContentLoaded", function (e) {
    showCart();

    document.getElementById("buyForm").addEventListener("submit", function (event) {
        document.getElementById("buyForm").classList.add('was-validated');
        paymentMethod();
        productCount();
        isEmpty();
        formSubmitAttempt = true;
        if (!document.getElementById("buyForm").checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            document.getElementById("buyBtn").classList.add("disabled");
            buyAlert();
            event.preventDefault();
            event.stopPropagation();
            setTimeout(() => {
                document.getElementById("buyForm").submit();
            }, 3000);
        }
    })
})

/* Función para mostrar los productos del carrito */
function showCart() {
    let cartContent = document.getElementById("cartContent");
    cartContent.innerHTML = `
    <table class="table align-middle">
        <thead>
            <tr>
            <th scope="col" class="d-md-table-cell d-none"></th>
            <th scope="col">Nombre</th>
            <th scope="col">Costo</th>
            <th scope="col">Cantidad</th>
            <th scope="col">Subtotal</th>
            <th scope="col"></th>
            </tr>
        </thead>
        <tbody id="currentCart">
        </tbody>
    </table>
    `

    let cart = JSON.parse(localStorage.getItem("Cart"));
    let htmlContentToAppend = "";
    for (let i = 0; i < cart.articles.length; i++) {
        htmlContentToAppend += `
        <tr>
            <td class="d-md-table-cell d-none"><img src="${cart.articles[i].image}" style="width: 100px"></td>
            <td>${cart.articles[i].name}</td>
            <td>${cart.articles[i].currency} ${cart.articles[i].unitCost}</td>
            <td><input required class="product-count form-control" aria-labelledby="product${[i]}CountValidation" type="number" min="1" placeholder="1" value="1" id="${[i]}" style="width: 75px" oninput="count(${[i]})">
            <div id="product${[i]}CountValidation" class="invalid-tooltip position-relative" style="width: fit-content">
                ¡Debe ser 1 o más!
            </div></td>
            <td class="subtotals"><strong>${cart.articles[i].currency} <span id="${[i]}subTotal">${cart.articles[i].unitCost}</span></strong></td>
            <td><button type="button" class="btn btn-outline-danger"><i class="fas fa-trash-alt"></i></button></td>
        </tr>
        `
    }
    document.getElementById("currentCart").innerHTML = htmlContentToAppend;

    subtotal();
    shipping();
    total();
}

/* -------------------------------------------------------------------------- */
/*                         FUNCIONES PARA LOS COSTOS                          */
/* -------------------------------------------------------------------------- */

/* Función que actualiza los costos en tiempo real en relación a la cantidad deseada de cada producto */
function count(id) {
    let cart = JSON.parse(localStorage.getItem("Cart"));
    let count = document.getElementById(id).value || 1;
    document.getElementById(`${id}subTotal`).innerHTML = count * (cart.articles[id].unitCost);

    subtotal();
    shipping();
    total();

    if (formSubmitAttempt == true) {
        productCount();
    }
}

/* Función que calcula y muestra el subtotal general */
function subtotal() {
    let subtotal = document.getElementById("subtotalCost");
    let subtotals = document.getElementsByClassName("subtotals");
    let costs = 0;
    for (let i = 0; i < subtotals.length; i++) {
        let subtotal = subtotals[i].innerText;
        let currency = subtotal.split(" ", 1);
        let cost = subtotal.slice(4);
        if (currency[0] == "UYU") {
            cost = cost / 40;
        }
        costs += parseInt(cost);
    }
    subtotalCost = 0;
    subtotalCost += costs;
    subtotal.innerHTML = "USD " + subtotalCost;
}

/* Función que calcula y muestra el costo de envío en relación al subtotal general */
function shipping() {
    let shipping = document.getElementById("shippingCost");

    if (document.getElementById("radioStandard").checked) {
        shipping.innerHTML = "USD " + (parseInt(subtotalCost * 0.05));
        shippingCost = (parseInt(subtotalCost * 0.05));
    } else if (document.getElementById("radioExpress").checked) {
        shipping.innerHTML = "USD " + (parseInt(subtotalCost * 0.07));
        shippingCost = (parseInt(subtotalCost * 0.07));
    } else if (document.getElementById("radioPremium").checked) {
        shipping.innerHTML = "USD " + (parseInt(subtotalCost * 0.15));
        shippingCost = (parseInt(subtotalCost * 0.15));
    }

    total();
}

/* Función que calcula y muestra el total general sumando subtotal y costo de envío */
function total() {
    let total = document.getElementById("totalCost");
    total.innerHTML = "USD " + (subtotalCost + shippingCost);
}

/* Función que iguala a 1 el valor del input de cantidad de cada producto, en caso de estar vacío, para que respete el placeholder igualado a 1 */
function productCount() {
    let products = document.getElementsByClassName("product-count");
    for (let i = 0; i < products.length; i++) {
        if (products[i].value == "") {
            products[i].value = 1;
        }
    }
}

/* -------------------------------------------------------------------------- */
/*                     FUNCIONES PARA LOS MÉTODOS DE PAGO                     */
/* -------------------------------------------------------------------------- */

/* Función que, cuando se selecciona un método de pago, muestra que ese método está seleccionado, y deshabilita los campos del método contrario */
function disablePayMethod() {
    if (creditCard.checked) {
        selectedPaymentMethod.innerHTML = "Tarjeta de crédito";
        accNumber.setAttribute("disabled", "");
        accNumber.value = "";
        cardNumber.removeAttribute("disabled");
        secCode.removeAttribute("disabled");
        expDate.removeAttribute("disabled");
        cardNumber.setAttribute("required", "");
        secCode.setAttribute("required", "");
        expDate.setAttribute("required", "");
    } else if (wireTranser.checked) {
        selectedPaymentMethod.innerHTML = "Transferencia bancaria";
        cardNumber.setAttribute("disabled", "");
        cardNumber.value = "";
        secCode.setAttribute("disabled", "");
        secCode.value = "";
        expDate.setAttribute("disabled", "");
        expDate.value = "";
        accNumber.removeAttribute("disabled");
    }

    if (formSubmitAttempt == true) {
        paymentMethod();
    }
}

/* Función que, cuando nos posicionamos en un campo del método de tarjeta de crédito, chequea su radio y llama a la función disablePayMethod, simulando un chequeo manual */
function checkCard() {
    creditCard.setAttribute("checked", "");
    disablePayMethod();
}

/* Función que, cuando nos posicionamos en el campo del método de transferencia bancaria, chequea su radio y llama a la función disablePayMethod, simulando un chequeo manual */
function checkWire() {
    wireTranser.setAttribute("checked", "");
    disablePayMethod();
}

/* Función que alerta al usuario que ningún método de pago ha sido seleccionado */
function paymentMethod() {
    let selected = document.getElementById("selectedPaymentMethod");
    let select = document.getElementById("selectPaymentMethod");
    if (!creditCard.checked && !wireTranser.checked) {
        selected.classList.add("text-danger");
        select.classList.add("link-danger");
    } else {
        selected.classList.remove("text-danger");
        select.classList.remove("link-danger");
    }
}

/* Función que alerta que hay campos vacíos en el modal al intentar enviarse el formulario */
function isEmpty() {
    if (creditCard.checked) {
        if (cardNumber.value == "" || secCode.value == "" || expDate.value == "") {
            document.getElementById("emptyFields").classList.replace("d-none", "d-block");
        }
    } else if (wireTranser.checked) {
        if (accNumber.value == "") {
            document.getElementById("emptyFields").classList.replace("d-none", "d-block");
        }
    }
}

/* Función que quita la alerta de que hay campos vacíos en el modal, al rellenar dichos campos */
function emptyFields() {
    if (creditCard.checked) {
        if (!cardNumber.value == "" && !secCode.value == "" && !expDate.value == "") {
            document.getElementById("emptyFields").classList.replace("d-block", "d-none");
        }
    } else if (wireTranser.checked) {
        if (!accNumber.value == "") {
            document.getElementById("emptyFields").classList.replace("d-block", "d-none");
        }
    }
}

/* -------------------------------------------------------------------------- */
/*               FUNCIÓN QUE MUESTRA LA ALERTA DE COMPRA EXITOSA              */
/* -------------------------------------------------------------------------- */

function buyAlert() {
    let alert = document.getElementById("buyAlert");
    alert.classList.remove("d-none");
}