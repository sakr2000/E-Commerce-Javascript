var userName = document.getElementById("userName");
var activeUser = JSON.parse(getActiveUser()) || null;
var logout = document.getElementById("logout");

// get active user from cookie
function getActiveUser() {
  var keyValue = document.cookie.match("(^|;) ?activeUser=([^;]*)(;|$)");
  return keyValue ? keyValue[2] : null;
}

if (activeUser) {
  document.querySelector(".nav-bar .login").style.display = "none";
  document.querySelector(".nav-bar .logout").style.display = "flex";
  userName.innerText = activeUser.name;
} else {
  document.querySelector(".nav-bar .login").style.display = "flex";
  document.querySelector(".nav-bar .logout").style.display = "none";
}

function logoutuser() {
  document.cookie =
    "activeUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location = "/";
  alertify.success("Logout successfully");
}

if (logout) {
  logout.addEventListener("click", logoutuser);
}

var upBtn = document.getElementById("ToTop");

if (upBtn) {
  window.onscroll = function () {
    scrollFunction();
  };

  function scrollFunction() {
    if (
      document.body.scrollTop > 300 ||
      document.documentElement.scrollTop > 300
    ) {
      upBtn.style.display = "block";
    } else {
      upBtn.style.display = "none";
    }
  }

  upBtn.onclick = function () {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };
}
