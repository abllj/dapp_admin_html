<template>
  <div>
    <div ref="editor" style="text-align:left;margin: 5px;width: 650px" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import E from 'wangeditor'
import { getToken } from '@/utils/auth'
export default {
  name: 'Editor',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      headers: {
        'Authorization': getToken()
      },
      info: null,
      editor: null
    }
  },
  computed: {
    ...mapGetters([
      'ossUploadImage'
    ])
  },
  watch: {
    value: function(val) {
      this.editor.txt.html(val)
      // this.editor.txt.html(val)
    }
  },
  mounted() {
    this.editor = new E(this.$refs.editor)
    // 自定义菜单配置

    this.editor.customConfig = this.editor.customConfig ? this.editor.customConfig : this.editor.config
    this.editor.customConfig.uploadImgShowBase64 = true // 使用 base64 保存图片
    // 不可修改
    this.editor.customConfig.uploadImgHeaders = this.headers
    // 自定义文件名，不可修改，修改后会上传失败
    this.editor.customConfig.uploadFileName = 'upfile'
    this.editor.customConfig.uploadImgServer = this.ossUploadImage // 上传图片到服务器
    this.editor.customConfig.uploadImgHooks = {
      customInsert: function(insertImg, result, editor) {
        insertImg(result.url)
      }
    }
    this.editor.customConfig.onchange = (html) => {
      this.info = html
      this.$emit('change', this.info)
      this.$emit('input', this.info)
    }
    this.editor.create()
    this.editor.txt.html(this.value)
  }
}
</script>

<style scoped>
.editor-content{
  padding-left: 5px;
}
</style>
