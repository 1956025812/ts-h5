<template>
  <div>
    <!-- 查询条件 -->
    <Card :bordered="false" title="查询条件">
      <Row>
        <div style="display: inline;">
          公司名称：
          <Input v-model="companyName" style="width: 100px" />
        </div>
        <div style="display: inline; margin-left:20px;">
          部门：
          <Input v-model="departmentName" style="width: 100px" />
        </div>
        <div style="display: inline; margin-left:20px;">
          角色级别：
          <Input v-model="roleLevel" style="width: 100px" />
        </div>
        <div style="display: inline; margin-left:20px;">
          状态：
          <Input v-model="userState" style="width: 100px" />
        </div>
        <div style="display: inline; margin-left:20px;">
          用户名：
          <Input v-model="username" style="width: 100px" />
        </div>
        <div style="display: inline; margin-left:20px;">
          姓名：
          <Input v-model="realName" style="width: 100px" />
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
        ref="systemUserTableRef"
        border
        :columns="columns"
        :data="systemUserTableData"
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
import { setToken, getToken, removeArrayElement } from "@/libs/util.js";

export default {
  components: {},
  data() {
    return {
      // 初始化变量
      companyName: "",
      departmentName: "",
      roleLevel: "",
      userState: "",
      username: "",
      realName: "",
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      selectRowSuids: [],

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
          title: "用户姓名",
          key: "username",
          align: "center"
        },
        {
          title: "姓名",
          key: "realName",
          align: "center"
        },
        {
          title: "公司",
          key: "companyName",
          align: "center"
        },
        {
          title: "部门",
          key: "departmentName",
          align: "center"
        },
        {
          title: "职位类型",
          key: "positionType",
          align: "center"
        },
        {
          title: "角色级别",
          key: "roleLevel",
          align: "center"
        },
        {
          title: "业务类型",
          key: "businessType",
          align: "center"
        },
        {
          title: "状态",
          key: "userState",
          align: "center"
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
                      alert("详情TODO");
                    }
                  }
                },
                "详情"
              )
            ]);
          }
        }
      ],
      systemUserTableData: []
    };
  },

  methods: {
    /**
     * 查询分页函数
     */
    querySystemUserPage(currentPage, pageSize) {},

    /**
     * 换页
     */
    changePage(currentPage) {
      this.$options.methods.querySystemUserPage.bind(this)(
        currentPage,
        this.pageSize
      );
    },

    /**
     * 更换每页显示数据量
     */
    changePageSize(pageSize) {
      this.$options.methods.querySystemUserPage.bind(this)(1, pageSize);
    },

    /**
     * 选中复选框
     */
    selectRow(selection, row) {
      if (this.selectRowSuids.indexOf(row.id) == -1) {
        this.selectRowSuids.push(row.id);
      }
    },

    /**
     * 取消选中复选框
     */
    cancelSelectRow(selection, row) {
      removeArrayElement(this.selectRowSuids, row.id);
    },

    /**
     * 全选
     */
    selectAllRow(selection) {
      selection.forEach(eachSelectedRow => {
        if (this.selectRowSuids.indexOf(eachSelectedRow.id) == -1) {
          this.selectRowSuids.push(eachSelectedRow.id);
        }
      });
    },

    /**
     * 取消全选
     */
    cancelSelectAllRow(selection) {
      this.systemUserTableData.forEach(eachCurrenPageRow => {
        removeArrayElement(this.selectRowSuids, eachCurrenPageRow.id);
      });
    },

    /**
     * 查询按钮查询
     */
    query() {
      this.selectRowSuids = [];
      this.$options.methods.querySystemUserPage.bind(this)(1, 10);
    },

    /**
     * 重置查询条件
     */
    reset() {
      this.companyName = "";
      this.departmentName = "";
      this.roleLevel = "";
      this.userState = "";
      this.username = "";
      this.realName = "";
      this.selectRowSuids = [];
      this.$options.methods.querySystemUserPage.bind(this)(1, 10);
    }
  },

  /**
   * 初始化页面 页面加载的时候执行
   */
  created() {
    this.$options.methods.querySystemUserPage.bind(this)(
      this.currentPage,
      this.pageSize
    );
  }
};
</script>
