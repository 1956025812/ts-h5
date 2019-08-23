<template>
  <div>
    <Button
      class="export-btn"
      style="border: none; appearance:none; margin-bottom: 5px;"
      @click="openTraceCycleEditModal"
    >
      <Icon type="md-Edit" size="25" />
    </Button>
    <Modal
      v-model="traceCycleEditModal"
      title="修改轨迹环节"
      ok-text="保存"
      @on-ok="editTraceCycle"
      :mask-closable="false"
      :closable="false"
    >
      <Input v-model="hiddenTcid" style="display:none" />
      <Form
        ref="traceCycleEditFormRef"
        :model="traceCycleEditForm"
        :rules="traceCycleEditFormRules"
        :label-width="120"
      >
        <FormItem label="环节代码：" prop="cycleCode">
          <Input v-model="traceCycleEditForm.cycleCode" placeholder="限一个字符，必须为字母或数字" disabled></Input>
        </FormItem>
        <FormItem label="环节中文名称：" prop="cycleNameCn">
          <Input v-model="traceCycleEditForm.cycleNameCn" placeholder="限20个字"></Input>
        </FormItem>
        <FormItem label="环节英文名称：" prop="cycleNameEn">
          <Input v-model="traceCycleEditForm.cycleNameEn" placeholder="限制50个字符"></Input>
        </FormItem>
        <FormItem label="环节用途描述：" prop="remark">
          <Input
            v-model="traceCycleEditForm.remark"
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
import {
  selectTraceCycleDetailAPI,
  editTraceCycleAPI
} from "@/api/baseMaterial/traceCyclePage.js";

export default {
  name: "TraceCycleEditPageComponent",
  data() {
    return {
      traceCycleEditModal: false,
      hiddenTcid: "",
      traceCycleEditForm: {
        cycleCode: "",
        cycleNameCn: "",
        cycleNameEn: "",
        remark: ""
      },
      traceCycleEditFormRules: {
        cycleCode: [
          {
            required: true,
            message: "环节代码不能为空",
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
        cycleNameCn: [
          {
            required: true,
            message: "环节中文名称不能为空",
            trigger: "blur"
          },
          {
            type: "string",
            max: 20,
            message: "限20个字",
            trigger: "blur"
          }
        ],
        cycleNameEn: [
          {
            required: true,
            message: "环节英文名称不能为空",
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
    openTraceCycleEditModal(tcid) {
      this.traceCycleEditModal = true;
      this.hiddenTcid = tcid;
      this.$refs.traceCycleEditFormRef.resetFields();

      let params = new Object();
      params.loginUid = getToken();
      params.id = tcid;
      selectTraceCycleDetailAPI(params).then(res => {
        if (res.data.code == 1) {
          this.traceCycleEditForm.cycleCode = res.data.data.cycleCode;
          this.traceCycleEditForm.cycleNameCn = res.data.data.cycleNameCn;
          this.traceCycleEditForm.cycleNameEn = res.data.data.cycleNameEn;
          this.traceCycleEditForm.remark = res.data.data.remark;
        } else if (res.data.code == 0) {
          this.$Notice.error({
            desc: res.data.msg
          });
        }
      });
    },

    editTraceCycle() {
      this.$refs.traceCycleEditFormRef.validate(valid => {
        if (valid) {
          let params = new Object();
          params.loginUid = getToken();
          params.id = this.hiddenTcid;
          params.cycleCode = this.traceCycleEditForm.cycleCode;
          params.cycleNameCn = this.traceCycleEditForm.cycleNameCn;
          params.cycleNameEn = this.traceCycleEditForm.cycleNameEn;
          params.remark = this.traceCycleEditForm.remark;

          editTraceCycleAPI(params).then(res => {
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











