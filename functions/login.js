exports.handler = function (event, context, callback) {
    const client_id = process.env["CLIENT_ID"]
    const state = "bananas"
    const redirect_uri = process.env["REDIRECT_URI"]
    const url = `https://discord.com/api/oauth2/authorize?response_type=code&client_id=${client_id}&scope=identify&state=${state}&redirect_uri=${redirect_uri}&prompt=consent`

    callback(null, {
        statusCode: 302,
        body: "",
        headers: {
            location: url,
        },
    })
}
