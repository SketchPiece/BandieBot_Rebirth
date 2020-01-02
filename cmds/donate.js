const Discord = module.require("discord.js");
const fs = require("fs");

module.exports.run = async (bot,message,args) => {
    message.channel.send(`Большое спасибо за поддержку вот этим ребятам, благодаря ним я живу и развиваюсь..\n\`\`\`Панкейк - 120 р\nJon_Ton - 90 р\nbepis_cherry_san - 72 р \nBoti tut? - 50 р\n\`\`\``);
}; 
module.exports.help = {
    name: "донат",
    aliases: ["donate"]
};