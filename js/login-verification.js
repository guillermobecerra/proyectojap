if (!localStorage.getItem("User")) {
    let path = window.location.pathname;
    let page = path.split("/").pop();
    localStorage.setItem('PreviousPage', page)
    window.location = "login.html";
  }