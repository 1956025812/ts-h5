<template>
  <div>
    <Button
      class="export-btn"
      style="border: none; appearance:none; margin-bottom: 5px;"
      @click="openTraceOriginalStandardEditModal"
    >
      <Icon type="md-Edit" size="25" />
    </Button>
    <Modal
      v-model="traceOriginalStandardEditModal"
      title="修改原始轨迹标准轨迹映射"
      ok-text="保存"
      @on-ok="editTraceOriginalStandard"
      :mask-closable="false"
      :closable="false"
    >
      <Form
        ref="traceOriginalStandardEditFormRef"
        :model="traceOriginalStandardEditForm"
        :rules="traceOriginalStandardEditFormRules"
        :label-width="120"
      >
        <div>修改的内容TODO</div>
      </Form>
    </Modal>
  </div>
</template>



<script>
import { getToken } from "@/libs/util.js";
import { editTraceOriginalStandardAPI } from "@/api/ruleConfig/traceOriginalStandardPage.js";

export default {
  name: "TraceOriginalStandardEditPageComponent",
  data() {
    return {
      traceOriginalStandardEditModal: false,
      traceOriginalStandardEditForm: {},
      traceOriginalStandardEditFormRules: {}
    };
  },

  methods: {
    openTraceOriginalStandardEditModal() {
      this.traceOriginalStandardEditModal = true;
      this.$refs.traceOriginalStandardEditFormRef.resetFields();
    },

    editTraceOriginalStandard() {
      this.$refs.traceOriginalStandardEditFormRef.validate(valid => {
        if (valid) {
          alert("修改TODO");
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








