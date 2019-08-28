<template>
  <div>
    <Button
      class="export-btn"
      style="border: none; appearance:none; margin-bottom: 5px;"
      @click="openTraceOriginalStandardAddModal"
    >
      <Icon type="md-add" size="25" />
    </Button>
    <Modal
      v-model="traceOriginalStandardAddModal"
      title="新增原始轨迹标准轨迹映射"
      ok-text="保存"
      @on-ok="saveTraceOriginalStandard"
      :mask-closable="false"
      :closable="false"
    >
      <Form
        ref="traceOriginalStandardAddFormRef"
        :model="traceOriginalStandardAddForm"
        :rules="traceOriginalStandardAddFormRules"
        :label-width="120"
      >
        <div>添加的内容TODO</div>
      </Form>
    </Modal>
  </div>
</template>



<script>
import { getToken } from "@/libs/util.js";
import { saveTraceOriginalStandardAPI } from "@/api/ruleConfig/traceOriginalStandardPage.js";

export default {
  name: "TraceOriginalStandardAddPageComponent",
  data() {
    return {
      traceOriginalStandardAddModal: false,
      traceOriginalStandardAddForm: {},
      traceOriginalStandardAddFormRules: {}
    };
  },

  methods: {
    openTraceOriginalStandardAddModal() {
      this.traceOriginalStandardAddModal = true;
      this.$refs.traceOriginalStandardAddFormRef.resetFields();
    },

    saveTraceOriginalStandard() {
      this.$refs.traceOriginalStandardAddFormRef.validate(valid => {
        if (valid) {
          alert("新增TODO");
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








