var registerForm = document.getElementById("registerForm");
var email = document.getElementById("email");
var password = document.getElementById("password");
var confirmPassword = document.getElementById("confirmPassword");
var username = document.getElementById("username");
var users = JSON.parse(window.localStorage.getItem("users")) || [];
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

function validatePassword(password) {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);

  if (!hasMinLength) {
    alertify.error("Password must be at least 8 characters long");
    return false;
  } else if (!hasUppercase) {
    alertify.error("Password must contain at least one uppercase letter");
    return false;
  } else if (!hasLowercase) {
    alertify.error("Password must contain at least one lowercase letter");
    return false;
  } else if (!hasDigit) {
    alertify.error("Password must contain at least one digit");
    return false;
  }

  return hasMinLength && hasUppercase && hasLowercase && hasDigit;
}

function validateConfirmPassword(password, confirmPassword) {
  if (password === confirmPassword) {
    return true;
  } else {
    alertify.error("Passwords do not match");
    return false;
  }
}

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}

function checkIfEmailExists(email) {
  var users = JSON.parse(window.localStorage.getItem("users")) || [];
  if (users.some((user) => user.email === email.value)) {
    alertify.error("Email already exists");
    return true;
  } else {
    return false;
  }
}

registerForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (
    isValidUsername(username.value) &&
    isValidEmail(email.value) &&
    validatePassword(password.value) &&
    validateConfirmPassword(password.value, confirmPassword.value) &&
    !checkIfEmailExists(email)
  ) {
    // hashing password
    hashPassword(password.value).then((hashedPassword) => {
      var user = {
        name: username.value,
        email: email.value,
        password: hashedPassword,
        cart: [],
      };
      users.push(user);
      window.localStorage.setItem("users", JSON.stringify(users));
      alert("Register Successful");
    });
  }
});
