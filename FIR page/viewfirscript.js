var w;
w = document.getElementById("cat0");

function inbox() {
    document.getElementById("div1").style.display = "block";
    document.getElementById("div2").style.display = "none";
    document.getElementById("div3").style.display = "none";
    document.getElementById("div4").style.display = "none";
}
w.onclick = inbox;

var x;
x = document.getElementById("cat1");

function prior1() {
    document.getElementById("div1").style.display = "none";
    document.getElementById("div2").style.display = "block";
    document.getElementById("div3").style.display = "none";
    document.getElementById("div4").style.display = "none";
}
x.onclick = prior1;

var y;
y = document.getElementById("cat2");

function prior2() {
    document.getElementById("div1").style.display = "none";
    document.getElementById("div2").style.display = "none";
    document.getElementById("div3").style.display = "block";
    document.getElementById("div4").style.display = "none";
}
y.onclick = prior2;

var z;
z = document.getElementById("cat3");

function prior3() {
    document.getElementById("div1").style.display = "none";
    document.getElementById("div2").style.display = "none";
    document.getElementById("div3").style.display = "none";
    document.getElementById("div4").style.display = "block";
}
z.onclick = prior3;