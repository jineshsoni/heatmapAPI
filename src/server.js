const express = require('express');
const bodyParser = require('body-parser');
const https = require('https')
const axios = require('axios');

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

function DataModel(state, district, confirmed) {
  this.state = state;
  this.district = district;
  this.confirmed = confirmed;
  return this;
}

app.get('/', function(req, res) {
  var arrayListDM = [];

  axios({
      method:'get',
      url: "https://raw.githubusercontent.com/jineshsoni/covid19India-Heatmap/master/covid19india.geojson",
     
  })
  .then(function (response) {
    let geoData = JSON.parse(JSON.stringify(response.data));

    axios({
      method:'get',
      url: "http://api.covid19india.org/state_district_wise.json",
     
    })
    .then(function (response) {
    let districtData =JSON.parse(JSON.stringify(response.data));

    geoData["features"].map(
      element => {
        try {
        console.log("Before== "+ element["properties"]["district"]);
        console.log("Before== "+ element["properties"]["confirmed"]);
        element["properties"]["confirmed"] = districtData[element["properties"]["state"]]["districtData"][element["properties"]["district"]]["confirmed"];
        console.log("After== "+ element["properties"]["confirmed"]);
      }catch{}
    } 
    );
    res.send(geoData);
    })
    .catch(function (error) {
      console.log(error);
    });
  })
  .catch(function (error) {
      console.log(error);
  });
});

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
