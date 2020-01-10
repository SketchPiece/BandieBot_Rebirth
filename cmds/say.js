// const Discord = module.require("discord.js");
// const fs = require("fs");

// module.exports.run = async (bot,message,args) => {
//     if(!message.member.hasPermission("BAN_MEMBERS")) return;

//     //let id = args[0];

//     let anonText = args.join(" ").slice(22);
//     //console.log(bugText);
//     //console.log(id);
//     console.log(anonText);
//     //let sayChannel = bot.channels.find(channel => channel.id === id );
//     //message.delete();
//     //sayChannel.send(sayText);
//     //rUser.send(`*Протянула анонимную записку на которой написано:* \n«${anonText}»`)
// };
// module.exports.help = {
//     name: "скажи",
//     aliases: ["say"]
// };

const Discord = module.require("discord.js");
const fs = require("fs");

module.exports.run = async (bot,message,args) => {
    if(!message.member.hasPermission("BAN_MEMBERS")) return;
    let id = args[0];
    let sayText = args.slice(1).join(" ");
    try{
        let sayChannel = bot.channels.find(channel => channel.id === id );
        message.delete();
        sayChannel.send(sayText);
    }
    catch{
        message.author.send("Ошибка! Правильно: \n>сказать [id канала] [текст]\n>say [id канала] [текст]").then(msg => msg.delete(5*1000));
    }
    
    //rUser.send(`*Протянула анонимную записку на которой написано:* \n«${anonText}»`)
};
module.exports.help = {
    name: "сказать",
    aliases: ["say"]
};