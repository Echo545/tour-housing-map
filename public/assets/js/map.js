import Housing from "./housing.js";
import Auth from "./auth.js";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
//                                                                 //
// This project was built with the Google Maps API & Firebae       //
// In the future I plan to implement housing rating,               //
// better address validation, sorting, and group verification.     //
//                                                                 //
// After coding this I now understand how weird JS is.             //
// This file is like a small plate of spaghetti so I               //
// made sure to leave lots of comments :)                          //
//                                                                 //
// Also I build a lot of the front end using Bootstrap Studio      //
// It's a really cool program, free for students in the            //
// Github student pack.                                            //
//                                                                 //
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //


// Initialize variables
const auth = new Auth();
var housings = [];
var map;
var geocoder;

// Call Google Maps JS API
$(document).ready(function () {
  // Setup about
  $("#about-button").click(function () {
    $("#about-modal").modal("show");
  });

  // Using netlify to secure my API key
  $.getScript("https://housingmap.netlify.com/.netlify/functions/backend");

});


function initMap() {
  // Center of the USA 39.828582, -98.580032
  var usa = {
    lat: 39.828582,
    lng: -98.580032
  };

  // The map, centered at usa, zoomed out
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    streetViewControl: false,
    center: usa
  });

  // create new geocoder
  geocoder = new google.maps.Geocoder();

  // Set button listeners
  $(document).ready(function () {

    // Setup form
    $("#add-housing").click(function () {
      $("#modal-popup").modal("show");
    });

    $("#modal-form-submit").click(function () {
      processForm(map, geocoder);
    });

  });

  loadHousingDB(map, geocoder);
}


function selectHousing(map, geocoder, housing) {
  // updates selected house display based on given housing then

  if (housing == -1) {
    alert("invalid housing: " + housing);
  } else {

    // smoothly fade out old selection
    $(".result").fadeOut(function () {
      // display selected house:
      $("#address-result").text(`${housing.address}`);
      $("#contact-name-result").text(`${housing.contactName}`);
      $("#contact-info-result").text(`${housing.contactInfo}`);
      $("#year-result").text(`${housing.year}`);
      $("#notes-result").text(`${housing.notes}`);
      $("#housing-name").text(`${housing.housingName}`);
      $("#submitter-result").text(`${housing.submitter}`);

      // nicely fade in selection
      $(".result").fadeIn();

      // mark house if its missing a marker
      if (housing.marker == "") {
        markHouse(map, geocoder, housing, function(){});
      }
      // Displays selected housing on map
      loadSelectedHousing(map, housing);
    });
  }
}

function loadHousingCallback(houses){
  // var dbHousingList = window.dbHouses;
  var dbHousingList = houses;

  for (var h of dbHousingList) {
    housings.push(h);
  }

  for (var hs of housings) {
    markHouse(map, geocoder, hs, function(){});
    appendHousingListDisplay(map, geocoder, hs);
  }
}


/**
 * Calls loadHousingCallback with a complete list of houses from the DB
 * 
 * @param {*} map 
 * @param {*} geocoder 
 */
function loadHousingDB(map, geocoder) {

  var dbHousingList = auth.readHousingList(loadHousingCallback);
}


function loadSelectedHousing(map, loadHousing) {
  // focus map on selected housing

  function smoothZoom(map, max, cnt) {
    // Smoothly zooms map in on Marker
    // Got this function from @squarecandy on Stack Overflow
    if (cnt >= max) {
      return;
    } else {
      var z = google.maps.event.addListener(map, "zoom_changed", function (event) {
        google.maps.event.removeListener(z);
        smoothZoom(map, max, cnt + 1);
      });
      setTimeout(function () {
        map.setZoom(cnt);
      }, 80);
    }
  }


  if (loadHousing == -1) {
    alert("Can't load selected housing: " + loadHousing);
  } else {
    const ZOOMLEVEL = 15;

    // focus map on marker
    // map.panTo(loadHousing.geoResults[0].geometry.location);
    auth.getGeoData(loadHousing.address, loadHousing, function(h, ac, gResults){

      map.panTo(gResults.geoResults[0].geometry.location);
      smoothZoom(map, ZOOMLEVEL, map.getZoom());

    }, function(){});
  }
}


function appendHousingListDisplay(map, geocoder, appendedHousing) {
  // should add given housing to housing list display
  var housingList = $("#housing-list");

  housingList.append(
    `<tr class="housing-list-item" id="item-${appendedHousing.id}"><td colspan="4">${appendedHousing.housingName}</td><td colspan="8">${appendedHousing.address}</td></tr>`
  );

  // Click event listener to select housing from list
  $(document).ready(function () {
    $(`#item-${appendedHousing.id}`).click(function () {
      // selectHousing(map, geocoder, getHousingByAddress(appendedHousing.address));
      selectHousing(map, geocoder, appendedHousing);
    });
  });
}


