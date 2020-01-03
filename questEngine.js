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
    } catch {
        return false
    }
}

module.exports.QuestParse = QuestParse;

// let fs = require("fs")

// var content = fs.readFileSync('./quests/test.qst', 'utf8')

// console.log(QuestParse(content));