module.exports.GenerateInfoPercent = async function(percent, title, description) {
    img = await Jimp.read('./imgs/progress.png');
    black = await Jimp.read('./imgs/black.png');
    bg = await (await Jimp.read('./imgs/black.png')).invert();
    if (!percent) percent = 0;
    // console.log(560*percent/100);
    black.resize(560 * percent / 100 + 1, 25); //560
    img.composite(black, 20, 110, { mode: Jimp.BLEND_DESTINATION_OVER });

    img.composite(bg, 0, 0, { mode: Jimp.BLEND_DESTINATION_OVER })

    font = await Jimp.loadFont("./imgs/fonts/font.fnt");
    img.print(font, 220, 15, title);
    img.print(font, 30, 60, description);

    return await img.getBufferAsync(Jimp.MIME_PNG);
}

module.exports.RenderInfoDone = async function(title, description) {
    img = await Jimp.read('./imgs/done.png');
    font = await Jimp.loadFont("./imgs/fonts/font.fnt");

    img.print(font, 220, 15, title);
    img.print(font, 30, 60, description);

    return await img.getBufferAsync(Jimp.MIME_PNG);
    // img.write("set.png")
}