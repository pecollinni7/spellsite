function displayTextWidth(text, font)
{
    const myCanvas = displayTextWidth.canvas || (displayTextWidth.canvas = document.createElement("canvas"));
    const context  = myCanvas.getContext("2d");
    context.font   = "bold 17pt verdana";

    return context.measureText(text).width;
}

function getCorrespondingWidthClass(width)
{
    if (width <= 10) return 10;
    if (width >= 150) return 150;

    return Math.ceil(width / 10) * 10;
}

function removeDuplicatesFromArray(arr)
{
    let s  = new Set(arr);
    let it = s.values();
    return Array.from(it);
}



module.exports = {
    displayTextWidth,
    removeDuplicatesFromArray,
    getCorrespondingWidthClass
}