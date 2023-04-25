<template>
  <div class="main">

    <h1 v-if="mode=='edit'">编辑活动</h1>
    <h1 v-else>创建活动</h1>

    <div>

      <div class="btn-group">
        <!-- 当前活动状态 -->
        <el-tag :type="statusMap[activityStatus].type" style="margin-right: 10px;">
          {{ statusMap[activityStatus].txt }}
        </el-tag>

        <el-button v-if="activityStatus==0" size="small" type="warning" @click="onPublish()">保存并发布</el-button>
        <el-button size="small" type="primary" @click="onSave()">保存</el-button>

      </div>
    </div>

    <h3>活动信息：</h3>
    <div class="information">
      <el-form ref="form" :model="activityForm" label-width="80px" size="mini">
        <el-form-item label="名称">
          <el-input v-model="activityForm.title" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="activityForm.status">
            <el-option v-for="(item, key) in statusMap" :key="key" :label="item.txt" :value="Number(key)" />
          </el-select>
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
      <Editor id="editor" v-model="content" :init="tinymceInit" />
    </div>

    <Position :maker-position.sync="position" :dialog-visible.sync="showMap" @confirm="onMapConfirm" />

  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
import Position from '@/components/Position'

import { createActivity, updateActivity, getActivity } from '@/api/activity'

export default {
  name: 'ActivityDetail',
  components: {
    Editor,
    Position
  },
  data() {
    return {
      activityStatus: 0,
      statusMap: {
        0: { type: 'info', txt: '未发布' },
        1: { type: 'success', txt: '已发布' },
        2: { type: 'danger', txt: '已取消' }
        // 3: { type: 'primary', txt: '进行中' },
        // 4: { type: 'primary', txt: '已结束' }
      },

      position: [114.06, 22.54],
      showMap: false,
      // mode: 'create', // create, edit
      content: '',
      coverImg: '',
      tinymceInit: {
        height: 600,
        language: 'zh_CN',
        plugins: 'lists link image table help wordcount paste',
        toolbar: 'undo redo | formatselect | image bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat',
        images_upload_url: '/go/api/admin/editor/upload',
        images_upload_base_path: 'http://localhost:8100/',
        images_file_types: 'jpeg,jpg,png,gif,webp',
        automatic_uploads: true,
        paste_data_images: true,
        content_style: 'img {max-width:100%;}', // 限制最大图片宽度
        images_upload_max_filesize: '2m'// 限制图片文件大小
      },
      activityForm: {
        title: '',
        status: 0,
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
  computed: {
    mode() { // mode: 'create', // create, edit
      return this.$route.query.mode
    }
  },
  async created() {
    // get params from query
    // this.mode = this.$route.query.mode
    this.id = this.$route.query.id

    console.log('mode', this.mode)
    console.log('id', this.id)

    if (this.mode === 'edit') {
      // get activity detail
      const res = await getActivity(this.id)
      console.log('res', res)
      res.timeRange = [new Date(res.timeStart), new Date(res.timeEnd)]
      res.price = res.price / 100
      this.activityForm = res
      this.content = res.content
      this.activityStatus = res.status
    }
  },
  methods: {
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
    onCoverChange() {
      const img = this.$refs.upload_cover.uploadFiles[0].raw
      // convert to base64 data URL
      const reader = new FileReader()
      reader.readAsDataURL(img)
      reader.onload = () => {
        this.coverImg = reader.result
      }
    },
    onMapConfirm(e) {
      console.log('onMapConfirm', e)
      this.activityForm.geoLoc = `${e.position[0]}, ${e.position[1]}`
      if (!this.activityForm.location) {
        // 如果没有填写地点，则自动填写
        this.activityForm.location = e.address
      }
    },
    async onPublish() {
      this.activityForm.status = 1
      this.onSave()
    },
    async onSave() {
      const form = JSON.parse(JSON.stringify(this.activityForm))
      form.price = form.price * 100
      form.content = this.content
      form.timeStart = new Date(form.timeRange[0]).valueOf()
      form.timeEnd = new Date(form.timeRange[1]).valueOf()

      // 提交封面图通过bas64 图片，显示封面图则转为url
      form.coverImg = this.coverImg

      // show loading
      this.$loading({
        lock: true,
        text: '保存中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      try {
        if (this.mode === 'edit') {
          const res = await updateActivity(this.id, form)
          console.log('update res', res)

          this.$loading().close()
          this.$message({ message: '保存成功', type: 'success' })
        } else {
          const res = await createActivity(form)

          this.$loading().close()
          this.$message({ message: '保存成功', type: 'success' })

          console.log('create res', res)
          const id = res.id

          // redirect to edit page
          this.$router.replace({
            path: '/activity/detail',
            query: { mode: 'edit', id }
          })
        }
      } catch (error) {
        this.$loading().close()
        this.$message({ message: `保存失败: ${error}`, type: 'error' })
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
