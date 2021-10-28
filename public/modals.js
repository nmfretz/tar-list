import addGlobalEventListener from "./utils/addGlobalEventListener.js";
import {
  storeVehicleName,
  storeDriver,
  fetchImages,
  renderSearchPhotos,
  storeVehicleImage,
  saveVehiclesToLocalStorage,
  renderVehicleGallery,
} from "./vehicles.js";

let imgSearchInput = "";
let imgSearchPage = 1;

const modalOverlay = document.querySelector("[data-modal-overlay]");
const vehicleNameModal = document.querySelector("[data-vehicle-name-modal]");
const vehicleNameInput = document.querySelector("[data-vehicle-name-input]");
const searchImgInput = document.querySelector("[data-search-img-input]");
const imageGallery = document.querySelector("[data-img-gallery]");
const clearSearchBtn = document.querySelector("[data-clear-search]");
const images = document.querySelector("[data-images]");
const finishBtn = document.querySelector("[data-finish-btn]");
const imgPageNum = document.querySelector("[data-page-num]");
const vehicleGallery = document.querySelector("[data-vehicle-gallery]");
const searchImageButton = document.querySelector("[data-search-img-btn]");

export function setupModals() {
  // add-vehicle button
  addGlobalEventListener("click", "[data-add-vehicle-btn]", showVehicleNameModal);

  // enable the next button on user input
  addGlobalEventListener("keyup", "[data-vehicle-name-input]", enableNextBtn);
  addGlobalEventListener("click", "[data-driver]", enableNextBtn);

  // next modal step button
  addGlobalEventListener("click", "[data-next-btn]", showNextModal);

  // previous modal step button
  addGlobalEventListener("click", "[data-prev-btn]", showPrevModal);

  // cancel modal
  addGlobalEventListener("click", "[data-cancel-btn]", cancelModal);

  // search images
  addGlobalEventListener("click", "[data-search-img-btn]", async (e) => {
    searchImageButton.disabled = true;
    searchImageButton.classList.add("disabled-btn");

    // button > * { pointer-events: none;} - This CSS prevents clicks on elements within the button from preventing the listener from firing
    imageGallery.classList.remove("hidden");
    imgSearchInput = searchImgInput.value;
    imgSearchPage = 1;
    await fetchImages(imgSearchInput);

    searchImageButton.disabled = false;
    searchImageButton.classList.remove("disabled-btn");
  });

  // show/hide the clear-search icon
  addGlobalEventListener("keyup", "[data-search-img-input]", () => {
    if (searchImgInput.value === "") {
      clearSearchBtn.classList.add("hidden");
    } else {
      clearSearchBtn.classList.remove("hidden");
    }
  });

  // clear search input with clear-search icon
  addGlobalEventListener("click", "[data-clear-search]", () => {
    searchImgInput.value = "";
    clearSearchBtn.classList.add("hidden");
  });

  // next image search page
  addGlobalEventListener("click", "[data-next-page]", () => {
    if (imgSearchPage === 20) return; // 120 photos fetched with 6 photos displayed per page = 20 pages
    imgSearchPage++;
    finishBtn.classList.add("disabled-btn");
    finishBtn.disabled = true;
    renderSearchPhotos(imgSearchPage);
  });

  // previous image search page
  addGlobalEventListener("click", "[data-prev-page]", () => {
    if (imgSearchPage === 1) return;
    imgSearchPage--;
    finishBtn.classList.add("disabled-btn");
    finishBtn.disabled = true;
    renderSearchPhotos(imgSearchPage);
  });

  // toggle a searched image
  addGlobalEventListener("click", "[data-img]", toggleSearchImage);

  // finish button
  addGlobalEventListener("click", "[data-finish-btn]", (e) => {
    console.log("clicked finish button");
    storeVehicleImage();
    saveVehiclesToLocalStorage();
    cancelModal(e);
    clearInputs();
    renderVehicleGallery();
    scrollIntroView();
  });
}

