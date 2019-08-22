<template>
  <div>
    <Button
      class="export-btn"
      style="border: none; appearance:none; margin-bottom: 5px;"
      @click="openTraceNodeEditModal"
    >
      <Icon type="md-Edit" size="25" />
    </Button>
    <Modal
      v-model="traceNodeEditModal"
      title="修改轨迹节点"
      ok-text="保存"
      @on-ok="editTraceNode"
      :mask-closable="false"
      :closable="false"
    >
      <Input v-model="hiddenTnid" style="display:none" />
      <Form
        ref="traceNodeEditFormRef"
        :model="traceNodeEditForm"
        :rules="traceNodeEditFormRules"
        :label-width="120"
      >
        <FormItem label="环节代码：" prop="cycleCode">
          <Select v-model="traceNodeEditForm.cycleCode" placeholder="请选择" clearable>
            <Option
              v-for="eachTraceCycleOption in traceNodeEditForm.traceCycleListOptions"
              :value="eachTraceCycleOption.cycleCode"
              :key="eachTraceCycleOption.cycleCode"
            >{{eachTraceCycleOption.cycleCode}}</Option>
          </Select>
        </FormItem>
        <FormItem label="节点代码：" prop="nodeCode">
          <Input v-model="traceNodeEditForm.nodeCode" placeholder="限一个字符，必须为字母或数字"></Input>
        </FormItem>
        <FormItem label="节点中文名称：" prop="nodeNameCn">
          <Input v-model="traceNodeEditForm.nodeNameCn" placeholder="限20个字"></Input>
        </FormItem>
        <FormItem label="节点英文名称：" prop="nodeNameEn">
          <Input v-model="traceNodeEditForm.nodeNameEn" placeholder="限制50个字符"></Input>
        </FormItem>
        <FormItem label="节点用途描述：" prop="remark">
          <Input
            v-model="traceNodeEditForm.remark"
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
import {
  selectTraceNodeDetailAPI,
  editTraceNodeAPI
} from "@/api/baseMaterial/traceNodePage.js";

export default {
  name: "TraceNodeEditPageComponent",
  data() {
    return {
      traceNodeEditModal: false,
      hiddenTnid: "",
      traceNodeEditForm: {
        cycleCode: "",
        nodeCode: "",
        nodeNameCn: "",
        nodeNameEn: "",
        remark: ""
      },
      traceNodeEditFormRules: {
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
            max: 20,
            message: "限20个字",
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
    openTraceNodeEditModal(tnid) {
      this.traceNodeEditModal = true;
      this.hiddenTnid = tnid;
      this.$refs.traceNodeEditFormRef.resetFields();

      // 初始化轨迹环节代码下拉框
      let params = new Object();
      params.loginUid = getToken();
      selectTraceCycleListAPI(params).then(res => {
        if (res.data.code == 1) {
          this.traceNodeEditForm.traceCycleListOptions = res.data.data;
        } else if (res.data.code == 0) {
          this.$Notice.error({
            desc: res.data.msg
          });
        }
      });

      // 查询轨迹节点详情
      params = new Object();
      params.loginUid = getToken();
      params.id = tnid;
      selectTraceNodeDetailAPI(params).then(res => {
        if (res.data.code == 1) {
          this.traceNodeEditForm.cycleCode = res.data.data.cycleCode;
          this.traceNodeEditForm.nodeCode = res.data.data.nodeCode;
          this.traceNodeEditForm.nodeNameCn = res.data.data.nodeNameCn;
          this.traceNodeEditForm.nodeNameEn = res.data.data.nodeNameEn;
          this.traceNodeEditForm.remark = res.data.data.remark;
        } else if (res.data.code == 0) {
          this.$Notice.error({
            desc: res.data.msg
          });
        }
      });
    },

    editTraceNode() {
      this.$refs.traceNodeEditFormRef.validate(valid => {
        if (valid) {
          let params = new Object();
          params.loginUid = getToken();
          params.id = this.hiddenTnid;
          params.cycleCode = this.traceNodeEditForm.cycleCode;
          params.nodeCode = this.traceNodeEditForm.nodeCode;
          params.nodeNameCn = this.traceNodeEditForm.nodeNameCn;
          params.nodeNameEn = this.traceNodeEditForm.nodeNameEn;
          params.remark = this.traceNodeEditForm.remark;

          editTraceNodeAPI(params).then(res => {
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











