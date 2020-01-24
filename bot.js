const Discord = require('discord.js');
// import Discord from 'discord.js';
const bot = new Discord.Client();

bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.quests = {};
bot.items = {};
bot.voice_timeouts = {}
const fs = require('fs');
let config = require('./botconfig.js');
let aux = require("./source/auxiliary");
let tasks = require("./source/task_system");
let User = require("./source/mongo").User
let QuestEngine = require("./source/questEngine")
let token = config.token;
let prefix = config.prefix;

fs.readdir('./cmds', (err, files) => {
    if (err) console.log(err);
    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if (jsfiles.length <= 0) return console.log("Нет команд для загрузки!");
    jsfiles.forEach((f, i) => {
        let props = require(`./cmds/${f}`);
        bot.commands.set(props.help.name, props);
        props.help.aliases.forEach(alias => {
            bot.aliases.set(alias, props.help.name);
        })
        console.log(`${i + 1}.${f} Загружен!`);
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

fs.readdir("./items", (err, files) => {
    if (err) console.log(err);
    let dirs = files.filter(f => !f.includes('.'));
    if (dirs.length <= 0) return console.log("Нет предметов для загрузки...");
    dirs.forEach((f, i) => {
        let item = require(`./items/${f}/item.json`);
        let path = `./items/${f}/item.png`;

        bot.items[item.name] = {
            "title": item.title,
            "discription": item.discription,
            "rarity": item.rarity,
            "path": path
        }

    })
    console.log(`Я загрузила ${dirs.length} предметов`)
        // console.log(bot.items);
});

/* Всопогательные функции */

bot.randint = function(min, max) {
    var rand = min + Math.random() * (max - min);
    rand = Math.round(rand);
    return rand;
}

let IsBannedChannel = aux.IsBannedChannel,
    FindMats = aux.FindMats,
    MatsAction = aux.MatsAction,
    FinishAttempts = aux.FinishAttempts,
    QuestEngineWork = aux.QuestEngineWork,
    EveryDayAt = aux.EveryDayAt;

let TaskChecker = tasks.TaskChecker,
    RandomTask = tasks.RandomTask,
    TaskDone = tasks.TaskDone;

async function CreateUser(bot) {
    let user = await User.findOne({ id: bot.userid }).exec();
    if (!user) {
        user = new User({ nickname: bot.name, id: bot.userid, quest: { IsQuest: false }, attempts: 5, forgive: true, task: RandomTask(bot) });
        await user.save();
        return user;
    }
    return user;
}

async function NextDay() {
    let users = await User.find({}).exec();
    console.log("Новый день~");
    users.forEach(async(user) => {
        user.forgive = true;
        user.task = RandomTask(bot);
        await user.save();
    })
}
/* Всопогательные функции */

async function VoiceWaiting(member) {
    let userdb = await User.findOne({ id: member.user.id }).exec();
    if (!userdb.task.voice_min) {
        userdb.task.voice_min = 0;
        // userdb.markModified('task');
        // userdb.save((err)=>{if(err) console.log(err)});
        // bot.voice_timeouts[member.user.id] = setTimeout(VoiceWaiting, 1000, member);
        // return;
    }
    if (userdb.task.voice_min >= 60) {
        TaskDone(bot, member.user, userdb);
        return;
    }
    if (member.voiceChannel.members.array().length < 2) return;
    userdb.task.voice_min += 1;
    userdb.markModified('task');
    userdb.save((err) => { if (err) console.log(err) })
        // console.log("Прошла секунда");
        // console.log(userdb.task.voice_min)
    bot.voice_timeouts[member.user.id] = setTimeout(VoiceWaiting, 1000, member);
}


bot.on('voiceStateUpdate', async(oldmem, member) => {
    if (member.voiceChannel) {
        if (bot.voice_timeouts[member.user.id]) return;
        // console.log(`${member.user.username} вошел в голос`);
        let userdb = await User.findOne({ id: member.user.id }).exec();
        if (!userdb) {
            userdb = new User({ nickname: member.user.username, id: member.user.id, quest: { IsQuest: false }, attempts: 5, forgive: true, task: RandomTask(bot) });
            await userdb.save();
            return;
        }
        if (userdb.task.id != 1) return;
        if (userdb.task.done) return;
        bot.voice_timeouts[member.user.id] = setTimeout(VoiceWaiting, 1000, member);
        // console.log();
    } else {
        // console.log(`${member.user.username} вышел`);
        if (!bot.voice_timeouts[member.user.id]) return;
        clearTimeout(bot.voice_timeouts[member.user.id]);
        bot.voice_timeouts[member.user.id] = undefined;
        let userdb = await User.findOne({ id: member.user.id }).exec();
        userdb.task.voice_min = 0;
        userdb.markModified('task');
        userdb.save((err) => { if (err) console.log(err) });
    }
});
bot.on("messageReactionAdd", (reac, user) => {
    console.log("React");

})

bot.on('ready', async() => {
    console.log(`Скрежет металла и звуки паровых котлов, я снова готова работать...`);
    bot.generateInvite(["ADMINISTRATOR"]).then(link => {
        console.log(link);
    })
    bot.user.setActivity(prefix + "помощь", { type: "WATCHING" });

    setInterval(async() => {
            let users = await User.find({}).exec();
            // console.log("Обновление матоф");
            users.forEach(async(user) => {
                if (user.attempts < 5) user.attempts++;
                await user.save();
            });
        }, 1000 * 60 * 60) //действие каждые пять минут
    EveryDayAt(0, 0, NextDay);

    // DEV
    let users = await User.find({}).exec();
    console.log("Новый день~");
    users.forEach(async(user) => {
        user.forgive = true;
        user.task = RandomTask(bot);
        await user.save();
    })
})

bot.on('message', async message => {
    if (message.author.bot) return;
    bot.name = message.author.username;
    // bot.user = message.author;
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
            user.quest.IsQuest = false; // = JSON.stringify({ "IsQuest": false });
            user.markModified('quest');
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

    bot.dmsend = function(msg) {
        message.author.send(msg);
    }
    bot.userdb = await CreateUser(bot);
    TaskChecker(bot, message);
    if (message.channel.type == "dm") {
        if (bot.userdb.quest.IsQuest) return QuestEngineWork(bot, message, bot.userdb, "выход");
        return;
    }

    if (IsBannedChannel(message.channel.id)) return;
    if (!FinishAttempts(bot)) return;

    if (FindMats(message)) return MatsAction(bot, message, bot.userdb);

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