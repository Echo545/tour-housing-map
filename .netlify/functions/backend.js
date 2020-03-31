export function handler(event, context, callback) {
    // your server-side functionality
    console.log(process.env.MAPS_API);
    callback(null, {
        statusCode: 200,
        body: "Hello, World"
        });
}