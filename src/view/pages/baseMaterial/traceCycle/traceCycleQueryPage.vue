<template>
  <div>
    <!-- 查询条件 -->
    <Card :bordered="false" title="查询条件">
      <Row>
        <div style="display: inline;">
          环节代码：
          <Input v-model="cycleCode" style="width: 80px" />
        </div>
        <div style="display: inline; margin-left:30px;">
          环节中文名称：
          <Input v-model="cycleNameCn" style="width: 200px" />
        </div>
        <div style="display: inline; margin-left:30px;">
          环节英文名称：
          <Input v-model="cycleNameEn" style="width: 200px" />
        </div>
        <div style="display: inline;  margin-left:30px;">
          最后修改时间：
          <DatePicker
            v-model="updateTimeRange"
            type="datetimerange"
            style="width: 300px"
            format="yyyy-MM-dd HH:mm:ss"
            @on-change="updateTimeRange=$event"
          ></DatePicker>
        </div>
        <div style="display: inline; margin-left:30px;">
          <Button class="search-btn" @click="query" type="primary">
            <Icon type="search" />查询
          </Button>
          <Button class="reset-btn" @click="reset" type="primary" style="margin-left:10px;">
            <Icon type="search" />重置
          </Button>
        </div>
      </Row>
    </Card>
    <br />

    <!-- 操作按钮 -->
    <div>
      <Tooltip placement="top" content="新增">
        <TraceCycleAddPageComponent @parentReset="reset"></TraceCycleAddPageComponent>
      </Tooltip>
      <Tooltip placement="top" content="删除">
        <Button
          class="export-btn"
          style="border: none; appearance:none; margin-bottom: 5px;"
          @click="openDelTraceCycleBatchModal()"
        >
          <Icon type="md-close" size="25" />
        </Button>
      </Tooltip>
    </div>
    <br />

    <!-- 表格 -->
    <div>
      <Table
        ref="traceCycleTableRef"
        border
        :columns="columns"
        :data="traceCycleTableData"
        @on-select="selectRow"
        @on-select-cancel="cancelSelectRow"
        @on-select-all="selectAllRow"
        @on-select-all-cancel="cancelSelectAllRow"
      ></Table>
    </div>
    <br />

    <!-- 分页 -->
    <div style="float: right;">
      <Page
        :total="totalCount"
        :current="currentPage"
        :page-size="pageSize"
        show-total
        show-elevator
        show-sizer
        @on-change="changePage"
        @on-page-size-change="changePageSize"
      ></Page>
    </div>

    <!-- 修改系统详情弹窗子组件 -->
    <TraceCycleEditPageComponent
      ref="TraceCycleEditPageComponentRef"
      style="display:none"
      @parentReset="reset"
    ></TraceCycleEditPageComponent>

    <!-- 操作日志列表弹窗子组件 -->
    <BaseOperateLogPageComponent ref="BaseOperateLogPageComponentRef" style="display:none"></BaseOperateLogPageComponent>
  </div>
</template>
  

<script>
import TraceCycleAddPageComponent from "_p/baseMaterial/traceCycle/traceCycleAddPage.vue";
import TraceCycleEditPageComponent from "_p/baseMaterial/traceCycle/traceCycleEditPage.vue";
import BaseOperateLogPageComponent from "_p/common/logger/baseOperateLogQueryPage.vue";
import { setToken, getToken, removeArrayElement } from "@/libs/util.js";
import {
  selectTraceCyclePageAPI,
  delTraceCycleAPI
} from "@/api/baseMaterial/traceCyclePage.js";

