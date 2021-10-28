import addGlobalEventListener from "./utils/addGlobalEventListener.js";
import { renderVehicleGallery, deleteVehicle, saveVehiclesToLocalStorage, reorderVehicleArray } from "./vehicles.js";

const modalOverlay = document.querySelector("[data-modal-overlay]");
const vehicleNameModal = document.querySelector("[data-vehicle-name-modal]");
const driverModal = document.querySelector("[data-driver-modal]");
const imgModal = document.querySelector("[data-img-modal]");
const galleryPopup = document.querySelector("[data-gallery-popup]");
const popupImg = document.querySelector("[data-popup-img]");

export function setupGallery() {
  renderVehicleGallery(); // renders gallery and also sets variable vehicleArray to localStorage

  // delete vehicle
  addGlobalEventListener("click", "[data-delete-item]", deleteVehicle);

  // popup for full gallery image
  addGlobalEventListener("click", ".item-image", (e) => {
    //TODO - refactor with function... code is too long
    popupImg.src = e.target.src;
    popupImg.alt = e.target.alt;
    modalOverlay.style.top = `${window.scrollY}px`;
    modalOverlay.style.height = `${window.innerHeight}px`;
    galleryPopup.style.top = `${window.scrollY + window.innerHeight / 2}px`;

    //TODO - susceptible to cross-site scripting?
    popupImg.parentElement.querySelector(
      ".attribution"
    ).innerHTML = `<span>"</span><a href="https://www.flickr.com/photos/${e.target.dataset.userId}/${e.target.dataset.photoId}" target="_blank">${e.target.dataset.title}</a><span>"</span>,  by <a href="https://www.flickr.com/people/${e.target.dataset.userId}" target="_blank">${e.target.dataset.owner}</a>, licensed under <a href=${e.target.dataset.licenseUrl} target="_blank">${e.target.dataset.license}</a>`;

    // assign css based on landscape vs portrait image
    if (popupImg.width > popupImg.height) {
      galleryPopup.classList.remove("portrait");
      galleryPopup.classList.add("landscape");
    } else {
      galleryPopup.classList.remove("landscape");
      galleryPopup.classList.add("portrait");
    }

    document.body.classList.add("pause-scrolling");
    modalOverlay.classList.remove("hidden");
    galleryPopup.classList.remove("hidden");
  });

  // close popup for full gallery image
  addGlobalEventListener("click", "[data-modal-overlay]", (e) => {
    if (
      !vehicleNameModal.classList.contains("hidden") ||
      !driverModal.classList.contains("hidden") ||
      !imgModal.classList.contains("hidden")
    )
      return;
    galleryPopup.classList.add("hidden");
    modalOverlay.classList.add("hidden");
    document.body.classList.remove("pause-scrolling");
  });

  //    move vehicle down the gallery
  addGlobalEventListener("click", "[data-sort-arrow-down]", (e) => {
    reorderVehicleArray(e);
    saveVehiclesToLocalStorage();
    renderVehicleGallery();
  });

  //    move vehicle up the gallery
  addGlobalEventListener("click", "[data-sort-arrow-up]", (e) => {
    reorderVehicleArray(e);
    saveVehiclesToLocalStorage();
    renderVehicleGallery();
  });
}
