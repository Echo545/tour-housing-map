export function handler(event, context, callback) {
    console.log("SUCCESS!");
    callback(null, {
    statusCode: 200,
    body: process.env.API_MAP
    });
}