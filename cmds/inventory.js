const Discord = module.require("discord.js");
const fs = require("fs");
let SendInventory = require('../source/task_system').SendInventory;

module.exports.run = async(bot, message, args) => {
    message.channel.startTyping();
    await SendInventory(bot);
    message.channel.stopTyping();
};
module.exports.help = {
    name: "инвентарь",
    aliases: ["inventory"]
};