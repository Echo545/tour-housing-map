export function handler(event, context, callback) {
    console.log("Returned " + "API_MAP");
    callback(null, {
    statusCode: 200,
    body: "API_MAP"
    });
}