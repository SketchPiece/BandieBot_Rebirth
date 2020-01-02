const Discord = module.require("discord.js");
const fs = require("fs");
// let profile = require('../profile.json');
module.exports.run = async(bot, message, args) => {
    try {

        if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("*Смотрит с недоумением*");

        let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if (rUser.id == '578197813821833227') return bot.send("Нет."); //важно
        if (!args[0]) return bot.send("Вы на столько ленивы что вам трудно даже нормально имя произнести?");
        if (!rUser) return bot.send("Я записываю имена всех кого встречаю, интересно о ком он?\n*Нахмурилась*\n(Может это тот самый вор что крадет еду из моего холодильника...)");

        let embed = new Discord.RichEmbed()
            .setDescription("Дисквалификация!")
            .addField("Мне сказал", message.author)
            .addField("Что ты", `${rUser.user} не достоин участи присутствия на сервере!`)
            .addField("Возможно, мы тебя и не вспомним c:<", `хе хе хе`);

        rUser.send(embed);
        message.guild.member(rUser).ban(`Бан по причине ${rUser.user.username}`);

    } catch (err) {
        console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
    }
};
module.exports.help = {
    name: "бан",
    aliases: []
};