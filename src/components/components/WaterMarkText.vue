<template>
  <div id="tab-container">
    <Row>
      <Col span="24">
        <Upload
          multiple
          type="drag"
          action
          :format="['jpg', 'jpeg', 'png']"
          accept="image"
          :before-upload="handleBeforeUpload"
        >
          <div style="padding: 20px 0">
            <Icon
              type="ios-cloud-upload"
              size="52"
              style="color: #3399ff"
            ></Icon>
            <p>上传图片</p>
          </div>
        </Upload>
      </Col>
    </Row>
    <Row>
      <Col span="8">
        <Form :label-width="80">
          <FormItem label="水印文本">
            <Input v-model="form.text" placeholder="water mark text..."></Input>
          </FormItem>
          <FormItem label="位置">
            <Select v-model="form.type" style="width: 200px">
              <Option :value="1">左上</Option>
              <Option :value="2">左中</Option>
              <Option :value="3">左下</Option>

              <Option :value="4">右上</Option>
              <Option :value="5">右中</Option>
              <Option :value="6">右下</Option>

              <Option :value="7">中上</Option>
              <Option :value="8">中间</Option>
              <Option :value="9">中下</Option>
              <Option :value="10">铺满</Option>
            </Select>
          </FormItem>
          <FormItem label="字体大小">
            <Slider v-model="form.fontSize" :max="100" :min="0"></Slider>
          </FormItem>

          <FormItem label="字体颜色">
            <ColorPicker v-model="form.color" />
          </FormItem>

          <FormItem label="透明度">
            <Slider v-model="form.globalAlpha" :max="100" :min="10"></Slider>
          </FormItem>
          <show-more :max-height="0" @expandSuccess="handleExpandSuccess">
            <FormItem label="上下间距">
              <Slider
                v-model="form.horizontalSpacing"
                :max="100"
                :min="0"
              ></Slider>
            </FormItem>

            <FormItem label="左右间距">
              <Slider
                v-model="form.portraitSpacing"
                :max="100"
                :min="0"
              ></Slider>
            </FormItem>

            <FormItem label="旋转角度">
              <Slider
                v-model="form.rotateAngle"
                :max="180"
                :min="-180"
                :step="5"
              ></Slider>
            </FormItem>
          </show-more>

          <div :style="exportButtonStyle">
            <Button type="primary" @click="handleExportImage">导出图片</Button>
          </div>
        </Form>
      </Col>
      <Col span="16">
        <div
          class="canvas-wrapper"
          ref="divCanvas"
          id="divCanvas"
          :style="{ height: canvasHeight + 'px' }"
        >
          <canvas ref="imageCanvas" class="canvas"></canvas>
          <canvas ref="textCanvas" class="canvas"></canvas>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
