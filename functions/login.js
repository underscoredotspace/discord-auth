const qs = require("querystring")

exports.handler = async function (event) {
    const { redirect } = event.queryStringParameters
    const { auth: id } = qs.parse(event.headers.cookie)
    if (id && id.length > 0) {
        const responseQs = qs.stringify(redirect ? { id, redirect } : { id })
        const callback_uri = process.env["CALLBACK"]

        return {
            statusCode: 302,
            body: "",
            headers: {
                location: `${callback_uri}?${responseQs}`,
            },
        }
    }

    const state = qs.stringify({ redirect })

    const query = qs.stringify({
        response_type: "code",
        client_id: process.env["CLIENT_ID"],
        scope: "identify email guilds.join",
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
