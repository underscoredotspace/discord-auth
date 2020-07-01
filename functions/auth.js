const qs = require("querystring")

const headers = {
    "Access-Control-Allow-Origin": "https://developer.mozilla.org",
    "Access-Control-Allow-Credentials": "true",
}

exports.handler = async function (event) {
    const cookie = event.headers.cookie
    if (!cookie) {
        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: "No auth" }),
        }
    }

    const { auth } = qs.parse(cookie)

    if (!auth) {
        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: "Invalid auth" }),
        }
    }
    return {
        statusCode: 200,
        headers,
        body: auth,
    }
}
