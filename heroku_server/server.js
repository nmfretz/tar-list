const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();

app.use(cors());

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Starting server at port: ${port}`);
});

// TODO - add try catch
app.get("/:searchparams", async (req, res) => {
  console.log(req.params);

  const searchParameters = req.params.searchparams.split(",");
  console.log(searchParameters);
  const searchInput = searchParameters[0];
  const flickrPage = searchParameters[1];
  const photosPerPage = 6;

  // TODO - add explanation of extras
  const extras = "url_q,license,owner_name";
  const licenseRequest = "1,2,3,4,5,6,7,8,9,10";

  const FLICKR_API_KEY = process.env.FLICKR_API_KEY;

  const apiUrlPhotos = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${FLICKR_API_KEY}&tags=${searchInput}&license=${licenseRequest}&extras=${extras}&per_page=${photosPerPage}&page=${flickrPage}&format=json&nojsoncallback=1`;

  const apiUrlLicenses = `https://www.flickr.com/services/rest/?method=flickr.photos.licenses.getInfo&api_key=aceda01ee3370538fb46eab541fabf93&format=json&nojsoncallback=1`;

  console.log(apiUrlPhotos);
  console.log(apiUrlLicenses);

  const photosFetchResponse = await fetch(apiUrlPhotos);
  const jsonPhotos = await photosFetchResponse.json();

  //TODO - cache the license fetch to reduce api calls.
  const licensesFetchResponse = await fetch(apiUrlLicenses);
  const jsonLicenses = await licensesFetchResponse.json();

  const photos = jsonPhotos.photos.photo;
  const licenses = jsonLicenses.licenses.license;
  console.log(licenses); // delete

  // Add license name and license url to each photo
  photos.forEach((photo) => {
    photo.licenseName = licenses.find((license) => license.id === photo.license).name;
    photo.licenseNameUrl = licenses.find((license) => license.id === photo.license).url;
  });

  console.log(photos); // delete

  res.json(photos);
});
