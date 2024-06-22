var form = document.getElementById("checkoutForm");

renderCartItems();

alertify.set("notifier", "position", "top-center");
function isValidUsername(username) {
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]+$/;
  if (usernameRegex.test(username)) {
    return true;
  } else {
    alertify.error("Invalid username");
    return false;
  }
}

function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._]+@[a-zA-Z0-9-]+\.[a-zA-Z]+$/;
  if (emailRegex.test(email)) {
    return true;
  } else {
    alertify.error("Invalid Email");
    return false;
  }
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var phone = document.getElementById("phone").value;
  var address = document.getElementById("address").value;
  if (isValidUsername(name) && isValidEmail(email)) {
    alertify.success("Order Placed");
    console.log(name, email, phone, address);
  } else {
    alertify.error("Invalid Details");
  }
});
