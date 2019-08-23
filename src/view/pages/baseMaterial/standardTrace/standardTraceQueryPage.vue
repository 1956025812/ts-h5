1<template>
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
          <Input v-model="nodeCode" style="width: 100px" />
        </div>
        <div style="display: inline; margin-left:30px;">
          轨迹代码：
          <Input v-model="traceCode" style="width: 200px" />
        </div>
        <div style="display: inline; margin-left:30px;">
          轨迹中文名称：
          <Input v-model="traceNameCn" style="width: 250px" />
        </div>
        <div style="display: inline; margin-left:30px;">
          轨迹英文名称：
          <Input v-model="traceNameEn" style="width: 250px" />
        </div>
      </Row>
      <br />
      <Row>
        <div style="display: inline;">
          状态：
          <Select v-model="state" style="width:100px" clearable>
            <Option value="0">异常</Option>
            <Option value="1">正常</Option>
          </Select>
        </div>
        <div style="display: inline; margin-left:30px;">
          客户可见：
          <Select v-model="showCustomer" style="width:100px" clearable>
            <Option value="0">不可见</Option>
            <Option value="1">可见</Option>
          </Select>
        </div>
        <div style="display: inline; margin-left:30px;">
          最后修改时间：
          <DatePicker
            v-model="updateTimeRange"
            type="datetimerange"
            style="width: 280px"
            format="yyyy-MM-dd HH:mm:ss"
            @on-change="updateTimeRange=$event"
          ></DatePicker>
        </div>
        <div style="display: inline; margin-left:20px;">
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
        <StandardTraceAddPageComponent @parentReset="reset"></StandardTraceAddPageComponent>
      </Tooltip>
      <Tooltip placement="top" content="删除">
        <Button
          class="export-btn"
          style="border: none; appearance:none; margin-bottom: 5px;"
          @click="openDelStandardTraceBatchModal()"
        >
          <Icon type="md-close" size="25" />
        </Button>
      </Tooltip>
      <Tooltip placement="top" content="导入">
        <StandardTraceImportPageComponent @parentReset="reset"></StandardTraceImportPageComponent>
      </Tooltip>
    </div>
    <br />

    <!-- 表格 -->
    <div>
      <Table
        ref="standardTraceTableRef"
        border
        :columns="columns"
        :data="standardTraceTableData"
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

    <!-- 修改标准轨迹弹窗子组件 -->
    <StandardTraceEditPageComponent
      ref="StandardTraceEditPageComponentRef"
      style="display:none"
      @parentReset="reset"
    ></StandardTraceEditPageComponent>
  </div>
</template>
  

<script>
import StandardTraceAddPageComponent from "_p/baseMaterial/standardTrace/standardTraceAddPage.vue";
import StandardTraceEditPageComponent from "_p/baseMaterial/standardTrace/standardTraceEditPage.vue";
import StandardTraceImportPageComponent from "_p/baseMaterial/standardTrace/standardTraceImportPage.vue";
import { setToken, getToken, removeArrayElement } from "@/libs/util.js";
import {
  selectStandardTracePageAPI,
  delStandardTraceAPI
} from "@/api/baseMaterial/standardTracePage.js";

