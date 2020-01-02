const Discord = module.require("discord.js");
const fs = require("fs");

module.exports.run = async (bot,message,args) => {
    function randomInteger(min, max) {
        var rand = min + Math.random() * (max - min)
        rand = Math.round(rand);
        return rand;
        } 
    var chanse = randomInteger(0, 1);
    if(chanse==0){
        message.channel.send(`*подбрасывает монетку*\n${message.author}, тебе выпала решка`);
    }
    else{
        message.channel.send(`*подбрасывает монетку*\n${message.author}, тебе выпал орёл`);
    }
};
module.exports.help = {
    name: "монетка",
    aliases: []
};