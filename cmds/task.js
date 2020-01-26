const Discord = module.require("discord.js");
const fs = require("fs");
let SendTaskInfo = require('../source/task_system').SendTaskInfo;

module.exports.run = async(bot, message, args) => {
    message.channel.startTyping();
    await SendTaskInfo(bot);
    message.channel.stopTyping();
};
module.exports.help = {
    name: "задание",
    aliases: ["task"]
};