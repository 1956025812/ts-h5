<template>
  <div>
    <Button
      class="export-btn"
      style="border: none; appearance:none; margin-bottom: 5px;"
      @click="openTraceNodeAddModal"
    >
      <Icon type="md-add" size="25" />
    </Button>
    <Modal
      v-model="traceNodeAddModal"
      title="新增轨迹节点"
      ok-text="保存"
      @on-ok="saveTraceNode"
      :mask-closable="false"
      :closable="false"
    >
      <Form
        ref="traceNodeAddFormRef"
        :model="traceNodeAddForm"
        :rules="traceNodeAddFormRules"
        :label-width="120"
      >
        <FormItem label="环节代码：" prop="cycleCode">
          <Select v-model="traceNodeAddForm.cycleCode" placeholder="请选择" clearable>
            <Option
              v-for="eachTraceCycleOption in traceNodeAddForm.traceCycleListOptions"
              :value="eachTraceCycleOption.cycleCode"
              :key="eachTraceCycleOption.cycleCode"
            >{{eachTraceCycleOption.cycleCode}}</Option>
          </Select>
        </FormItem>
        <FormItem label="节点代码：" prop="nodeCode">
          <Input v-model="traceNodeAddForm.nodeCode" placeholder="限一个字符，必须为字母或数字"></Input>
        </FormItem>
        <FormItem label="环节中文名称：" prop="nodeNameCn">
          <Input v-model="traceNodeAddForm.nodeNameCn" placeholder="限50个字"></Input>
        </FormItem>
        <FormItem label="环节英文名称：" prop="nodeNameEn">
          <Input v-model="traceNodeAddForm.nodeNameEn" placeholder="限制50个字符"></Input>
        </FormItem>
        <FormItem label="环节用途描述：" prop="remark">
          <Input
            v-model="traceNodeAddForm.remark"
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
import { saveTraceNodeAPI } from "@/api/baseMaterial/traceNodePage.js";

export default {
  name: "TraceCycleAddPageComponent",
  data() {
    return {
      traceNodeAddModal: false,
      traceNodeAddForm: {
        traceCycleListOptions: Array,
        cycleCode: "",
        nodeCode: "",
        nodeNameCn: "",
        nodeNameEn: "",
        remark: ""
      },
      traceNodeAddFormRules: {
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
            trigger: "blur"
          },
          {
            type: "string",
            min: 1,
            max: 1,
            message: "必须是一个字符或数字",
            trigger: "blur"
          }
        ],
        nodeNameCn: [
          {
            required: true,
            message: "节点中文名称不能为空",
            trigger: "blur"
          },
          {
            type: "string",
            max: 50,
            message: "限50个字",
            trigger: "blur"
          }
        ],
        nodeNameEn: [
          {
            required: true,
            message: "节点英文名称不能为空",
            trigger: "blur"
          },
          {
            type: "string",
            max: 50,
            message: "限制50个字符",
            trigger: "blur"
          }
        ],
        remark: [
          {
            required: true,
            message: "节点用途描述不能为空",
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
    openTraceNodeAddModal() {
      this.traceNodeAddModal = true;
      this.$refs.traceNodeAddFormRef.resetFields();

      // 初始化轨迹环节代码下拉框
      let params = new Object();
      params.loginUid = getToken();
      selectTraceCycleListAPI(params).then(res => {
        if (res.data.code == 1) {
          this.traceNodeAddForm.traceCycleListOptions = res.data.data;
        } else if (res.data.code == 0) {
          this.$Notice.error({
            desc: res.data.msg
          });
        }
      });
    },

    saveTraceNode() {
      this.$refs.traceNodeAddFormRef.validate(valid => {
        if (valid) {
          let params = new Object();
          params.loginUid = getToken();
          params.cycleCode = this.traceNodeAddForm.cycleCode;
          params.nodeCode = this.traceNodeAddForm.nodeCode;
          params.nodeNameCn = this.traceNodeAddForm.nodeNameCn;
          params.nodeNameEn = this.traceNodeAddForm.nodeNameEn;
          params.remark = this.traceNodeAddForm.remark;

          saveTraceNodeAPI(params).then(res => {
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








