<template>
  <div>
    <el-upload :action="'/api/oss/ossUpload'" :headers="headers" :on-remove="handleRemove" :on-preview="handlePreview"
      :on-success="handleUploadSuccess" :before-remove="beforeRemove" :file-list="fileList" :name="'upfile'" multiple
      :limit="1" :on-exceed="handleExceed">

   <!--   <div class="eladmin-upload"><i class="el-icon-upload" /> 添加文件</div>
      <div slot="tip" class="el-upload__tip">可上传任意格式文件，且不超过100M</div> -->
      <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
      <div slot="tip" style="display: block;" class="el-upload__tip">请勿上传违法文件，且文件不超过100M</div>
    </el-upload>
  </div>
</template>

<script>
  import {
    getToken
  } from '@/utils/auth'
  import {
    mapGetters
  } from 'vuex'
  export default {
    props: {
      value: {
        default: '',
        type: String
      }
    },
    data() {
      return {
        resourcesUrl: '',
        headers: {
          'Authorization': getToken()
        }
      }
    },
    computed: {
      ...mapGetters([
        'uploadApi'
      ]),
      fileList() {
        const res = []
        if (this.value) {
          res.push({
            name: this.value,
            url: this.resourcesUrl + this.value,
            response: this.value
          })
        }
        this.$emit('input', this.value)
        return res
      }
    },
    methods: {
      // 图片上传
      handleUploadSuccess(response, file, fileList) {
        this.$emit('input', file.response.url)
      },
      handleRemove(file, fileList) {
        this.$emit('change', file)
      },
      handlePreview(file) {
       //console.log(file);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`)
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },

    }
  }
</script>

<style lang="scss">
</style>
