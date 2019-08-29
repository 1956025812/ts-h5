<template>
  <div class="demo-split">
    <Split v-model="leftRightSplit" mode="horizontal" min="325px">
      <div slot="left" class="demo-split-pane">
        <div>
          <Input
            type="textarea"
            :autosize="{minRows: 30,maxRows: 30}"
            placeholder="请输入单号，用逗号分隔，最多50个"
          ></Input>
        </div>
        <div>
          <div style="width:100%;">
            <h3 style="text-align:left">还可以输入30个单号</h3>
          </div>
        </div>
        <br />
        <div style="width:100%">
          <Button type="primary" size="large" style="width:130px; margin-left: 10px">清空</Button>
          <Button type="primary" size="large" style="width:130px; margin-left: 10px">查询</Button>
        </div>
      </div>
      <div slot="right" class="demo-split-pane">
        <div>分类TODO</div>
        <Divider />
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