function showVehicleNameModal() {
  modalOverlay.style.top = `${window.scrollY}px`;
  modalOverlay.style.height = `${window.innerHeight}px`;
  vehicleNameModal.style.top = `${window.scrollY + window.innerHeight / 2}px`;

  document.body.classList.add("pause-scrolling");
  modalOverlay.classList.remove("hidden");
  vehicleNameModal.classList.remove("hidden");

  //focus and select input element for desktop and mobile
  vehicleNameInput.focus();
  vehicleNameInput.select();
}

function enableNextBtn(e) {
  const targetBtn = e.target.closest("[data-modal]").querySelector("[data-next-btn]");

  if (e.target.closest("[data-modal]").matches("[data-vehicle-name-modal]")) {
    if (vehicleNameInput.value !== "") {
      targetBtn.classList.remove("disabled-btn");
      targetBtn.disabled = false;
    } else {
      targetBtn.classList.add("disabled-btn");
      targetBtn.disabled = true;
    }
  }

  if (e.target.closest("[data-modal]").matches("[data-driver-modal]")) {
    toggleDriver(e);
    if (e.target.classList.contains("selected-driver")) {
      targetBtn.classList.remove("disabled-btn");
      targetBtn.disabled = false;
    } else {
      targetBtn.classList.add("disabled-btn");
      targetBtn.disabled = true;
    }
  }
}

function toggleDriver(e) {
  const allDrivers = [...document.querySelectorAll("[data-driver]")];
  allDrivers.forEach((driver) => driver.classList.remove("selected-driver"));
  e.target.classList.add("selected-driver");
}

function toggleSearchImage(e) {
  const allImages = [...document.querySelectorAll("[data-img]")];
  allImages.forEach((img) => img.classList.remove("selected-img"));
  e.target.classList.add("selected-img");
  finishBtn.classList.remove("disabled-btn");
  finishBtn.disabled = false;
}

function showNextModal(e) {
  const currentModal = e.target.closest("[data-modal]");
  const nextModal = currentModal.nextElementSibling;

  if (currentModal === document.querySelector("[data-vehicle-name-modal]")) {
    console.log("clicked next in name modal");
    storeVehicleName();
  }
  if (currentModal === document.querySelector("[data-driver-modal]")) {
    console.log("clicked next in driver modal");
    storeDriver();
  }

  currentModal.classList.add("hidden");
  nextModal.style.top = `${window.scrollY + window.innerHeight / 2}px`;
  nextModal.classList.remove("hidden");

  if (nextModal.matches("[data-img-modal]")) {
    // focus and select input element for desktop and mobile
    searchImgInput.focus();
    searchImgInput.select();
  }
}

function showPrevModal(e) {
  const target = e.target.closest(".modal");
  target.classList.add("hidden");
  target.previousElementSibling.classList.remove("hidden");
}

function cancelModal(e) {
  const target = e.target.closest(".modal");
  target.classList.add("hidden");
  modalOverlay.classList.add("hidden");
  document.body.classList.remove("pause-scrolling");
  clearInputs();
}

function clearInputs() {
  vehicleNameInput.value = "";

  const allDrivers = [...document.querySelectorAll("[data-driver]")];
  allDrivers.forEach((driver) => driver.classList.remove("selected-driver"));

  searchImgInput.value = "";
  clearSearchBtn.classList.add("hidden");
  images.innerHTML = "";
  imageGallery.classList.add("hidden");
  finishBtn.classList.add("disabled-btn");
  finishBtn.disabled = true;
  const nextBtns = [...document.querySelectorAll("[data-next-btn]")];
  nextBtns.forEach((btn) => btn.classList.add("disabled-btn"));
  nextBtns.forEach((btn) => (btn.disabled = true));
  imgPageNum.innerHTML = "";
}

function scrollIntroView() {
  const newestVehicle = vehicleGallery.lastElementChild;
  const vehicleImg = newestVehicle.querySelector("[data-item-img]");
  newestVehicle.scrollIntoView({ behavior: "smooth" });
  vehicleImg.classList.add("highlight");
  setTimeout(() => {
    vehicleImg.classList.remove("highlight");
  }, 3000);
}
