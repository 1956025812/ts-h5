<template>
  <div>
    <!-- 查询条件 -->
    <Card :bordered="false" title="查询条件">
      <Row>
        <div style="display: inline;">
          物流主单号：
          <Input v-model="logisticsMainNo" style="width: 80px" />
        </div>
        <div style="display: inline; margin-left:30px;">
          服务商单号：
          <Input v-model="agentNo" style="width: 200px" />
        </div>
        <div style="display: inline; margin-left:30px;">
          物流产品代码：
          <Input v-model="logisticsProductCode" style="width: 200px" />
        </div>
        <div style="display: inline;  margin-left:30px;">
          创建时间：
          <DatePicker
            v-model="createTimeRange"
            type="datetimerange"
            style="width: 300px"
            format="yyyy-MM-dd HH:mm:ss"
            @on-change="createTimeRange=$event"
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
      <Tooltip placement="top" content="处理">
        <Button
          class="export-btn"
          style="border: none; appearance:none; margin-bottom: 5px;"
          @click="handleWaitStandardTrace()"
        >
          <Icon type="ios-construct" size="25" />
        </Button>
      </Tooltip>
      <Tooltip placement="top" content="删除">
        <Button
          class="export-btn"
          style="border: none; appearance:none; margin-bottom: 5px;"
          @click="openDelWaitStandardTraceBatchModal()"
        >
          <Icon type="md-close" size="25" />
        </Button>
      </Tooltip>
    </div>
    <br />

    <!-- 表格 -->
    <div>
      <Table
        ref="waitStandardTraceTableRef"
        border
        :columns="columns"
        :data="waitStandardTraceTableData"
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

    <!-- 操作日志列表弹窗子组件 -->
    <BaseOperateLogPageComponent ref="BaseOperateLogPageComponentRef" style="display:none"></BaseOperateLogPageComponent>
  </div>
</template>
  

<script>
import BaseOperateLogPageComponent from "_p/common/logger/baseOperateLogQueryPage.vue";
import { setToken, getToken, removeArrayElement } from "@/libs/util.js";
import {
  selectWaitStandardTracePageAPI,
  delWaitStandardTraceAPI
} from "@/api/operateMonitor/waitStandardTracePage.js";

