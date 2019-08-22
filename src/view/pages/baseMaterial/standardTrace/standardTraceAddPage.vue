<template>
  <div>
    <Button
      class="export-btn"
      style="border: none; appearance:none; margin-bottom: 5px;"
      @click="openStandardTraceAddModal"
    >
      <Icon type="md-add" size="25" />
    </Button>
    <Modal
      v-model="standardTraceAddModal"
      title="新增标准轨迹"
      ok-text="保存"
      @on-ok="saveStandardTrace"
      :mask-closable="false"
      :closable="false"
    >
      <Form
        ref="standardTraceAddFormRef"
        :model="standardTraceAddForm"
        :rules="standardTraceAddFormRules"
        :label-width="120"
      >
        <FormItem label="环节代码：" prop="cycleCode">
          <Select
            v-model="standardTraceAddForm.cycleCode"
            placeholder="请选择"
            clearable
            @on-change="cycleCodeSelectChange"
            @on-clear="cycleCodeSelectClear"
          >
            <Option
              v-for="eachTraceCycleOption in standardTraceAddForm.traceCycleListOptions"
              :value="eachTraceCycleOption.cycleCode"
              :key="eachTraceCycleOption.cycleCode"
            >{{eachTraceCycleOption.cycleCode}}</Option>
          </Select>
        </FormItem>
        <FormItem label="节点代码：" prop="nodeCode">
          <Select
            v-model="standardTraceAddForm.nodeCode"
            placeholder="请选择"
            clearable
            @on-change="updateCycleNodeTraceCode"
            @on-clear="updateCycleNodeTraceCode"
          >
            <Option
              v-for="eachTraceNodeOption in standardTraceAddForm.traceNodeListOptions"
              :value="eachTraceNodeOption.nodeCode"
              :key="eachTraceNodeOption.nodeCode"
            >{{eachTraceNodeOption.nodeCode}}</Option>
          </Select>
        </FormItem>
        <FormItem label="轨迹代码：" prop="traceCode">
          <Input
            v-model="standardTraceAddForm.traceCode"
            placeholder="限2~5个英文字符"
            @on-change="updateCycleNodeTraceCode"
          ></Input>
        </FormItem>
        <FormItem label="轨迹简码：" prop="cycleNodeTraceCode">
          <Input
            v-model="standardTraceAddForm.cycleNodeTraceCode"
            placeholder="环节代码-节点代码-轨迹代码"
            readonly
          ></Input>
        </FormItem>
        <FormItem label="轨迹状态：" prop="state">
          <Select v-model="standardTraceAddForm.state" placeholder="请选择" clearable>
            <Option value="0">异常</Option>
            <Option value="1">正常</Option>
          </Select>
        </FormItem>
        <FormItem label="客户可见：" prop="showCustomer">
          <Select v-model="standardTraceAddForm.showCustomer" placeholder="请选择" clearable>
            <Option value="0">不可见</Option>
            <Option value="1">可见</Option>
          </Select>
        </FormItem>
        <FormItem label="轨迹中文名称：" prop="traceNameCn">
          <Input
            v-model="standardTraceAddForm.traceNameCn"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="限制150个字符"
          ></Input>
        </FormItem>
        <FormItem label="轨迹英文名称：" prop="traceNameEn">
          <Input
            v-model="standardTraceAddForm.traceNameEn"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="限制150个字符"
          ></Input>
        </FormItem>
        <FormItem label="轨迹用途描述：" prop="remark">
          <Input
            v-model="standardTraceAddForm.remark"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="限制150个字符"
          ></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>



<script>
import { getToken } from "@/libs/util.js";
import { selectTraceCycleListAPI } from "@/api/baseMaterial/traceCyclePage.js";
import { selectTraceNodeListAPI } from "@/api/baseMaterial/traceNodePage.js";
import { saveStandardTraceAPI } from "@/api/baseMaterial/standardTracePage.js";

