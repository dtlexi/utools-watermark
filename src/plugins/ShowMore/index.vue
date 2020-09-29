<template>
  <div class="more-contain" ref="moreContain" :style="moreStyle">
    <slot></slot>

    <div class="div-more" v-if="showMore">
      <a @click="more">
        <svg
          t="1601026058500"
          class="icon"
          viewBox="0 0 1536 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="7690"
          width="20"
          height="20"
        >
          <path
            d="M770.276 894.376c-7.207-0.004-14.026-1.65-20.107-4.587l-524.141-247.144c-24.854-11.72600001-36.07099999-42.699-25.109-69.337 10.962-26.512 40.021-38.55600001 64.814-26.83l504.54399999 237.902 504.54400001-238.028c24.854-11.72600001 53.915 0.383 64.814 26.893 10.96200001 26.575-0.254 57.611-25.109 69.273l-524.492 247.397c-5.81599999 2.81-12.64900001 4.455-19.864 4.462zM770.276 482.11c-7.207-0.004-14.026-1.65-20.107-4.587l-524.14099999-247.144c-24.854-11.853-36.071-42.89-25.10900001-69.4s40.021-38.55600001 64.814-26.894l504.54399999 238.028 504.54400001-238.028c24.854-11.663 53.915 0.319 64.81400001 26.894 10.96200001 26.575-0.254 57.612-25.10900001 69.337l-524.492 247.27c-5.837 2.883-12.70699999 4.575-19.969 4.59z"
            p-id="7691"
            fill="#3399ff"
          ></path>
        </svg>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      moreStyle: {
        maxHeight: undefined,
        overflow: "hidden",
      },
      acturalHeight: undefined,
      showMore: true,
    };
  },
  mounted: function () {
    this.acturalHeight = this.$refs.moreContain.clientHeight;
    if (this.$refs.moreContain.clientHeight > this.maxHeight) {
      this.moreStyle.maxHeight = this.maxHeight + "px";
    } else {
      this.showMore = false;
      this.moreStyle.overflow = "visible";
    }
  },
  methods: {
    more() {
      if (parseInt(this.moreStyle.maxHeight) == parseInt(this.acturalHeight)) {
        this.moreStyle.maxHeight = this.maxHeight + "px";
      } else {
        this.moreStyle.maxHeight = this.acturalHeight + "px";
      }
      this.showMore = false;
      this.moreStyle.overflow = "visible";
      this.$emit("expandSuccess");
    },
  },
  props: {
    maxHeight: {
      default: 200,
      type: Number,
    },
  },
};
</script>

<style>
/* .more-contain {
  overflow-y: hidden;
} */

.div-more {
  position: absolute;
  text-align: center;
  width: 100%;
  bottom: 0;
  height: 40px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0),
    #fff
  ); /*实现渐变效果，遮罩效果*/
}
.div-more a {
  text-decoration: none;
  color: #3399ff;
  display: inline-block;
  margin-top: 20px;
  font-size: 20px;
}
</style>