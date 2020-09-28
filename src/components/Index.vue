<template>
  <div id="app-container">
    <Tabs active-key="icon" @on-click="handleTabClick">
      <Tab-pane label="图标水印" key="icon">
        <water-mark-icon ref="icon"></water-mark-icon>
      </Tab-pane>
      <Tab-pane label="文字水印" key="text">
        <water-mark-text ref="text"></water-mark-text>
      </Tab-pane>
    </Tabs>
  </div>
</template>

<script>
import WaterMarkText from "@/components/components/WaterMarkText";
import WaterMarkIcon from "@/components/components/WaterMarkIcon";
export default {
  data() {
    return {
      activeKey: 0,
    };
  },
  mounted() {
    window.onresize = this.resize;

    var filse=utools.showOpenDialog({
      filters: [{ name: "plugin.json", extensions: ["json"] }],
      properties: ["openFile"],
    });
    console.log(filse)
  },
  methods: {
    resize() {
      console.log("res");
      this.$refs.icon.reRender();
      this.$refs.text.reRender();
    },

    handleTabClick(key) {
      this.activeKey = key;
    },
  },
  components: { WaterMarkText, WaterMarkIcon },
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