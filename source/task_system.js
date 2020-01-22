const main_id = require('../botconfig').server_channels.main;
const prefix = require('../botconfig').prefix;
const Jimp = require("jimp");
//Tasks
taskList = [{
        title: "Печатный станок",
        description: "Введи в чат 1000 сообщений",
        action: function(bot, message, user) {

            if (!user.task.mess_count) {
                user.task.mess_count = 1;
                return Save(user);
            }
            if (user.task.mess_count < 999) {
                user.task.mess_count += 1;
                return Save(user)
            }
            TaskDone(bot, message.author, user);
        },
        check_states: function(user){
            if (!user.task.mess_count) {
                user.task.mess_count = 0;
                return Save(user);
            }
        },
        percent: function(user) {
            return user.task.mess_count * 100 / 1000;
        }
    },{
        title: "Скажи гаф!",
        description: "Пообщайся с людьми в войс чате",
        action: function(bot, message, user) {},
        check_states: function(user){},
        percent: function(user) {
            return user.task.voice_min * 100 / 60;
        }
    }]
    //Functions
let TaskDone = async function (bot, user, userdb) {
    let done_message = bot.channels.find(channel => channel.id === main_id);
    // console.log(bot.user);
    userdb.task = { id: userdb.task.id, done: true };
    
    
    await done_message.send(`${user} выполнил задание!`);
    await done_message.send({files: [{
        attachment: await GenerateInfoDone(taskList[userdb.task.id].title,taskList[userdb.task.id].description),
        name: `sketch-gay.png`   
    }]});
    if(userdb.inventory.length<20){
        let item = RandomItem(bot);
        // console.log(item);
        userdb.inventory.push(item);
        done_message.send(`${user} получил предмет ${bot.items[item].title}!`);
    }else{
        done_message.send(`У ${user} закончилось место в инвентаре!`);
    }
    
    Save(userdb);
}

module.exports.TaskDone = TaskDone;

function RandomItem(bot){
    let rand = Math.random();
    let rarity;
    if (rand < 0.70) rarity = 1;
    else if (rand < 0.90) rarity = 2;
    else if (rand < 0.99) rarity = 3;
    else rarity = 4;
    
    let rarity_items = [];
    console.log(rarity);
    let keys = Object.keys(bot.items);

    keys.forEach(key => {
        if(bot.items[key].rarity == rarity) rarity_items.push(key);
    });
    // console.log(rarity_items);
    return rarity_items[bot.randint(0,rarity_items.length-1)];
}

module.exports.TaskDone = TaskDone;

function Save(user) {
    user.markModified('task');
    user.save((err) => { if (err) console.log(err) })
}

module.exports.TaskChecker = function(bot, message) {
    let user = bot.userdb;
    if (user.task.done) return;
    if (message.content.startsWith(prefix)) return taskList[user.task.id].check_states(user);
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
    let img = await GenerateInfoPercent(taskList[user.task.id].percent(user),taskList[user.task.id].title,taskList[user.task.id].description);
    bot.send({files: [{
        attachment: img,
        name: `sketch-gay.png`   
    }]});
}

module.exports.SendInventory = async function(bot){
    let user = bot.userdb;
    bot.send({files: [{
        attachment: await GenerateInventory(bot,user),
        name: `sketch-gay.png`   
    }]});
}

async function GenerateInventory(bot,user){
    let inv = await Jimp.read("./imgs/inventory.png");
    // let inventory_temp = await Jimp.read("./item-template.png");
    for(let i = 0,j=5,k=-1; i<user.inventory.length;i++, j++){
        if (i % 5 === 0) {
            k++;
            j = j-5;
        }
        
        // console.log(j+" "+k)
        inv.composite(await Jimp.read(bot.items[user.inventory[i]].path),j*512,k*512);
    }
    // console.log(Math.floor(inv_arr.length/5));
    // inv.composite(inventory_temp,512,0);


    return await inv.getBufferAsync(Jimp.MIME_PNG);
}

async function GenerateInfoPercent(percent,title,description) {
    img = await Jimp.read('./imgs/progress.png');
    black = await Jimp.read('./imgs/black.png');
    bg = await (await Jimp.read('./imgs/black.png')).invert();
    if(!percent) percent = 0;
    // console.log(560*percent/100);
    black.resize(560*percent/100+1,25); //560
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

