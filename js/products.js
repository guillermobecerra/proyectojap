let currentProductsArray = [];
let minCount = undefined;
let maxCount = undefined;

function showProductsList() {

    let htmlContentToAppend = "";
    for (let i = 0; i < currentProductsArray.products.length; i++) {
        let product = currentProductsArray.products[i];

        if (((minCount == undefined) || (minCount != undefined && parseInt(product.cost) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(product.cost) <= maxCount))) {

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
        }

        document.getElementById("products-list-container").innerHTML = htmlContentToAppend;
    }
}


document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentProductsArray = resultObj.data;
            showProductsList();
            document.getElementById("currentCat").innerHTML = currentProductsArray.catName;
        }
    })

    /* Entrega 2, pauta 3: funcionalidades para ordenar en función de precios y relevancia */

    document.getElementById("sortCostDesc").addEventListener("click", function () {
        currentProductsArray.products.sort(function (a, b) {
            if (parseInt(a.cost) > parseInt(b.cost)) {
                return -1;
            }
            if (parseInt(a.cost) < parseInt(b.cost)) {
                return 1;
            }
            return 0;
        })
        showProductsList();
    })

    document.getElementById("sortCostAsc").addEventListener("click", function () {
        currentProductsArray.products.sort(function (a, b) {
            if (parseInt(a.cost) > parseInt(b.cost)) {
                return 1;
            }
            if (parseInt(a.cost) < parseInt(b.cost)) {
                return -1;
            }
            return 0;
        })
        showProductsList();
    })

    document.getElementById("sortByRel").addEventListener("click", function () {
        currentProductsArray.products.sort(function (a, b) {
            if (parseInt(a.soldCount) > parseInt(b.soldCount)) {
                return -1;
            }
            if (parseInt(a.soldCount) < parseInt(b.soldCount)) {
                return 1;
            }
            return 0;
        })
        showProductsList();
    })

    /* Entrega 2, pauta 3: funcionalidad del botón para limpiar el filtro de rango de precios */

    document.getElementById("clearRangeFilter").addEventListener("click", function () {
        document.getElementById("rangeFilterCostMin").value = "";
        document.getElementById("rangeFilterCostMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showProductsList();
    });

    /* Entrega 2, pauta 3: funcionalidad del botón de filtro asociado al rango de precios */

    document.getElementById("rangeFilterCost").addEventListener("click", function () {

        minCount = document.getElementById("rangeFilterCostMin").value;
        maxCount = document.getElementById("rangeFilterCostMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0) {
            minCount = parseInt(minCount);
        }
        else {
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0) {
            maxCount = parseInt(maxCount);
        }
        else {
            maxCount = undefined;
        }

        showProductsList();
    });

})