<template>
  <div id="app-container">
    <Tabs active-key="key1">
      <Tab-pane label="图标水印" key="key1">
        <Button type="dashed" size="small">Dashed</Button>

        <div id="container"></div>
      </Tab-pane>
      <Tab-pane label="文字水印" key="key2">
        <water-mark-text></water-mark-text>
      </Tab-pane>
    </Tabs>

    <Spin fix v-if="showSpin">
      <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
      <div>图片生成中...</div>
    </Spin>
  </div>
</template>

<script>
var watermark = require("watermarkjs");
import { fileToImage } from "@/utils/imageUtil";
import WaterMarkText from "@/components/components/WaterMarkText";
export default {
  data() {
    return {
      imageFile: undefined,
      fontSize: 20,
      waterText: "renjilin.online",
      showSpin: false,
    };
  },
  methods: {
    handleWaterMark() {
      this.showSpin = true;
      watermark([this.imageFile])
        .image(
          watermark.text.lowerRight(this.waterText, this.fontSize, "#fff", 0.5)
        )
        .then((img) => {
          this.showSpin = false;
          document.getElementById("container").appendChild(img);
        });
    },
  },
  computed: {
    font() {
      return this.fontSize + "px Josefin Slab";
    },
  },
  components: { WaterMarkText },
};
</script>

<style>
#app-container {
  padding: 20px;
}
.ivu-form-item {
  padding: 0px 7px;
}
</style>