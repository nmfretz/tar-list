import HeaderGame from "./header-game.js";
import AddVehicle, { searchPhotosCache, photosPerPage } from "./add-vehicle.js";
import VehicleGallery, { vehicleArray } from "./vehicle-gallery.js";

//TODO - consider moving
let tempSearchInput = "";
let searchPage = 1;

// TODO - go through UI elements and see which ones can be moved down to where they are used, if used once
const headlightToggle = document.querySelector("[data-headlight-toggle]");
const headlightColorPicker = document.querySelector("[data-headlight-color-picker]");
const horn = document.querySelector("[data-horn]");
const addVehiclebtn = document.querySelector("[data-add-vehicle-btn]");
const modalOverlay = document.querySelector("[data-modal-overlay]");
const modalsContainer = document.querySelector("[data-modals]");
const vehicleNameModal = document.querySelector("[data-vehicle-name-modal]");
const driverModal = document.querySelector("[data-driver-modal]");
const imgModal = document.querySelector("[data-img-modal]");
const searchImgInput = document.querySelector("[data-search-img-input]");
const searchImgBtn = document.querySelector("[data-search-img-btn]");
const clearSearchBtn = document.querySelector("[data-clear-search]");
const imageGallery = document.querySelector("[data-img-gallery]");
const vehicleGallery = document.querySelector("[data-vehicle-gallery]");
const galleryPopup = document.querySelector("[data-gallery-popup]");
const popupImg = document.querySelector("[data-popup-img]");

vehicleArray.forEach(VehicleGallery.renderVehicles);

headlightToggle.addEventListener("click", (e) => {
  HeaderGame.toggleHeadlights(e);
});

headlightColorPicker.addEventListener("click", (e) => {
  HeaderGame.chooseHeadlightColor(e);
});

horn.addEventListener("click", (e) => {
  HeaderGame.honkHorn();
});

// add new vehicle button (event listener)
addVehiclebtn.addEventListener("click", (e) => {
  AddVehicle.openModal();
});

// enables the next button once a vehicle name has been input
modalsContainer.addEventListener("keyup", (e) => {
  if (!e.target.matches("[data-vehicle-name-input]")) return;
  AddVehicle.enableNextBtnVehicleNameModal(e);
});

// next modal step (event listener)
modalsContainer.addEventListener("click", (e) => {
  if (!e.target.matches("[data-next-btn]")) return;
  const target = document.querySelector("[data-vehicle-name-modal]");
  AddVehicle.nextModalStep(target);
});

const vehicleNameInput = document.querySelector("[data-vehicle-name-input]");
document.addEventListener("keyup", (e) => {
  if (e.keyCode !== 13) return;
  if (document.querySelector("[data-vehicle-name-modal]").classList.contains("hidden") === true) return;
  if (vehicleNameInput.value === "") return;
  const target = document.querySelector("[data-vehicle-name-modal]");
  AddVehicle.nextModalStep(target);
  console.log("enter vehicle name");
});

// previous modal step (event listener)
modalsContainer.addEventListener("click", (e) => {
  if (!e.target.matches("[data-prev-btn]")) return;
  AddVehicle.prevModalStep(e);
});

// cancel modal (event listener)
modalsContainer.addEventListener("click", (e) => {
  if (!e.target.matches("[data-cancel-btn]")) return;
  AddVehicle.cancelModal(e);
});

// select driver (event listeners)
//    mousedown event allows class to be assigned to target img before the click event below fires to enable the next button
modalsContainer.addEventListener("mousedown", (e) => {
  if (!e.target.matches("[data-driver]")) return;
  AddVehicle.toggleDriver(e);
});

//    enable next button once driver selected
modalsContainer.addEventListener("click", (e) => {
  if (!e.target.matches("[data-driver]")) return;
  AddVehicle.enableNextBtnDriverModal(e);
});

