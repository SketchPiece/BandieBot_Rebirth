module.exports = {
    "prefix": ">",
    "token": process.env.BINDIE_API_KEY,
    "banned_channels": [
        process.env.BINDIE_BANNED_CHANNEL
    ],
    "mongo_uri": process.env.MONGODB_URI,
    "version": "0.3.3 Dev"
}