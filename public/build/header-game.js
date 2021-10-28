import addGlobalEventListener from "./utils/addGlobalEventListener.js";

const headlights = document.querySelector("[data-headlights]");
const honk = new Audio("./sounds/car-horn.mp3"); // TODO - find honk audio with a delay

export function setupHeaderGame() {
  // add event listener to headlights
  addGlobalEventListener("click", "[data-headlight-toggle]", toggleHeadlights);
  //add event listener to headlight color
  addGlobalEventListener("click", "[data-color-JS]", chooseHeadlightColor);
  //add event listener to horn
  addGlobalEventListener("click", "[data-horn]", honkHorn);
}

function toggleHeadlights(e) {
  if (e.target.checked === true) {
    headlights.classList.remove("hidden");
  } else {
    headlights.classList.add("hidden");
  }
}

function chooseHeadlightColor(e) {
  e.target.parentElement.querySelector(".selected").classList.remove("selected");
  e.target.classList.add("selected");
  headlights.children[0].style.backgroundColor = e.target.dataset.colorJs;
  headlights.children[0].style.boxShadow = `0 0 20px 15px ${e.target.dataset.colorJs}`;
  headlights.children[1].style.backgroundColor = e.target.dataset.colorJs;
  headlights.children[1].style.boxShadow = `0 0 20px 15px ${e.target.dataset.colorJs}`;
}

function honkHorn() {
  honk.play();
}
