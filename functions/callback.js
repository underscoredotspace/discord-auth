const fetch = require("node-fetch")
const qs = require("querystring")
const uuid = require("uuid")
const firebase = require("../helpers/firebase")

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

    const user = await fetch("https://discord.com/api/users/@me", {
        headers: { authorization: `Bearer ${auth.access_token}` },
    })
        .then((res) => res.json())
        .catch((error) => ({ error }))

    if (user.error) {
        return {
            statusCode: 500,
            body: JSON.stringify(user.error),
        }
    }

    const id = uuid.v4()
    const { access_token, refresh_token, expires_in } = auth
    const authObject = {
        access_token,
        refresh_token,
        access_expires: new Date(Date.now() + expires_in * 1000).valueOf(),
    }

    const db = firebase()
    const docRef = db.collection("auth").doc(id)
    docRef.set({
        ...user,
        ...authObject,
    })

    const { redirect } = qs.parse(
        qs.unescape(event.queryStringParameters.state)
    )

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
