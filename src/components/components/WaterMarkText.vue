<template>
  <div id="tab-container">
    <Row>
      <Col span="24">
        <Upload
          multiple
          type="drag"
          action=""
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
            <Input
              v-model="water.text"
              placeholder="water mark text..."
            ></Input>
          </FormItem>
          <FormItem label="位置">
            <Select v-model="model1" style="width: 200px">
              <Option :value="1">左上</Option>
              <Option :value="2">左中</Option>
              <Option :value="3">左下</Option>
              <Option :value="4">右上</Option>
              <Option :value="5">右中</Option>
              <Option :value="6">右下</Option>
              <Option :value="7">中上</Option>
              <Option :value="8">中间</Option>
              <Option :value="9">右下</Option>
              <Option :value="10">铺满</Option>
            </Select>
          </FormItem>
          <FormItem label="字体大小">
            <Slider v-model="water.fontSize"></Slider>
          </FormItem>

          <FormItem label="字体颜色">
            <ColorPicker v-model="water.color" />
          </FormItem>

          <FormItem label="透明度">
            <Slider v-model="water.globalAlpha"></Slider>
          </FormItem>

          <FormItem label="旋转角度">
            <Slider
              v-model="water.position.route"
              :max="180"
              :min="-180"
              :step="5"
            ></Slider>
          </FormItem>
        </Form>
      </Col>
      <Col span="16">
        <div id="divCanvas" class="canvas-wrapper">
          <canvas id="imageCanvas" class="canvas"></canvas>
          <canvas id="textCanvas" class="canvas"></canvas>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
import { fileToImage } from "@/utils/imageUtil";
export default {
  data() {
    return {
      canvas: undefined,
      ctx: undefined,
      txtCanvas: undefined,
      txtCtx: undefined,
      sourceImage: undefined,
      water: {
        fontSize: 50,
        fontType: "Arial",
        text: "@renjilin.online",
        globalAlpha: 100,
        color: "#000000",
        position: {
          textAlign: "left",
          textBaseline: "top",
          x: 0,
          y: 0,
          route: 0,
        },
      },
      canvasWidth: 500,
      canvasHeight: 200,
    };
  },
  mounted: function () {
    this.canvas = document.getElementById("imageCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.txtCanvas = document.getElementById("textCanvas");
    this.txtCtx = this.txtCanvas.getContext("2d");
  },
  methods: {
    handleBeforeUpload(file) {
      fileToImage(file).then((image) => {
        this.sourceImage = image;
        this.renderImage(image);
      });
      return false;
    },
    renderImage(image) {
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

      this.ctx.drawImage(image, 0, 0, this.canvasWidth, this.canvasHeight);

      this.renderText();
    },
    renderText() {
      this.txtCtx.clearRect(0, 0, this.canvasWidth, this.canvasWidth);

      this.txtCtx.font = this.font;
      this.txtCtx.fillStyle = this.water.color;

      this.txtCtx.globalAlpha = this.water.globalAlpha / 100;
      // 设置垂直对齐方式
      this.txtCtx.textAlign = this.water.position.textAlign;
      this.txtCtx.textBaseline = this.water.position.textBaseline;

      const position = { ...this.water.position };

      var ox = this.txtCanvas.width / 2;
      var oy = this.txtCanvas.height / 2;
      this.txtCtx.rotate((Math.PI / 180) * position.route); // 弧度 = (Math.PI/180)*角度
      this.txtCtx.fillText(this.water.text, 0, 0);

      this.txtCtx.rotate((Math.PI / 180) * position.route * -1);
    },
  },
  watch: {
    water: {
      handler(val) {
        this.renderText();
      },
      deep: true,
      immediate: false,
    },
  },
  computed: {
    font() {
      return this.water.fontSize + "px " + this.water.fontType;
    },
  },
};
</script>

<style>
.canvas-wrapper {
  position: relative;
  width: 800px;
  height: 800px;
  padding-left: 50px;
}

.canvas {
  position: absolute;
}
</style>