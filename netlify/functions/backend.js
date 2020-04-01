const fetch = require("node-fetch");

// Code built on example from Netlify functions playground

exports.handler = async (event, context) => {
  return fetch(`https://maps.googleapis.com/maps/api/js?key=${process.env.API_TOKEN}&callback=initMap`)
    .then(response => response.text())
    .then(data => ({
      statusCode: 200,
      body: data
    }))
    .catch(error => ({ statusCode: 422, body: String(error) }));
};