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
          <Button type="primary" size="large" style="width:130px; margin-left: 10px">查询</Button>
          <Button type="primary" size="large" style="width:130px; margin-left: 10px">清空</Button>
        </div>
      </div>
      <div slot="right" class="demo-split-pane">
        <div>
          <Tabs ref="stateChangeTabRef" value="name1" @on-click="changeTabStatus">
            <TabPane label="所有（0）" name="name1" />
            <TabPane label="查询不到（0）" name="name2" />
            <TabPane label="运输途中（0）" name="name3" />
            <TabPane label="投递失败（0）" name="name4" />
            <TabPane label="成功签收（0）" name="name5" />
            <TabPane label="可能异常（0）" name="name6" />
            <TabPane label="运输过久（0）" name="name7" />
          </Tabs>
        </div>
        <br />
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

  methods: {
    /**
     * 状态页签切换函数
     */
    changeTabStatus(name) {
      alert(name);
    }
  },

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