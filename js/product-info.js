let currentProductArray = [];
let currentCommentsArray = [];

document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCT_INFO_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentProductArray = resultObj.data;
            showProductInfo();
        }
    })
    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentCommentsArray = resultObj.data;
            showProductComments();
        }
    })

    /* Entrega 3, Pauta 4: Agregar los controles gráficos necesarios para realizar un nuevo comentario */
    document.getElementById("comment").innerHTML = `
    <h4 style="margin-top: 40px">Comentar</h4>
    <form>
    <p>
        <small>Tu opinión:</small><br>
        <textarea required style="width: 500px; height: 100px; margin-top: 5px"></textarea>
    </p>
    <p>
        <small>Tu puntuación:</small><br>
        <select id="score" required style="width: 120px; height: 30px; padding-left: 5px; margin-top: 5px">
            <option value=""></option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
        </select>
    </p>
    <input type="submit" value="Enviar" class="submitBtn">
    </form>`
})



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
        <div class="row justify-content-left" id="imageList"></div>
    </div>`

    showImages();
}

/* Función para llamar a las imágenes de cada producto y mostrarlas */
function showImages() {
    let htmlContentToAppend = "";
    for (let i = 0; i < currentProductArray.images.length; i++) {
        let image = currentProductArray.images[i];
        htmlContentToAppend += `<img class="card" style="margin: 0px 10px 20px 10px; padding: 5px; width: 23.4%" src="${image}">`;
    }
    document.getElementById("imageList").innerHTML = htmlContentToAppend;
}



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


/* Función para que pinte las estrellas según el puntaje del comentario */
function rating() {
    let comments = document.getElementsByClassName("list-group-item")
    for (let i = 0; i < comments.length; i++) {
        let stars = comments[i].getElementsByTagName("span")
        for (let x = 0; x < comments[i].id; x++) {
            stars[x].classList.add("checked");
        }
    }
}