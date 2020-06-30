const fetch = require("node-fetch")
const qs = require("querystring")

exports.handler = (event, context, callback) => {
    const code = event.queryStringParameters.code

    const form = qs.stringify({
        client_id: process.env["CLIENT_ID"],
        client_secret: process.env["CLIENT_SECRET"],
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env["REDIRECT_URI"],
        scope: "identify",
    })

    const options = {
        method: "post",
        headers: new fetch.Headers({
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": form.length,
        }),
        body: form,
    }

    fetch("https://discord.com/api/oauth2/token", options)
        .then((res) => res.json())
        .then((response) => {
            callback(null, {
                statusCode: 200,
                body: JSON.stringify(response),
            })
        })
        .catch((err) => {
            callback(null, {
                statusCode: err.status,
                body: err.statusText,
            })
        })
}
