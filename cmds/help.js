const Discord = module.require("discord.js");
const fs = require("fs");

module.exports.run = async (bot,message,args) => {
    message.channel.send(`*Озирается по сторонам*\n-Помочь? У меня нет на это времени.\n*Спустя какое то время она бросила в сторону ${message.author} скомканный клочок бумажки, который к тому же был порван..*`);
    message.channel.send(`\`\`\`\nТехническое:\n>жалоба [пользователь] [текст жалобы]\n>баг [описание бага]\n>testers\n>donate\n>about\n\nРазвлечения:\n>привет\n>обнять [пользователь]\n>записка [пользователь] [текст анонимной записки]\n>конверт [id пользователя] [текст анонимной записки]\n>голосование [текст]\n>монетка\n>взгляни\n>украсть [пользователь]\n>триггеред [пользователь]\n>картина [пользователь]\n>покемон [пользователь]\n>гей [пользователь]\n>бутылка [пользователь]\n>прон [пользователь] [текст]\n>цитата [пользователь] [текст]\n\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/ \`\`\``);
    if(message.member.hasPermission("MANAGE_MESSAGES")) message.channel.send("\`\`\`\nМодератор-Администратор:\n>бан\n>варн [причина]\n>анварн\n>очисти [кол-во сообщений]\`\`\`");
}; 
module.exports.help = {
    name: "помощь",
    aliases: ["help","хелп","хелб"]
};