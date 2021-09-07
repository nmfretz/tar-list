//----------HTML ELEMENTS----------//

// header game elements
const headlights = document.querySelector("[data-headlights]");
const headlightToggle = document.querySelector("[data-headlight-toggle]");
const headlightColorPicker = document.querySelector("[data-headlight-color-picker]");
const horn = document.querySelector("[data-horn]");

// adding a vehicle elements
const addVehiclebtn = document.querySelector("[data-add-vehicle-btn]");
const modalOverlay = document.querySelector("[data-modal-overlay]");
const modalsContainer = document.querySelector("[data-modals]");
const vehicleNameModal = document.querySelector("[data-vehicle-name-modal]");
const vehicleNameInput = document.querySelector("[data-vehicle-name-input]");
const driverModal = document.querySelector("[data-driver-modal]");
const imgModal = document.querySelector("[data-img-modal]");
const searchImgInput = document.querySelector("[data-search-img-input]");
const searchImgBtn = document.querySelector("[data-search-img-btn]");
const clearSearchBtn = document.querySelector("[data-clear-search]");
const imageGallery = document.querySelector("[data-img-gallery]");
const images = document.querySelector("[data-images]");
const loader = document.querySelector("[data-loader]");
const imgPageNum = document.querySelector("[data-page-num]");
const finishBtn = document.querySelector("[data-finish-btn]");

// vehicle gallery elements
const vehicleGallery = document.querySelector("[data-vehicle-gallery]");
const vehicleTemplate = document.querySelector("[data-vehicle-template]");
const galleryPopup = document.querySelector("[data-gallery-popup]");
const popupImg = document.querySelector("[data-popup-img]");

//----------GLOBAL VARIABLES----------//

