var productsContainer = document.querySelector(".product-items");
var categoriesContainer = document.getElementById("categories");
var searchInput = document.getElementById("search-box");

var categories = JSON.parse(window.sessionStorage.getItem("categories")) || [];
var products = JSON.parse(window.sessionStorage.getItem("products")) || [];
var activeUser = JSON.parse(getActiveUser()) || null;

alertify.set("notifier", "position", "top-center");

// get active user from cookie
function getActiveUser() {
  var keyValue = document.cookie.match("(^|;) ?activeUser=([^;]*)(;|$)");
  return keyValue ? keyValue[2] : null;
}

function updateUserCookie(user) {
  var date = new Date();
  date.setTime(date.getTime() + 3 * 24 * 60 * 60 * 1000);
  document.cookie = `activeUser=${JSON.stringify(
    user
  )}; expires=${date.toUTCString()};path=/`;
}

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
            <div class="details">
                <h3 class="product-name">${product.title}</h3>
                <p class="product-price">${product.price} $</p>
                <button class="btn"><span class="material-icons addToCart" id="${product.id}"> shopping_cart </span></button>
            </div>
        </div>`;
  });
  // add to cart
  var addToCartButtons = document.querySelectorAll(".addToCart");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", handleAddToCart);
  });

  // show product popup
  var productItems = document.querySelectorAll(".details .product-name");
  productItems.forEach((item) => {
    item.addEventListener("click", function () {
      var product = products.find(
        (product) => product.title == item.textContent
      );
      console.log(product);
      showProductPopup(product);
    });
  });
}

// search products
searchInput.addEventListener("keyup", (e) => {
  if (e.target.value == "") {
    renderProducts(products);
  } else {
    var searchValue = e.target.value.toLowerCase();
    var filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(searchValue)
    );
    renderProducts(filteredProducts);
  }
});

// filter products by category
categoriesContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-category")) {
    // clear active category
    var activeCategory = document.querySelector(".btn-category.active");
    if (activeCategory) {
      activeCategory.classList.remove("active");
    }
    e.target.classList.add("active");
    var category = e.target.id;
    if (category == "all") {
      renderProducts(products);
    } else {
      var filteredProducts = products.filter(
        (product) => product.category == category
      );
      renderProducts(filteredProducts);
    }
  }
});

function handleAddToCart(event) {
  var productId = event.target.id;
  const product = products.find((product) => product.id == productId);
  if (activeUser) {
    addProductToCart(product);
  } else {
    location.href = "../login/login.html";
  }
}

function addProductToCart(product) {
  if (activeUser.cart.some((item) => item.id == product.id)) {
    alertify.notify("Product already in cart", "warning", 3);
    return;
  } else {
    activeUser.cart.push({ ...product, quantity: 1 });
    updateUserCookie(activeUser);
    alertify.notify("Product added to cart", "success", 3);
    updateCartCount();
  }
}

function showProductPopup(product) {
  var popup = document.querySelector(".product-popup");
  var popupContainer = popup.querySelector(".product-popup .popup-container");

  popupContainer.innerHTML = `
        <div class="popup-header">
          <h3>${product.title}</h3>
          <span class="material-icons close"> close </span>
        </div>
        <div class="popup-body">
          <div class="image">
            <img src="${product.image}" alt="product image" />
          </div>
          <div class="popup-details">
            <h3 class="product-name">${product.title}</h3>
            <p class="product-description">${product.description}</p>
            <p class="product-price">${product.price} $</p>
            <button class="btn btn-add-to-cart">Add to Cart</button>
          </div>
        </div>
  `;

  popup.classList.add("show");

  popup.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("close") ||
      e.target.classList.contains("product-popup")
    ) {
      popup.classList.remove("show");
    }
  });

  popup.querySelector(".image img").addEventListener("mousemove", zoomImage);
  popup.querySelector(".image img").addEventListener("mouseleave", (e) => {
    e.target.style.transform = "scale(1)";
    e.target.style.transformOrigin = "center";
  });

  var addToCartBtn = popup.querySelector(".btn-add-to-cart");
  addToCartBtn.addEventListener("click", () => {
    addProductToCart(product);
  });
}

// zoom image on mouseover

function zoomImage(event) {
  var x = event.clientX - event.target.offsetLeft;
  var y = event.clientY - event.target.offsetTop;

  var img = event.target;

  img.style.transformOrigin = `${x}px ${y}px`;
  img.style.transform = "scale(2)";
}
