<template>
  <div>
    <Button
      class="export-btn"
      style="border: none; appearance:none; margin-bottom: 5px;"
      @click="openBaseOperateLogModal"
    >
      <Icon type="md-Edit" size="25" />
    </Button>
    <Modal v-model="baseOperateLogModal" title="操作日志" :footer-hide="true" width="1200px">
      <!-- 查询条件 -->
      <Card :bordered="false" title="查询条件">
        <Row>
          <div style="display: inline;">
            操作人：
            <Input v-model="createBy" style="width: 80px" />
          </div>
          <div style="display: inline; margin-left:30px;">
            操作内容：
            <Input v-model="remark" style="width: 80px" />
          </div>
          <div style="display: inline;  margin-left:30px;">
            操作时间：
            <DatePicker
              v-model="createTimeRange"
              type="datetimerange"
              style="width: 280px"
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

      <!-- 表格 -->
      <div>
        <Table
          ref="baseOperateLogTableRef"
          border
          :columns="columns"
          :data="baseOperateLogTableData"
        ></Table>
      </div>
      <br />

      <!-- 分页 -->
      <div style="text-align: center">
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
    </Modal>
  </div>
</template>



<script>
import { getToken } from "@/libs/util";
import { selectBaseOperateLogPageAPI } from "@/api/common/logger/baseOperateLogPage.js";

export default {
  name: "BaseOperateLogPageComponent",
  data() {
    return {
      baseOperateLogModal: false,
      belongTypeHidden: "",
      thirdRecordIdHidden: "",
      createBy: "",
      remark: "",
      createTimeRange: "",
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,

      columns: [
        {
          title: "序号",
          type: "index",
          width: 80,
          align: "center"
        },
        {
          title: "操作人",
          key: "createBy",
          width: 160,
          align: "center"
        },
        {
          title: "操作时间",
          key: "createTime",
          width: 280,
          align: "center"
        },
        {
          title: "操作内容",
          key: "remark",
          align: "center"
        }
      ],
      baseOperateLogTableData: []
    };
  },

  methods: {
    openBaseOperateLogModal(belongType, thirdRecordId) {
      this.baseOperateLogModal = true;
      this.belongTypeHidden = belongType;
      this.thirdRecordIdHidden = thirdRecordId;

      // 查询
      this.$options.methods.queryBaseOperateLogPage.bind(this)(
        this.currentPage,
        this.pageSize
      );
    },

    /**
     * 查询分页函数
     */
    queryBaseOperateLogPage(currentPage, pageSize) {
      let params = new Object();
      params.currentPage = currentPage;
      params.pageSize = pageSize;
      params.loginUid = getToken();
      params.belongType = this.belongTypeHidden;
      params.thirdRecordId = this.thirdRecordIdHidden;
      params.createBy = this.createBy;
      params.remark = this.remark;
      if (this.createTimeRange != null && this.createTimeRange != "") {
        params.startTime = this.createTimeRange.toString().split(",")[0];
        params.endTime = this.createTimeRange.toString().split(",")[1];
      }

      selectBaseOperateLogPageAPI(params).then(res => {
        if (res.data.code == 1) {
          this.totalCount = res.data.data.totalCount;
          this.currentPage = res.data.data.currentPage;
          this.pageSize = res.data.data.pageSize;
          this.baseOperateLogTableData = res.data.data.items;
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
      this.$options.methods.queryBaseOperateLogPage.bind(this)(
        currentPage,
        this.pageSize
      );
    },

    /**
     * 更换每页显示数据量
     */
    changePageSize(pageSize) {
      this.$options.methods.queryBaseOperateLogPage.bind(this)(1, pageSize);
    },

    /**
     * 查询按钮查询
     */
    query() {
      this.$options.methods.queryBaseOperateLogPage.bind(this)(1, 10);
    },

    reset() {
      this.createBy = "";
      this.remark = "";
      this.createTimeRange = "";
      this.$options.methods.queryBaseOperateLogPage.bind(this)(1, 10);
    }
  },

  created() {}
};
</script>











