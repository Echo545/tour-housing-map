const fetch = require("node-fetch");

console.log("process.env.API_TOKEN");


// This is the code that gets run on netlify server 
exports.handler = async (event, context, callback) => {
    const pass = (body) => {callback(null, {statusCode: 200, body: JSON.stringify(body)})}
  
    try {
    let response = await fetch(`https://maps.googleapis.com/maps/api/js?key=${process.env.API_TOKEN}&callback=initMap`)
    .then((response) => {
        let data = response.json()
        pass(data)
      }
    )
    console.log("response: " + response.json());
   } catch(err) {
       let error = {
         statusCode: err.statusCode || 500,
         body: JSON.stringify({error: err.message})
   }
    await pass(error)
   }
  }
