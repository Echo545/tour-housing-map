// console.log("Returning " + API_MAP);

// exports.handler = function(event, context, callback) {
//     callback(null, {
//       statusCode: 200,
//       body: `Hello ${process.env.API_MAP}`
//     });
//   };

const fetch = require("node-fetch");


  // exports.handler = async (event, context, callback) => {
  //   const pass = (body) => {callback(null, {statusCode: 200, body: JSON.stringify(body)})}
  
  //   try {
  //   let response = await fetch(`https://maps.googleapis.com/maps/api/js?key=${process.env.MAPS_API}&callback=initMap`)
  //    let data = await response.json()
  //    await pass(data)
  //  } catch(err) {
  //      let error = {
  //        statusCode: err.statusCode || 500,
  //        body: JSON.stringify({error: err.message})
  //  }
  //   await pass(error)
  //  }
  // }
  
  exports.handler = async (event, context, callback) => {
    const pass = (body) => {callback(null, {statusCode: 200, body: JSON.stringify(body)})}
  
    try {
    let response = await fetch(`https://maps.googleapis.com/maps/api/js?key=${process.env.API_TOKEN}&callback=initMap`)
     let data = await response.json()
     await pass(data)
   } catch(err) {
       let error = {
         statusCode: err.statusCode || 500,
         body: JSON.stringify({error: err.message})
   }
    await pass(error)
   }
  }
