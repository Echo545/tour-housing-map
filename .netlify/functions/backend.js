export function handler(event, context, callback) {
    console.log("Returned " + process.env.API_MAP);
    callback(null, {
    statusCode: 200,
    body: process.env.API_MAP
    });
}