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