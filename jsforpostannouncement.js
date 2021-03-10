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

const list = document.getElementById("list");
const add = document.getElementById("add");
const closebtn = document.getElementsByClassName("closebtn");
const newAnnouncement = document.getElementById("announcement-box").innerHTML;

add.addEventListener("click", function () {
  if (list.childElementCount < 10) {
    let newElement = document.createElement("li");
    list.appendChild(newElement);
    newElement.innerHTML =
      '<div class="licontent">' +
      newAnnouncement +
      '</div><div class="closebtn">&times;</div>';
    newElement.classList.add("element");
    console.log(list.childElementCount);
  } else {
    alert("Max 10 elements can be added");
  }
});

list.addEventListener("click", function (element) {
  if (
    element.target &&
    element.target.nodeName == "DIV" &&
    list.childElementCount > 2
  ) {
    element.target.parentNode.remove();
  }
});
