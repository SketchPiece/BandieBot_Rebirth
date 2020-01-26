const Discord = module.require("discord.js");
const fs = require("fs");
let TaskDone = require('../source/task_system').TaskDone;

module.exports.run = async(bot, message, args) => {
    await TaskDone(bot,message.author);
};
module.exports.help = {
    name: "выполнить",
    aliases: ["done"]
};