const LOCAL_STORAGE_PREFIX = "TAR_LIST";
const TAR_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-tars`;
let vehicleArray = loadVehicles(); // populates array with local storage or an empty array if local storage is empty
vehicleArray.forEach(renderVehicles);

let tempSearchInput = "";
let flickrPage = 1;
const tempVehicle = {};

//----------EVENT LISTENERS----------//

// headlight toggle (event listener)
headlightToggle.addEventListener("click", (e) => {
  if (e.target.checked === true) {
    headlights.classList.remove("hidden");
  } else {
    headlights.classList.add("hidden");
  }
});

// headlight color picker (event listener)
headlightColorPicker.addEventListener("click", (e) => {
  if (!e.target.matches("[data-color-JS]")) return;
  e.target.parentElement.querySelector(".selected").classList.remove("selected");
  e.target.classList.add("selected");
  headlights.children[0].style.backgroundColor = e.target.dataset.colorJs;
  headlights.children[0].style.boxShadow = `0 0 20px 15px ${e.target.dataset.colorJs}`;
  headlights.children[1].style.backgroundColor = e.target.dataset.colorJs;
  headlights.children[1].style.boxShadow = `0 0 20px 15px ${e.target.dataset.colorJs}`;
});

// honk car horn (event listener)
horn.addEventListener("click", (e) => {
  const honk = new Audio("./sounds/car-horn.mp3");
  honk.play();
});

// add new vehicle button (event listener)
addVehiclebtn.addEventListener("click", (e) => {
  openModal();
});

// name your vehicle (event listener)
modalsContainer.addEventListener("keyup", (e) => {
  if (!e.target.matches("[data-vehicle-name-input]")) return;

  const targetBtn = e.target.closest("[data-vehicle-name-modal]").querySelector("[data-next-btn]");

  if (vehicleNameInput.value !== "") {
    targetBtn.classList.remove("disabled-btn");
    targetBtn.disabled = false;
  } else {
    targetBtn.classList.add("disabled-btn");
    targetBtn.disabled = true;
  }
});

// next modal step (event listeners)
//    click event
modalsContainer.addEventListener("click", (e) => {
  if (!e.target.matches("[data-next-btn]")) return;
  nextModalStep(e);
});

//    enter event
vehicleNameInput.addEventListener("keyup", (e) => {
  if (e.keyCode !== 13 || vehicleNameInput.value === "") return;
  nextModalStep(e);
});

// previous modal step (event listener)
modalsContainer.addEventListener("click", (e) => {
  if (!e.target.matches("[data-prev-btn]")) return;
  prevModalStep(e);
});

// cancel modal (event listener)
modalsContainer.addEventListener("click", (e) => {
  if (!e.target.matches("[data-cancel-btn]")) return;
  cancelModal(e);
});

// select driver (event listeners)
//    mousedown event allows class to be assigned to target img before the click event below fires to enable the next button
modalsContainer.addEventListener("mousedown", (e) => {
  if (!e.target.matches("[data-driver]")) return;
  const allDrivers = Array.from(document.querySelectorAll("[data-driver]"));
  allDrivers.forEach((driver) => driver.classList.remove("selected-driver"));
  e.target.classList.add("selected-driver");
});

//    enable next button once driver selected
modalsContainer.addEventListener("click", (e) => {
  if (!e.target.matches("[data-driver]")) return;

  const targetBtn = e.target.closest("[data-driver-modal]").querySelector("[data-next-btn]");

  if (e.target.classList.contains("selected-driver")) {
    targetBtn.classList.remove("disabled-btn");
    targetBtn.disabled = false;
  } else {
    targetBtn.classList.add("disabled-btn");
    targetBtn.disabled = true;
  }
});

// search image (event listeners)
//    search on enter
searchImgInput.addEventListener("keyup", (e) => {
  if (e.keyCode !== 13 || searchImgInput.value === "") return;
  imageGallery.classList.remove("hidden");
  tempSearchInput = searchImgInput.value;
  flickrPage = 1;
  fetchImages(tempSearchInput);
});

//    search on btn click
searchImgBtn.addEventListener("click", (e) => {
  imageGallery.classList.remove("hidden");
  tempSearchInput = searchImgInput.value;
  flickrPage = 1;
  fetchImages(tempSearchInput);
});

// change fetch image page (event listeners)
//    next fetch image page
imgModal.addEventListener("click", (e) => {
  if (!e.target.matches("[data-next-page]")) return;
  flickrPage++;
  fetchImages(tempSearchInput);
});

//    previous fetch image page
imgModal.addEventListener("click", (e) => {
  if (!e.target.matches("[data-prev-page]")) return;
  if (flickrPage === 1) return;
  flickrPage--;
  fetchImages(tempSearchInput);
});

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
  const allImages = Array.from(document.querySelectorAll("[data-img]"));
  allImages.forEach((img) => img.classList.remove("selected-img"));
  e.target.classList.add("selected-img");
  finishBtn.classList.remove("disabled-btn");
  finishBtn.disabled = false;
});

//TODO - consider moving some of the finish button event listener to a function
// finish button (event listener)
modalsContainer.addEventListener("click", (e) => {
  if (!e.target.matches("[data-finish-btn]")) return;

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
  saveVehicles();
  renderVehicles("yes");

  const target = e.target.closest(".modal");
  target.classList.add("hidden");
  modalOverlay.classList.add("hidden");
  document.body.classList.remove("pause-scrolling");
  clearInputs();
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

//    ensures that trash can hides if you move mouse directly from trash can out of image near top of image
vehicleGallery.addEventListener("mouseout", (e) => {
  if (!e.target.matches("[data-delete-item]")) return;
  e.target.classList.add("hidden");
});

// delete vehicle (event listener)
vehicleGallery.addEventListener("click", (e) => {
  if (!e.target.matches("[data-delete-item]")) return;
  deleteVehicle(e); //removes vehicle from html, vehicleArray, and local storage
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

  //TODO - add title/author/license to html
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
  reorderArray(vehicleArray, currentPosition, currentPosition + 1);
  saveVehicles();
  vehicleGallery.innerHTML = "";
  vehicleArray.forEach(renderVehicles);
});

//    move up the gallery
vehicleGallery.addEventListener("click", (e) => {
  if (!e.target.matches("[data-sort-arrow-up]")) return;
  const currentId = e.target.closest("[data-item-container]").dataset.id;
  const currentPosition = vehicleArray.map((vehicle) => vehicle.id).indexOf(currentId);
  reorderArray(vehicleArray, currentPosition, currentPosition - 1);
  saveVehicles();
  vehicleGallery.innerHTML = "";
  vehicleArray.forEach(renderVehicles);
});

//----------FUNCTIONS----------//

function openModal() {
  modalOverlay.style.top = `${window.scrollY}px`;
  modalOverlay.style.height = `${window.innerHeight}px`;
  vehicleNameModal.style.top = `${window.scrollY + window.innerHeight / 2}px`;

  document.body.classList.add("pause-scrolling");
  modalOverlay.classList.remove("hidden");
  vehicleNameModal.classList.remove("hidden");
}

function nextModalStep(e) {
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

function prevModalStep(e) {
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

async function fetchImages(searchInput) {
  finishBtn.classList.add("disabled-btn");
  images.innerHTML = "";
  loader.classList.remove("hide-loader");

  const apiUrl = `/${searchInput},${flickrPage}`;

  //TODO - add try catch here
  const response = await fetch(apiUrl);
  const photos = await response.json();
  console.log(photos);

  // const photos = json.photos.photo;
  loader.classList.add("hide-loader");

  if (photos.length > 0) {
    photos.forEach((photo) => {
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
    });
    imgPageNum.innerHTML = `page ${flickrPage}`;
  } else {
    const noPhotoMessage = document.createElement("span");
    noPhotoMessage.innerText = `No photos found for '${searchInput}'`;
    images.append(noPhotoMessage);
  }
}

function renderVehicles(isVehicleNew) {
  vehicleGallery.innerHTML = "";
  vehicleArray.forEach((vehicle, index) => {
    const templateClone = vehicleTemplate.content.cloneNode(true);
    const itemContainer = templateClone.querySelector("[data-item-container]");
    const itemImage = templateClone.querySelector("[data-item-img]");
    const driver = templateClone.querySelector("[data-item-driver]");
    const itemName = templateClone.querySelector("[data-item-name]");
    const itemRank = templateClone.querySelector("[data-item-rank]");
    itemContainer.dataset.id = vehicle.id;
    itemImage.src = vehicle.image;
    // image attribution
    itemImage.dataset.userId = vehicle.userId;
    itemImage.dataset.photoId = vehicle.photoId;
    itemImage.dataset.owner = vehicle.owner;
    itemImage.dataset.title = vehicle.title;
    itemImage.dataset.license = vehicle.license;
    itemImage.dataset.licenseUrl = vehicle.licenseUrl;

    driver.src = vehicle.driver;
    itemName.innerText = vehicle.name.toUpperCase();
    itemRank.innerText = `RANK: ${index + 1}`;

    //TODO - add photo attribution
    vehicleGallery.append(itemContainer);

    //scroll to newly rendered image
    if (isVehicleNew === "yes" && index === vehicleArray.length - 1) {
      itemContainer.scrollIntoView({ behavior: "smooth" });
      itemImage.classList.add("highlight");
      setTimeout(() => {
        itemImage.classList.remove("highlight");
      }, 3000);
    }
  });
}

function saveVehicles() {
  localStorage.setItem(TAR_STORAGE_KEY, JSON.stringify(vehicleArray));
}

function loadVehicles() {
  const vehicleString = localStorage.getItem(TAR_STORAGE_KEY);
  return JSON.parse(vehicleString) || [];
}

function deleteVehicle(e) {
  const parent = e.target.closest("[data-item-container]");
  const parentId = parent.dataset.id;
  vehicleArray = vehicleArray.filter((vehicle) => vehicle.id !== parentId);
  parent.remove();
  saveVehicles();
}

// modify array to reorder vehicle gallery
//    TODO - is modifying the array in place poor practice?
function reorderArray(arr, fromIndex, toIndex) {
  if (fromIndex === 0 && toIndex < 0) return;
  if (fromIndex === arr.length - 1 && toIndex === arr.length) return;
  const element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}
//TODO
/**
 * go through html/css/javascript and clean up attribute names.
 * use spread operator to change nodelists into arrays. do this instead of Array.from(nodelist)
 * check newVehicle spread operator to clone object. may not need this anymore
 * check to see if maps and sets can be used.
 * consider using a generator for IDs

 * Design considerations
 *  search-text size?
 *  use higher quality driver photos
 *  overlay colour
 *  change headlight toggle to something simple?
 *  add enter event listener on 2nd and 3rd modals or else remove on first for consistency
 */
