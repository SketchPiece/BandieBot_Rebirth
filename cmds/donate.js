const Discord = module.require("discord.js");
const fs = require("fs");

module.exports.run = async(bot, message, args) => {
    message.channel.send(`Большое спасибо за поддержку вот этим ребятам, благодаря ним я живу и развиваюсь..\n\`\`\`Но никто не пришёл...\`\`\``);
};
module.exports.help = {
    name: "донат",
    aliases: ["donate"]
};