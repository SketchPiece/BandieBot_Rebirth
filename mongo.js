const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uri = require("./botconfig").mongo_uri;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);
var userScheme = new Schema({
    nickname: String,
    id: String,
    questJson: String,
    attempts: Number
});

const User = mongoose.model("User", userScheme);

module.exports.User = User