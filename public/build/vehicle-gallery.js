const LOCAL_STORAGE_PREFIX = "TAR_LIST";
const TAR_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-tars`;

export default class VehicleGallery {
  //TODO - is modifying the array in place poor practice?
  static reorderArray(arr, fromIndex, toIndex) {
    if (fromIndex === 0 && toIndex < 0) return;
    if (fromIndex === arr.length - 1 && toIndex === arr.length) return;
    const element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }

  static saveVehicles() {
    localStorage.setItem(TAR_STORAGE_KEY, JSON.stringify(vehicleArray));
  }

  static loadVehicles() {
    const vehicleString = localStorage.getItem(TAR_STORAGE_KEY);
    return JSON.parse(vehicleString) || [];
  }

  static deleteVehicle(e) {
    const parent = e.target.closest("[data-item-container]");
    const parentId = parent.dataset.id;
    vehicleArray = vehicleArray.filter((vehicle) => vehicle.id !== parentId);
    parent.remove();
    this.saveVehicles();
  }

  static renderVehicles(isVehicleNew) {
    const vehicleTemplate = document.querySelector("[data-vehicle-template]");
    const vehicleGallery = document.querySelector("[data-vehicle-gallery]");

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
}

// TODO - refactor to database
// populates array with local storage or an empty array if local storage is empty
export let vehicleArray = VehicleGallery.loadVehicles();