export default {
  components: {
    TraceCycleAddPageComponent,
    TraceCycleEditPageComponent,
    BaseOperateLogPageComponent
  },
  data() {
    return {
      // 初始化变量
      cycleCode: "",
      cycleNameCn: "",
      cycleNameEn: "",
      updateTimeRange: "",
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      selectRowTcids: [],

      columns: [
        {
          type: "selection",
          key: "id",
          width: 50,
          align: "center"
        },
        {
          title: "序号",
          type: "index",
          width: 80,
          align: "center"
        },
        {
          title: "环节代码",
          key: "cycleCode",
          align: "center"
        },
        {
          title: "环节中文名称",
          key: "cycleNameCn",
          align: "center"
        },
        {
          title: "环节英文名称",
          key: "cycleNameEn",
          align: "center"
        },
        {
          title: "环节用途描述",
          key: "remark",
          align: "center"
        },
        {
          title: "最后修改人",
          key: "updateBy",
          align: "center"
        },
        {
          title: "最后修改时间",
          key: "updateTime",
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      // 在父组件中通过ref调用子组件的方法
                      this.$refs.TraceCycleEditPageComponentRef.openTraceCycleEditModal(
                        params.row.id
                      );
                    }
                  }
                },
                "修改"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.openTraceCycleDelSingleModal(params.row);
                    }
                  }
                },
                "删除"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.$refs.BaseOperateLogPageComponentRef.openBaseOperateLogModal(
                        1, 
                        params.row.id
                      );
                    }
                  }
                },
                "查看日志"
              )
            ]);
          }
        }
      ],
      traceCycleTableData: []
    };
  },

  methods: {
    /**
     * 查询分页函数
     */
    queryTraceCyclePage(currentPage, pageSize) {
      let params = new Object();
      params.currentPage = currentPage;
      params.pageSize = pageSize;
      params.loginUid = getToken();
      params.cycleCode = this.cycleCode;
      params.cycleNameCn = this.cycleNameCn;
      params.cycleNameEn = this.cycleNameEn;
      if (this.updateTimeRange != null && this.updateTimeRange != "") {
        params.startTime = this.updateTimeRange.toString().split(",")[0];
        params.endTime = this.updateTimeRange.toString().split(",")[1];
      }

      selectTraceCyclePageAPI(params).then(res => {
        if (res.data.code == 1) {
          this.totalCount = res.data.data.totalCount;
          this.currentPage = res.data.data.currentPage;
          this.pageSize = res.data.data.pageSize;
          this.traceCycleTableData = res.data.data.items;

          // 处理复选框回显
          if (res.data.data.items.length > 0) {
            res.data.data.items.forEach(eachTraceCycle => {
              if (this.selectRowTcids.indexOf(eachTraceCycle.id) != -1) {
                eachTraceCycle._checked = true;
              }
            });
          }
        } else if (res.data.code == 0) {
          this.$Notice.error({
            desc: res.data.msg
          });
        }
      });
    },

    /**
     * 换页
     */
    changePage(currentPage) {
      this.$options.methods.queryTraceCyclePage.bind(this)(
        currentPage,
        this.pageSize
      );
    },

    /**
     * 更换每页显示数据量
     */
    changePageSize(pageSize) {
      this.$options.methods.queryTraceCyclePage.bind(this)(1, pageSize);
    },

    /**
     * 选中复选框
     */
    selectRow(selection, row) {
      if (this.selectRowTcids.indexOf(row.id) == -1) {
        this.selectRowTcids.push(row.id);
      }
    },

    /**
     * 取消选中复选框
     */
    cancelSelectRow(selection, row) {
      removeArrayElement(this.selectRowTcids, row.id);
    },

    /**
     * 全选
     */
    selectAllRow(selection) {
      selection.forEach(eachSelectedRow => {
        if (this.selectRowTcids.indexOf(eachSelectedRow.id) == -1) {
          this.selectRowTcids.push(eachSelectedRow.id);
        }
      });
    },

    /**
     * 取消全选
     */
    cancelSelectAllRow(selection) {
      this.traceCycleTableData.forEach(eachCurrenPageRow => {
        removeArrayElement(this.selectRowTcids, eachCurrenPageRow.id);
      });
    },

    /**
     * 查询按钮查询
     */
    query() {
      this.selectRowTcids = [];
      this.$options.methods.queryTraceCyclePage.bind(this)(1, 10);
    },

    /**
     * 重置查询条件
     */
    reset() {
      this.cycleCode = "";
      this.cycleNameCn = "";
      this.cycleNameEn = "";
      this.updateTimeRange = "";
      this.selectRowTcids = [];
      this.$options.methods.queryTraceCyclePage.bind(this)(1, 10);
    },

    /**
     * 删除单条轨迹环节
     */
    openTraceCycleDelSingleModal(row) {
      this.$Modal.confirm({
        title: "删除轨迹环节",
        content: "确认删除轨迹环节【" + row.cycleNameCn + "】么？",
        onOk: () => {
          let params = new Object();
          params.loginUid = getToken;
          params.id = row.id;
          delTraceCycleAPI(params).then(res => {
            if (res.data.code == 1) {
              this.$Notice.success({
                desc: res.data.msg
              });
              this.reset();
            } else if (res.data.code == 0) {
              this.$Notice.error({
                desc: res.data.msg
              });
            }
          });
        }
      });
    },

    /**
     * 批量删除
     */
    openDelTraceCycleBatchModal() {
      if (this.selectRowTcids.length == 0) {
        this.$Notice.warning({
          title: "请选中要删除的记录后再进行删除操作"
        });
        return;
      }

      this.$Modal.confirm({
        title: "批量删除轨迹环节",
        content: "确认要批量删除这些轨迹环节么？",
        onOk: () => {
          let params = new Object();
          params.loginUid = getToken;
          params.tcids = this.selectRowTcids;
          delTraceCycleAPI(params).then(res => {
            if (res.data.code == 1) {
              this.$Notice.success({
                desc: res.data.msg
              });
              this.reset();
            } else if (res.data.code == 0) {
              this.$Notice.error({
                desc: res.data.msg
              });
            }
          });
        }
      });
    }
  },

  /**
   * 初始化页面 页面加载的时候执行
   */
  created() {
    this.$options.methods.queryTraceCyclePage.bind(this)(
      this.currentPage,
      this.pageSize
    );
  }
};
</script>
