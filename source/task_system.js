const main_id = require('../botconfig').server_channels.main;
const prefix = require('../botconfig').prefix;
const Jimp = require("jimp");
//Tasks
taskList = [{
        title: "Сообщения",
        description: "Введи в чат 10 сообщений",
        action: function(bot, message, user) {

            if (!user.task.mess_count) {
                user.task.mess_count = 1;
                return Save(user);
            }
            if (user.task.mess_count < 9) {
                user.task.mess_count += 1;
                return Save(user)
            }
            TaskDone(bot, message, user);
        },
        percent: function(user) {
            return user.task.mess_count * 100 / 10;
        }
    }]
    //Functions
async function TaskDone(bot, message, user) {
    let done_message = bot.channels.find(channel => channel.id === main_id);
    user.task = { id: user.task.id, done: true };
    done_message.send(`${message.author} выполнил задание!`);
    done_message.send({files: [{
        attachment: await GenerateInfoDone(taskList[user.task.id].title,taskList[user.task.id].description),
        name: `sketch-gay.png`   
    }]});
    Save(user);
}

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
    return task = {
        id: bot.randint(0, taskList.length - 1),
        done: false
    }
}
module.exports.SendTaskInfo = async function(bot) {
    let user = bot.userdb;
    if (user.task.done) return bot.send({files: [{
        attachment: await GenerateInfoDone(taskList[user.task.id].title,taskList[user.task.id].description),
        name: `fontaid-gay.png`   
    }]});
    // bot.send(`Задание "${taskList[user.task.id].title}" выполнено на ${taskList[user.task.id].percent(user)}%!\n` + "`" + taskList[user.task.id].description + "`");
    bot.send({files: [{
        attachment: await GenerateInfoPercent(taskList[user.task.id].percent(user),taskList[user.task.id].title,taskList[user.task.id].description),
        name: `sketch-gay.png`   
    }]});
}

async function GenerateInfoPercent(percent,title,description) {
    img = await Jimp.read('./imgs/progress.png');
    black = await Jimp.read('./imgs/black.png');
    bg = await (await Jimp.read('./imgs/black.png')).invert();

    black.resize(560*percent/100,25); //560
    img.composite(black,20,110,{mode: Jimp.BLEND_DESTINATION_OVER});
    
    img.composite(bg,0,0,{mode: Jimp.BLEND_DESTINATION_OVER})

    font = await Jimp.loadFont("./imgs/fonts/font.fnt");
    img.print(font,220,15, title);
    img.print(font,30,60, description);

    return await img.getBufferAsync(Jimp.MIME_PNG);
}

async function GenerateInfoDone(title,description) {
    img = await Jimp.read('./imgs/done.png');
    font = await Jimp.loadFont("./imgs/fonts/font.fnt");
    
    img.print(font,220,15, title);
    img.print(font,30,60, description);

    return await img.getBufferAsync(Jimp.MIME_PNG);
    // img.write("set.png")
}