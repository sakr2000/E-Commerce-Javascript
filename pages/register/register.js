var registerForm = document.getElementById("registerForm");
var email = document.getElementById("email");
var password = document.getElementById("password");
var confirmPassword = document.getElementById("confirmPassword");
var users = JSON.parse(window.localStorage.getItem("users")) || [];
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._]+@[a-zA-Z0-9-]+\.[a-zA-Z]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);

  return hasMinLength && hasUppercase && hasLowercase && hasDigit;
}

function validateConfirmPassword(password, confirmPassword) {
  return password === confirmPassword;
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
  return users.some((user) => user.email === email.value);
}

registerForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (
    isValidEmail(email.value) &&
    validatePassword(password.value) &&
    validateConfirmPassword(password.value, confirmPassword.value) &&
    !checkIfEmailExists(email)
  ) {
    // hashing password
    hashPassword(password.value).then((hashedPassword) => {
      var user = {
        email: email.value,
        password: hashedPassword,
      };
      users.push(user);
      window.localStorage.setItem("users", JSON.stringify(users));
      alert("Register Successful");
    });
  }
});
