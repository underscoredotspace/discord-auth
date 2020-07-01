const fetch = require("node-fetch")
const qs = require("querystring")

exports.handler = async (event) => {
    const form = qs.stringify({
        client_id: process.env["CLIENT_ID"],
        client_secret: process.env["CLIENT_SECRET"],
        grant_type: "authorization_code",
        code: event.queryStringParameters.code,
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

    const auth = await fetch("https://discord.com/api/oauth2/token", options)
        .then((res) => res.json())
        .catch((error) => ({ error }))

    if (auth.error) {
        return {
            statusCode: 500,
            body: JSON.stringify(auth.error),
        }
    }

    const { redirect } = qs.parse(
        qs.unescape(event.queryStringParameters.state)
    )

    function createCookie(values) {
        const cookie = JSON.stringify(values)

        return `auth=${cookie}; path=/;`
    }

    const { access_token, refresh_token, expires_in } = auth

    return {
        statusCode: 302,
        body: "",
        headers: {
            location: redirect,
            "Set-Cookie": createCookie({
                access_token,
                refresh_token,
                access_expires: new Date(
                    Date.now() + expires_in * 1000
                ).valueOf(),
            }),
        },
    }
}
