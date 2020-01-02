const Discord = module.require("discord.js");
const fs = require("fs");
module.exports.run = async (bot,message,args) => {
    try{
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("*Смотрит с недоумением*");
    if(args[0]>100) return bot.send("Укажи пожалуйста значение меньше 100");
    if(args[0]<1) return bot.send("Укажи пожалуйста значение больше 1");
    message.channel.bulkDelete(args[0]).then(() =>{
        if(args[0] == 1){
            message.channel.send(`${args[0]} сообщение было безвозвратно потеряно.`).then(msg => msg.delete(10*1000));    
        }
        else{
            message.channel.send(`${args[0]} сообщений были безвозвратно потеряны.`).then(msg => msg.delete(10*1000));
        }
    });
}catch(err){
    console.log(err.message)
}
};
module.exports.help = {
    name: "очисти",
    aliases: []
};