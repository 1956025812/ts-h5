<template>
  <div class="demo-split">
    <Split v-model="leftRightSplit" mode="horizontal" min="325px">
      <div slot="left" class="demo-split-pane">Left Pane</div>
      <div slot="right" class="demo-split-pane">
        <!-- <div>分类TODO</div> -->
        <!-- <Divider /> -->
        <div>查询列表</div>
      </div>
    </Split>
  </div>
</template>
  

<script>
import { setToken, getToken, removeArrayElement } from "@/libs/util.js";
export default {
  components: {},
  data() {
    return {
      leftRightSplit: 0.2
    };
  },

  methods: {},

  /**
   * 初始化页面 页面加载的时候执行
   */
  created() {}
};
</script>

<style>
.demo-split {
  height: 100%;
  border: 1px solid #dcdee2;
}
.demo-split-pane {
  padding: 10px;
}
</style>