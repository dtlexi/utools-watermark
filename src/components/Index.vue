<template>
  <div id="app-container">
    <Tabs active-key="key1">
      <Tab-pane label="图标水印" key="key1">
        <water-mark-icon></water-mark-icon>
      </Tab-pane>
      <Tab-pane label="文字水印" key="key2">
        <water-mark-text></water-mark-text>
      </Tab-pane>
    </Tabs>
  </div>
</template>

<script>
import WaterMarkText from "@/components/components/WaterMarkText";
import WaterMarkIcon from "@/components/components/WaterMarkIcon";
export default {
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