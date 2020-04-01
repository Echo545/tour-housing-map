const fetch = require("node-fetch");
console.log("Connect back end!");

exports.handler = async (event, context) => {
  return fetch(`https://maps.googleapis.com/maps/api/js?key=${process.env.API_TOKEN}&callback=initMap`)
    // .then(r => { console.log("response: " + r); })
    .then(function (r) { 
      console.log("response: " + r); 
      return r; 
    })
    .then(response => response.text())
    // .then(response => response.json())
    .then(function (r) { 
      // console.log("response text: " + r); 
      return r; 
    })
    .then(data => ({
      statusCode: 200,
      body: data
    }))
    .catch(error => ({ statusCode: 422, body: String(error) }));
};