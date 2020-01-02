const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
const fs = require('fs');
let config = require('./botconfig.json');
let profile = require('./profile.json');
let aux = require("./auxiliary.js");
let token = config.apitoken;
let prefix = config.prefix;

let checkBot = 0;
let checkHiBot = 0;

fs.readdir('./cmds', (err, files) => {
    if (err) console.log(err);
    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if (jsfiles.length <= 0) console.log("Нет команд для загрузки!");
    console.log(`Я загрузила ${jsfiles.length} комманд`);
    jsfiles.forEach((f, i) => {
        let props = require(`./cmds/${f}`);
        console.log(`${i+1}.${f} Загружен!`);
        bot.commands.set(props.help.name, props);
        props.help.aliases.forEach(alias => {
            bot.aliases.set(alias, props.help.name);
        })
    });
});

/* Всопогательные функции */

let randomInteger = aux.randomInteger;

let IsBannedChannel = aux.IsBannedChannel;

let FindMats = aux.FindMats;

/* Всопогательные функции */


bot.on('ready', () => {
    console.log(`Скрежет металла и звуки паровых котлов, я снова готова работать...`);
    bot.generateInvite(["ADMINISTRATOR"]).then(link => {
        console.log(link);
    })
    bot.user.setActivity(">помощь", { type: "WATCHING" });
    /*таймер запуск*/
    setInterval(() => {
        timeActionCheck()
    }, 1000 * 60 * 60 * 24)
    setInterval(() => {
        timeActionSpam()
    }, 1000 * 30)
    setInterval(() => {
        //sendchannel.send('Тестовое сообщение каждые 5 сек')
    }, 5000)
})


// bot.on('guildMemberAdd', function(member){
//   // member.send('Добро пожаловать!')
//   var sendchannel = bot.channels.find(channel => channel.id === '551774501290115085');//важно изменить
//   sendchannel.send(`Привет ${member}`);
// })

// bot.on('guildMemberRemove', function(member){
//   // member.send('Добро пожаловать!')
//   var sendchannel = bot.channels.find(channel => channel.id === '551774501290115085'); //важно изменить
//   sendchannel.send(`Пока ${member}`);
// })

function timeActionCheck() {
    checkBot++;
}

function timeActionSpam() {
    checkHiBot++;
}


/*таймер снаружи*/

bot.on('message', async message => {
    if (message.author.bot) return;
    if (message.channel.type == "dm") return;

    if (message.content == "!reset" && message.member.hasPermission("BAN_MEMBERS")) {
        console.log("Выход...");
        process.exit();
    }
    // var channelMoon = bot.channels.find(channel => channel.id === '578660037384339489'); //важно изменить


    let user = message.author.username;
    let userid = message.author.id;


    if (!profile[userid]) {
        profile[userid] = {
            username: user,
            mats: 10,
            warns: 0,
            forgives: 0,
            forgiveUser: 1,
            checkUser: 0,
            checkHiUser: 0,
            hiCheckout: 0,
        };
    };

    fs.writeFile('./profile.json', JSON.stringify(profile), (err) => {
        if (err) console.log(err);
    })
    if (IsBannedChannel(message.channel.id)) return;

    if (profile[userid].mats <= 0) return;


    if (profile[userid].checkUser != checkBot) {
        profile[userid].forgiveUser = 1;
        profile[userid].checkUser = checkBot;
        console.log(`Я обновила "Прощение" пользователю ${user}`);
        //console.log(profile[userid].forgiveUser);
    }
    if (profile[userid].checkHiUser != checkHiBot) {
        profile[userid].hiCheckout = 0;
        profile[userid].checkHiUser = checkHiBot;
        //console.log(`Я обновила "Привет" пользователю ${user}`);
        //console.log(profile[userid].forgiveUser);
    }
    bot.send = function send(msg) {
        message.channel.send(msg);
    };

    if (FindMats(bot, message)) return;

    if (!message.content.startsWith(prefix)) return;
    let args = message.content.slice(prefix.length).trim().split(/(\s+)/).filter(function(e) { return e.trim().length > 0; });
    let temp = args.shift();
    let cmd = temp.toLowerCase();
    let command;

    if (bot.commands.has(cmd)) {
        command = bot.commands.get(cmd);
    } else {
        command = bot.commands.get(bot.aliases.get(cmd));
    }

    if (command) command.run(bot, message, args);

});

bot.login(token);