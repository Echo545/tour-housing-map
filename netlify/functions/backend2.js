// exports.handler = function(event, context, callback) {
//     callback(null, {
//       statusCode: 200,
//       body: `Hello ${process.env.API_MAP}`
//     });
//   };

// const fetch = require("node-fetch");

  
//   exports.handler = async (event, context, callback) => {
//     const pass = (body) => {callback(null, {statusCode: 200, body: JSON.stringify(body)})}
  
//     try {
//     let response = await fetch(`https://maps.googleapis.com/maps/api/js?key=${process.env.API_TOKEN}&callback=initMap`)
//     .then((response) => {
//         let data = response.json()
//         pass(data)
//       }
//     )
//    } catch(err) {
//        let error = {
//          statusCode: err.statusCode || 500,
//          body: JSON.stringify({error: err.message})
//    }
//     await pass(error)
//    }
//   }

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = require('jquery')(window);

console.log("$: " + $);

var getMap = function() {
  var m = $.get(`https://maps.googleapis.com/maps/api/js?key=${process.env.API_TOKEN}&callback=initMap`);
  console.log("m: " + m);
  return m;
}

exports.handler = function(event, context, callback) {
    callback(null, {
      statusCode: 200,
      body: getMap
    });
  };