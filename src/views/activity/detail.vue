<template>
  <div class="main">

    <h1 v-if="mode == 'edit'">编辑活动</h1>
    <h1 v-else>创建活动</h1>

    <div>
      <!-- 当前活动状态 -->
      <div class="btn-group">
        <el-button size="small" type="primary" @click="onPublish">发布</el-button>
        <el-button size="small" type="warning" @click="onSave">保存草稿</el-button>
      </div>
    </div>

    <h3>活动信息：</h3>
    <div class="information">
      <el-form ref="form" :model="activityForm" label-width="80px" size="mini">
        <el-form-item label="名称">
          <el-input v-model="activityForm.title" />
        </el-form-item>

        <el-form-item label="价格">
          <el-input
            v-model="activityForm.price"
            placeholder="请输入价格（元）"
            :formatter="formatDisplayPrice"
            :parser="parsePrice"
            :maxlength="14"
            @keyup.native="formatPrice"
          >
            <template #prepend>
              <span>¥</span>
            </template>
          </el-input>

        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            v-model="activityForm.timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="activityForm.brief" />
        </el-form-item>
        <el-form-item label="组织者">
          <el-input v-model="activityForm.organizer" />
        </el-form-item>
        <el-form-item label="地点">
          <el-col :span="12">
            <el-input v-model="activityForm.location" />
          </el-col>
          <el-col :span="4" style="text-align: right;"> 地图坐标： </el-col>
          <el-col :span="8">
            <el-input v-model="activityForm.geoLoc">
              <el-button slot="append" icon="el-icon-location-information" @click="showMap = true" />
            </el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="封面图">
          <!-- <el-input v-model="activityForm.coverImg" /> -->
          <el-upload ref="upload_cover" :show-file-list="false" action="#" :auto-upload="false" accept="image/*" :on-change="onCoverChange">
            <img v-if="coverImg" :src="coverImg" class="cover">
            <i v-else class="el-icon-plus cover-uploader-icon" />
          </el-upload>

        </el-form-item>
      </el-form>
    </div>

    <h3>文案编辑：</h3>
    <div class="editor-area">
      <!-- tinymce-script-src -->
      <Editor
        id="editor"
        v-model="content"
        :init="tinymceInit"

        api-key="7q9jf03l3uzkjxf2mehm98tyygk2chohslgwsbepnh5xfe76"
        @onBeforeSetContent="beforeSetContent"
        @onSetContent="onSetContent"
        @onSelectionChange="onSelectionChange"
      />
    </div>

    <Position :maker-position.sync="position" :dialog-visible.sync="showMap" @confirm="onMapConfirm" />

  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
import Position from '@/components/Position'

import { createActivity, updateActivity, getActivity, tinyMceUploadImg, upload } from '@/api/activity'
import { Message } from 'element-ui'

