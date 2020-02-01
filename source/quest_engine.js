function QuestParse(content) {
    try {
        var code = content.replace(/\s\s+/gm, '')
        let questObj = {}

        let strings = code.split(';');
        var ending = strings.pop();
        if (ending.replace(' ', '') != '') return false
        questInfo = strings.shift().match(/\[(.+?)\]/g);
        questObj.title = questInfo[0].match(/\[(.+?)\]/)[1];
        questObj.description = questInfo[1].match(/\[(.+?)\]/)[1];
        questObj.author = questInfo[2].match(/\[(.+?)\]/)[1];
        questObj.stages = {};

        strings.forEach(str => {
            var stage = str.replace(/\[(.+?)\]/, '').match(/\d+/)[0];
            var data = str.match(/\[(.+?)\]/g);
            // console.log(data);

            questObj.stages[stage] = {
                question: data[0].match(/\[(.+?)\]/)[1]
            }

            if (data[1].match(/\[(.+?)\]/)[1].toLowerCase() == "end") {
                questObj.stages[stage].end = true;
            } else {
                questObj.stages[stage].end = false;
                var answers = data[1].match(/\[(.+?)\]/)[1].split(',');
                answersObj = {};
                answers.forEach(answer => {
                    var command = answer.replace(/\((.+?)\)/, '').toLowerCase();
                    var next = answer.match(/\((.+?)\)/)[1]
                    answersObj[command] = next;
                })

                questObj.stages[stage].answers = answersObj
            }

        });
        return questObj;
    } catch (e) {
        console.log(e);
        return false

    }
}

module.exports.QuestParse = QuestParse;

module.exports.QuestEngineWork = async function(bot, message, exit) {
    let user = await User.findOne({ id: bot.userid }).exec(); //
    if (!message.content.startsWith(prefix)) return bot.sendQuest(bot.quests[user.quest.QuestName].stages[user.quest.Status]);
    let temp = message.content.slice(prefix.length).trim().split(/(\s+)/).filter(function(e) { return e.trim().length > 0; });
    next = temp.shift().toLowerCase();
    if (next == exit) {
        user.quest.IsQuest = false;
        user.quest.QuestName = undefined;
        user.quest.Status = undefined;
        user.markModified('quest');
        user.save((err) => { if (err) console.log(err) });
        return bot.dmsend("`Квест был завершен досрочно`");
    }
    if (!bot.quests[user.quest.QuestName].stages[user.quest.Status].answers[next]) return bot.sendQuest(bot.quests[user.ques.QuestName].stages[user.quest.Status]);
    user.quest.Status = bot.quests[user.quest.QuestName].stages[user.quest.Status].answers[next]
    bot.sendQuest(bot.quests[user.quest.QuestName].stages[user.quest.Status]);
    user.markModified('quest');

    user.save((err) => { if (err) console.log(err) })
}