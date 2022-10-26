const burger = document.querySelector("#burger");
const burger2 = document.querySelector("#burger2");
const nav = document.querySelector("nav");
const navChildren = document.querySelector("#navChildren");

burger.addEventListener("click", () => {
  navChildren.style.display = "block";
  nav.style.width = "225px";
});
burger2.addEventListener("click", () => {
  nav.style.width = "0px";
  navChildren.style.display = "none";
});
