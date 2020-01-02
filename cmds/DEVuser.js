const Discord = module.require("discord.js");
const fs = require("fs");
const User = require("../mongo").User

function GetUser(id) {
    User.findOne({ id: id }, (err, u) => {
        if (err) return console.log(err);
        return u;
    });
}

module.exports.run = async(bot, message, args) => {
    let user = await User.findOne({ id: String(bot.userid) }).exec();
    // console.log(bot.userid)

    bot.send(`user: ${user.nickname}\nid:${user.id}`);
    if (args[0]) {
        json = JSON.stringify({ "test": args[0] })
        user.questJson = json;
        user.save((err) => { if (err) console.log(err) })
        bot.send("Save: " + json)
    }
};
module.exports.help = {
    name: "user",
    aliases: []
};