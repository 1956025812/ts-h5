<template>
  <div>
    <Button
      class="export-btn"
      style="border: none; appearance:none; margin-bottom: 5px;"
      @click="openStandardTraceEditModal"
    >
      <Icon type="md-Edit" size="25" />
    </Button>
    <Modal
      v-model="standardTraceEditModal"
      title="修改标准轨迹"
      ok-text="保存"
      @on-ok="editStandardTrace"
      :mask-closable="false"
      :closable="false"
    >
      <Input v-model="hiddenStid" style="display:none" />
      <Form
        ref="standardTraceEditFormRef"
        :model="standardTraceEditForm"
        :rules="standardTraceEditFormRules"
        :label-width="120"
      >
        <FormItem label="环节代码：" prop="cycleCode">
          <Select
            v-model="standardTraceEditForm.cycleCode"
            placeholder="请选择"
            clearable
            disabled
            @on-change="cycleCodeSelectChange"
            @on-clear="cycleCodeSelectClear"
          >
            <Option
              v-for="eachTraceCycleOption in standardTraceEditForm.traceCycleListOptions"
              :value="eachTraceCycleOption.cycleCode"
              :key="eachTraceCycleOption.cycleCode"
            >{{eachTraceCycleOption.cycleCode}}</Option>
          </Select>
        </FormItem>
        <FormItem label="节点代码：" prop="nodeCode">
          <Select
            v-model="standardTraceEditForm.nodeCode"
            placeholder="请选择"
            clearable
            disabled
            @on-change="updateCycleNodeTraceCode"
            @on-clear="updateCycleNodeTraceCode"
          >
            <Option
              v-for="eachTraceNodeOption in standardTraceEditForm.traceNodeListOptions"
              :value="eachTraceNodeOption.nodeCode"
              :key="eachTraceNodeOption.nodeCode"
            >{{eachTraceNodeOption.nodeCode}}</Option>
          </Select>
        </FormItem>
        <FormItem label="轨迹代码：" prop="traceCode">
          <Input
            v-model="standardTraceEditForm.traceCode"
            placeholder="限2~5个英文字符"
            disabled
            @on-change="updateCycleNodeTraceCode"
          ></Input>
        </FormItem>
        <FormItem label="轨迹简码：" prop="cycleNodeTraceCode">
          <Input
            v-model="standardTraceEditForm.cycleNodeTraceCode"
            placeholder="环节代码-节点代码-轨迹代码"
            disabled
          ></Input>
        </FormItem>
        <FormItem label="轨迹状态：" prop="state">
          <Select v-model="standardTraceEditForm.state" placeholder="请选择" clearable>
            <Option value="0">异常</Option>
            <Option value="1">正常</Option>
          </Select>
        </FormItem>
        <FormItem label="客户可见：" prop="showCustomer">
          <Select v-model="standardTraceEditForm.showCustomer" placeholder="请选择" clearable>
            <Option value="0">不可见</Option>
            <Option value="1">可见</Option>
          </Select>
        </FormItem>
        <FormItem label="轨迹中文名称：" prop="traceNameCn">
          <Input
            v-model="standardTraceEditForm.traceNameCn"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="限制150个字符"
          ></Input>
        </FormItem>
        <FormItem label="轨迹英文名称：" prop="traceNameEn">
          <Input
            v-model="standardTraceEditForm.traceNameEn"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="限制150个字符"
          ></Input>
        </FormItem>
        <FormItem label="轨迹用途描述：" prop="remark">
          <Input
            v-model="standardTraceEditForm.remark"
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
import { getToken } from "@/libs/util";
import { selectTraceCycleListAPI } from "@/api/baseMaterial/traceCyclePage.js";
import { selectTraceNodeListAPI } from "@/api/baseMaterial/traceNodePage.js";
import {
  selectStandardTraceDetailAPI,
  editStandardTraceAPI
} from "@/api/baseMaterial/standardTracePage.js";

