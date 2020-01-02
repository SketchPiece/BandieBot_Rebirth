const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost:27017/bandie", { useNewUrlParser: true, useUnifiedTopology: true });

var userScheme = new Schema({
    nickname: String,
    id: String,
    questJson: String,
});

const User = mongoose.model("User", userScheme);

module.exports.User = User