document.addEventListener("keyup", (e) => {
  if (e.keyCode !== 13) return;
  if (document.querySelector("[data-driver-modal]").classList.contains("hidden") === true) return;
  const allDrivers = [...document.querySelectorAll("[data-driver]")];
  console.log(allDrivers);
  if (allDrivers.find((driver) => driver.classList.contains("selected-driver")) === undefined) return;
  const target = document.querySelector("[data-driver-modal]");
  AddVehicle.nextModalStep(target);
  console.log("enter driver");
});

// next modal step (event listener)
modalsContainer.addEventListener("click", (e) => {
  if (!e.target.matches("[data-next-btn]")) return;
  const target = document.querySelector("[data-driver-modal]");
  AddVehicle.nextModalStep(target);
});

// search image (event listeners)
//    search on enter
searchImgInput.addEventListener("keyup", async (e) => {
  if (e.keyCode !== 13 || searchImgInput.value === "") return;
  imageGallery.classList.remove("hidden");
  tempSearchInput = searchImgInput.value; // can get rid of this now that I cache 120 images and then page through them
  searchPage = 1;
  await AddVehicle.fetchImages(tempSearchInput);
});

//    search on btn click
searchImgBtn.addEventListener("click", async (e) => {
  imageGallery.classList.remove("hidden");
  tempSearchInput = searchImgInput.value;
  searchPage = 1;
  await AddVehicle.fetchImages(tempSearchInput);
});

// change fetch image page (event listeners)

//    next fetch image page
imgModal.addEventListener("click", (e) => {
  if (!e.target.matches("[data-next-page]")) return;
  searchPage++;
  AddVehicle.renderSearchPhotos(searchPhotosCache, photosPerPage, searchPage);
});

//    previous fetch image page
imgModal.addEventListener("click", (e) => {
  if (!e.target.matches("[data-prev-page]")) return;
  if (searchPage === 1) return;
  searchPage--;
  AddVehicle.renderSearchPhotos(searchPhotosCache, photosPerPage, searchPage);
});

// TODO - consider changing to something like clearSearchBar.addEventListener
// clear icon in search bar - hide/unhide (event listener)
modalsContainer.addEventListener("keyup", (e) => {
  if (!e.target.matches("[data-search-img-input]")) return;
  if (searchImgInput.value === "") {
    clearSearchBtn.classList.add("hidden");
  } else {
    clearSearchBtn.classList.remove("hidden");
  }
});

// clear icon in search bar - clear search (event listener)
modalsContainer.addEventListener("click", (e) => {
  if (!e.target.matches("[data-clear-search]")) return;
  searchImgInput.value = "";
  clearSearchBtn.classList.add("hidden");
});

// select vehicle img (event listener)
modalsContainer.addEventListener("click", (e) => {
  if (!e.target.matches("[data-img]")) return;
  AddVehicle.toggleSearchImage(e);
});

// finish button (event listener)
modalsContainer.addEventListener("click", (e) => {
  if (!e.target.matches("[data-finish-btn]")) return;

  const allImages = [...document.querySelectorAll("[data-img]")];
  const selectedImage = allImages.find((image) => image.classList.contains("selected-img"));
  console.log(selectedImage);

  AddVehicle.storeVehicleDetails(selectedImage, vehicleArray);
  VehicleGallery.saveVehicles();
  //TODO - change params to renderVehicles... I made this too confusing
  VehicleGallery.renderVehicles("yes");

  const activeModal = document.querySelector("[data-img-modal]");
  activeModal.classList.add("hidden");
  modalOverlay.classList.add("hidden");
  document.body.classList.remove("pause-scrolling");
  AddVehicle.clearInputs();
});

