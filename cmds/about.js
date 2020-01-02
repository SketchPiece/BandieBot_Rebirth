const Discord = module.require("discord.js");
const fs = require("fs");

module.exports.run = async (bot,message,args) => {
    message.channel.send("\`\`\`css\nBindieBot v.0.9.8 Beta\nby Sketch & FonTaid\`\`\`");
};
module.exports.help = {
    name: "about",
    aliases: []
};