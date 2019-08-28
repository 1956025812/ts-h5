<template>
  <div>
    <!-- 查询条件 -->
    <Card :bordered="false" title="查询条件">
      <Row>
        <div style="display: inline;">
          映射编号：
          <Input v-model="relationNo" style="width: 200px" />
        </div>
        <div style="display: inline; margin-left:30px;">
          物流商：
          <Input v-model="logisticsAgentCode" style="width: 200px" />
        </div>
        <div style="display: inline; margin-left:30px;">
          物流方式：
          <Input v-model="logisticsMethodCode" style="width: 200px" />
        </div>
        <div style="display: inline; margin-left:30px;">
          结果-标准轨迹代码：
          <Input v-model="standardTraceCode" style="width: 200px" />
        </div>
      </Row>
      <br />
      <Row>
        <div style="display: inline;">
          条件-描述：
          <Input v-model="conditionDesc" style="width: 600px" />
        </div>
        <div style="display: inline;  margin-left:30px;">
          修改时间：
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
        <TraceOriginalStandardAddPageComponent @parentReset="reset"></TraceOriginalStandardAddPageComponent>
      </Tooltip>
      <Tooltip placement="top" content="删除">
        <Button
          class="export-btn"
          style="border: none; appearance:none; margin-bottom: 5px;"
          @click="openDelTraceOriginalStandardBatchModal()"
        >
          <Icon type="md-close" size="25" />
        </Button>
      </Tooltip>
    </div>
    <br />

    <!-- 表格 -->
    <div>
      <Table
        ref="traceOriginalStandardTableRef"
        border
        :columns="columns"
        :data="traceOriginalStandardTableData"
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
  </div>
</template>
  

<script>
import TraceOriginalStandardAddPageComponent from "_p/ruleConfig/traceOriginalStandard/traceOriginalStandardAddPage.vue";
import { setToken, getToken, removeArrayElement } from "@/libs/util.js";
import {
  selectTraceOriginalStandardPageAPI,
  delTraceOriginalStandardAPI
} from "@/api/ruleConfig/traceOriginalStandardPage.js";

