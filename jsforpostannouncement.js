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
const overlay = document.getElementById("overlay");
const yes = document.getElementById("yes");
const cancel = document.getElementById("cancel");
const close = document.getElementById("close");
const popupContent = document.getElementById("popup-content");

addAnnouncement();
removeAnnouncement();
editAnnouncement();

function addAnnouncement() {
  add.addEventListener("click", function () {
    let newAnnouncement = document.getElementById("announcement-box").value;
    if (list.childElementCount < 10 && newAnnouncement != "") {
      let newElement = document.createElement("li");
      list.appendChild(newElement);
      newElement.innerHTML =
        '<div class="licontent">' +
        newAnnouncement +
        '</div><div class="editbtn">Edit</div><div class="closebtn">&times;</div>';
      document.getElementById("announcement-box").value = "";
      newElement.classList.add("element");
    } else if (newAnnouncement == "") {
      alert("The announcements section cannot be empty");
    } else {
      alert("Max 10 elements can be added");
    }
  });
}

function removeAnnouncement() {
  list.addEventListener("click", function (element) {
    if (
      element.target &&
      element.target.className == "closebtn" &&
      list.childElementCount > 2
    ) {
      openpopup();

      yes.addEventListener("click", function () {
        element.target.parentNode.remove();
        closepopup();
      });

      cancel.addEventListener("click", function () {
        closepopup();
      });

      close.addEventListener("click", function () {
        closepopup();
      });

      overlay.addEventListener("click", function () {
        const popups = document.querySelectorAll(".popup.active");
        popups.forEach((popup) => {
          closepopup();
        });
      });
    } else if (
      element.target &&
      element.target.className == "closebtn" &&
      list.childElementCount <= 2
    ) {
      popupContent.innerHTML =
        "<p>There should be atleast three announcments to delete one</p>";
      openpopup();
      close.addEventListener("click", function () {
        closepopup();
        popupContent.innerHTML =
          '<div class="confirmation-text">Are you sure you want to delete?</div><div class="popup-buttons"><button id="cancel">Cancel</button><button id="yes">Yes</button></div>';
      });
    }
  });
}

function editAnnouncement() {
  list.addEventListener("click", function (element) {
    if (element.target && element.target.className == "editbtn") {
      let content = element.target.parentNode.getElementsByClassName(
        "licontent"
      );
      // console.log(content[0].innerHTML);
      document.getElementById(
        "announcement-box"
      ).value = content[0].innerHTML.trim();
      window.scrollTo(0, 20);

      document.querySelector(".post-announcement h1").innerHTML =
        "Edit the announcement and click on add to edit the announcement";

      add.addEventListener("click", function () {
        // if (document.getElementById("announcement-box").value != "") {
        element.target.parentNode.remove();
        // }
        document.querySelector(".post-announcement h1").innerHTML =
          "Post the new announcement here:";
      });
    }
  });
}

function openpopup() {
  document.getElementById("overlay").classList.add("active");
  document.getElementsByClassName("popup")[0].classList.add("active");
}

function closepopup() {
  document.getElementById("overlay").classList.remove("active");
  document.getElementsByClassName("popup")[0].classList.remove("active");
}
