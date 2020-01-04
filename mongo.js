const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/bandie";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);
var userScheme = new Schema({
    nickname: String,
    id: String,
    questJson: String,
});

const User = mongoose.model("User", userScheme);

module.exports.User = User