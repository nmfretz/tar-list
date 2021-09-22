// TODO - this needs to be refactored. The nextModalStep I created should be broken apart and renamed to something intuitive

export default class AddVehicle {
  static openModal() {
    modalOverlay.style.top = `${window.scrollY}px`;
    modalOverlay.style.height = `${window.innerHeight}px`;
    vehicleNameModal.style.top = `${window.scrollY + window.innerHeight / 2}px`;

    document.body.classList.add("pause-scrolling");
    modalOverlay.classList.remove("hidden");
    vehicleNameModal.classList.remove("hidden");
  }

  static enableNextBtnVehicleNameModal(e) {
    const targetBtn = e.target.closest("[data-vehicle-name-modal]").querySelector("[data-next-btn]");

    if (vehicleNameInput.value !== "") {
      targetBtn.classList.remove("disabled-btn");
      targetBtn.disabled = false;
    } else {
      targetBtn.classList.add("disabled-btn");
      targetBtn.disabled = true;
    }
  }

  static enableNextBtnDriverModal(e) {
    const targetBtn = e.target.closest("[data-driver-modal]").querySelector("[data-next-btn]");

    if (e.target.classList.contains("selected-driver")) {
      targetBtn.classList.remove("disabled-btn");
      targetBtn.disabled = false;
    } else {
      targetBtn.classList.add("disabled-btn");
      targetBtn.disabled = true;
    }
  }

  static nextModalStep(e) {
    const target = e.target.closest(".modal");
    if (target.querySelector("[data-vehicle-name-input]")) {
      tempVehicle.name = vehicleNameInput.value;
    } else {
      const allDrivers = Array.from(document.querySelectorAll("[data-driver]"));
      const selectedDriver = allDrivers.find((driver) => driver.classList.contains("selected-driver"));
      const driverPhoto = selectedDriver.src;
      tempVehicle.driver = driverPhoto;
    }

    //switch to appropriate modal
    target.classList.add("hidden");
    target.nextElementSibling.style.top = `${window.scrollY + window.innerHeight / 2}px`;
    target.nextElementSibling.classList.remove("hidden");
  }

  static prevModalStep(e) {
    const target = e.target.closest(".modal");
    target.classList.add("hidden");
    target.previousElementSibling.classList.remove("hidden");
  }

  static clearInputs() {
    vehicleNameInput.value = "";
    const allDrivers = Array.from(document.querySelectorAll("[data-driver]"));
    allDrivers.forEach((driver) => driver.classList.remove("selected-driver"));
    searchImgInput.value = "";
    clearSearchBtn.classList.add("hidden");
    images.innerHTML = "";
    imageGallery.classList.add("hidden");
    finishBtn.classList.add("disabled-btn");
    finishBtn.disabled = true;
    const nextBtns = Array.from(document.querySelectorAll("[data-next-btn]"));
    nextBtns.forEach((btn) => btn.classList.add("disabled-btn"));
    nextBtns.forEach((btn) => (btn.disabled = true));
    imgPageNum.innerHTML = "";
  }

  static cancelModal(e) {
    const target = e.target.closest(".modal");
    target.classList.add("hidden");
    modalOverlay.classList.add("hidden");
    document.body.classList.remove("pause-scrolling");
    this.clearInputs();
  }

  static toggleDriver(e) {
    const allDrivers = Array.from(document.querySelectorAll("[data-driver]"));
    allDrivers.forEach((driver) => driver.classList.remove("selected-driver"));
    e.target.classList.add("selected-driver");
  }

  static async fetchImages(searchInput) {
    searchPhotosCache = [];
    finishBtn.classList.add("disabled-btn");
    loader.classList.remove("hide-loader");

    // change domain based on deployment
    const apiUrl = `http://localhost:3000/${searchInput}`;

    // TODO - add try catch here
    try {
      const response = await fetch(apiUrl);
      searchPhotosCache = await response.json();
      console.log(searchPhotosCache);

      loader.classList.add("hide-loader");

      if (searchPhotosCache.length > 0) {
        this.renderSearchPhotos(searchPhotosCache, photosPerPage);
      } else {
        const noPhotoMessage = document.createElement("span");
        noPhotoMessage.innerText = `No photos found for '${searchInput}'. Please try another search.`;
        images.append(noPhotoMessage);
      }
    } catch (error) {
      console.error(error);
      loader.classList.add("hide-loader");
      const noPhotoMessage = document.createElement("span");
      noPhotoMessage.innerText = `${error}. Please check your internet connection`;
      images.append(noPhotoMessage);
    }
  }

  static toggleSearchImage(e) {
    const allImages = Array.from(document.querySelectorAll("[data-img]"));
    allImages.forEach((img) => img.classList.remove("selected-img"));
    e.target.classList.add("selected-img");
    finishBtn.classList.remove("disabled-btn");
    finishBtn.disabled = false;
  }

  static renderSearchPhotos(photos, photosPerPage, page = 1) {
    images.innerHTML = "";

    photos.forEach((photo, index) => {
      if (index >= photosPerPage * page - photosPerPage && index < photosPerPage * page) {
        const img = document.createElement("img");
        const fullImageURL = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
        img.src = photo.url_q; //thumbnail image
        img.classList.add("gal-img");
        img.dataset.img = ""; //TODO - review this. was this for DOM selection?
        img.setAttribute("data-full-url", fullImageURL);
        img.dataset.userId = photo.owner;
        img.dataset.photoId = photo.id;
        img.dataset.title = photo.title;
        img.dataset.owner = photo.ownername;
        img.dataset.license = photo.licenseName;
        img.dataset.licenseUrl = photo.licenseNameUrl;

        images.append(img);
        imgPageNum.innerHTML = `page ${page}`;
      } else {
        return;
      }
    });
  }

  static storeVehicleDetails(e, vehicleArray) {
    tempVehicle.image = e.target.closest(".modal").querySelector(".selected-img").dataset.fullUrl;
    //TODO - change id to uuid v4
    tempVehicle.id = new Date().valueOf().toString();
    tempVehicle.title = e.target.closest(".modal").querySelector(".selected-img").dataset.title;
    tempVehicle.owner = e.target.closest(".modal").querySelector(".selected-img").dataset.owner;
    tempVehicle.license = e.target.closest(".modal").querySelector(".selected-img").dataset.license;
    tempVehicle.licenseUrl = e.target.closest(".modal").querySelector(".selected-img").dataset.licenseUrl;
    tempVehicle.userId = e.target.closest(".modal").querySelector(".selected-img").dataset.userId;
    tempVehicle.photoId = e.target.closest(".modal").querySelector(".selected-img").dataset.photoId;
    const newVehicle = { ...tempVehicle }; // TODO - check to see if I still need to clone object using spread operator.
    vehicleArray.push(newVehicle);
  }
}

const tempVehicle = {};
export let searchPhotosCache = [];
export const photosPerPage = 6;

// TODO - move into functions if used once
const modalOverlay = document.querySelector("[data-modal-overlay]");
const vehicleNameModal = document.querySelector("[data-vehicle-name-modal]");
const vehicleNameInput = document.querySelector("[data-vehicle-name-input]");
const searchImgInput = document.querySelector("[data-search-img-input]");
const clearSearchBtn = document.querySelector("[data-clear-search]");
const images = document.querySelector("[data-images]");
const imageGallery = document.querySelector("[data-img-gallery]");
const finishBtn = document.querySelector("[data-finish-btn]");
const imgPageNum = document.querySelector("[data-page-num]");
const loader = document.querySelector("[data-loader]");
