const Discord = module.require("discord.js");
const fs = require("fs");
const axios = require('axios');

module.exports.run = async(bot, message, args) => {
    if (message.author.avatarURL == null) return bot.send("Да, хорошая шутка.");
    url = message.author.avatarURL;
    axios.get(url, {
        responseType: "arraybuffer"
    }).then(async res => {
        await message.channel.send(`*Саркастичный взгляд*\nНу... и что ты хочешь услышать?`, {
            files: [{
                attachment: await res.data,
                name: `${message.author.id}.png`
            }]
        }).then(() => message.channel.stopTyping());
    }).catch(err => console.error(err));
};

module.exports.help = {
    name: "взгляни",
    aliases: []
};