import { fileToImage, getTextWith, canvas2Image } from "@/utils/imageUtil";
import { downLoadImage } from "@/utils/fileUtil";
import ShowMore from "@/plugins/ShowMore";
export default {
  data() {
    return {
      canvas: undefined,
      ctx: undefined,
      txtCanvas: undefined,
      txtCtx: undefined,
      sourceImage: undefined,
      form: {
        fontSize: 50,
        fontType: "Arial",
        text: "@renjilin.online",
        globalAlpha: 100,
        color: "#FFFFFF",
        type: 1,
        portraitSpacing: 0,
        horizontalSpacing: 0,
        rotateAngle: 0,
      },
      canvasWidth: 500,
      canvasHeight: 200,
      sourceFile: {
        fileName: undefined,
        fileType: undefined,
      },
      exportButtonStyle: {
        width: "100%",
        textAlign: "center",
        paddingTop: "10px",
      },
    };
  },
  mounted: function () {
    this.canvas = this.$refs.imageCanvas;
    this.ctx = this.canvas.getContext("2d");
    this.txtCanvas = this.$refs.textCanvas;
    this.txtCtx = this.txtCanvas.getContext("2d");

    this.canvasWidth = this.$refs.divCanvas.clientWidth - 50;
  },
  methods: {
    handleBeforeUpload(file) {
      fileToImage(file).then((image) => {
        this.sourceImage = image;

        this.sourceFile.fileName = file.name;
        this.sourceFile.fileType = file.type;
        this.initCanvas(image);
        this.renderImage(image);
        this.renderText();

        try {
          utools.showMainWindow();
        } catch (error) {}
      });
      return false;
    },
    initCanvas(image) {
      const width = image.width;
      const height = image.height;
      const proportion = width / height;
      this.canvasHeight = parseInt(this.canvasWidth / proportion);

      var imageWidthAttr = document.createAttribute("width");
      imageWidthAttr.nodeValue = this.canvasWidth;
      var imageHeightAttr = document.createAttribute("height");
      imageHeightAttr.nodeValue = this.canvasHeight;
      this.canvas.setAttributeNode(imageWidthAttr);
      this.canvas.setAttributeNode(imageHeightAttr);

      var txtWidthAttr = document.createAttribute("width");
      txtWidthAttr.nodeValue = this.canvasWidth;
      var txtHeightAttr = document.createAttribute("height");
      txtHeightAttr.nodeValue = this.canvasHeight;
      this.txtCanvas.setAttributeNode(txtWidthAttr);
      this.txtCanvas.setAttributeNode(txtHeightAttr);
    },
    renderImage(image) {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.ctx.drawImage(image, 0, 0, this.canvasWidth, this.canvasHeight);
    },
    renderText() {
      this.txtCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      this.txtCtx.font = this.font;

      this.txtCtx.fillStyle = this.form.color;

      this.txtCtx.globalAlpha = this.form.globalAlpha / 100;
      // 设置垂直对齐方式
      this.txtCtx.textAlign = "left";
      this.txtCtx.textBaseline = "top";

      this.txtCtx.translate(this.position.center.x, this.position.center.y);
      this.txtCtx.rotate((Math.PI / 180) * this.form.rotateAngle);

      for (let index = 0; index < this.position.points.length; index++) {
        const position = this.position.points[index];
        this.txtCtx.fillText(this.form.text, position.x, position.y);
      }

      this.txtCtx.rotate((Math.PI / 180) * this.form.rotateAngle * -1);
      this.txtCtx.translate(
        this.position.center.x * -1,
        this.position.center.y * -1
      );
    },
    handleExpandSuccess() {
      this.exportButtonStyle.position = "unset";
      this.exportButtonStyle.paddingTop = "unset";
    },
    reRender() {
      if (this.sourceImage) {
        this.canvasWidth = this.$refs.divCanvas.clientWidth - 50;

        this.initCanvas(this.sourceImage);
        this.renderImage(this.sourceImage);
        this.renderText();
      }
    },
    handleExportImage() {
      try {
        if (!this.sourceImage) {
          throw "请选择需要添加水印的图片";
        }

        if (!this.form.text) {
          throw "请输入需要添加的水印内容";
        }
        this.$spin.show({
          render: (h) => {
            return h("div", [
              h("Icon", {
                class: "demo-spin-icon-load",
                props: {
                  type: "ios-loading",
                  size: 18,
                },
              }),
              h("div", "生成图片中..."),
            ]);
          },
        });

        setTimeout(() => {
          this.renderExportImage();
        }, 800);
      } catch (error) {
        this.$notice.error({
          title: "导出失败",
          desc: error,
        });
      } finally {
      }
    },
    renderExportImage() {
      const imageWidth = this.sourceImage.width;
      const imageHeight = this.sourceImage.height;

      let canvas = document.createElement("canvas");
      var imageWidthAttr = document.createAttribute("width");
      imageWidthAttr.nodeValue = imageWidth;

      var imageHeightAttr = document.createAttribute("height");
      imageHeightAttr.nodeValue = imageHeight;
      canvas.setAttributeNode(imageWidthAttr);
      canvas.setAttributeNode(imageHeightAttr);

      let ctx = canvas.getContext("2d");
      ctx.drawImage(this.sourceImage, 0, 0, imageWidth, imageHeight);

      let txtCanvas = document.createElement("canvas");
      let txtWidthAttr = document.createAttribute("width");
      txtWidthAttr.nodeValue = imageWidth;

      var txtHeightAttr = document.createAttribute("height");
      txtHeightAttr.nodeValue = imageHeight;
      txtCanvas.setAttributeNode(txtWidthAttr);
      txtCanvas.setAttributeNode(txtHeightAttr);

      let txtCtx = txtCanvas.getContext("2d");
      const scale = imageWidth / this.canvasWidth;
      console.log(scale);
      txtCtx.scale(scale, scale);

      txtCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      txtCtx.font = this.font;

      txtCtx.fillStyle = this.form.color;

      txtCtx.globalAlpha = this.form.globalAlpha / 100;
      // 设置垂直对齐方式
      txtCtx.textAlign = "left";
      txtCtx.textBaseline = "top";
      txtCtx.translate(this.position.center.x, this.position.center.y);
      txtCtx.rotate((Math.PI / 180) * this.form.rotateAngle);
      for (let index = 0; index < this.position.points.length; index++) {
        const position = this.position.points[index];
        txtCtx.fillText(this.form.text, position.x, position.y);
      }
      txtCtx.rotate((Math.PI / 180) * this.form.rotateAngle * -1);
      txtCtx.translate(
        this.position.center.x * -1,
        this.position.center.y * -1
      );
      ctx.drawImage(txtCanvas, 0, 0);
      let image = canvas2Image(canvas, this.sourceFile.type);
      downLoadImage(image, this.sourceFile.fileName);
      this.$spin.hide();
      try {
        utools.showMainWindow();
      } catch (error) {}
    },
    renderText2Image() {
      let canvas = document.createElement("canvas");
      var imageWidthAttr = document.createAttribute("width");
      imageWidthAttr.nodeValue = this.txtWidth;

      var imageHeightAttr = document.createAttribute("height");
      imageHeightAttr.nodeValue = this.form.fontSize;
      canvas.setAttributeNode(imageWidthAttr);
      canvas.setAttributeNode(imageHeightAttr);

      let ctx = canvas.getContext("2d");

      ctx.font = this.font;
      ctx.fillStyle = this.form.color;

      ctx.globalAlpha = this.form.globalAlpha / 100;
      // 设置垂直对齐方式
      ctx.textAlign = "left";
      ctx.textBaseline = "top";

      ctx.fillText(this.form.text, 0, 0);
      let image = canvas2Image(canvas, this.sourceFile.type);

      return image;
    },
  },
  watch: {
    form: {
      handler(val) {
        this.renderText();
      },
      deep: true,
      immediate: false,
    },
  },
  computed: {
    font() {
      return this.form.fontSize + "px " + this.form.fontType;
    },
    position() {
      let points = [];
      let center = undefined;

      //top left
      if (this.form.type == 1) {
        center = { x: 0, y: 0 };

        let pos = {
          x: this.form.portraitSpacing,
          y: this.form.horizontalSpacing,
        };
        points.push(pos);
      }

      // middle left
      if (this.form.type == 2) {
        center = { x: 0, y: this.canvasHeight / 2 };
        let pos = {
          x: this.form.portraitSpacing,
          y: this.form.horizontalSpacing - this.form.fontSize / 2,
        };
        points.push(pos);
      }

      // bottom left
      if (this.form.type == 3) {
        center = { x: 0, y: this.canvasHeight };

        let pos = {
          x: this.form.portraitSpacing,
          y: (this.form.horizontalSpacing + this.form.fontSize) * -1,
        };
        points.push(pos);
      }

      //top right
      if (this.form.type == 4) {
        center = { x: this.canvasWidth, y: 0 };

        let pos = {
          x: (this.form.portraitSpacing + this.txtWidth) * -1,
          y: this.form.horizontalSpacing,
        };
        points.push(pos);
      }

      // middle right
      if (this.form.type == 5) {
        center = { x: this.canvasWidth, y: this.canvasHeight / 2 };

        let pos = {
          x: (this.form.portraitSpacing + this.txtWidth) * -1,
          y: this.form.horizontalSpacing - this.form.fontSize / 2,
        };
        points.push(pos);
      }

      // bottom right
      if (this.form.type == 6) {
        center = { x: this.canvasWidth, y: this.canvasHeight };

        let pos = {
          x: (this.form.portraitSpacing + this.txtWidth) * -1,
          y: (this.form.horizontalSpacing + this.form.fontSize) * -1,
        };
        points.push(pos);
      }

      // center top
      if (this.form.type == 7) {
        center = { x: this.canvasWidth / 2, y: 0 };

        let pos = {
          x: this.form.portraitSpacing - this.txtWidth / 2,
          y: this.form.horizontalSpacing,
        };

        points.push(pos);
      }

      // center middle
      if (this.form.type == 8) {
        center = { x: this.canvasWidth / 2, y: this.canvasHeight / 2 };

        let pos = {
          x: this.form.portraitSpacing - this.txtWidth / 2,
          y: this.form.horizontalSpacing - this.form.fontSize / 2,
        };
        points.push(pos);
      }

      // center bottom
      if (this.form.type == 9) {
        center = { x: this.canvasWidth / 2, y: this.canvasHeight };

        let pos = {
          x: this.form.portraitSpacing - this.txtWidth / 2,
          y: (this.form.horizontalSpacing + this.form.fontSize) * -1,
        };

        points.push(pos);
      }

      // all
      if (this.form.type == 10) {
        center = { x: this.canvasWidth / 2, y: this.canvasHeight / 2 };
        const txtWidth = this.txtWidth + this.form.portraitSpacing;
        const txtHeight = this.form.fontSize + this.form.horizontalSpacing;

        var length =
          Math.sqrt(
            Math.pow(this.canvasWidth, 2) + Math.pow(this.canvasHeight, 2)
          ) / 2;

        let posY = length * -1;
        while (posY < length) {
          let posX = length * -1;
          while (posX < length) {
            points.push({ x: posX, y: posY });
            posX += txtWidth;
          }
          posY += txtHeight;
        }
      }

      return {
        points: points,
        center: center,
      };
    },
    txtWidth() {
      return getTextWith(this.form.text, this.font);
    },
  },
  components: { ShowMore },
};
</script>

<style>
.canvas-wrapper {
  /* position: relative; */
  width: 100%;
  height: 100%;
  padding-left: 50px;
}

.canvas {
  position: absolute;
}

.ivu-select {
  width: 100% !important;
}
</style>