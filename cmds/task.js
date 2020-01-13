const Discord = module.require("discord.js");
const fs = require("fs");
let SendTaskInfo = require('../source/task_system').SendTaskInfo;

module.exports.run = async(bot, message, args) => {
    SendTaskInfo(bot);

};
module.exports.help = {
    name: "задание",
    aliases: ["task"]
};