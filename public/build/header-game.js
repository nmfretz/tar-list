const headlights = document.querySelector("[data-headlights]");

export default class HeaderGame {
  static toggleHeadlights(e) {
    if (e.target.checked === true) {
      headlights.classList.remove("hidden");
    } else {
      headlights.classList.add("hidden");
    }
  }

  static chooseHeadlightColor(e) {
    if (!e.target.matches("[data-color-JS]")) return;
    e.target.parentElement.querySelector(".selected").classList.remove("selected");
    e.target.classList.add("selected");
    headlights.children[0].style.backgroundColor = e.target.dataset.colorJs;
    headlights.children[0].style.boxShadow = `0 0 20px 15px ${e.target.dataset.colorJs}`;
    headlights.children[1].style.backgroundColor = e.target.dataset.colorJs;
    headlights.children[1].style.boxShadow = `0 0 20px 15px ${e.target.dataset.colorJs}`;
  }

  static honkHorn() {
    const honk = new Audio("./sounds/car-horn.mp3");
    honk.play();
  }
}
