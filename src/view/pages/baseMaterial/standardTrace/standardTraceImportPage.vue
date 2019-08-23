<template>
  <div>
    <Button
      class="export-btn"
      style="border: none; appearance:none; margin-bottom: 5px;"
      @click="openStandardTraceImportModal"
    >
      <Icon type="ios-arrow-dropdown" size="25" />
    </Button>
    <Modal
      v-model="standardTraceImportModal"
      title="导入标准轨迹"
      ok-text="导入"
      @on-ok="importStandardTrace"
      :mask-closable="false"
      :closable="false"
    >
      <a>点击下载导入模板</a>
      <br />
      <br />
      <div>
        <Upload
          ref="uploadRef"
          :format="['xls','xlsx']"
          :before-upload="handleUpload"
          :on-format-error="handleFormatError"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          action="http://localhost:8001/standardtrace/import"
        >
          <Button icon="ios-arrow-dropdown">选择文件</Button>
        </Upload>
        <div v-if="excelFile !== null">选中的文件: {{ excelFile.name }}</div>
      </div>
    </Modal>
  </div>
</template>



<script>
import { getToken } from "@/libs/util.js";
import { importStandardTraceAPI } from "@/api/baseMaterial/standardTracePage.js";

export default {
  name: "StandardTraceImportPageComponent",
  data() {
    return {
      standardTraceImportModal: false,
      excelFile: null
    };
  },

  methods: {
    /**
     * 初始化新增弹窗
     */
    openStandardTraceImportModal() {
      this.standardTraceImportModal = true;
      this.excelFile = null;
    },

    /**
     * 上传文件之前的钩子，参数为上传的文件，若返回 false 或者 Promise 则停止上传
     * TODO 1  这样子格式校验不起作用了
     */
    handleUpload(file) {
      this.excelFile = file;
      return false;
    },

    /**
     * 文件类型错误提示
     */
    handleFormatError(file) {
      this.excelFile = null;
      this.$Notice.warning({
        title: "必须是EXCEL文件",
        desc: "文件后缀名必须是xls或者xlsx"
      });
    },

    /**
     * 导入标准轨迹   TODO  2  不想写死路径 想从js里面获取路径  3  后台接收不到file参数
     */
    importStandardTrace() {
      this.$refs.uploadRef.post(this.excelFile);

      /* let params = new Object();
      params.loginUid = getToken();
      params.file = this.excelFile;
      importStandardTraceAPI(params).then(res => {
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
      }); */
    },

    /**
     * 导入成功
     */
    handleUploadSuccess(response, file, fileList) {
      alert(JSON.stringify(response));
    },

    /**
     * 导入失败
     */
    handleUploadError(response, file, fileList) {
      alert(JSON.stringify(response));
    }
  },

  created() {}
};
</script>








