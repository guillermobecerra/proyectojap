let currentProductArray = [];
let currentCommentsArray = [];

document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCT_INFO_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentProductArray = resultObj.data;
            showProductInfo();
            showRelatedProducts();
        }
    })
    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentCommentsArray = resultObj.data;
            showProductComments();
        }
    })
})


/* -------------------------------------------------------------------------- */
/*      Función para llamar a la información de cada producto y mostrarla     */
/* -------------------------------------------------------------------------- */
function showProductInfo() {
    let product = currentProductArray;
    document.getElementById("product-info").innerHTML = `
    <h2 class="p-4" style="margin: 15px 0px 0px -18px">${product.name}</h2>
    <hr>
    <div id=cost>
        <p><strong>Precio</strong><br>
        ${product.currency} ${product.cost}</p>
    </div>
    <div id=description>
        <p><strong>Descripción</strong><br>
        ${product.description}</p>
    </div>
    <div id=category>
        <p><strong>Categoría</strong><br>
        ${product.category}</p>
    </div>
    <div id=soldCount>
        <p><strong>Cantidad de vendidos</strong><br>
        ${product.soldCount}</p>
    </div>
    <div id=images>
        <p><strong>Imágenes ilustrativas</strong></p>
        <div id="carouselExampleIndicators" class="carousel slide carousel-dark w-50" data-bs-ride="carousel" style="display: block; margin-left: auto; margin-right: auto">
            <div class="carousel-indicators" id="carousel-indicators">
            </div>
            <div class="carousel-inner" id="imageList">
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
            </div>
    </div>`

    showImages();
}

/* -------------------------------------------------------------------------- */
/*      Función para llamar a las imágenes de cada producto y mostrarlas      */
/* -------------------------------------------------------------------------- */
function showImages() {
    let htmlContentToAppend = "";
    let carouselIndicators = "";
    let flag = 0;
    for (let i = 0; i < currentProductArray.images.length; i++) {
        let image = currentProductArray.images[i];
        if (flag === 0) {
            htmlContentToAppend += `
            <div class="carousel-item active">
                <img src="${image}" class="d-block w-100" alt="Imagen del producto">
            </div>
            `;
            carouselIndicators += `
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${[i]}" class="active" aria-current="true" aria-label="Slide 1"></button>
            `
            flag++;
        } else {
            htmlContentToAppend += `
            <div class="carousel-item">
                <img src="${image}" class="d-block w-100" alt="Imagen del producto">
            </div>
            `;
            carouselIndicators += `
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${[i]}" aria-label="Slide ${[i+1]}"></button>
            `
        }
    }
    document.getElementById("imageList").innerHTML = htmlContentToAppend;
    document.getElementById("carousel-indicators").innerHTML = carouselIndicators;
}


/* -------------------------------------------------------------------------- */
/*     Función para llamar a los comentarios de cada producto y mostrarlos    */
/* -------------------------------------------------------------------------- */
function showProductComments() {
    let htmlContentToAppend = "";
    for (let i = 0; i < currentCommentsArray.length; i++) {

        let comment = currentCommentsArray[i];

        htmlContentToAppend += `
        <li class="list-group-item" id="${comment.score}">
        <strong>${comment.user}</strong> - ${comment.dateTime} - <span class="fa fa-star"></span>
        <span class="fa fa-star"></span>
        <span class="fa fa-star"></span>
        <span class="fa fa-star"></span>
        <span class="fa fa-star"></span><br>
        <small>${comment.description}</small>
        </li>`
    }
    document.getElementById("comments").innerHTML = `<h4 style="margin-top: 40px">Comentarios</h4>
    <ul class="list-group">` + htmlContentToAppend + `</ul>`

    rating();
}


/* Función para que pinte las estrellas de los comentarios según el puntaje del comentario */
function rating() {
    let comments = document.getElementsByClassName("list-group-item")
    for (let i = 0; i < comments.length; i++) {
        let stars = comments[i].getElementsByTagName("span")
        for (let x = 0; x < comments[i].id; x++) {
            stars[x].classList.add("checked");
        }
    }
}

/* -------------------------------------------------------------------------- */
/*      Función para mostrar los productos relacionados de cada producto      */
/* -------------------------------------------------------------------------- */
function showRelatedProducts() {
    let htmlContentToAppend = "";
    for (let i = 0; i < currentProductArray.relatedProducts.length; i++) {
        let product = currentProductArray.relatedProducts[i];
        htmlContentToAppend += `
        <div class="card" style="width: 20%; cursor: pointer; margin: 0px 10px; padding: 5px" onclick="relatedRedirect(${product.id})">
        <img src="${product.image}" class="card-img-top">
        <div class="card-body">
            <p class="card-text text-center">${product.name}</p>
        </div>
        </div>
        `
    }
    document.getElementById("relatedProducts").innerHTML += `
    <div class="row justify-content-left" style="margin: 50px 10px">` + htmlContentToAppend + `</div>`;
}

/* Función para redirigir al producto relacionado cuando se lo clickea */
function relatedRedirect(id) {
    localStorage.setItem("product-info", id);
    window.location = "product-info.html";
}