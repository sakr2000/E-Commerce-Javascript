var categories = JSON.parse(window.sessionStorage.getItem("categories")) || [];
var products = JSON.parse(window.sessionStorage.getItem("products")) || [];
var productsContainer = document.querySelector(".product-items");
var categoriesContainer = document.getElementById("categories");

var activeUser = JSON.parse(window.localStorage.getItem("activeUser")) || null;

// get products from api and cache them
if (products.length == 0) {
  fetch("https://fakestoreapi.com/products")
    .then((response) => response.json())
    .then((data) => {
      window.sessionStorage.setItem("products", JSON.stringify(data));
      products = data;
      renderProducts(products);
    });
} else {
  renderProducts(products);
}

// get categories from api and cache them
if (categories.length == 0) {
  fetch("https://fakestoreapi.com/products/categories")
    .then((response) => response.json())
    .then((data) => {
      window.sessionStorage.setItem("categories", JSON.stringify(data));
      categories = data;
      renderCategories();
    });
} else {
  renderCategories();
}

function renderCategories() {
  categoriesContainer.innerHTML = "";
  categories.forEach((category) => {
    categoriesContainer.innerHTML += `<li><button class="btn btn-category" id="${category}">${category}</button></li>`;
  });
}

function renderProducts(products) {
  productsContainer.innerHTML = "";
  products.forEach((product) => {
    productsContainer.innerHTML += `        <div class="product-item">
            <div class="image">
                <img src="${product.image}" class="product-img">
            </div>
            <div class="product-details">
                <span class="product-name">${product.title}</span>
                <span class="product-price">${product.price}</span>
                <button class="btn btn-addToCart">Add to Cart</button>
            </div>
        </div>`;
  });
}

// filter products by category
categoriesContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-category")) {
    var category = e.target.id;
    var filteredProducts = products.filter(
      (product) => product.category == category
    );
    renderProducts(filteredProducts);
  }
});

// add to cart
var addToCartButtons = document.querySelectorAll(".btn-addToCart");
addToCartButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    if (!activeUser) {
      location.href = "../login/login.html";
    } else {
      var product = products.find(
        (product) =>
          product.title == e.target.parentElement.children[0].innerText
      );
      addProductToCart(product);
    }
  });
});

function addProductToCart(product) {
  activeUser.cart.push(product);
  window.localStorage.setItem("activeUser", JSON.stringify(activeUser));
  console.log(activeUser.cart);
  alert("Product added to cart");
}
