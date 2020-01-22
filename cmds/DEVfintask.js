const Discord = module.require("discord.js");
const fs = require("fs");
let TaskDone = require('../source/task_system').TaskDone;

module.exports.run = async(bot, message, args) => {
    TaskDone(bot,message.author,bot.userdb);
};
module.exports.help = {
    name: "выполнить",
    aliases: ["done"]
};