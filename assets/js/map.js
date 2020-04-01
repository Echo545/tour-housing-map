import Housing from "./housing.js";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
//                                                                 //
// This project was built with the Google Maps API.                //
// In the future I plan to add to it by connecting it to Firebase  //
// and implementing user accounts, housing rating,                 //
// better address validation, and a sort feature.                  //
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
var housings = [];

// Call Google Maps JS API
$(document).ready(function() {
  // Using netlify to secure my API key
  $.getScript("https://housingmap.netlify.com/.netlify/functions/backend");
  console.log(s);
});


function initMap() {  
  // Center of the USA 39.828582, -98.580032
  var usa = {
    lat: 39.828582,
    lng: -98.580032
  };

  // The map, centered at usa, zoomed out
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    streetViewControl: false,
    center: usa
  });

  // create new geocoder
  var geocoder = new google.maps.Geocoder();

  // Set button listeners
  $(document).ready(function() {

    // Setup form
    $("#add-housing").click(function() {
      $("#modal-popup").modal("show");
    });

    $("#modal-form-submit").click(function() {
      processForm(map, geocoder);
    });

    // Setup about
    $("#about-button").click(function() {
      $("#about-modal").modal("show");
    });

    $("#about-modal").modal("show");
  });

  // load initial housing data
  populateHousings();

  // display all houses from housings[]
  displayHousingList(map, geocoder);
}


function populateHousings() {
  housings.push(new Housing());
  housings.push(
    new Housing({
      address: "75-5944 Kuakini Hwy Kailua-Kona, HI 96740",
      contactName: "Evan",
      contactInfo: "evansemail.gmail.com",
      year: "2019",
      notes: "small house but great family, very happy to help, did CRX 2018"
    })
  );
  housings.push(
    new Housing({
      address: "414 N Meridian St, Newberg, OR 97132",
      contactName: "Robin Baker",
      contactInfo: "(503) 538-8383",
      year: "2020",
      notes: "Great big house, cool family, loves George Fox students and Jesus"
    })
  );
  housings.push(
    new Housing({
      address: "713 E Airtex Dr, Houston, TX 77073",
      contactName: "Eric",
      contactInfo: "(281) 821-2222",
      year: "2020",
      notes:
        "Church pastor, hosted us for many years! Amazing people with many connections"
    })
  );
  housings.push(
    new Housing({
      address: "4484 N John Young Pkwy, Orlando, FL 32804",
      contactName: "Amy",
      contactInfo: "(407) 246-0001",
      year: "2019",
      notes:
        "Large church with many connections, hosted The Send pre-rallies. Very hospitable and practical"
    })
  );
  housings.push(
    new Housing({
      address: "4850 Ward Rd STE 201, Wheat Ridge, CO 80033",
      contactName: "Greg Steir",
      contactInfo: "(303) 425-1606",
      year: "2017",
      notes:
        "Has lots of connections, great housing, passionate about evangelism"
    })
  );
  housings.push(
    new Housing({
      address: "3800 Niles Rd St Joseph, MI 49085",
      contactName: "Micah",
      contactInfo: "(269) 429-1106",
      year: "2019",
      notes:
        "Housed us many times, lots of room, seperate genders but many houses in their network"
    })
  );
}


function selectHousing(map, geocoder, housing) {
  // updates selected house display based on given housing then

  if (housing == -1) {
    alert("invalid housing: " + housing);
  } else {

    // smoothly fade out old selection
    $(".result").fadeOut(function(){
      // display selected house:
      $("#address-result").text(`${housing.address}`);
      $("#contact-name-result").text(`${housing.contactName}`);
      $("#contact-info-result").text(`${housing.contactInfo}`);
      $("#year-result").text(`${housing.year}`);
      $("#notes-result").text(`${housing.notes}`);
      $("#housing-name").text(`${housing.housingName}`);
  
      // nicely fade in selection
      $(".result").fadeIn();
  
      // mark house if its missing a marker
      if (housing.marker == "") {
        markHouse(map, geocoder, housing);
      }
      // Displays selected housing on map
      loadSelectedHousing(map, housing);
    });
  }
}


