const Discord = module.require("discord.js");
const fs = require("fs");

module.exports.run = async (bot,message,args) => {
    let id = args[0];
    let anonText = args.slice(1).join(" ");
    try {
        let rUser = message.guild.members.find('id', id);
        //console.log(bugText);
        console.log(rUser);
        message.delete();
        rUser.send(`*Протянула анонимнимный конверт на которой написано:* \n||${anonText}||`)
    }   
    catch{
        message.delete();
        message.channel.send('Определись уже кому этот конверт!').then(msg => msg.delete(5*1000));
    }
    
};
module.exports.help = {
    name: "конверт",
    aliases: []
};