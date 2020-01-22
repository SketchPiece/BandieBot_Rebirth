const Discord = module.require("discord.js");
const fs = require("fs");
let SendInventory = require('../source/task_system').SendInventory;

module.exports.run = async(bot, message, args) => {
    SendInventory(bot);
};
module.exports.help = {
    name: "инвентарь",
    aliases: ["inventory"]
};