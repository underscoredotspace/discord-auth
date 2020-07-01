const qs = require("querystring")

exports.handler = async function (event) {
    const { redirect } = event.queryStringParameters

    const state = qs.stringify({ redirect })

    const query = qs.stringify({
        response_type: "code",
        client_id: process.env["CLIENT_ID"],
        scope: "identify",
        state,
        redirect_uri: process.env["REDIRECT_URI"],
        prompt: "none",
    })

    const url = `https://discord.com/api/oauth2/authorize?${query}`

    return {
        statusCode: 302,
        body: "",
        headers: {
            location: url,
        },
    }
}
