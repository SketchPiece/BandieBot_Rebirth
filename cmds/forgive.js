const Discord = module.require("discord.js");
const fs = require("fs");
let User = require("../source/mongo").User

module.exports.run = async(bot, message, args) => {
    try {
        let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        let userDB = await User.findOne({ id: bot.userid }).exec();
        if (!userDB.forgive) return bot.send(`*Она не обрашает на ${message.author} внимания. Лучше ему прийти завтра*`)
        if (!args[0]) return bot.send("Вы настолько ленивы что вам трудно даже нормально имя произнести?");
        if (!rUser) return bot.send("Знать бы еще о ком речь...");
        let rUserDB = await User.findOne({ id: rUser.id }).exec();
        if (!rUserDB) return bot.send(`${message.author}, я не могу найти его в своём списке, прости..`);
        if (rUserDB.attempts > 0) return bot.send("А, ну да, конечно... \n*продолжает заниматся своими делами*")

        rUserDB.attempts += bot.randint(2, 4)

        if (rUserDB.attempts > 0) {
            bot.send(`Окей, ${rUser}, на этот раз тебе свезло`);
            userDB.forgive = false;
            rUserDB.save(err => { if (err) console.log(err) });
            userDB.save(err => { if (err) console.log(err) });
            return;
        }
        bot.send(`Это все замечательно, но ты посмотри на него.. не думаю что он реально исправился`)
        userDB.forgive = false;
        rUserDB.save(err => { if (err) console.log(err) });
        userDB.save(err => { if (err) console.log(err) });
    } catch (err) {
        console.log(`1.${err.name}\n2.${err.message}\n3.${err.stack}`);
    }
};
module.exports.help = {
    name: "прости",
    aliases: []
};