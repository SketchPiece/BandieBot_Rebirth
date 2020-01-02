const Discord = module.require("discord.js");
const fs = require("fs");
const ver = require("../botconfig.json").version;

module.exports.run = async(bot, message, args) => {
    message.channel.send(`\`\`\`css\nBindieBot v.${ver}\nby Sketch & FonTaid\`\`\``);
};
module.exports.help = {
    name: "about",
    aliases: []
};