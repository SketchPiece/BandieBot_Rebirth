const main_id = require('../botconfig').server_channels.main;
const { prefix } = require('../botconfig');
const Jimp = require("jimp");
const { User } = require("./mongo");
let { RenderInfoDone, RenderInventory } = require('./render_ui');
//Tasks
taskList = [{
        title: "Печатный станок",
        description: "Введи в чат 1000 сообщений",
        action: function(bot, message, user) {
            if (user.task.mess_count < user.task.goal) {
                user.task.mess_count += 1;
                return Save(user)
            }
            TaskDone(bot, message.author);
        },
        set: function(bot, task) {
            task.mess_count = 0;
            task.goal = bot.randint(700, 1200);
            return task;
        },
        percent: function(user) {
            return user.task.mess_count * 100 / user.task.goal;
        }
    }, {
        title: "Скажи гаф!",
        description: "Пообщайся с людьми в войс чате",
        action: function(bot, message, user) {},
        set: function(bot, task) {
            task.voice_min = 0;
            task.goal = bot.randint(30, 120);

            return task;
        },
        percent: function(user) {
            return user.task.voice_min * 100 / user.task.goal;
        }
    }, {
        title: "Пометь товарища!",
        description: "Получи несколько одинаковых реакций",
        action: function(bot, message, user) {
            if (!user.task.reacts) {
                user.task.reacts = 0;
                Save(user);
            }
        },
        set: function(bot, task) {
            task.reacts = 0;
            task.goal = bot.randint(4, 8);

            return task;
        },
        percent: function(user) {
            return user.task.reacts * 100 / user.task.goal;
        }
    }]
    //Functions
let TaskDone = async function(bot, user) {

    let done_message = bot.channels.find(channel => channel.id === main_id);
    // console.log(bot.user);
    let userdb = await User.findOne({ id: user.id }).exec()
        // console.log(userdb.inventory.length);
    userdb.task = { id: userdb.task.id, done: true };
    let item = null;
    if (userdb.inventory.length < 20) {
        item = RandomItem(bot);
        // console.log(item);
        userdb.inventory.push(item);
        await Save(userdb);
    }
    done_message.startTyping();
    await done_message.send(`${user} выполнил задание!`);

    await done_message.send({
        files: [{
            attachment: await RenderInfoDone(taskList[userdb.task.id].title, taskList[userdb.task.id].description),
            name: `sketch-gay.png`
        }]
    });

    if (item) {
        done_message.send(`${user} получил предмет ${bot.items[item].title}!`);
    } else {
        done_message.send(`У ${user} закончилось место в инвентаре!`);
    }
    done_message.stopTyping();
}

module.exports.TaskDone = TaskDone;

function RandomItem(bot) {
    let rand = Math.random();
    let rarity;
    if (rand < 0.70) rarity = 1;
    else if (rand < 0.90) rarity = 2;
    else if (rand < 0.99) rarity = 3;
    else rarity = 4;

    let rarity_items = [];
    // console.log(rarity);
    let keys = Object.keys(bot.items);

    keys.forEach(key => {
        if (bot.items[key].rarity == rarity) rarity_items.push(key);
    });
    // console.log(rarity_items);
    return rarity_items[bot.randint(0, rarity_items.length - 1)];
}
module.exports.RandomItem = RandomItem;
module.exports.TaskDone = TaskDone;

function Save(user) {
    user.markModified('task');
    user.save((err) => { if (err) console.log(err) })
}

module.exports.TaskChecker = function(bot, message) {
    let user = bot.userdb;
    if (user.task.done) return;
    if (message.content.startsWith(prefix)) return;
    taskList[user.task.id].action(bot, message, user);
}
module.exports.RandomTask = function(bot) {
    let task_id = bot.randint(0, taskList.length - 1);
    let task = {
        id: task_id,
        done: false
    }
    return taskList[task_id].set(bot, task);
}
module.exports.SendTaskInfo = async function(bot) {
    let user = bot.userdb;
    if (user.task.done) return bot.send({
        files: [{
            attachment: await RenderInfoDone(taskList[user.task.id].title, taskList[user.task.id].description),
            name: `fontaid-gay.png`
        }]
    });
    // bot.send(`Задание "${taskList[user.task.id].title}" выполнено на ${taskList[user.task.id].percent(user)}%!\n` + "`" + taskList[user.task.id].description + "`");

    let img = await GenerateInfoPercent(taskList[user.task.id].percent(user), taskList[user.task.id].title, taskList[user.task.id].description);
    bot.send({
        files: [{
            attachment: img,
            name: `fontaid-gay.png`
        }]
    });
}

module.exports.SendInventory = async function(bot) {
    let user = bot.userdb; //
    bot.send({
        files: [{
            attachment: await RenderInventory(bot, user),
            name: `sketch-gay.png`
        }]
    });
}