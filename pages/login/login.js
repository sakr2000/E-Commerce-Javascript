var email = document.getElementById("email");
var password = document.getElementById("password");
var loginform = document.getElementById("loginForm");

var date = new Date();
var users = JSON.parse(window.localStorage.getItem("users")) || [];

alertify.set("notifier", "position", "top-center");
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
    return true;
  } else {
    return false;
  }
}

function setUserCookie(user) {
  // expires in 3 days
  date.setTime(date.getTime() + 3 * 24 * 60 * 60 * 1000);
  document.cookie = `activeUser=${JSON.stringify(
    user
  )};expires=${date.toUTCString()};path=/`;
}

loginform.addEventListener("submit", function (e) {
  e.preventDefault();

  users.forEach((user) => {
    if (user.email === email.value) {
      checkPassword(password.value, user.password).then((isCorrect) => {
        if (isCorrect) {
          setUserCookie(user);
          window.location.href = "../../index.html";
        } else {
          alertify.error("Incorrect Email or Password");
        }
      });
    }
  });
});
