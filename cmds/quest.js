const Discord = module.require("discord.js");
const fs = require("fs");
const User = require("../mongo").User

module.exports.run = async(bot, message, args) => {
    if (args[0]) {
        if (!bot.quests[args[0]]) return bot.send("Такого квеста не существует!");
        user = await User.findOne({ id: bot.userid }).exec();
        json = JSON.parse(user.questJson);
        json["IsQuest"] = true;
        json["QuestName"] = args[0];
        json["Status"] = 0;
        user.questJson = JSON.stringify(json);
        user.save((err) => { if (err) console.log(err) })
        bot.quests[args[0]]
        return bot.sendQuest(bot.quests[args[0]].stages[0]);
    }

    qstAnswer = "Доступные квесты:\n```";
    for (var quest in bot.quests) {
        qstAnswer += `Название: ${bot.quests[quest].title}\nОписание: ${bot.quests[quest].description}` + "\nКод: " + quest + "\n\n";
    }
    qstAnswer += "```\n"
    qstAnswer += "`Что бы выбрать квест введите >квест [код]`"

    bot.send(qstAnswer);
};
module.exports.help = {
    name: "квест",
    aliases: ["quest", "квесты"]
};