export default {
  components: { TraceOriginalStandardAddPageComponent },
  data() {
    return {
      // 初始化变量
      relationNo: "",
      logisticsAgentCode: "",
      logisticsMethodCode: "",
      conditionDesc: "",
      standardTraceCode: "",
      updateTimeRange: "",
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      selectRowTosids: [],

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
          title: "SH映射编号",
          key: "relationNo",
          align: "center"
        },
        {
          title: "物流商",
          key: "logisticsAgentCode",
          align: "center"
        },
        {
          title: "物流方式代码",
          key: "logisticsMethodCode",
          align: "center"
        },
        {
          title: "物流方式名称",
          key: "logisticsMethodCode",
          align: "center"
        },
        {
          title: "条件描述",
          key: "conditionDesc",
          align: "center"
        },
        {
          title: "结果-标准轨迹代码",
          key: "standardTraceCode",
          align: "center"
        },
        {
          title: "最新修改人",
          key: "updateBy",
          align: "center"
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
                      alert("修改TODO");
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
                      this.openTraceOriginalStandardSingleModal(params.row);
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
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      alert("查看业务日志TODO");
                    }
                  }
                },
                "查看日志"
              )
            ]);
          }
        }
      ],
      traceOriginalStandardTableData: []
    };
  },

  methods: {
    /**
     * 查询分页函数
     */
    queryTraceOriginalStandardPage(currentPage, pageSize) {
      let params = new Object();
      params.currentPage = currentPage;
      params.pageSize = pageSize;
      params.loginUid = getToken();
      params.relationNo = this.relationNo;
      params.logisticsAgentCode = this.logisticsAgentCode;
      params.logisticsMethodCode = this.logisticsMethodCode;
      params.conditionDesc = this.conditionDesc;
      params.standardTraceCode = this.standardTraceCode;
      if (this.updateTimeRange != null && this.updateTimeRange != "") {
        params.startTime = this.updateTimeRange.toString().split(",")[0];
        params.endTime = this.updateTimeRange.toString().split(",")[1];
      }

      selectTraceOriginalStandardPageAPI(params).then(res => {
        if (res.data.code == 1) {
          this.totalCount = res.data.data.totalCount;
          this.currentPage = res.data.data.currentPage;
          this.pageSize = res.data.data.pageSize;
          this.traceOriginalStandardTableData = res.data.data.items;

          // 处理复选框回显
          if (res.data.data.items.length > 0) {
            res.data.data.items.forEach(eachTraceOriginalStandard => {
              if (
                this.selectRowTosids.indexOf(eachTraceOriginalStandard.id) != -1
              ) {
                eachTraceOriginalStandard._checked = true;
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
      this.$options.methods.queryTraceOriginalStandardPage.bind(this)(
        currentPage,
        this.pageSize
      );
    },

    /**
     * 更换每页显示数据量
     */
    changePageSize(pageSize) {
      this.$options.methods.queryTraceOriginalStandardPage.bind(this)(
        1,
        pageSize
      );
    },

    /**
     * 选中复选框
     */
    selectRow(selection, row) {
      if (this.selectRowTosids.indexOf(row.id) == -1) {
        this.selectRowTosids.push(row.id);
      }
    },

    /**
     * 取消选中复选框
     */
    cancelSelectRow(selection, row) {
      removeArrayElement(this.selectRowTosids, row.id);
    },

    /**
     * 全选
     */
    selectAllRow(selection) {
      selection.forEach(eachSelectedRow => {
        if (this.selectRowTosids.indexOf(eachSelectedRow.id) == -1) {
          this.selectRowTosids.push(eachSelectedRow.id);
        }
      });
    },

    /**
     * 取消全选
     */
    cancelSelectAllRow(selection) {
      this.traceOriginalStandardTableData.forEach(eachCurrenPageRow => {
        removeArrayElement(this.selectRowTosids, eachCurrenPageRow.id);
      });
    },

    /**
     * 查询按钮查询
     */
    query() {
      this.selectRowTosids = [];
      this.$options.methods.queryTraceOriginalStandardPage.bind(this)(1, 10);
    },

    /**
     * 重置查询条件
     */
    reset() {
      this.relationNo = "";
      this.logisticsAgentCode = "";
      this.logisticsMethodCode = "";
      this.conditionDesc = "";
      this.standardTraceCode = "";
      this.updateTimeRange = "";
      this.selectRowTosids = [];
      this.$options.methods.queryTraceOriginalStandardPage.bind(this)(1, 10);
    },

    /**
     * 删除单条原始轨迹标准轨迹映射
     */
    openTraceOriginalStandardSingleModal(row) {
      this.$Modal.confirm({
        title: "删除原始轨迹标准轨迹映射",
        content: "确认删除原始轨迹标准轨迹映射【" + row.relationNo + "】么？",
        onOk: () => {
          let params = new Object();
          params.loginUid = getToken;
          params.id = row.id;
          delTraceOriginalStandardAPI(params).then(res => {
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
     * 批量处理
     */
    openHandleTraceOriginalStandardBatchModal() {
      if (this.selectRowTosids.length == 0) {
        this.$Notice.warning({
          title: "请选中要处理的记录后再进行处理操作"
        });
        return;
      }

      this.$Modal.confirm({
        title: "批量处理待标准化轨迹",
        content: "确认要批量处理这些待标准化轨迹么？",
        onOk: () => {
          alert("批量处理待标准化轨迹TODO");
          this.reset();
        }
      });
    },

    /**
     * 批量删除
     */
    openDelTraceOriginalStandardBatchModal() {
      if (this.selectRowTosids.length == 0) {
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
          params.tosids = this.selectRowTosids;
          delTraceOriginalStandardAPI(params).then(res => {
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
    this.$options.methods.queryTraceOriginalStandardPage.bind(this)(
      this.currentPage,
      this.pageSize
    );
  }
};
</script>