export default {
  name: 'ActivityDetail',
  components: {
    Editor,
    Position
  },
  data() {
    return {
      position: [114.06, 22.54],
      showMap: false,
      mode: 'create', // create, edit
      content: '',
      coverImg: '',
      editor: null,
      tinymceInit: {
        apiKey: '7q9jf03l3uzkjxf2mehm98tyygk2chohslgwsbepnh5xfe76',
        height: 600,
        // width: (750 - 40) / 2,
        language: 'zh_CN',
        plugins: 'lists link image help wordcount paste',
        toolbar: 'undo redo | formatselect | image bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | addSmallImg addBigImg',

        images_file_types: 'jpeg,jpg,png,gif,webp',
        automatic_uploads: true,
        paste_data_images: true,
        body_style: 'margin: 0',
        content_style: 'body {width: calc(375px + 2px); margin: 0; padding: 15px; border: 1px dashed red; box-sizing: border-box;} ', // border-box 有左右1个px
        // 'p {padding-left: 15px; padding-right: 15px; box-sizing: border-box;}',

        // content_style: 'img { object-fit: cover; max-width:30%; max-height:30%; margin: 10px; border: 5px solid red; padding: 3px; }',
        // inline_styles: false,
        // content_style: '.small-img { object-fit: cover; max-width:100px; max-height:100px; margin: 10px; border: 5px dashed red; padding: 3px; }',

        images_upload_max_filesize: '2m', // 限制图片文件大小
        images_upload_handler: function(blobInfo, success, failure, progress) {
          tinyMceUploadImg(blobInfo, success, failure, progress)
        },
        setup: (editor) => {
          this.editor = editor

          editor.ui.registry.addButton('addSmallImg', this.addImgButtonCfg('small'))
          editor.ui.registry.addButton('addBigImg', this.addImgButtonCfg('big'))
        }

      },
      activityForm: {
        title: '',
        coverImg: '',
        price: '',
        timeRange: [new Date(), new Date()],
        brief: '',
        organizer: '',
        location: '',
        geoLoc: ''
      }
    }
  },
  async created() {
    // get params from query
    this.mode = this.$route.query.mode
    this.id = this.$route.query.id

    if (this.mode === 'edit') {
      // get activity detail
      const res = await getActivity(this.id)
      console.log('getActivity res', res)
      const activity = res.data
      activity.timeRange = [new Date(activity.timeStart), new Date(activity.timeEnd)]
      activity.price = activity.price / 100
      this.activityForm = activity
      this.content = activity.content
    }
  },
  methods: {
    onInsertImg(imgType) {
      const input = document.createElement('input')
      input.value = '选择文件'
      input.type = 'file'
      input.onchange = event => {
        const file = event.target.files[0]
        const blobInfo = {
          blob: () => {
            return file
          }
        }
        const failure = (err) => {
          console.log('upload error', err)
        }
        const success = (res) => {
          console.log('upload success', res)
          let imgClass = 'small-img'
          if (imgType === 'big') {
            imgClass = 'big-img'
          }

          this.editor.insertContent(`<img class="${imgClass}" src="${res}">`)
        }

        tinyMceUploadImg(blobInfo, success, failure, null)
      }
      input.click()
    },
    onSelectionChange() {
    },
    addImgButtonCfg(imgType) {
      // imgType    small, big
      // actionType add, set

      let imgTxt = '小图'
      const actionTxt = '插入/设置'
      let imgClass = `small-img`
      if (imgType === 'big') {
        imgTxt = '大图'
        imgClass = `big-img`
      }

      return {
        text: `<span>${actionTxt}${imgTxt}</span>`,
        onAction: (e) => {
          const node = this.editor.selection.getNode()
          console.log('nodeName', node.nodeName)
          if (node.nodeName === 'IMG') {
            this.editor.dom.removeClass(node, 'small-img')
            this.editor.dom.removeClass(node, 'big-img')
            this.editor.dom.addClass(node, imgClass)
            this.onSetContent(null)
          } else {
            // 插入
            this.onInsertImg(imgType)
          }
        }
      }
    },
    onSetContent(params) {
    // 内容变更后进行样式设置
      let nodes = this.editor.getBody().getElementsByClassName('small-img')

      for (const node of nodes) {
        const nodeIndex = this.editor.dom.nodeIndex(node)
        console.log('nodeIndex', nodeIndex, node)
        let marginLeft = '15px'
        if (nodeIndex % 3 === 0) {
          marginLeft = '0'// 左边第一个元素不需要margin
        }

        this.editor.dom.setStyles(node, {
          'width': '105px',
          'height': '105px',
          'object-fit': 'cover',
          'border-radius': '10px',
          'margin': '0',
          'margin-left': marginLeft,
          'margin-top': '15px',
          // 'border-radius': '0',
          // 'border': '2px solid green',
          // 'box-sizing': 'border-box',
          'border': null
        })
      }

      nodes = this.editor.getBody().getElementsByClassName('big-img')
      for (const node of nodes) {
        this.editor.dom.setStyles(node, {
          'width': '345px',
          'height': 'auto',
          'object-fit': null,
          'border-radius': '10px',
          'margin': '0',
          // 'margin-left': '15px',
          // 'box-sizing': 'border-box'
          // 'border-radius': '0',
          // 'border': '2px solid green',
          'border': null
        })
      }
    },
    beforeSetContent(params) {
      // console.log('beforeSetContent', params)
    },
    formatPrice() {
      this.activityForm.price = this.activityForm.price.replace(/[^\d\.]/g, '')
      // 如果小数点后面有3位及以上的数字，则截取前两位
      const decimalIndex = this.activityForm.price.indexOf('.')
      if (decimalIndex >= 0 && this.activityForm.price.length - decimalIndex > 3) {
        this.activityForm.price = this.activityForm.price.slice(0, decimalIndex + 3)
      }
    },
    formatDisplayPrice(value) {
      if (!value) {
        return ''
      }
      const yuan = parseFloat(value).toFixed(2)
      return yuan
    },
    parsePrice(value) {
      const yuan = parseFloat(value)
      return yuan.toFixed(2)
    },
    async onCoverChange() {
      const img = this.$refs.upload_cover.uploadFiles[0].raw
      const res = await upload(img, 'activity/cover')
      this.coverImg = res.data.url
    },
    onMapConfirm(e) {
      console.log('onMapConfirm', e)
      this.activityForm.geoLoc = `${e.position[0]}, ${e.position[1]}`
      if (!this.activityForm.location) {
        // 如果没有填写地点，则自动填写
        this.activityForm.location = e.address
      }
    },
    onPublish() {
      console.log(this.content)
    },
    async onSave() {
      const form = JSON.parse(JSON.stringify(this.activityForm))
      form.price = form.price * 100
      form.content = this.content
      form.timeStart = new Date(form.timeRange[0]).valueOf()
      form.timeEnd = new Date(form.timeRange[1]).valueOf()
      form.coverImg = this.coverImg

      if (this.mode === 'edit') {
        const res = await updateActivity(this.id, form)
        console.log('update res', res)

        Message.success('更新成功')
      } else {
        const res = await createActivity(form)
        console.log('create res', res)

        Message.success('创建成功')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  margin: 1rem;
}

.editor-area {
  border: 1px solid gray;
  // width: calc(375px - 20px);
}

.btn-group {
  text-align: right;

  .el-button {
    width: 10rem;
  }
}

.cover,
.cover-uploader-icon {
  min-width: 5rem;
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed gray;
}

</style>