function displayHousingList(map, geocoder) {
  // generates and displays the housing list based on housings[]
  // this should only be called once in initialization

  for (var hs of housings) {

    // marks house only if it hasn't been marked yet
    if (hs.marker == ""){
      markHouse(map, geocoder, hs);
    }
    appendHousingListDisplay(map, geocoder, hs);
  }
}


function loadSelectedHousing(map, loadHousing) {
  // focus map on selected housing

  function smoothZoom(map, max, cnt) {
    // Smoothly zooms map in on Marker
    // Got this function from @squarecandy on Stack Overflow
    if (cnt >= max) {
      return;
    } else {
      var z = google.maps.event.addListener(map, "zoom_changed", function(event) {
        google.maps.event.removeListener(z);
        smoothZoom(map, max, cnt + 1);
      });
      setTimeout(function() {
        map.setZoom(cnt);
      }, 80);
    }
  }
  

  if (loadHousing == -1) {
    alert("Can't load selected housing: " + loadHousing);
  } else {
    const ZOOMLEVEL = 15;

    // focus map on marker
    map.panTo(loadHousing.marker.getPosition());
    smoothZoom(map, ZOOMLEVEL, map.getZoom());
  }
}


function appendHousingListDisplay(map, geocoder, appendedHousing) {
  // should add given housing to housing list display
  var housingList = $("#housing-list");

  housingList.append(
    `<tr class="housing-list-item" id="item-${appendedHousing.id}"><td colspan="4">${appendedHousing.housingName}</td><td colspan="8">${appendedHousing.address}</td></tr>`
  );

  // Click event listener to select housing from list
  $(document).ready(function() {
    $(`#item-${appendedHousing.id}`).click(function() {
      selectHousing(map, geocoder, getHousingByID(appendedHousing.id));
    });
  });
}


function getHousingByID(id) {
  // search housings by id
  var result = -1;

  for (var hs of housings) {
    if (hs.id == id) {
      result = hs;
    }
  }

  return result;
}


function markHouse(map, geocoder, house) {
  // lookup (geocode) address
  geocoder.geocode({ address: house.address }, function(results, status) {
    // markResults is returned with marker data which gets processed whenever a new housing is marked
    var markResults;

    if (status === "OK") {
      // center map on location
      var location = results[0].geometry.location;
      map.setCenter(location);

      // create new marker with posistion from address lookup
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location,
        title: `${house.housingName}`,
        // label: `${house.housingName}`
        animation: google.maps.Animation.DROP
      });

      // add marker and location to house
      house.marker = marker;
      house.location = location;

      // add listener to marker to select house on click
      google.maps.event.addListener(marker, "click", function() {
        selectHousing(map, geocoder, house);
      });

      markResults = [marker, location];
    } else {
      // alert("Geocode was not successful for the following reason: " + status);
      console.log("ERROR STATUS: " + status);
      markResults = [-1, -1];
    }

    // I originally attempted to return markResults, but ran into scope problems
    // so now its a global variable only refrenced in processForm()
    window.markResults = markResults;
  });
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
    var userSubmittedHouse = new Housing({
      address: addressInput,
      contactName: contactNameInput,
      contactInfo: contactInfoInput,
      year: yearInput,
      notes: notesInput
    });

    // house needs to be marked before it can be selected (and mapped)
    markHouse(map, geocoder, userSubmittedHouse);
    var markData = window.markResults;

    // update housing with its new mark data before adding to housings
    userSubmittedHouse.marker = markData[0];
    userSubmittedHouse.location = markData[1];

    // add to housings list and select newly created house
    housings.push(userSubmittedHouse);
    selectHousing(map, geocoder, userSubmittedHouse);
    appendHousingListDisplay(map, geocoder, userSubmittedHouse);
  }
}

// Allows initMap to be called publically
window.initMap = initMap;