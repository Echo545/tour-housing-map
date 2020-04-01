// console.log("Returning " + API_MAP);

exports.handler = function(event, context, callback) {
    callback(null, {
      statusCode: 200,
      body: `Hello ${process.env.API_MAP}`
    });
  };