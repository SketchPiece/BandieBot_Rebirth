const Discord = module.require("discord.js");
const fs = require("fs");

module.exports.run = async (bot,message,args) => {
    let anonText = args.join(" ").slice(22);

    let rUser = message.mentions.users.first() || message.guild.members.get(args[0]) || message.author;
    //console.log(bugText);
    
    message.delete();
    rUser.send(`*Протянула анонимную записку на которой написано:* \n«${anonText}»`)
};
module.exports.help = {
    name: "записка",
    aliases: ["note"]
};