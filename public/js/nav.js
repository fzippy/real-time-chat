const burger = document.querySelector("#burger");
const burger2 = document.querySelector("#burger2");
const nav = document.querySelector("nav");

burger.addEventListener("click", () => {
  console.log("y");
  nav.style.width = "225px";
});
burger2.addEventListener("click", () => {
  nav.style.width = "0px";
});
