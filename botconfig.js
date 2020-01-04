module.exports = {
    "prefix": ">",
    "token": process.env.BINDIE_API_KEY,
    "banned_channels": [process.env.BINDIE_BANNED_CHANNEL, "662021429847392303", "662021465331204096", "662021919666864128", "662021998809186323"],
    "mongo_uri": process.env.MONGODB_URI,
    "version": "0.4 Dev"
}