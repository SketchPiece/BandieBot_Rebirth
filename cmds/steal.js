const Discord = module.require("discord.js");
const axios = require('axios');
const fs = require("fs");

module.exports.run = async(bot, message, args) => {

    let rUser = message.mentions.users.first() || message.guild.members.get(args[0]) || message.author;

    if (rUser.id == '578197813821833227') return bot.send("У меня воровать собрался?"); //важно

    if (rUser.id == message.author.id) return bot.send("Я не ворую у заказчиков");
    let profilepic = rUser.avatarURL;
    let url = `${profilepic}`;

    message.channel.startTyping();

    axios.get(url, {
        responseType: "arraybuffer"
    }).then(async res => {
        await message.channel.send(`Еле унесла копыта! С тебя должок!`, {
            files: [{
                attachment: await res.data,
                name: `${rUser.id}.png`
            }]
        }).then(() => message.channel.stopTyping());
    }).catch(err => console.error(err));
};

module.exports.help = {
    name: "украсть",
    aliases: []
};