function getHousingByAddress(ad) {
  // search housings by id
  var result = -1;

  for (var hs of housings) {
    if (hs.address == ad) {
      result = hs;
    }
  }

  return result;
}


/**
 * This callback is used to process exisitng geoData
 * 
 * @param {House} house 
 * @param {function} callback 
 * @param {array} existingGeoData 
 */
function markHouseCallback(house, callback, existingGeoData){

  var markResults = [-1, -1];
  var location;
  var marker;

  if (existingGeoData) {
    location = existingGeoData.geoResults[0].geometry.location;
    marker = existingGeoData.marker;

    house.geoResults = existingGeoData;

    // center map:
    map.setCenter(location);

    // mark map:
    marker = new google.maps.Marker({
      map: map,
      position: location,
      title: `${house.housingName}`,
      animation: google.maps.Animation.DROP
    });

    // add marker event listener
    google.maps.event.addListener(marker, "click", function () {
      selectHousing(map, geocoder, house);
    });

    // update mark results
    markResults = [marker, house.geoResults];

    window.markResults = markResults;
    if (callback) {
      callback(markResults);
    }
    else{
      console.log("no callback provided!");
    }
  }
  else {

    // lookup (geocode) address
    geocoder.geocode({ address: house.address }, function (results, status) {
      // markResults is returned with marker data which gets processed whenever a new housing is marked

      if (status === "OK") {
        // center map on location
        location = results[0].geometry.location;
        map.setCenter(location);

        // create new marker with posistion from address lookup
        marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
          title: `${house.housingName}`,
          animation: google.maps.Animation.DROP
        });

        // add marker and location to house
        house.marker = marker;
        house.geoResults = results;

        // add listener to marker to select house on click
        google.maps.event.addListener(marker, "click", function () {
          selectHousing(map, geocoder, house);
        });

        markResults = [marker, results];

        window.markResults = markResults;
        callback(markResults);
      }
      else {
        // alert("Geocode was not successful for the following reason: " + status);
        console.log("ERROR STATUS: " + status);
        window.markResults = [-1, -1];
      }
    });
  }
}


function markHouse(map, geocoder, house, callback) {
  // only geocode if address isn't already in DB

  var existingGeoData = auth.getGeoData(house.address, house, markHouseCallback, callback);
}


function processForm(map, geocoder) {
  // validates address and all required form elements
  var incomplete = false;
  var inputs = [];

  // Get inputs
  var addressInput = $("#addressInput")[0].value;
  var contactNameInput = $("#contactNameInput")[0].value;
  var contactInfoInput = $("#contactInfoInput")[0].value;
  var yearInput = $("#yearInput")[0].value;
  var notesInput = $("#notesInput")[0].value;

  // validate inputs
  inputs.push(addressInput);
  inputs.push(contactNameInput);
  inputs.push(contactInfoInput);
  inputs.push(yearInput);
  inputs.push(notesInput);

  for (var i of inputs) {
    if (i == "") {
      incomplete = true;
    }
    // more validation can be added here
  }

  if (incomplete) {
    // form is invalid
    $("#form-invalid").modal("show");
  } else {
    // Form is valid

    // close and clear form
    $("#modal-popup").modal("hide");
    $("#modal-form").trigger("reset");

    // create new housing object from given inputs
    var userSubmittedHouse = new Housing(
      addressInput,
      contactNameInput,
      contactInfoInput,
      yearInput,
      notesInput
    );

    // house needs to be marked before it can be selected (and mapped)
    markHouse(map, geocoder, userSubmittedHouse, function(markData){

      // var markData = window.markResults;
      
      // update housing with its new mark data before adding to housings
      userSubmittedHouse.marker = markData[0];
      userSubmittedHouse.geoResults = markData[1];
      
      // update userSubmittedHouse with submitter info
      userSubmittedHouse.submitter = auth.currentUser.displayName;
      
      // add to DB
      auth.addHouseToGroupDB(userSubmittedHouse);
      
      // add to housings list
      housings.push(userSubmittedHouse);
      
      // select new house & add to display
      selectHousing(map, geocoder, userSubmittedHouse);
      appendHousingListDisplay(map, geocoder, userSubmittedHouse);
    });
  }
}

// Allows initMap to be called publically
window.initMap = initMap;
