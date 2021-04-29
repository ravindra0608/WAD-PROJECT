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

ScrollRate = 100;

function scrollDiv_init() {
  DivElmnt = document.getElementById("announcements-box");
  ReachedMaxScroll = false;

  DivElmnt.scrollTop = 0;
  PreviousScrollTop = 0;

  ScrollInterval = setInterval("scrollDiv()", ScrollRate);
}

function scrollDiv() {
  if (!ReachedMaxScroll) {
    DivElmnt.scrollTop = PreviousScrollTop;
    PreviousScrollTop++;

    ReachedMaxScroll =
      DivElmnt.scrollTop >= DivElmnt.scrollHeight - DivElmnt.offsetHeight;
  } else {
    ReachedMaxScroll = DivElmnt.scrollTop == 0 ? false : true;

    DivElmnt.scrollTop = PreviousScrollTop;
    PreviousScrollTop--;
  }
}

function pauseDiv() {
  clearInterval(ScrollInterval);
}

function resumeDiv() {
  PreviousScrollTop = DivElmnt.scrollTop;
  ScrollInterval = setInterval("scrollDiv()", ScrollRate);
}

document.querySelector("body").onload(scrollDiv_init());
