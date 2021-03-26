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
//   Home Page JS


var swipeDown = document.querySelector('#swipe-down-button button');
var downCont = document.getElementById('cont-3');


swipeDown.addEventListener('click',function (event) {
    event.preventDefault();
    // console.log('clicked!');
    var interval1 = setInterval(() => {
        let dist = downCont.getBoundingClientRect().y;
        // console.log(dist);
        if (dist > 138 ) {
            window.scrollBy(0,10);
        } else {
            clearInterval(interval1);
        }
    }, 5);
});