const CARS_URL = "https://japceibal.github.io/emercado-api/cats_products/101.json";

let productsArray = [];

function showProductsCars(array) {
    let htmlContentToAppend = "";
    for (let i = 0; i < array.products.length; i++) {
        let product = array.products[i];
        htmlContentToAppend += `
        <div class="list-group-item list-group-item-action">
            <div class="row">
                <div class="col-3">
                    <img src="` + product.image + `" alt="product-image" class="img-thumbnail">
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <div class="mb-1">
                        <h4>`+ product.name + ` - ` + product.currency + ` ` + product.cost + `</h4>
                        <p> `+ product.description + `</p>
                        </div>
                        <small class="text-muted">` + product.soldCount + ` vendidos</small>
                    </div>
                </div>
            </div>
        </div>
        `
        document.getElementById("cars-list-container").innerHTML = `<div class="text-center p-4">
        <h2>Productos</h2>
        <p class="lead">Verás aquí todos los productos de la categoría <strong>Autos</strong></p>
        </div>` + htmlContentToAppend;
    }
}

document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(CARS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            carsArray = resultObj.data;
            showProductsCars(carsArray);
        }
    });
});