export default {
  components: {
    BaseOperateLogPageComponent
  },
  data() {
    return {
      // 初始化变量
      logisticsMainNo: "",
      agentNo: "",
      logisticsProductCode: "",
      createTimeRange: "",
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      selectRowWstids: [],

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
          width: 70,
          align: "center"
        },
        {
          title: "物流主单号",
          key: "logisticsMainNo",
          align: "center"
        },
        {
          title: "客户参考号",
          key: "customerReferenceNo",
          align: "center"
        },
        {
          title: "服务商单号",
          key: "agentNo",
          align: "center"
        },
        {
          title: "物流产品代码",
          key: "logisticsProductCode",
          align: "center"
        },
        {
          title: "物流渠道代码",
          key: "logisticsChannelCode",
          align: "center"
        },
        {
          title: "原始轨迹代码",
          key: "originalTraceCode",
          align: "center"
        },
        {
          title: "原始轨迹描述",
          key: "originalTraceRemark",
          align: "center"
        },
        {
          title: "轨迹来源",
          key: "traceSource",
          align: "center"
        },
        {
          title: "轨迹生成人",
          key: "createBy",
          align: "center"
        },
        {
          title: "轨迹发生时间",
          key: "traceCreateTime",
          align: "center",
          width: "150"
        },
        {
          title: "创建时间",
          key: "createTime",
          align: "center",
          width: "150"
        },
        {
          title: "最后修改时间",
          key: "updateTime",
          align: "center",
          width: "150"
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: "200",
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
                      alert("处理TODO");
                    }
                  }
                },
                "处理"
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
                      this.openWaitStandardTraceSingleModal(params.row);
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
      waitStandardTraceTableData: []
    };
  },

  methods: {
    /**
     * 查询分页函数
     */
    queryWaitStandardTracePage(currentPage, pageSize) {
      let params = new Object();
      params.currentPage = currentPage;
      params.pageSize = pageSize;
      params.loginUid = getToken();
      params.logisticsMainNo = this.logisticsMainNo;
      params.agentNo = this.agentNo;
      params.logisticsProductCode = this.logisticsProductCode;
      if (this.createTimeRange != null && this.createTimeRange != "") {
        params.startTime = this.createTimeRange.toString().split(",")[0];
        params.endTime = this.createTimeRange.toString().split(",")[1];
      }

      selectWaitStandardTracePageAPI(params).then(res => {
        if (res.data.code == 1) {
          this.totalCount = res.data.data.totalCount;
          this.currentPage = res.data.data.currentPage;
          this.pageSize = res.data.data.pageSize;
          this.waitStandardTraceTableData = res.data.data.items;

          // 处理复选框回显
          if (res.data.data.items.length > 0) {
            res.data.data.items.forEach(eachWaitStandardTrace => {
              if (
                this.selectRowWstids.indexOf(eachWaitStandardTrace.id) != -1
              ) {
                eachWaitStandardTrace._checked = true;
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
      this.$options.methods.queryWaitStandardTracePage.bind(this)(
        currentPage,
        this.pageSize
      );
    },

    /**
     * 更换每页显示数据量
     */
    changePageSize(pageSize) {
      this.$options.methods.queryWaitStandardTracePage.bind(this)(1, pageSize);
    },

    /**
     * 选中复选框
     */
    selectRow(selection, row) {
      if (this.selectRowWstids.indexOf(row.id) == -1) {
        this.selectRowWstids.push(row.id);
      }
    },

    /**
     * 取消选中复选框
     */
    cancelSelectRow(selection, row) {
      removeArrayElement(this.selectRowWstids, row.id);
    },

    /**
     * 全选
     */
    selectAllRow(selection) {
      selection.forEach(eachSelectedRow => {
        if (this.selectRowWstids.indexOf(eachSelectedRow.id) == -1) {
          this.selectRowWstids.push(eachSelectedRow.id);
        }
      });
    },

    /**
     * 取消全选
     */
    cancelSelectAllRow(selection) {
      this.waitStandardTraceTableData.forEach(eachCurrenPageRow => {
        removeArrayElement(this.selectRowWstids, eachCurrenPageRow.id);
      });
    },

    /**
     * 查询按钮查询
     */
    query() {
      this.selectRowWstids = [];
      this.$options.methods.queryWaitStandardTracePage.bind(this)(1, 10);
    },

    /**
     * 重置查询条件
     */
    reset() {
      this.logisticsMainNo = "";
      this.agentNo = "";
      this.logisticsProductCode = "";
      this.createTimeRange = "";
      this.selectRowWstids = [];
      this.$options.methods.queryWaitStandardTracePage.bind(this)(1, 10);
    },

    /**
     * 删除单条待标准化轨迹
     */
    openWaitStandardTraceSingleModal(row) {
      this.$Modal.confirm({
        title: "删除待标准化轨迹",
        content: "确认删除待标准化轨迹【TODO】么？",
        onOk: () => {
          let params = new Object();
          params.loginUid = getToken;
          params.id = row.id;
          delWaitStandardTraceAPI(params).then(res => {
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
    openDelWaitStandardTraceBatchModal() {
      if (this.selectRowWstids.length == 0) {
        this.$Notice.warning({
          title: "请选中要删除的记录后再进行删除操作"
        });
        return;
      }

      this.$Modal.confirm({
        title: "批量删除待标准化轨迹",
        content: "确认要批量删除这些待标准化轨迹么？",
        onOk: () => {
          let params = new Object();
          params.loginUid = getToken;
          params.wstids = this.selectRowWstids;
          delWaitStandardTraceAPI(params).then(res => {
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
    this.$options.methods.queryWaitStandardTracePage.bind(this)(
      this.currentPage,
      this.pageSize
    );
  }
};
</script>
