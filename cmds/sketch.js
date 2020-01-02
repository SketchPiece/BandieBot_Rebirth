const Discord = module.require("discord.js");
const fs = require("fs");

module.exports.run = async(bot, message, args) => {
    var Mass = [`*${message.author} заметил записку на стене*\n«Дневник разработчика: добавить больше пасхалок\n-Скетч»`, `*${message.author} заметил записку на  стене*\n«Харе бухать энергетики!!\n-Скетч»`, `*${message.author} заметил записку на  стене*\n«Дневник разработчика: Не ленись... пж\n-Скетч»`, `*${message.author} заметил записку на  стене*\n«От винта!\n-Скетч»`]; //база ответов
    /*Ответы вводяться в ковычках через запятую. Если хочешь что бы бот обращался к юзеру, используй конструкцию с ковычками `фраза`(пример:последняя фраза)*/
    /* <@${message.author.id}> - польззователь */
    function randomInteger(min, max) {
        var rand = min + Math.random() * (max - min)
        rand = Math.round(rand);
        return rand;
    }
    var random = randomInteger(0, Mass.length - 1);
    message.channel.send(Mass[random]);
};
module.exports.help = {
    name: "<@331103366774259713>",
    aliases: ["sketch", "скетч", "скотч"] //название команды, то что вводится после >
        /*в этом случае команда будет реагировать на >шаблон*/
};