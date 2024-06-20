var prevSlide = document.querySelector(".prev-slide");
var nextSlide = document.querySelector(".next-slide");
var slides = document.querySelectorAll(".slide");
var slider = document.querySelector(".slider");

// home slider

var slideIndex = 1;
showSlides(slideIndex);

function showSlides(n) {
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (var i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideIndex - 1].style.display = "block";
}

// prev and next slide

prevSlide.addEventListener("click", function () {
  showSlides((slideIndex -= 1));
});

nextSlide.addEventListener("click", function () {
  showSlides((slideIndex += 1));
});

setInterval(function () {
  showSlides((slideIndex += 1));
}, 10000);
