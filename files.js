const fs = require("fs");

fs.readdir("./items", (err,files) => {
    if(err) console.log(err);
    let dirs = files.filter(f => !f.includes('.'));
    dirs.forEach((f,i)=>{
        let item = require(`./items/${f}`);
    })
});