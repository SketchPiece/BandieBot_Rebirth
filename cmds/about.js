const Discord = module.require("discord.js");
const fs = require("fs");
const ver = require("../botconfig").version;

module.exports.run = async(bot, message, args) => {
    message.channel.send(`\`\`\`css\nBindieBot v.${ver}\nby Sketch & FonTaid\`\`\``);
};
module.exports.help = {
    name: "инфо",
    aliases: ["about"]
};