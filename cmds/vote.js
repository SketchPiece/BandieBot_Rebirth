const Discord = module.require("discord.js");
const fs = require("fs");

let choise;
let collect = true;
let voting;

let vote = {
    "✅":0,
    "❎":0
};

async function IsRemove(mess){
    delay(500,mess)
}
function delay(sec,mess){
    // console.log(mess.reactions.get("✅").count)
    setTimeout(Count, sec,mess,sec);
}
function Count(mess,sec){
    if(!collect) return;
    // console.log(vote);
    if(vote["✅"] == mess.reactions.get("✅").count && vote["❎"] == mess.reactions.get("❎").count) return delay(sec, mess);
    if(vote["✅"] > mess.reactions.get("✅").count || vote["❎"] > mess.reactions.get("❎").count) {;
        vote["✅"] = mess.reactions.get("✅").count;
        vote["❎"] = mess.reactions.get("❎").count;
        // console.log(vote);
        // console.log(vote["✅"]>vote["❎"]);
        // console.log(vote["✅"]<vote["❎"]);
        // console.log(vote["✅"]==vote["❎"]);
        if(vote["✅"]>vote["❎"]){
            choise = "Да";
            mess.edit(voting + '| '+choise);
        } else if(vote["✅"]<vote["❎"]){
            choise = "Нет";
            mess.edit(voting + '| '+choise);
        } else{
            choise = "Ничья";
            mess.edit(voting + '| '+choise);
        }
    }
    delay(sec, mess);
}
// var msg;






// function Test(){
//     while(collect){
//         // if(vote["✅"] == mess.reactions.get("✅").count && vote["❎"] == mess.reactions.get("❎").count) continue;
//         // if(vote["✅"] > mess.reactions.get("✅").count || vote["❎"] > mess.reactions.get("❎").count) console.log("Del");
//         // vote["✅"] = mess.reactions.get("✅").count;
//         // vote["❎"] = mess.reactions.get("❎").count;
//         // console.log("Deleted");
//     }
// }

module.exports.run = async (bot,message,args) => {
    
    var theme='';

    if(!args[0]){
        voting = 'Голосование!';
        theme='Обычное голосование';
    } 
    else {
        for (var i = 0; i < args.length; i++){
            if(i ==args.length-1) {theme = theme + args[i]; continue;}
            theme = theme + args[i] + " ";
        }
        voting = 'Голосование на тему: ' + theme;
    }
    
    let mess = await message.channel.send(voting);
    // msg = mess;
    await mess.react("✅");
    await mess.react("❎");
    IsRemove(mess);
    // console.log("aaa")
    const collector = mess.createReactionCollector((reaction, user) => reaction.emoji.name === '✅' || reaction.emoji.name === '❎' && user.id == message.author.id, {time: 60000});

    collector.on('collect', async r =>{
        // console.log(mess.reactions.get("✅").count);
        vote["✅"] = mess.reactions.get("✅").count;
        vote["❎"] = mess.reactions.get("❎").count;
        if(vote["✅"]>vote["❎"]){
            choise = "Да";
            mess.edit(voting + '| '+choise);
        } else if(vote["✅"]<vote["❎"]){
            choise = "Нет";
            mess.edit(voting + '| '+choise);
        } else{
            choise = "Ничья";
            mess.edit(voting + '| '+choise);
        }

    })

    collector.on('end', async () => {
        if(!choise){
            choise = 'не известен..';
        }
        if(vote["✅"]>vote["❎"]){
            choise = "Да";
        } else if(vote["✅"]<vote["❎"]){
            choise = "Нет";
        } else{
            choise = "Ничья";
        }
        await mess.edit(`Голосование закончилось!\n${message.author}, Результат голосования: \"`+theme+'\" '+choise);
        collect = false;
    })
};
module.exports.help = {
    name: "голосование",
    aliases: ["vote"]
};