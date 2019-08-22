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
          节点代码：
          <Input v-model="nodeCode" style="width: 80px" />
        </div>
        <div style="display: inline; margin-left:30px;">
          节点中文名称：
          <Input v-model="nodeNameCn" style="width: 150px" />
        </div>
        <div style="display: inline; margin-left:30px;">
          节点英文名称：
          <Input v-model="nodeNameEn" style="width: 150px" />
        </div>
        <div style="display: inline;  margin-left:30px;">
          最后修改时间：
          <DatePicker
            v-model="updateTimeRange"
            type="datetimerange"
            style="width: 280px"
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
        <TraceNodeAddPageComponent @parentReset="reset"></TraceNodeAddPageComponent>
      </Tooltip>
      <Tooltip placement="top" content="删除">
        <Button
          class="export-btn"
          style="border: none; appearance:none; margin-bottom: 5px;"
          @click="openDelTraceNodeBatchModal()"
        >
          <Icon type="md-close" size="25" />
        </Button>
      </Tooltip>
    </div>
    <br />

    <!-- 表格 -->
    <div>
      <Table
        ref="traceNodeTableRef"
        border
        :columns="columns"
        :data="traceNodeTableData"
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
    <TraceNodeEditPageComponent
      ref="TraceNodeEditPageComponentRef"
      style="display:none"
      @parentReset="reset"
    ></TraceNodeEditPageComponent>
  </div>
</template>
  

<script>
import TraceNodeAddPageComponent from "_p/baseMaterial/traceNode/traceNodeAddPage.vue";
import TraceNodeEditPageComponent from "_p/baseMaterial/traceNode/traceNodeEditPage.vue";
import { setToken, getToken, removeArrayElement } from "@/libs/util.js";
import {
  selectTraceNodePageAPI,
  delTraceNodeAPI
} from "@/api/baseMaterial/traceNodePage.js";

export default {
  components: {
    TraceNodeAddPageComponent,
    TraceNodeEditPageComponent
  },
  data() {
    return {
      // 初始化变量
      cycleCode: "",
      nodeCode: "",
      nodeNameCn: "",
      nodeNameEn: "",
      updateTimeRange: "",
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      selectRowTnids: [],

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
          title: "节点代码",
          key: "nodeCode",
          align: "center"
        },
        {
          title: "环节代码",
          key: "cycleCode",
          align: "center"
        },
        {
          title: "节点中文名称",
          key: "nodeNameCn",
          align: "center"
        },
        {
          title: "节点英文名称",
          key: "nodeNameEn",
          align: "center"
        },
        {
          title: "节点用途描述",
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
          width: 250,
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
                      this.$refs.TraceNodeEditPageComponentRef.openTraceNodeEditModal(
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
                      this.openTraceNodeDelSingleModal(params.row);
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
                      alert("查看日志");
                    }
                  }
                },
                "查看日志"
              )
            ]);
          }
        }
      ],
      traceNodeTableData: []
    };
  },

  methods: {
    /**
     * 查询分页函数
     */
    queryTraceNodePage(currentPage, pageSize) {
      let params = new Object();
      params.currentPage = currentPage;
      params.pageSize = pageSize;
      params.loginUid = getToken();
      params.cycleCode = this.cycleCode;
      params.nodeCode = this.nodeCode;
      params.nodeNameCn = this.nodeNameCn;
      params.nodeNameEn = this.nodeNameEn;
      if (this.updateTimeRange != null && this.updateTimeRange != "") {
        params.startTime = this.updateTimeRange.toString().split(",")[0];
        params.endTime = this.updateTimeRange.toString().split(",")[1];
      }

      selectTraceNodePageAPI(params).then(res => {
        if (res.data.code == 1) {
          this.totalCount = res.data.data.totalCount;
          this.currentPage = res.data.data.currentPage;
          this.pageSize = res.data.data.pageSize;
          this.traceNodeTableData = res.data.data.items;

          // 处理复选框回显
          if (res.data.data.items.length > 0) {
            res.data.data.items.forEach(eachTraceNode => {
              if (this.selectRowTnids.indexOf(eachTraceNode.id) != -1) {
                eachTraceNode._checked = true;
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
      this.$options.methods.queryTraceNodePage.bind(this)(
        currentPage,
        this.pageSize
      );
    },

    /**
     * 更换每页显示数据量
     */
    changePageSize(pageSize) {
      this.$options.methods.queryTraceNodePage.bind(this)(1, pageSize);
    },

    /**
     * 选中复选框
     */
    selectRow(selection, row) {
      if (this.selectRowTnids.indexOf(row.id) == -1) {
        this.selectRowTnids.push(row.id);
      }
    },

    /**
     * 取消选中复选框
     */
    cancelSelectRow(selection, row) {
      removeArrayElement(this.selectRowTnids, row.id);
    },

    /**
     * 全选
     */
    selectAllRow(selection) {
      selection.forEach(eachSelectedRow => {
        if (this.selectRowTnids.indexOf(eachSelectedRow.id) == -1) {
          this.selectRowTnids.push(eachSelectedRow.id);
        }
      });
    },

    /**
     * 取消全选
     */
    cancelSelectAllRow(selection) {
      this.traceCycleTableData.forEach(eachCurrenPageRow => {
        removeArrayElement(this.selectRowTnids, eachCurrenPageRow.id);
      });
    },

    /**
     * 查询按钮查询
     */
    query() {
      this.selectRowTnids = [];
      this.$options.methods.queryTraceNodePage.bind(this)(1, 10);
    },

    /**
     * 重置查询条件
     */
    reset() {
      this.cycleCode = "";
      this.nodeCode = "";
      this.nodeNameCn = "";
      this.nodeNameEn = "";
      this.updateTimeRange = "";
      this.selectRowTnids = [];
      this.$options.methods.queryTraceNodePage.bind(this)(1, 10);
    },

    /**
     * 删除单条轨迹环节
     */
    openTraceNodeDelSingleModal(row) {
      this.$Modal.confirm({
        title: "删除轨迹节点",
        content: "确认删除轨迹节点【" + row.nodeNameCn + "】么？",
        onOk: () => {
          let params = new Object();
          params.loginUid = getToken;
          params.id = row.id;
          delTraceNodeAPI(params).then(res => {
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
    openDelTraceNodeBatchModal() {
      if (this.selectRowTnids.length == 0) {
        this.$Notice.warning({
          title: "请选中要删除的记录后再进行删除操作"
        });
        return;
      }

      this.$Modal.confirm({
        title: "批量删除轨迹节点",
        content: "确认要批量删除这些轨迹节点么？",
        onOk: () => {
          let params = new Object();
          params.loginUid = getToken;
          params.tnids = this.selectRowTnids;
          delTraceNodeAPI(params).then(res => {
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
    this.$options.methods.queryTraceNodePage.bind(this)(
      this.currentPage,
      this.pageSize
    );
  }
};
</script>