export default {
  name: "StandardTraceAddPageComponent",
  data() {
    return {
      standardTraceAddModal: false,
      standardTraceAddForm: {
        traceCycleListOptions: Array,
        traceNodeListOptions: Array,
        cycleCode: "",
        nodeCode: "",
        traceCode: "",
        cycleNodeTraceCode: "",
        state: "",
        showCustomer: "",
        traceNameCn: "",
        traceNameEn: "",
        remark: ""
      },
      standardTraceAddFormRules: {
        cycleCode: [
          {
            required: true,
            message: "环节代码不能为空",
            trigger: "change"
          }
        ],
        nodeCode: [
          {
            required: true,
            message: "节点代码不能为空",
            trigger: "change"
          }
        ],
        traceCode: [
          {
            required: true,
            message: "轨迹代码不能为空",
            trigger: "blur"
          },
          {
            type: "string",
            min: 2,
            max: 5,
            message: "必须是2~5位英文字符",
            trigger: "blur"
          }
        ],
        state: [
          {
            required: true,
            message: "轨迹状态不能为空",
            trigger: "change"
          }
        ],
        showCustomer: [
          {
            required: true,
            message: "客户可见不能为空",
            trigger: "change"
          }
        ],
        traceNameCn: [
          {
            required: true,
            message: "轨迹中文名称不能为空",
            trigger: "blur"
          },
          {
            type: "string",
            max: 150,
            message: "限150个字",
            trigger: "blur"
          }
        ],
        traceNameEn: [
          {
            required: true,
            message: "轨迹英文名称不能为空",
            trigger: "blur"
          },
          {
            type: "string",
            max: 150,
            message: "限制150个字符",
            trigger: "blur"
          }
        ],
        remark: [
          {
            required: true,
            message: "环节用途描述不能为空",
            trigger: "blur"
          },
          {
            type: "string",
            max: 150,
            message: "限制150个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },

  methods: {
    /**
     * 初始化新增弹窗
     */
    openStandardTraceAddModal() {
      this.standardTraceAddModal = true;
      this.$refs.standardTraceAddFormRef.resetFields();

      // 初始化轨迹环节代码下拉框
      let params = new Object();
      params.loginUid = getToken();
      selectTraceCycleListAPI(params).then(res => {
        if (res.data.code == 1) {
          this.standardTraceAddForm.traceCycleListOptions = res.data.data;
        } else if (res.data.code == 0) {
          this.$Notice.error({
            desc: res.data.msg
          });
        }
      });
    },

    /**
     * 环节代码下拉框清空触发时将环节代码值和节点代码下框值清空， 并更新轨迹简码
     */
    cycleCodeSelectClear() {
      this.standardTraceAddForm.cycleCode = "";
      this.standardTraceAddForm.nodeCode = "";
      this.standardTraceAddForm.traceNodeListOptions = [];

      // 更新轨迹简码11111
      this.$options.methods.updateCycleNodeTraceCode.bind(this)();
    },

    /**
     * 环节代码下拉框改变的时候级联刷新节点代码下拉框, 并更新轨迹简码 注意：清空后获取到的值为undefined
     */
    cycleCodeSelectChange(cycleCode) {
      this.standardTraceAddForm.nodeCode = "";
      if (cycleCode == undefined) {
        this.standardTraceAddForm.traceNodeListOptions = [];
      } else {
        let params = new Object();
        params.loginUid = getToken();
        params.cycleCode = cycleCode;
        selectTraceNodeListAPI(params).then(res => {
          if (res.data.code == 1) {
            this.standardTraceAddForm.traceNodeListOptions = res.data.data;
          } else if (res.data.code == 0) {
            this.$Notice.error({
              desc: res.data.msg
            });
          }
        });
      }

      // 更新轨迹简码
      this.$options.methods.updateCycleNodeTraceCode.bind(this)();
    },

    /**
     * 更新轨迹简码
     */
    updateCycleNodeTraceCode() {
      this.standardTraceAddForm.cycleNodeTraceCode =
        this.standardTraceAddForm.cycleCode +
        "-" +
        this.standardTraceAddForm.nodeCode +
        "-" +
        this.standardTraceAddForm.traceCode;
    },

    /**
     * 新增标准轨迹
     */
    saveStandardTrace() {
      this.$refs.standardTraceAddFormRef.validate(valid => {
        if (valid) {
          let params = new Object();
          params.loginUid = getToken();
          params.cycleCode = this.standardTraceAddForm.cycleCode;
          params.nodeCode = this.standardTraceAddForm.nodeCode;
          params.traceCode = this.standardTraceAddForm.traceCode;
          params.state = this.standardTraceAddForm.state;
          params.showCustomer = this.standardTraceAddForm.showCustomer;
          params.traceNameCn = this.standardTraceAddForm.traceNameCn;
          params.traceNameEn = this.standardTraceAddForm.traceNameEn;
          params.remark = this.standardTraceAddForm.remark;

          saveStandardTraceAPI(params).then(res => {
            if (res.data.code == 1) {
              this.$Notice.success({
                desc: res.data.msg
              });
              // 通过自定义事件调用父窗口的重置按钮刷新分页列表
              this.$emit("parentReset");
            } else if (res.data.code == 0) {
              this.$Notice.error({
                desc: res.data.msg
              });
            }
          });
        } else {
          this.$Notice.error({
            desc: "内容不合法，请重新填写。"
          });
        }
      });
    }
  },

  created() {}
};
</script>








