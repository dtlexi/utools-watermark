 export function downLoadImage(image, fileName) {
     let oA = document.createElement("a");
     if (!fileName) {
         fileName = "水印";
     }
     oA.download = fileName; // 设置下载的文件名，默认是'下载'
     oA.href = image.src;
     document.body.appendChild(oA);
     oA.click();
     oA.remove(); // 下载之后把创建的元素删除
 }