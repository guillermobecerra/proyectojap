document.addEventListener("DOMContentLoaded", function (e) {
    showCart();
})

function showCart() {
    let cartContent = document.getElementById("cartContent");
    cartContent.innerHTML = `
    <table class="table align-middle">
        <thead>
            <tr>
            <th scope="col"></th>
            <th scope="col">Nombre</th>
            <th scope="col">Costo</th>
            <th scope="col">Cantidad</th>
            <th scope="col">Subtotal</th>
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
            <td><img src="${cart.articles[i].image}" style="width: 100px"></td>
            <td>${cart.articles[i].name}</td>
            <td>${cart.articles[i].currency} ${cart.articles[i].unitCost}</td>
            <td><input type="number" min="1" placeholder="1" id="${[i]}" style="width: 75px" oninput="count(${[i]})"></td>
            <td><strong>${cart.articles[i].currency} <span id="${[i]}subTotal">${cart.articles[i].unitCost}</span></strong></td>
        </tr>
        `
    }
    document.getElementById("currentCart").innerHTML = htmlContentToAppend;
}

function count(id) {
    let cart = JSON.parse(localStorage.getItem("Cart"));
    let count = document.getElementById(id).value || 1;
    document.getElementById(`${id}subTotal`).innerHTML = count * (cart.articles[id].unitCost);
}