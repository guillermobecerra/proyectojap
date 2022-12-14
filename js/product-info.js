let currentProductArray = [];
let currentCommentsArray = [];

document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCT_INFO_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentProductArray = resultObj.data;
            showProductInfo();
            showRelatedProducts();

            /* Funcionalidad para agregar el producto al carrito, si es que no está allí */
            if (localStorage.getItem("Cart")) {
                let cart = JSON.parse(localStorage.getItem("Cart"));
                let flag = 0;
                for (let i = 0; i < cart.articles.length; i++) {
                    if (cart.articles[i].id == currentProductArray.id) {
                        flag = 1
                    }
                }
                if (flag == 1) {
                    document.getElementById("buy").setAttribute("data-bs-target", "#cartAlreadyModal");
                }
                document.getElementById("buy").addEventListener("click", function () {
                    if (!flag == 1) {
                        cart.articles[cart.articles.length] = {
                            id: currentProductArray.id,
                            name: currentProductArray.name,
                            count: 1,
                            unitCost: currentProductArray.cost,
                            currency: currentProductArray.currency,
                            image: currentProductArray.images[0]
                        };
                        document.getElementById("buy").setAttribute("data-bs-target", "#cartAlreadyModal");
                        localStorage.setItem("Cart", JSON.stringify(cart));
                        flag = 1;
                    }
                })
            } else {
                let cart = {
                    user: localStorage.getItem("User"),
                    articles: []
                };
                document.getElementById("buy").addEventListener("click", function () {
                    cart.articles[0] = {
                        id: currentProductArray.id,
                        name: currentProductArray.name,
                        count: 1,
                        unitCost: currentProductArray.cost,
                        currency: currentProductArray.currency,
                        image: currentProductArray.images[0]
                    };
                    document.getElementById("buy").setAttribute("data-bs-target", "#cartAlreadyModal");
                    localStorage.setItem("Cart", JSON.stringify(cart));
                })
            }
        }
    })
    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentCommentsArray = resultObj.data;
            showProductComments();
            loadNewComments();
            rating();
            document.getElementById("commentSubmit").addEventListener("click", function (e) {
                comment(e);
            })
        }
    })
})


/* -------------------------------------------------------------------------- */
/*      Función para llamar a la información de cada producto y mostrarla     */
/* -------------------------------------------------------------------------- */
function showProductInfo() {
    let product = currentProductArray;
    document.getElementById("product-info").innerHTML = `
    <div class="d-flex flex-row">
        <h2 class="p-4 me-auto" style="margin: 15px 0px 0px -18px">${product.name}</h2>
        <button type="button" class="btn btn-success align-self-center mt-3" id="buy" data-bs-toggle="modal" data-bs-target="#cartAddModal">Comprar</button>
        <div class="modal fade" id="cartAddModal" tabindex="-1" aria-labelledby="cartAddModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content bg-success">
                <div class="modal-header text-white">
                    <h1 class="modal-title fs-5" id="cartAddModalLabel">Producto agregado al carrito</h1>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body bg-white">
                    ¿Deseas ir al carrito?
                </div>
                <div class="modal-footer justify-content-center bg-white">
                    <button type="button" class="btn btn-outline-success" data-bs-dismiss="modal">Seguir comprando</button>
                    <a class="btn btn-success" href="cart.html" role="button">Ir al carrito</a>
                </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="cartAlreadyModal" tabindex="-1" aria-labelledby="cartAlreadyModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content bg-danger">
                <div class="modal-header text-white">
                    <h1 class="modal-title fs-5" id="cartAlreadyModalLabel">Este producto ya se encuentra en el carrito</h1>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body bg-white">
                    Dentro del carrito podrás modificar las unidades a comprar.<br>
                    ¿Deseas ir al carrito?
                </div>
                <div class="modal-footer justify-content-center bg-white">
                    <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Seguir comprando</button>
                    <a class="btn btn-danger" href="cart.html" role="button">Ir al carrito</a>
                </div>
                </div>
            </div>
        </div>
    </div>
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
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${[i]}" aria-label="Slide ${[i + 1]}"></button>
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
        <strong>${comment.user}</strong> - ${comment.dateTime} - <br class="d-md-none"><span class="fa fa-star"></span>
        <span class="fa fa-star"></span>
        <span class="fa fa-star"></span>
        <span class="fa fa-star"></span>
        <span class="fa fa-star"></span><br>
        <small>${comment.description}</small>
        </li>`
    }
    document.getElementById("comments").innerHTML = `<h4 style="margin-top: 40px">Comentarios</h4>
    <ul class="list-group" id="preLoadedComments">` + htmlContentToAppend + `</ul>`
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
        <div class="card mb-md-1 mb-5 col-sm-4 col-md-5 col-lg-3" style="cursor: pointer; margin: 0px 10px; padding: 5px" onclick="relatedRedirect(${product.id})">
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

/* Función para agregar más comentarios a un producto */
function comment(e) {
    e.preventDefault();
    let comment = document.getElementById("commentContent");
    let score = document.getElementById("commentScore");
    let commentError = document.getElementById("commentError");
    let scoreError = document.getElementById("scoreError");
    let commentInput = document.getElementById("commentInput");
    let scoreInput = document.getElementById("scoreInput");

    function addError(form, text) { form.classList.add('formError'); text.classList.add('textError-active') };
    function removeError(form, text) { form.classList.remove('formError'); text.classList.remove('textError-active') };

    let loginflag = true;

    if (comment.value == "") {
        loginflag = false;
        addError(commentInput, commentError);
    } else {
        removeError(commentInput, commentError);
    }

    if (score.value == "") {
        loginflag = false;
        addError(scoreInput, scoreError);
    } else {
        removeError(scoreInput, scoreError);
    }

    if (loginflag) {
        let today = new Date();
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        let hour = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        let commentDate = date + ' ' + hour;

        if (!localStorage.getItem("Comments")) {
            let myComments = {
                user: localStorage.getItem("User"),
                comment: []
            };
            myComments.comment[0] = {
                product: currentProductArray.id,
                score: score.value,
                description: comment.value,
                user: localStorage.getItem("User"),
                dateTime: commentDate
            };
            localStorage.setItem("Comments", JSON.stringify(myComments));
            location.reload();
        } else {
            let myComments = JSON.parse(localStorage.getItem("Comments"));
            myComments.comment[myComments.comment.length] = {
                product: currentProductArray.id,
                score: score.value,
                description: comment.value,
                user: localStorage.getItem("User"),
                dateTime: commentDate
            }
            localStorage.setItem("Comments", JSON.stringify(myComments));
            location.reload();
        }
    };
}

/* Función para mostrar los comentarios que se agregaron */
function loadNewComments() {
    if (localStorage.getItem("Comments")) {
        let myComments = JSON.parse(localStorage.getItem("Comments"));
        let preLoadedComments = document.getElementById("preLoadedComments");
        let htmlContentToAppend = "";
        for (let i = 0; i < myComments.comment.length; i++) {
            let comment = myComments.comment[i];
            if (comment.product == currentProductArray.id) {
            htmlContentToAppend = `<li class="list-group-item" id="${comment.score}">
            <strong>${comment.user}</strong> - ${comment.dateTime} - <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span><br>
            <small>${comment.description}</small>
            </li>` + htmlContentToAppend
            }
        }
        preLoadedComments.innerHTML = htmlContentToAppend + preLoadedComments.innerHTML;
    }
}