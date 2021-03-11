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
var announcements = [];

addAnnouncement();
removeAnnouncement();
editAnnouncement();

function addAnnouncement() {
  add.addEventListener("click", function () {
    if (list.childElementCount < 10) {
      let newElement = document.createElement("li");
      list.appendChild(newElement);
      let newAnnouncement = document.getElementById("announcement-box").value;
      newElement.innerHTML =
        '<div class="licontent">' +
        newAnnouncement +
        '</div><div class="editbtn">Edit</div><div class="closebtn">&times;</div>';
      announcements.push(newAnnouncement);
      document.getElementById("announcement-box").value = "";
      newElement.classList.add("element");
    } else {
      alert("Max 10 elements can be added");
    }
  });
}

function removeAnnouncement(params) {
  list.addEventListener("click", function (element) {
    if (
      element.target &&
      element.target.className == "closebtn" &&
      list.childElementCount > 2
    ) {
      element.target.parentNode.remove();
    }
  });
}

function editAnnouncement() {
  list.addEventListener("click", function (element) {
    if (element.target && element.target.className == "editbtn") {
      let content = element.target.parentNode.getElementsByClassName(
        "licontent"
      );
      console.log(content[0].innerHTML);
      document.getElementById(
        "announcement-box"
      ).value = content[0].innerHTML.trim();
      element.target.parentNode.remove();
      window.scrollTo(0, 20);
    }
  });
}
