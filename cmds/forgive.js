const Discord = module.require("discord.js");
const fs = require("fs");
let profile = require('../profile.json');
module.exports.run = async (bot,message,args) => {
    try{
    
    //console.log(profile[message.author.id].forgiveUser);
    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(profile[message.author.id].forgiveUser == 0) return bot.send(`Она не обрашает на ${message.author} внимания. Лучше ему прийти завтра`)
    if(!args[0]) return bot.send("Вы настолько ленивы что вам трудно даже нормально имя произнести?");
    if(!rUser) return bot.send("Знать бы еще о ком речь...");
    if(!profile[rUser.id]) return bot.send(`<@${message.author.id}>, я не могу найти его в своём списке, прости..`);
    if(profile[rUser.id].forgives<=0) return bot.send("А, ну да, конечно... \n*продолжает заниматся своими делами*")
    profile[rUser.id].forgives--;
    fs.writeFile('./profile.json',JSON.stringify(profile),(err)=>{
        if(err) console.log(err);
    })
    if(profile[rUser.id].forgives<=0) {
        bot.send(`<@${rUser.id}>, я тебя прощаю!`)
        profile[rUser.id].mats = 10;
        profile[rUser.id].hiCheckout = 0;
        return 
    }
    bot.send(`Это конечно хорошо, но этого не достаточно! Осталось простить: ${profile[rUser.id].forgives}`)
    profile[message.author.id].forgiveUser = 0;
    }catch(err){
        console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
    }
};
module.exports.help = {
    name: "прости",
    aliases: []
};