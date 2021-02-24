const navSlide = function () {
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav-links");
  const navLinks = document.querySelectorAll(".nav-links li");

  burger.addEventListener("click", function () {
    nav.classList.toggle("nav-active");
    burger.classList.toggle("toggle");
  });
};

navSlide();

let element = document.getElementById("announcements-box");
let scrollerId;
let paused = true;

function startScroll() {
  x = 1;
  let id = setInterval(function () {
    element.scrollBy(0, x);
  }, 10);

  return id;
}

function stopScroll() {
  clearInterval(scrollerId);
}

element.addEventListener("mouseover", function (event) {
  if (paused == true) {
    scrollerId = startScroll();
    paused = false;
  } else {
    stopScroll();
    paused = true;
  }
});
