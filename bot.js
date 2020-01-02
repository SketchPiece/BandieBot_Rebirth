const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.quests = {};
const fs = require('fs');
let config = require('./botconfig.json');
let profile = require('./profile.json');
let aux = require("./auxiliary.js");
let User = require("./mongo").User
let QuestEngine = require("./questEngine")
let token = config.apitoken;
let prefix = config.prefix;

fs.readdir('./cmds', (err, files) => {
    if (err) console.log(err);
    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if (jsfiles.length <= 0) return console.log("Нет команд для загрузки!");
    jsfiles.forEach((f, i) => {
        let props = require(`./cmds/${f}`);
        console.log(`${i+1}.${f} Загружен!`);
        bot.commands.set(props.help.name, props);
        props.help.aliases.forEach(alias => {
            bot.aliases.set(alias, props.help.name);
        })
    });
    console.log(`Я загрузила ${jsfiles.length} комманд`);
});

fs.readdir('./quests', (err, files) => {
    if (err) console.log(err);
    let qstfiles = files.filter(f => f.split(".").pop() === "qst");
    if (qstfiles.length <= 0) return console.log("Нет квестов для загрузки...");

    qstfiles.forEach((f, i) => {
        let questCode = fs.readFileSync(`./quests/${f}`, 'utf8');
        let questName = f.split('.')[0];
        let questObj = QuestEngine.QuestParse(questCode);
        if (!questObj) {
            console.log(`${i+1}.${questName} Ошибка!`);
        } else {
            bot.quests[questName] = questObj;
            console.log(`${i+1}.${questName} Загружен!`);
        }
    })
    console.log(`Я загрузила ${qstfiles.length} квестов`)
});

async function IsQuest(id) {
    let user = await User.findOne({ id: id }).exec();
    UserJson = JSON.parse(user.questJson);
    if (!UserJson["IsQuest"]) {
        user.questJson = JSON.stringify({ "IsQuest": false });
        user.save((err) => { if (err) console.log(err) })
        return false
    }
    if (UserJson["IsQuest"]) return true;
    else return false;
}

async function QuestEngineWork(bot, message) {
    let user = await User.findOne({ id: bot.userid }).exec();
    let json = JSON.parse(user.questJson);

    if (!message.content.startsWith(prefix)) return bot.sendQuest(bot.quests[json["QuestName"]].stages[json["Status"]]);
    let temp = message.content.slice(prefix.length).trim().split(/(\s+)/).filter(function(e) { return e.trim().length > 0; });
    next = temp.shift().toLowerCase();
    if (!bot.quests[json["QuestName"]].stages[json["Status"]].answers[next]) return bot.sendQuest(bot.quests[json["QuestName"]].stages[json["Status"]]);
    json["Status"] = bot.quests[json["QuestName"]].stages[json["Status"]].answers[next]
    bot.sendQuest(bot.quests[json["QuestName"]].stages[json["Status"]]);
    user.questJson = JSON.stringify(json);
    user.save((err) => { if (err) console.log(err) })
}

/* Всопогательные функции */

let randomInteger = aux.randomInteger;

let IsBannedChannel = aux.IsBannedChannel;

let FindMats = aux.FindMats;

async function CreateUser(bot) {
    user = await User.findOne({ id: bot.userid });
    // , async(err, user) => {
    //     if (err) return console.log(err);
    //     if (!user) {
    //         user = new User({ nickname: bot.name, id: bot.userid, questJson: "{}" });
    //         await user.save(function(err) {
    //             if (err) console.log(err);
    //         });
    //     }
    // }
    if (!user) {
        user = new User({ nickname: bot.name, id: bot.userid, questJson: "{}" });
        await user.save();
    }
}

/* Всопогательные функции */


bot.on('ready', () => {
    console.log(`Скрежет металла и звуки паровых котлов, я снова готова работать...`);
    bot.generateInvite(["ADMINISTRATOR"]).then(link => {
        console.log(link);
    })
    bot.user.setActivity(">помощь", { type: "WATCHING" });
})

bot.on('message', async message => {
    if (message.author.bot) return;
    if (message.channel.type == "dm") return;

    if (message.content == "!reset" && message.member.hasPermission("BAN_MEMBERS")) {
        console.log("Выход...");
        process.exit();
    }

    bot.name = message.author.username;
    bot.userid = message.author.id;

    bot.send = function send(msg) {
        message.channel.send(msg);
    };
    bot.sendQuest = async function(stage) {
        let answer = `${stage.question}`
        if (stage.end) {
            let user = await User.findOne({ id: bot.userid }).exec();
            user.questJson = JSON.stringify({ "IsQuest": false });
            user.save((err) => { if (err) console.log(err) })
            return bot.send(answer + "\n`Конец квеста`");
        }
        answer += "```"
        for (key in stage.answers) {
            answer += `\n>${key}`;
        }
        answer += "```"

        bot.send(answer);
    }

    await CreateUser(bot);

    if (IsBannedChannel(message.channel.id)) return;


    // console.log(await IsQuest(bot.userid));
    if (await IsQuest(bot.userid)) {
        return QuestEngineWork(bot, message);
        // console.log("Запущен квест");
    }

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