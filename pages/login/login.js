var email = document.getElementById("email");
var password = document.getElementById("password");
var loginform = document.getElementById("loginForm");

var users = JSON.parse(window.localStorage.getItem("users")) || [];

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

async function checkPassword(inputPassword, storedHash) {
  const inputHash = await hashPassword(inputPassword);

  if (inputHash === storedHash) {
    console.log("Password is correct");
    return true;
  } else {
    console.log("Password is incorrect");
    return false;
  }
}

loginform.addEventListener("submit", function (e) {
  e.preventDefault();

  users.forEach((user) => {
    if (user.email === email.value) {
      checkPassword(password.value, user.password).then((isCorrect) => {
        if (isCorrect) {
          // Show success message
          alert("Login Successful");
        } else {
          // Show error message

          alert("Login Failed");
        }
      });
    }
  });
});
