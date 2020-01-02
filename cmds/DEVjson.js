const Discord = module.require("discord.js");
const fs = require("fs");
const User = require("../mongo").User

module.exports.run = async(bot, message, args) => {
    let user = await User.findOne({ id: String(bot.userid) }).exec();
    // console.log(bot.userid)

    json = JSON.parse(user.questJson)
    if (json.test) {
        bot.send(`json: ${json.test}`);
    } else {
        bot.send("Json doesn't exist!")
    }

};
module.exports.help = {
    name: "json",
    aliases: []
};