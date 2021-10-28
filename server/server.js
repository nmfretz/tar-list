const express = require("express");
const fetch = require("node-fetch"); // TODO - consider changing to axios
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());

const HOURS_TO_MILLISECONDS = 1 * 60 * 60 * 1000;
let cachedData;
let cacheTime;

const photosPerPage = 120; // rename because there is a similar varibale in add-vehicle.js. Maybe use photosPerRequest
// TODO - add explanation of extras
const extras = "url_q,license,owner_name";
const licenseRequest = "1,2,3,4,5,6,7,8,9,10"; // license 0 is all rights reserved

const FLICKR_API_KEY = process.env.FLICKR_API_KEY;

const apiUrlLicenses = `https://www.flickr.com/services/rest/?method=flickr.photos.licenses.getInfo&api_key=${FLICKR_API_KEY}&format=json&nojsoncallback=1`;

app.get("/:searchparams", async (req, res) => {
  console.log(req.params);
  const searchParameters = req.params.searchparams.split(",");
  console.log(searchParameters);

  const searchInput = searchParameters[0].replace(/\s/g, "%20");
  const apiUrlPhotos = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${FLICKR_API_KEY}&tags=${searchInput}&license=${licenseRequest}&extras=${extras}&per_page=${photosPerPage}&format=json&nojsoncallback=1`;
  console.log(apiUrlPhotos);

  try {
    const photosFetchResponse = await fetch(apiUrlPhotos);
    const jsonPhotos = await photosFetchResponse.json();

    const status = res.statusCode; // TODO - consider changing response based on status
    console.log(status);

    // cache the licenses to reduce api calls and speed up fetch.
    let jsonLicenses;
    if (cacheTime && cacheTime > Date.now() - 24 * HOURS_TO_MILLISECONDS) {
      console.log("using cache");
      jsonLicenses = cachedData;
    } else {
      console.log("fetching licenses");
      const licensesFetchResponse = await fetch(apiUrlLicenses);
      jsonLicenses = await licensesFetchResponse.json();
      cachedData = jsonLicenses;
      cacheTime = Date.now();
    }

    console.log(jsonLicenses);

    const photos = jsonPhotos.photos.photo;
    const licenses = jsonLicenses.licenses.license;

    photos.forEach((photo) => {
      photo.licenseName = licenses.find((license) => license.id === photo.license).name;
      photo.licenseNameUrl = licenses.find((license) => license.id === photo.license).url;
    });

    res.json(photos);
  } catch (error) {
    console.error(error); // TODO - appropriately handle network errors
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Starting server at port: ${port}`);
});
