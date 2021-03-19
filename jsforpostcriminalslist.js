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

//For the image to appear

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      document
        .querySelector("#criminal-picture")
        .setAttribute("src", e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function showPicture() {
  document.getElementById("criminal-picture").style.display = "block";
  document.querySelector(".container").style.display = "block";
}

var criminals = document.querySelector(".added-criminals");

document.querySelector(".submit-button").addEventListener("click", function () {
  let name = document.getElementById("name").value;
  let crimename = document.getElementById("crime-name").value;
  let lastseen = document.getElementById("last-seen").value;
  let fullPath = document.getElementById("criminal-pic").value;
  let dangerScale = document.querySelector(
    'input[name="danger-level"]:checked'
  );
  let filename = "";
  if (fullPath) {
    var startIndex =
      fullPath.indexOf("\\") >= 0
        ? fullPath.lastIndexOf("\\")
        : fullPath.lastIndexOf("/");
    filename = fullPath.substring(startIndex);
    if (filename.indexOf("\\") === 0 || filename.indexOf("/") === 0) {
      filename = filename.substring(1);
    }
  }

  var newCriminal = document.createElement("div");
  newCriminal.innerHTML =
    '<img src="images/' +
    filename +
    '" alt="" class="pic"><div class="details"><h3>Name:' +
    name +
    "</h3><p>Crime committed:" +
    crimename +
    "</p><p>Last seen: " +
    lastseen +
    '</div><div class="closebtn">Remove</div>';

  newCriminal.classList.add("criminal");
  newCriminal.classList.add(dangerScale.id);

  criminals.appendChild(newCriminal);

  clearInputs();
});

function clearInputs() {
  var inputBoxes = document.getElementsByTagName("input");
  for (let i = 0; i < inputBoxes.length; i++) {
    inputBoxes[i].value = "";
  }
  document.getElementById("criminal-picture").style.display = "none";
  document.querySelector(".container").style.display = "none";

  document.querySelector('input[name="danger-level"]:checked').checked = false;
}

const yes = document.getElementById("yes");
const cancel = document.getElementById("cancel");
const close = document.getElementById("close");
const popupContent = document.getElementById("popup-content");

document
  .querySelector(".added-criminals")
  .addEventListener("click", function (element) {
    if (element.target && element.target.className == "closebtn") {
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
    }
  });

function openpopup() {
  document.getElementById("overlay-pop").classList.add("active");
  document.getElementsByClassName("popup")[0].classList.add("active");
}

function closepopup() {
  document.getElementById("overlay-pop").classList.remove("active");
  document.getElementsByClassName("popup")[0].classList.remove("active");
}
