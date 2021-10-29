import { v4 as uuidv4 } from "uuid";

const LOCAL_STORAGE_PREFIX = "TAR_LIST";
const TAR_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-tars`;
let vehicleArray = []; // set on page load to localStorage or [] by setupGallery() -> renderVehicleGallery()
let searchPhotosCache = [];
const newVehicle = {};

const vehicleNameInput = document.querySelector("[data-vehicle-name-input]");
const images = document.querySelector("[data-images]");
const finishBtn = document.querySelector("[data-finish-btn]");
const imgPageNum = document.querySelector("[data-page-num]");
const loader = document.querySelector("[data-loader]");
const vehicleGallery = document.querySelector("[data-vehicle-gallery]");

export function storeVehicleName() {
  newVehicle.name = vehicleNameInput.value;
}

export function storeDriver() {
  const allDrivers = [...document.querySelectorAll("[data-driver]")];
  const selectedDriver = allDrivers.find((driver) => driver.classList.contains("selected-driver"));
  const driverPhoto = selectedDriver.src;
  newVehicle.driver = driverPhoto;
}

export async function fetchImages(searchInput) {
  images.innerHTML = "";
  searchPhotosCache = [];
  finishBtn.classList.add("disabled-btn");
  loader.classList.remove("hide-loader");

  const apiUrl = `http://localhost:3000/${searchInput}`; // change domain in production based on server deployment

  try {
    const response = await fetch(apiUrl);
    searchPhotosCache = await response.json();

    loader.classList.add("hide-loader");

    if (searchPhotosCache.length > 0) {
      renderSearchPhotos();
    } else {
      const noPhotoMessage = document.createElement("span");
      noPhotoMessage.classList.add("no-photo-msg");
      noPhotoMessage.innerText = `No photos found for '${searchInput}'. Please try another search.`;
      images.append(noPhotoMessage);
    }
  } catch (error) {
    console.error(error);
    loader.classList.add("hide-loader");
    const noPhotoMessage = document.createElement("span");
    noPhotoMessage.classList.add("no-photo-msg");
    noPhotoMessage.innerText = `Network error - ${error}`;
    images.append(noPhotoMessage);
  }
}

export function renderSearchPhotos(page = 1) {
  images.innerHTML = "";
  const photosPerPage = 6;

  searchPhotosCache.forEach((photo, index) => {
    if (index >= photosPerPage * page - photosPerPage && index < photosPerPage * page) {
      const img = document.createElement("img");
      const fullImageURL = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
      img.src = photo.url_q; // thumbnail image
      img.classList.add("gal-img");
      img.dataset.img = ""; // adds data-img attribute for DOM selection in storeVehicleImage()
      img.setAttribute("data-full-url", fullImageURL);
      img.dataset.userId = photo.owner;
      img.dataset.photoId = photo.id;
      img.dataset.title = photo.title;
      img.dataset.owner = photo.ownername;
      img.dataset.license = photo.licenseName;
      img.dataset.licenseUrl = photo.licenseNameUrl;

      images.append(img);
      imgPageNum.innerHTML = `page ${page}`;
    }
  });
}

export function storeVehicleImage() {
  const allImages = [...document.querySelectorAll("[data-img]")];
  const selectedImage = allImages.find((image) => image.classList.contains("selected-img"));

  newVehicle.image = selectedImage.dataset.fullUrl;
  newVehicle.id = uuidv4();
  newVehicle.title = selectedImage.dataset.title;
  newVehicle.owner = selectedImage.dataset.owner;
  newVehicle.license = selectedImage.dataset.license;
  newVehicle.licenseUrl = selectedImage.dataset.licenseUrl;
  newVehicle.userId = selectedImage.dataset.userId;
  newVehicle.photoId = selectedImage.dataset.photoId;
  vehicleArray.push(newVehicle);
}

export function saveVehiclesToLocalStorage() {
  localStorage.setItem(TAR_STORAGE_KEY, JSON.stringify(vehicleArray));
}

function loadVehicles() {
  const vehicleString = localStorage.getItem(TAR_STORAGE_KEY);
  return JSON.parse(vehicleString) || [];
}

export function deleteVehicle(e) {
  // removes vehicle from html, vehicleArray, and local storage
  const parent = e.target.closest("[data-item-container]");
  const parentId = parent.dataset.id;
  vehicleArray = vehicleArray.filter((vehicle) => vehicle.id !== parentId);
  parent.remove();
  saveVehiclesToLocalStorage();
}

export function renderVehicleGallery() {
  vehicleGallery.innerHTML = "";
  const vehicleTemplate = document.querySelector("[data-vehicle-template]");

  vehicleArray = loadVehicles();
  vehicleArray.forEach((vehicle, index) => {
    const templateClone = vehicleTemplate.content.cloneNode(true);

    const itemContainer = templateClone.querySelector("[data-item-container]");
    itemContainer.dataset.id = vehicle.id;

    const itemImage = templateClone.querySelector("[data-item-img]");
    itemImage.dataset.userId = vehicle.userId;
    itemImage.dataset.photoId = vehicle.photoId;
    itemImage.dataset.owner = vehicle.owner;
    itemImage.dataset.title = vehicle.title;
    itemImage.dataset.license = vehicle.license;
    itemImage.dataset.licenseUrl = vehicle.licenseUrl;
    itemImage.src = vehicle.image;

    const driver = templateClone.querySelector("[data-item-driver]");
    driver.src = vehicle.driver;

    const itemName = templateClone.querySelector("[data-item-name]");
    itemName.innerText = vehicle.name.toUpperCase();
    itemName.title = vehicle.name.toUpperCase();

    const itemRank = templateClone.querySelector("[data-item-rank]");
    itemRank.innerText = `RANK: ${index + 1}`;

    vehicleGallery.append(itemContainer);
  });
}

export function reorderVehicleArray(e) {
  const currentId = e.target.closest("[data-item-container]").dataset.id;
  const fromIndex = vehicleArray.map((vehicle) => vehicle.id).indexOf(currentId);

  let toIndex;
  if (e.target.matches("[data-sort-arrow-down]")) {
    toIndex = fromIndex + 1; // move down gallery
  }
  if (e.target.matches("[data-sort-arrow-up]")) {
    toIndex = fromIndex - 1; // move up gallery
  }

  if (fromIndex === 0 && toIndex < 0) return;
  if (fromIndex === vehicleArray.length - 1 && toIndex === vehicleArray.length) return;

  const element = vehicleArray[fromIndex];
  vehicleArray.splice(fromIndex, 1);
  vehicleArray.splice(toIndex, 0, element);
}
