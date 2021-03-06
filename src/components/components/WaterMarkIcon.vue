<template>
  <div id="tab-container">
    <Row>
      <Col span="24">
        <Upload
          multiple
          type="drag"
          :format="['jpg', 'jpeg', 'png']"
          action
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
          <FormItem label="水印图片">
            <Upload
              ref="upload"
              :show-upload-list="false"
              :format="['jpg', 'jpeg', 'png']"
              :max-size="2048"
              type="drag"
              action=""
              style="display: inline-block; width: 30px; margin-right: 20px"
              :before-upload="handleBeforeIconUpload"
            >
              <div style="width: 30px; height: 30px; line-height: 35px">
                <Icon type="md-images" size="20"></Icon>
              </div>
            </Upload>
            <br />
            <img v-show="form.icon" height="60" ref="iconPrev" />
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
          <FormItem label="水印大小">
            <Slider
              v-model="form.iconSize"
              :max="200"
              :min="20"
              :step="5"
            ></Slider>
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
          :style="{ height: canvasHeight + 'px' }"
        >
          <canvas ref="imageCanvas" class="canvas"></canvas>
          <canvas ref="iconCanvas" class="canvas"></canvas>
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
      iconCanvas: undefined,
      iconCtx: undefined,
      sourceImage: undefined,
      sourceFile: {
        fileName: undefined,
        fileType: undefined,
      },
      form: {
        iconSize: 50,
        globalAlpha: 100,
        type: 1,
        portraitSpacing: 20,
        horizontalSpacing: 20,
        rotateAngle: 0,
        icon: undefined,
      },
      canvasWidth: 500,
      canvasHeight: 200,
      exportButtonStyle: {
        width: "100%",
        textAlign: "center",
        paddingTop: "10px",
      },
      spinTxt: "生成图片中...",
      showSpin: false,
    };
  },
  mounted: function () {
    this.canvas = this.$refs.imageCanvas;
    this.ctx = this.canvas.getContext("2d");

    this.iconCanvas = this.$refs.iconCanvas;
    this.iconCtx = this.iconCanvas.getContext("2d");

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
        this.renderIcon();

        try {
          utools.showMainWindow();
        } catch (error) {}
      });
      return false;
    },
    handleBeforeIconUpload(file) {
      fileToImage(file).then((image) => {
        this.form.icon = image;

        this.$refs.iconPrev.src = image.src;

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

      var iconWidthAttr = document.createAttribute("width");
      iconWidthAttr.nodeValue = this.canvasWidth;
      var iconHeightAttr = document.createAttribute("height");
      iconHeightAttr.nodeValue = this.canvasHeight;
      this.iconCanvas.setAttributeNode(iconWidthAttr);
      this.iconCanvas.setAttributeNode(iconHeightAttr);
    },
    renderImage(image) {
      this.ctx.drawImage(image, 0, 0, this.canvasWidth, this.canvasHeight);
    },
    renderIcon() {
      this.iconCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      if (this.form.icon) {
        this.iconCtx.globalAlpha = this.form.globalAlpha / 100;

        this.iconCtx.translate(this.position.center.x, this.position.center.y);
        this.iconCtx.rotate((Math.PI / 180) * this.form.rotateAngle);

        for (let index = 0; index < this.position.points.length; index++) {
          const position = this.position.points[index];
          this.iconCtx.drawImage(
            this.form.icon,
            position.x,
            position.y,
            this.iconSize.width,
            this.iconSize.height
          );
        }

        this.iconCtx.rotate((Math.PI / 180) * this.form.rotateAngle * -1);
        this.iconCtx.translate(
          this.position.center.x * -1,
          this.position.center.y * -1
        );
      }
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
        this.renderIcon();
      }
    },
    handleExportImage() {
      try {
        if (!this.sourceImage) {
          throw "请选择需要添加水印的图片";
        }

        if (!this.form.icon) {
          throw "请选择需要添加的水印图片";
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
      const proportion = imageWidth / this.canvasWidth;
      ctx.globalAlpha = this.form.globalAlpha / 100;

      ctx.translate(
        this.position.center.x * proportion,
        this.position.center.y * proportion
      );
      ctx.rotate((Math.PI / 180) * this.form.rotateAngle);

      for (let index = 0; index < this.position.points.length; index++) {
        const position = this.position.points[index];
        ctx.drawImage(
          this.form.icon,
          position.x * proportion,
          position.y * proportion,
          this.iconSize.width * proportion,
          this.iconSize.height * proportion
        );
      }
      ctx.rotate((Math.PI / 180) * this.form.rotateAngle * -1);
      ctx.translate(
        this.position.center.x * proportion * -1,
        this.position.center.y * proportion * -1
      );
      let image = canvas2Image(canvas, this.sourceFile.type);
      downLoadImage(image, this.sourceFile.fileName);
      this.$spin.hide();
      try {
        utools.showMainWindow();
      } catch (error) {}
    },
  },
  watch: {
    form: {
      handler(val) {
        this.renderIcon();
      },
      deep: true,
      immediate: false,
    },
  },
  computed: {
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
          y: this.form.horizontalSpacing - this.iconSize.height / 2,
        };
        points.push(pos);
      }

      // bottom left
      if (this.form.type == 3) {
        center = { x: 0, y: this.canvasHeight };

        let pos = {
          x: this.form.portraitSpacing,
          y: (this.form.horizontalSpacing + this.iconSize.height) * -1,
        };
        points.push(pos);
      }

      //top right
      if (this.form.type == 4) {
        center = { x: this.canvasWidth, y: 0 };

        let pos = {
          x: (this.form.portraitSpacing + this.iconSize.width) * -1,
          y: this.form.horizontalSpacing,
        };
        points.push(pos);
      }

      // middle right
      if (this.form.type == 5) {
        center = { x: this.canvasWidth, y: this.canvasHeight / 2 };

        let pos = {
          x: (this.form.portraitSpacing + this.iconSize.width) * -1,
          y: this.form.horizontalSpacing - this.iconSize.height / 2,
        };
        points.push(pos);
      }

      // bottom right
      if (this.form.type == 6) {
        center = { x: this.canvasWidth, y: this.canvasHeight };

        let pos = {
          x: (this.form.portraitSpacing + this.iconSize.width) * -1,
          y: (this.form.horizontalSpacing + this.iconSize.height) * -1,
        };
        points.push(pos);
      }

      // center top
      if (this.form.type == 7) {
        center = { x: this.canvasWidth / 2, y: 0 };

        let pos = {
          x: this.form.portraitSpacing - this.iconSize.width / 2,
          y: this.form.horizontalSpacing,
        };

        points.push(pos);
      }

      // center middle
      if (this.form.type == 8) {
        center = { x: this.canvasWidth / 2, y: this.canvasHeight / 2 };

        let pos = {
          x: this.form.portraitSpacing - this.iconSize.width / 2,
          y: this.form.horizontalSpacing - this.iconSize.height / 2,
        };
        points.push(pos);
      }

      // center bottom
      if (this.form.type == 9) {
        center = { x: this.canvasWidth / 2, y: this.canvasHeight };

        let pos = {
          x: this.form.portraitSpacing - this.iconSize.width / 2,
          y: (this.form.horizontalSpacing + this.iconSize.height) * -1,
        };

        points.push(pos);
      }

      // all
      if (this.form.type == 10) {
        center = { x: this.canvasWidth / 2, y: this.canvasHeight / 2 };
        const iconWidth = this.iconSize.width + this.form.portraitSpacing;
        const iconHeight = this.iconSize.height + this.form.horizontalSpacing;

        var length =
          Math.sqrt(
            Math.pow(this.canvasWidth, 2) + Math.pow(this.canvasHeight, 2)
          ) / 2;

        let posY = length * -1;
        while (posY < length) {
          let posX = length * -1;
          while (posX < length) {
            points.push({ x: posX, y: posY });
            posX += iconWidth;
          }
          posY += iconHeight;
        }
      }

      return {
        points: points,
        center: center,
      };
    },
    iconSize() {
      let size = {
        width: this.form.iconSize,
        height: this.form.iconSize,
      };

      const icon = this.form.icon;
      if (!icon) {
        return false;
      }

      if (icon.width > icon.height) {
        const percent = icon.width / icon.height;
        size.height = size.width / percent;
      } else {
        const percent = icon.height / icon.width;
        size.width = size.height / percent;
      }

      return size;
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