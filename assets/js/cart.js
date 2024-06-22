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
var cartIcon = document.querySelector(".nav-bar .cart");
var cartPopup = document.querySelector(".cart-popup");
var cartItems = document.querySelector(".nav-bar .cart .cart-items");
var activeUser = JSON.parse(getActiveUser()) || null;
if (activeUser) {
  updateCartCount();
}
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

// show cart items
function updateCartCount() {
  if (!activeUser || !cartItems) {
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
if (cartIcon) {
  cartIcon.addEventListener("click", () => {
    cartPopup.classList.toggle("show");
    renderCartItems();
  });
}

cartPopup.addEventListener("click", (e) => {
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
  updateUserCookie(activeUser);
  renderCartItems();
  updateCartCount();
  alertify.notify("Product removed from cart", "success", 3);
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
    total = total.toFixed(2);
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
  updateUserCookie(activeUser);
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
  updateUserCookie(activeUser);
  renderCartItems();
}

// clear cart
function clearCart() {
  activeUser.cart = [];
  updateUserCookie(activeUser);
  cartPopup.classList.remove("show");
  renderCartItems();
  updateCartCount();
  alertify.notify("Cart cleared", "success", 3);
}
cartPopup.querySelector(".btn-clear").addEventListener("click", clearCart);

var checkoutBtn = cartPopup.querySelector(".btn-checkout");
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    location.href = "/pages/checkout/checkout.html";
  });
}
