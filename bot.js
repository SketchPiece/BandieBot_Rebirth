const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.quests = {};
const fs = require('fs');
let config = require('./botconfig.js');
// let profile = require('./profile.json');
let aux = require("./auxiliary.js");
let User = require("./mongo").User
let QuestEngine = require("./questEngine")
let token = config.token;
let prefix = config.prefix;

fs.readdir('./cmds', (err, files) => {
    if (err) console.log(err);
    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if (jsfiles.length <= 0) return console.log("Нет команд для загрузки!");
    jsfiles.forEach((f, i) => {
        let props = require(`./cmds/${f}`);
        console.log(`${i + 1}.${f} Загружен!`);
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
            console.log(`${i + 1}.${questName} Ошибка!`);
        } else {
            bot.quests[questName] = questObj;
            console.log(`${i + 1}.${questName} Загружен!`);
        }
    })
    console.log(`Я загрузила ${qstfiles.length} квестов`)
});

/* Всопогательные функции */

bot.randint = function(min, max) {
    var rand = min + Math.random() * (max - min);
    rand = Math.round(rand);
    return rand;
}

let IsBannedChannel = aux.IsBannedChannel;

let FindMats = aux.FindMats;

let MatsAction = aux.MatsAction;

let FinishAttempts = aux.FinishAttempts;

let IsQuest = aux.IsQuest;

let QuestEngineWork = aux.QuestEngineWork;

let EveryDayAt = aux.EveryDayAt;

async function CreateUser(bot) {
    user = await User.findOne({ id: bot.userid });
    if (!user) {
        user = new User({ nickname: bot.name, id: bot.userid, questJson: "{}", attempts: 5 });
        await user.save();
    }
}

async function UpdateForgive() {
    let users = await User.find({}).exec();
    console.log("Обновление матоф");
    users.forEach(async(user) => {
        user.forgive = true;
        await user.save();
    })
}

/* Всопогательные функции */


bot.on('ready', () => {
    console.log(`Скрежет металла и звуки паровых котлов, я снова готова работать...`);
    bot.generateInvite(["ADMINISTRATOR"]).then(link => {
        console.log(link);
    })
    bot.user.setActivity(">помощь", { type: "WATCHING" });

    setInterval(async() => {
            let users = await User.find({}).exec();
            console.log("Обновление матоф");
            users.forEach(async(user) => {
                if (user.attempts < 5) user.attempts++;
                await user.save();
            });
        }, 1000 * 60 * 60) //действие каждые пять минут
    EveryDayAt(0, 0, UpdateForgive);
})

bot.on('message', async message => {
    if (message.author.bot) return;
    bot.dmsend = function(msg) {
        message.author.send(msg);
    }
    if (message.channel.type == "dm") {
        if (await IsQuest(bot.userid)) return QuestEngineWork(bot, message);
        return;
    }

    bot.name = message.author.username;
    bot.userid = message.author.id;

    bot.send = function send(msg) {
        message.channel.send(msg);
    };
    bot.sendQuest = async function(stage) {
        let answer = "";
        let breaks = stage.question.split("(br)");
        breaks.forEach((str) => {
            answer += str + "\n";
        });
        if (stage.end) {
            let user = await User.findOne({ id: bot.userid }).exec();
            user.questJson = JSON.stringify({ "IsQuest": false });
            user.save((err) => { if (err) console.log(err) });
            return bot.dmsend(answer + "\n`Конец квеста`");
        }
        answer += "```"
        for (key in stage.answers) {
            answer += `\n${prefix}${key}`;
        }
        answer += "```"

        bot.dmsend(answer);
    }

    await CreateUser(bot);
    if (IsBannedChannel(message.channel.id)) return;
    if (await FinishAttempts(bot)) return;
    if (FindMats(message)) return MatsAction(bot, message);


    // console.log(await IsQuest(bot.userid));

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