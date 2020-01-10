const Discord = module.require("discord.js");
const fs = require("fs");
const User = require("../source/mongo").User
const IsQuest = require("../source/auxiliary").IsQuest;

module.exports.run = async(bot, message, args) => {
    if(await IsQuest(bot.userid)) return bot.send("Квест уже запущен! Выйдите из текущего что бы начать новый");
    if (args[0]) {
        if (!bot.quests[args[0]]) return bot.send("Такого квеста не существует!");
        user = await User.findOne({ id: bot.userid }).exec();
        user.quest.IsQuest = true;
        user.quest.QuestName = args[0];
        user.quest.Status = 0;
        user.markModified('quest');
        user.save((err) => { if (err) console.log(err) })
        bot.send("Квест с кодом "+ args[0]+ " запущен");
        return bot.sendQuest(bot.quests[args[0]].stages[0]);
    }

    qstAnswer = "Доступные квесты:\n```";
    for (var quest in bot.quests) {
        qstAnswer += `Название: ${bot.quests[quest].title}\nОписание: ${bot.quests[quest].description}\nАвтор: ${bot.quests[quest].author}` + "\nКод: " + quest + "\n\n";
    }
    qstAnswer += "```\n"
    qstAnswer += "`Что бы выбрать квест введите >квест [код]`"
    qstAnswer += "\n`Что бы выйти из квеста введите >выход`"

    bot.send(qstAnswer);
};
module.exports.help = {
    name: "квест",
    aliases: ["quest", "квесты"]
};