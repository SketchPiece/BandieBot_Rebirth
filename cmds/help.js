const Discord = module.require("discord.js");
const fs = require("fs");

module.exports.run = async(bot, message, args) => {
    bot.send(`*Озирается по сторонам*\n-Помочь? У меня нет на это времени.\n*Спустя какое то время она бросила в сторону ${message.author} скомканный клочок бумажки, который к тому же был порван..*`);
    bot.send(`*Какие-то непонятные каракули. Видимо она еще не определилась в своих силах*`);
    if (message.member.hasPermission("MANAGE_MESSAGES")) bot.send("\`\`\`\nМодератор-Администратор:\n>бан\n>варн [причина]\n>анварн\n>очисти [кол-во сообщений]\`\`\`");
};
module.exports.help = {
    name: "помощь",
    aliases: ["help", "хелп", "хелб"]
};