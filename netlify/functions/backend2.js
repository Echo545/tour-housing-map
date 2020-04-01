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

// TAKE 1
// var jsdom = require("jsdom");
// const { JSDOM } = jsdom;
// const { window } = new JSDOM();
// const { document } = (new JSDOM('')).window;
// global.document = document;

// TAKE 2
// const JSDOM = require("jsdom");
// const window = new JSDOM();
// const document = (new JSDOM("")).window;
// var $ = require('jquery')(window);
// var $ = require('jquery');

// TAKE 3
// console.log("connected!");
// const jsdom = require("jsdom");

// // // console.log("$: " + $);
// console.log("jsdom: " + jsdom);
// // const {JSDOM} = jsdom;
// // const dom = new JSDOM(html);
// // const $ = (require('jquery'))(dom.window);


// var getMap = function() {
//   var m = $.get(`https://maps.googleapis.com/maps/api/js?key=${process.env.API_TOKEN}&callback=initMap`);
//   console.log("m: " + m);
//   return m;
// }

// console.log("Get map" + getMap());

// exports.handler = function(event, context, callback) {
//     callback(null, {
//       statusCode: 200,
//       body: "getMap TEST"
//     });
//   };


// Take 4
import fetch from "node-fetch";

exports.handler = async (event, context) => {
  return fetch(`https://maps.googleapis.com/maps/api/js?key=${process.env.API_TOKEN}&callback=initMap`)
    .then(response => response.json())
    .then(data => ({
      statusCode: 200,
      body: data
    }))
    .catch(error => ({ statusCode: 422, body: String(error) }));
};