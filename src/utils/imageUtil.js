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