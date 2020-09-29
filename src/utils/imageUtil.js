export function fileToImage(file) {
    return new Promise(function(resolve, reject) {
        var reader = new FileReader();
        reader.readAsDataURL(file); //读取图像文件 result 为 DataURL, DataURL 可直接 赋值给 img.src
        reader.onload = function(event) {
            var img = new Image();
            img.src = event.target.result; //base64
            resolve(img)
        }
    });

}


export function getTextWith(text, fontStyle) {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    context.font = fontStyle || "16px"; // 设置字体样式，当然，也可以在这里给一个默认值
    var dimension = context.measureText(text);
    return dimension.width;
}

export function canvas2Image(canvas, type, width, height) {
    let image = new Image();
    if (!type) {
        type = "image/png";
    }
    if (width > 0) {
        image.width = width
    }
    if (height > 0) {
        image.height > 0
    }
    image.src = canvas.toDataURL(type);

    return image;
}

export function txt2Image(txt, font) {
    // if (!txt) {
    //     txt = "@renjilin.online";
    // }
    // if (!font) {
    //     
    // }
    // let canvas = document.createElement("canvas");
    // var imageWidthAttr = document.createAttribute("width");
    // imageWidthAttr.nodeValue = this.txtWidth;

    // var imageHeightAttr = document.createAttribute("height");
    // imageHeightAttr.nodeValue = this.form.fontSize;
    // canvas.setAttributeNode(imageWidthAttr);
    // canvas.setAttributeNode(imageHeightAttr);

    // let ctx = canvas.getContext("2d");

    // ctx.font = this.font;
    // ctx.fillStyle = this.form.color;

    // ctx.globalAlpha = this.form.globalAlpha / 100;
    // // 设置垂直对齐方式
    // ctx.textAlign = "left";
    // ctx.textBaseline = "top";

    // ctx.fillText(this.form.text, 0, 0);
    // let image = canvas2Image(canvas, this.sourceFile.type);

    // return image;
}