export default {
  name: "StandardTraceEditPageComponent",
  data() {
    return {
      standardTraceEditModal: false,
      hiddenStid: "",
      standardTraceEditForm: {
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
      standardTraceEditFormRules: {
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
     * 初始化修改弹窗
     */
    openStandardTraceEditModal(stid) {
      this.standardTraceEditModal = true;
      this.hiddenStid = stid;
      this.$refs.standardTraceEditFormRef.resetFields();

      // 查询标准轨迹信息回显
      params = new Object();
      params.loginUid = getToken();
      params.id = stid;
      selectStandardTraceDetailAPI(params).then(res => {
        if (res.data.code == 1) {
          this.standardTraceEditForm.cycleCode = res.data.data.cycleCode;
          this.standardTraceEditForm.nodeCode = res.data.data.nodeCode;
          this.standardTraceEditForm.traceCode = res.data.data.traceCode;
          this.standardTraceEditForm.state = res.data.data.state + "";
          this.standardTraceEditForm.showCustomer =
            res.data.data.showCustomer + "";
          this.standardTraceEditForm.traceNameCn = res.data.data.traceNameCn;
          this.standardTraceEditForm.traceNameEn = res.data.data.traceNameEn;
          this.standardTraceEditForm.remark = res.data.data.remark;
          // 更新轨迹简码
          this.$options.methods.updateCycleNodeTraceCode.bind(this)();
        } else if (res.data.code == 0) {
          this.$Notice.error({
            desc: res.data.msg
          });
        }
      });

      // 初始化轨迹环节代码下拉框
      let params = new Object();
      params.loginUid = getToken();
      selectTraceCycleListAPI(params).then(res => {
        if (res.data.code == 1) {
          this.standardTraceEditForm.traceCycleListOptions = res.data.data;
        } else if (res.data.code == 0) {
          this.$Notice.error({
            desc: res.data.msg
          });
        }
      });

      // 初始化轨迹节点代码下拉框
      this.$options.methods.cycleCodeSelectChange.bind(this)(
        this.standardTraceEditForm.cycleCode
      );
    },

    /**
     * 环节代码下拉框清空触发时将环节代码值和节点代码下框值清空， 并更新轨迹简码
     */
    cycleCodeSelectClear() {
      this.standardTraceEditForm.cycleCode = "";
      this.standardTraceEditForm.nodeCode = "";
      this.standardTraceEditForm.traceNodeListOptions = [];

      // 更新轨迹简码
      this.$options.methods.updateCycleNodeTraceCode.bind(this)();
    },

    /**
     * 环节代码下拉框改变的时候级联刷新节点代码下拉框, 并更新轨迹简码 注意：清空后获取到的值为undefined
     */
    cycleCodeSelectChange(cycleCode) {
      this.standardTraceEditForm.nodeCode = "";
      if (cycleCode == undefined) {
        this.standardTraceEditForm.traceNodeListOptions = [];
      } else {
        let params = new Object();
        params.loginUid = getToken();
        params.cycleCode = cycleCode;
        selectTraceNodeListAPI(params).then(res => {
          if (res.data.code == 1) {
            this.standardTraceEditForm.traceNodeListOptions = res.data.data;
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
      this.standardTraceEditForm.cycleNodeTraceCode =
        this.standardTraceEditForm.cycleCode +
        "-" +
        this.standardTraceEditForm.nodeCode +
        "-" +
        this.standardTraceEditForm.traceCode;
    },

    editStandardTrace() {
      this.$refs.standardTraceEditFormRef.validate(valid => {
        if (valid) {
          let params = new Object();
          params.loginUid = getToken();
          params.id = this.hiddenStid;
          params.cycleCode = this.standardTraceEditForm.cycleCode;
          params.nodeCode = this.standardTraceEditForm.nodeCode;
          params.traceCode = this.standardTraceEditForm.traceCode;
          params.state = this.standardTraceEditForm.state;
          params.showCustomer = this.standardTraceEditForm.showCustomer;
          params.traceNameCn = this.standardTraceEditForm.traceNameCn;
          params.traceNameEn = this.standardTraceEditForm.traceNameEn;
          params.remark = this.standardTraceEditForm.remark;
          editStandardTraceAPI(params).then(res => {
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











