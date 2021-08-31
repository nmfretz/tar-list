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

//TODO - consider separating server and client
app.use(express.static("../client"));

//TODO - add try catch
app.get("/images/:searchinputs", async (req, res) => {
  console.log(req.params);

  //TODO - bring some searchinputs from script.js to server.js
  const searchInputs = req.params.searchinputs.split(",");
  console.log(searchInputs);

  const searchInput = searchInputs[0];
  const extras = searchInputs[1];
  const photosPerPage = searchInputs[2];
  const flickrPage = searchInputs[3];

  const FLICKR_API_KEY = process.env.FLICKR_API_KEY;

  //TODO - add license, author, etc to request
  const apiUrl = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${FLICKR_API_KEY}&tags=${searchInput}&extras=${extras}&per_page=${photosPerPage}&page=${flickrPage}&format=json&nojsoncallback=1`;

  console.log(apiUrl);

  const fetchResponse = await fetch(apiUrl);
  const json = await fetchResponse.json();
  res.json(json);
});