// finish button (event listener) - CURRENTLY EDITING HERE
document.addEventListener("keyup", (e) => {
  if (e.keyCode !== 13) return;
  if (document.querySelector("[data-img-modal]").classList.contains("hidden") === true) return;

  const allImages = [...document.querySelectorAll("[data-img]")];
  console.log(allImages);
  if (allImages.find((image) => image.classList.contains("selected-img")) === undefined) return;

  const selectedImage = allImages.find((image) => image.classList.contains("selected-img"));
  console.log(selectedImage);
  AddVehicle.storeVehicleDetails(selectedImage, vehicleArray); // TODO - consider just exporting vehicleArray and importing to add-vehicle.js
  VehicleGallery.saveVehicles();
  //TODO - change params to renderVehicles... I made this too confusing
  VehicleGallery.renderVehicles("yes");

  const activeModal = document.querySelector("[data-img-modal]");
  activeModal.classList.add("hidden");
  modalOverlay.classList.add("hidden");
  document.body.classList.remove("pause-scrolling");
  AddVehicle.clearInputs();
});

// trash cans in vehicle gallery (event listeners)
//    show trash cans when hovering over image
vehicleGallery.addEventListener("mouseover", (e) => {
  if (!e.target.matches("[data-item-img]")) return;
  e.target.nextElementSibling.classList.remove("hidden");
});

//    hide trash cans when not hovering over image
vehicleGallery.addEventListener("mouseout", (e) => {
  if (!e.target.matches("[data-item-img]")) return;
  e.target.nextElementSibling.classList.add("hidden");
});

//    show trash when hovering over trash can
vehicleGallery.addEventListener("mouseover", (e) => {
  if (!e.target.matches("[data-delete-item]")) return;
  e.target.classList.remove("hidden");
});

// ensures that trash can hides if you move mouse directly from trash can out of image near top-right of image
vehicleGallery.addEventListener("mouseout", (e) => {
  if (!e.target.matches("[data-delete-item]")) return;
  e.target.classList.add("hidden");
});

// delete vehicle (event listener)
vehicleGallery.addEventListener("click", (e) => {
  if (!e.target.matches("[data-delete-item]")) return;
  VehicleGallery.deleteVehicle(e); //removes vehicle from html, vehicleArray, and local storage
});

// open popup for full vehicle image (event listener)
//TODO - refactor with function
vehicleGallery.addEventListener("click", (e) => {
  if (!e.target.matches(".item-image")) return;

  popupImg.src = e.target.src;
  popupImg.alt = e.target.alt;
  modalOverlay.style.top = `${window.scrollY}px`;
  modalOverlay.style.height = `${window.innerHeight}px`;
  galleryPopup.style.top = `${window.scrollY + window.innerHeight / 2}px`;

  //TODO - look into using sanitize html or not using innerHTML here
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

// close popup for full vehicle image (event listener)
modalOverlay.addEventListener("click", (e) => {
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

// sort vehicle gallery items (event listeners)
//    move down the gallery
vehicleGallery.addEventListener("click", (e) => {
  if (!e.target.matches("[data-sort-arrow-down]")) return;

  const currentId = e.target.closest("[data-item-container]").dataset.id;
  const currentPosition = vehicleArray.map((vehicle) => vehicle.id).indexOf(currentId);
  VehicleGallery.reorderArray(vehicleArray, currentPosition, currentPosition + 1);
  VehicleGallery.saveVehicles();
  vehicleGallery.innerHTML = "";
  vehicleArray.forEach(VehicleGallery.renderVehicles);
});

//    move up the gallery
vehicleGallery.addEventListener("click", (e) => {
  if (!e.target.matches("[data-sort-arrow-up]")) return;
  const currentId = e.target.closest("[data-item-container]").dataset.id;
  const currentPosition = vehicleArray.map((vehicle) => vehicle.id).indexOf(currentId);
  VehicleGallery.reorderArray(vehicleArray, currentPosition, currentPosition - 1);
  VehicleGallery.saveVehicles();
  vehicleGallery.innerHTML = "";
  vehicleArray.forEach(VehicleGallery.renderVehicles);
});
