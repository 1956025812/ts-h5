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
          name="uploadFile"
          :format="excelFileTypes"
          :before-upload="handleUpload"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :action="uploadStandardTraceUrl"
        >
          <Button icon="ios-arrow-dropdown">选择文件</Button>
        </Upload>
        <div v-if="excelFile !== null">选中的文件: {{ excelFile.name }}</div>
      </div>
    </Modal>
  </div>
</template>



<script>
// 引用src/config/index.js里面的配置属性，注意：使用的时候不能加this,直接用自定义名称baseConfig.xxx
// 另外：还可以在v-if等类似的标签中使用$config.xxx来获取配置项
import baseConfig from "@/config/index.js";

import { getToken } from "@/libs/util.js";
import { importStandardTraceAPI } from "@/api/baseMaterial/standardTracePage.js";

export default {
  name: "StandardTraceImportPageComponent",
  data() {
    return {
      standardTraceImportModal: false,
      excelFile: null,
      excelFileTypes: ["xls", "xlsx"],
      uploadStandardTraceUrl: baseConfig.baseUrl.dev + "/standardtrace/import"
    };
  },

  methods: {
    /**
     * 初始化新增弹窗
     */
    openStandardTraceImportModal() {
      this.standardTraceImportModal = true;
      // 清空选择的文件和已上传的文件列表
      this.excelFile = null;
      this.$refs.uploadRef.clearFiles();
    },

    /**
     * 上传文件之前的钩子： 检验文件格式
     */
    handleUpload(file) {
      // 校验文件格式 注意：此处没有使用on-format-error方法，因为会和 return false 冲突
      let fileType = file.name.split(".");
      fileType = fileType[fileType.length - 1].toLowerCase();
      if (this.excelFileTypes.indexOf(fileType) < 0) {
        this.$Notice.warning({
          title: "必须是EXCEL文件",
          desc: "文件后缀名必须是xls或者xlsx"
        });
      } else {
        this.excelFile = file;
      }

      // 若返回 false 或者 Promise 则停止上传
      return false;
    },

    /**
     * 导入标准轨迹   TODO  2  不想写死路径 想从js里面获取路径  3  后台接收不到file参数
     */
    importStandardTrace() {
      if (this.excelFile == null) {
        this.$Notice.warning({
          title: "EXCEL文件不能为空",
          desc: "EXCEL文件不能为空,请重新上传！"
        });
        return;
      }

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