export default {
  components: {
    StandardTraceAddPageComponent,
    StandardTraceEditPageComponent,
    StandardTraceImportPageComponent
  },
  data() {
    return {
      // 初始化变量
      cycleCode: "",
      nodeCode: "",
      traceCode: "",
      traceNameCn: "",
      traceNameEn: "",
      state: "",
      showCustomer: "",
      updateTimeRange: "",
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      selectRowStids: [],

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
          title: "轨迹代码",
          key: "traceCode",
          align: "center"
        },
        {
          title: "环节代码",
          key: "cycleCode",
          align: "center"
        },
        {
          title: "节点代码",
          key: "nodeCode",
          align: "center"
        },
        {
          title: "轨迹中文名称",
          key: "traceNameCn",
          align: "center"
        },
        {
          title: "轨迹英文名称",
          key: "traceNameEn",
          align: "center"
        },
        {
          title: "客户可见",
          key: "showCustomer",
          align: "center",
          render: (h, params) => {
            let showCustomerName = null;
            if (params.row.showCustomer == 0) {
              showCustomerName = "不可见";
            } else if (params.row.showCustomer == 1) {
              showCustomerName = "可见";
            }
            return h("div", showCustomerName);
          }
        },
        {
          title: "状态",
          key: "state",
          align: "center",
          render: (h, params) => {
            let stateName = null;
            if (params.row.state == 0) {
              stateName = "异常";
            } else if (params.row.state == 1) {
              stateName = "正常";
            }
            return h("div", stateName);
          }
        },
        {
          title: "轨迹用途描述",
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
                      this.$refs.StandardTraceEditPageComponentRef.openStandardTraceEditModal(
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
                      this.openStandardTraceDelSingleModal(params.row);
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
      standardTraceTableData: []
    };
  },

  methods: {
    /**
     * 查询分页函数
     */
    queryStandardTracePage(currentPage, pageSize) {
      let params = new Object();
      params.currentPage = currentPage;
      params.pageSize = pageSize;
      params.loginUid = getToken();
      params.cycleCode = this.cycleCode;
      params.nodeCode = this.nodeCode;
      params.traceCode = this.traceCode;
      params.traceNameCn = this.traceNameCn;
      params.traceNameEn = this.traceNameEn;
      params.state = this.state;
      params.showCustomer = this.showCustomer;
      if (this.updateTimeRange != null && this.updateTimeRange != "") {
        params.startTime = this.updateTimeRange.toString().split(",")[0];
        params.endTime = this.updateTimeRange.toString().split(",")[1];
      }

      selectStandardTracePageAPI(params).then(res => {
        if (res.data.code == 1) {
          this.totalCount = res.data.data.totalCount;
          this.currentPage = res.data.data.currentPage;
          this.pageSize = res.data.data.pageSize;
          this.standardTraceTableData = res.data.data.items;

          // 处理复选框回显
          if (res.data.data.items.length > 0) {
            res.data.data.items.forEach(eachStandardTrace => {
              if (this.selectRowStids.indexOf(eachStandardTrace.id) != -1) {
                eachStandardTrace._checked = true;
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
      this.$options.methods.queryStandardTracePage.bind(this)(
        currentPage,
        this.pageSize
      );
    },

    /**
     * 更换每页显示数据量
     */
    changePageSize(pageSize) {
      this.$options.methods.queryStandardTracePage.bind(this)(1, pageSize);
    },

    /**
     * 选中复选框
     */
    selectRow(selection, row) {
      if (this.selectRowStids.indexOf(row.id) == -1) {
        this.selectRowStids.push(row.id);
      }
    },

    /**
     * 取消选中复选框
     */
    cancelSelectRow(selection, row) {
      removeArrayElement(this.selectRowStids, row.id);
    },

    /**
     * 全选
     */
    selectAllRow(selection) {
      selection.forEach(eachSelectedRow => {
        if (this.selectRowStids.indexOf(eachSelectedRow.id) == -1) {
          this.selectRowStids.push(eachSelectedRow.id);
        }
      });
    },

    /**
     * 取消全选
     */
    cancelSelectAllRow(selection) {
      this.traceCycleTableData.forEach(eachCurrenPageRow => {
        removeArrayElement(this.selectRowStids, eachCurrenPageRow.id);
      });
    },

    /**
     * 查询按钮查询
     */
    query() {
      this.selectRowStids = [];
      this.$options.methods.queryStandardTracePage.bind(this)(1, 10);
    },

    /**
     * 重置查询条件
     */
    reset() {
      this.cycleCode = "";
      this.nodeCode = "";
      this.traceCode = "";
      this.traceNameCn = "";
      this.traceNameEn = "";
      (this.state = ""), (this.showCustomer = ""), (this.updateTimeRange = "");
      this.selectRowStids = [];
      this.$options.methods.queryStandardTracePage.bind(this)(1, 10);
    },

    /**
     * 删除单条轨迹环节
     */
    openStandardTraceDelSingleModal(row) {
      this.$Modal.confirm({
        title: "删除标准轨迹",
        content: "确认删除标准轨迹【" + row.traceNameCn + "】么？",
        onOk: () => {
          let params = new Object();
          params.loginUid = getToken;
          params.id = row.id;
          delStandardTraceAPI(params).then(res => {
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
    openDelStandardTraceBatchModal() {
      if (this.selectRowStids.length == 0) {
        this.$Notice.warning({
          title: "请选中要删除的记录后再进行删除操作"
        });
        return;
      }

      this.$Modal.confirm({
        title: "批量删除标准轨迹",
        content: "确认要批量删除这些标准轨迹么？",
        onOk: () => {
          let params = new Object();
          params.loginUid = getToken;
          params.stids = this.selectRowStids;
          delStandardTraceAPI(params).then(res => {
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
    this.$options.methods.queryStandardTracePage.bind(this)(
      this.currentPage,
      this.pageSize
    );
  }
};
</script>
