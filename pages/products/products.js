var categories = JSON.parse(window.sessionStorage.getItem("categories")) || [];
var products = JSON.parse(window.sessionStorage.getItem("products")) || [];
var productsContainer = document.querySelector(".product-items");
var categoriesContainer = document.getElementById("categories");
var cartIcon = document.querySelector(".nav-bar .cart");
var cartPopup = document.querySelector(".cart-popup");
var cartItems = document.querySelector(".cart-items");

var activeUser = JSON.parse(window.localStorage.getItem("activeUser")) || null;
if (activeUser) {
  updateCartCount();
}
// ToDo: create custom timed alert

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
}

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
  const product = products.filter((product) => product.id == productId)[0];
  console.log(product);
  if (activeUser) {
    addProductToCart(product);
  } else {
    location.href = "../login/login.html";
  }
}

function addProductToCart(product) {
  if (activeUser.cart.some((item) => item.id == product.id)) {
    alert("Product already in cart");
    return;
  } else {
    activeUser.cart.push({ ...product, quantity: 1 });
    window.localStorage.setItem("activeUser", JSON.stringify(activeUser));
    alert("Product added to cart");
    updateCartCount();
  }
}

/**
 * cart Side Bar
 * - show cart items
 * - remove item from cart
 * - update cart count
 * - clear cart
 * - checkout
 * - increase/decrease quantity
 * - total price
 */

// show cart items
function updateCartCount() {
  if (!activeUser) {
    return;
  } else if (activeUser.cart.length == 0) {
    cartItems.style.display = "none";
    return;
  } else {
    cartItems.style.display = "block";
    cartItems.innerText = activeUser.cart.length;
  }
}

// cart popup open and close
cartIcon.addEventListener("click", () => {
  cartPopup.classList.toggle("show");
  renderCartItems();
  activateRemoveItem();
});

window.addEventListener("click", (e) => {
  if (e.target == cartPopup || e.target.classList.contains("close")) {
    cartPopup.classList.remove("show");
  }
});

// remove item from cart
function activateRemoveItem() {
  const removeButtons = cartPopup.querySelectorAll(".btn-remove");
  const clickHandler = (e) => {
    deleteItemFromCart(e.target.id);
  };
  removeButtons.forEach((button) => {
    button.addEventListener("click", clickHandler);
  });
}

function deleteItemFromCart(productId) {
  activeUser.cart = activeUser.cart.filter(
    (product) => product.id != productId
  );
  window.localStorage.setItem("activeUser", JSON.stringify(activeUser));
  renderCartItems();
  updateCartCount();
}
function renderCartItems() {
  var itemContainer = cartPopup.querySelector(".cart-items");
  itemContainer.innerHTML = "";
  var total = 0;
  if (activeUser.cart.length == 0) {
    itemContainer.innerHTML = `<h3 class="empty-cart">Your cart is empty</h3>`;
    cartPopup.querySelector(".cart-total").innerText = "0$";
    return;
  } else {
    activeUser.cart.forEach((product) => {
      total += product.price * product.quantity;
      itemContainer.innerHTML += `          
      <div class="item">
              <div class="image">
                <img src="${product.image}" alt="product image" />
              </div>
              <div class="details">
                <h3 class="product-name">${product.title}</h3>
                <p class="product-price">${product.price}$</p>
                <div class="quantity">
                  <span class="material-icons remove" id="${product.id}"> remove </span>
                  <span class="quantity-number">${product.quantity}</span>
                  <span class="material-icons add" id="${product.id}"> add </span>
                </div>
              </div>
              <button class="btn"><span class="material-icons btn-remove" id="${product.id}"> delete </span></button>
          </div>`;
    });
    cartPopup.querySelector(".cart-total").innerText = total + "$";
    activateRemoveItem();
  }
}

// increase/decrease quantity
cartPopup.querySelector(".cart-items").addEventListener("click", (e) => {
  if (e.target.classList.contains("add")) {
    increaseQuantity(e.target.id);
  } else if (e.target.classList.contains("remove")) {
    decreaseQuantity(e.target.id);
  }
});

function increaseQuantity(productId) {
  activeUser.cart = activeUser.cart.map((product) => {
    if (product.id == productId) {
      return { ...product, quantity: product.quantity + 1 };
    } else {
      return product;
    }
  });
  window.localStorage.setItem("activeUser", JSON.stringify(activeUser));
  renderCartItems();
}
function decreaseQuantity(productId) {
  activeUser.cart = activeUser.cart.map((product) => {
    if (product.id == productId) {
      return { ...product, quantity: product.quantity - 1 };
    } else {
      return product;
    }
  });
  window.localStorage.setItem("activeUser", JSON.stringify(activeUser));
  renderCartItems();
}

// clear cart
function clearCart() {
  activeUser.cart = [];
  window.localStorage.setItem("activeUser", JSON.stringify(activeUser));
  cartPopup.classList.remove("show");
  renderCartItems();
  updateCartCount();
}
cartPopup.querySelector(".btn-clear").addEventListener("click", clearCart);
