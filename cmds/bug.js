const Discord = module.require("discord.js");
const fs = require("fs");

module.exports.run = async (bot,message,args) => {
    let bugText = args.join(" ");
    let Sketch = message.guild.members.find('id', "331103366774259713");
    
    //console.log(bugText);
    
    message.delete();
    message.channel.send(`*В голову ${message.author} прилетел комочек бумаги. Развернув его он увидел надпись*\n«Спасибо за фидбек! \n-Скетч»`).then(msg => msg.delete(15*1000));
    Sketch.send(`${message.author} сообщил о баге: \n${bugText}`)
};
module.exports.help = {
    name: "баг",
    aliases: ["bug"]
};