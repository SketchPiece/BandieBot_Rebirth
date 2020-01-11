const main_id = require('../botconfig').server_channels.main;
const prefix = require('../botconfig').prefix;
//Tasks
taskList = [{
        name: "Сообщения",
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
function TaskDone(bot, message, user) {
    let done_message = bot.channels.find(channel => channel.id === main_id);
    user.task = { id: user.task.id, done: true };
    done_message.send(`${message.author} выполнил задание "${taskList[user.task.id].name}"!\nОн получает письку в подарок!`);
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
module.exports.SendTaskInfo = function(bot) {
    let user = bot.userdb;
    if (user.task.done) return bot.send(`Задание "${taskList[user.task.id].name}" выполнено!\nМожно расходится`);
    bot.send(`Задание "${taskList[user.task.id].name}" выполнено на ${taskList[user.task.id].percent(user)}%!\n` + "`" + taskList[user.task.id].description + "`");
}