<template>
  <div class="dashboard-container">
    <el-row style="margin-bottom: 2rem;">

      <el-button v-for="(item, k) in classList" :key="k" :type="classId == item.value ? 'primary' : 'default'" size="mini" @click="getInfoByClass(item.value)">{{
        item.name }}</el-button>

      <el-input v-model="searchName" placeholder="请输入昵称" size="mini" class="search">
        <el-button slot="append" icon="el-icon-search" @click="onSearchName()" />
      </el-input>

      <el-switch v-model="showNobody" style="margin-left: 2rem;" active-text="显示三无人员" @change="onToggleShowNobody" />
    </el-row>

    <el-table v-loading="loading" :data="tableData" size="mini" style="width: 100%" border @sort-change="onSortChange">
      <el-table-column prop="id" label="#" />
      <el-table-column prop="class_id" label="班级" width="100" />
      <el-table-column label="用户头像" width="150">
        <template slot-scope="scope">
          <img v-if="scope.row.avatarUrl" :src="scope.row.avatarUrl" class="picture">
          <div v-else class="picture">
            无照片
          </div>
        </template>
      </el-table-column>
      <el-table-column label="照片墙" width="300">
        <template slot-scope="scope">

          <img v-for="(index, item) in scope.row.imageList" :key="index" :src="item" class="picture">

        </template>
      </el-table-column>

      <el-table-column prop="nickname" label="用户昵称" width="100" />
      <el-table-column prop="desc" label="用户介绍" sortable width="250">
        <template slot-scope="scope">
          <div v-if="!scope.row.edit" class="desc-show">{{ scope.row.desc }}</div>
          <el-input v-else v-model="scope.row.desc" type="textarea" />
        </template>
      </el-table-column>
      <el-table-column prop="score" label="用户质量分" sortable width="120">
        <template slot-scope="scope">
          <el-select v-model="scope.row.score" size="mini" placeholder="请打分" @change="onUpdateUserScore(scope.row)">
            <el-option
              v-for="item in [1, 2, 3, 4, 5]"
              :key="item + scope.row.id"
              :label="item"
              :value="item"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="是否展示" sortable width="120">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isShow" @change="onUpdateUserShow(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column sortable label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.createdAt | formatDate('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>

      <el-table-column sortable label="更新时间">
        <template slot-scope="scope">
          {{ scope.row.updatedAt | formatDate('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >{{ scope.row.edit ? '完成' : '编辑' }} </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      :current-page="curPage"
      :page-sizes="[20, 50, 100, 200]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import { getList, updateUserInfo } from '../../api/group'
import moment from 'moment'

export default {
  name: 'Dashboard',

  filters: {
    formatDate(time, format) {
      if (!time) return ''
      return moment(time).format(format)
    }
  },
  data() {
    return {
      classList: [
        { name: '一班', value: 'one' },
        { name: '二班', value: 'two' },
        { name: '三班', value: 'three' },
        { name: '四班', value: 'four' },
        { name: '五班', value: 'five' }
      ],
      tableData: [],
      searchName: '',
      orderBy: '',
      select: '',
      updateObj: {},
      isEdit: false,
      total: 0,
      pageSize: 20,
      curPage: 1,
      classId: 'one',
      showNobody: true,
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.getInfoByClass(this.classId)
  },
  methods: {
    async onSortChange({ column, prop, order }) {
      console.log('onSortChange', column, prop, order)

      switch (column.label) {
        case '创建时间':
          this.orderBy = 'created_at'
          break
        case '更新时间':
          this.orderBy = 'updated_at'
          break
        case '用户质量分':
          this.orderBy = 'score'
          break
        case '用户介绍':
          this.orderBy = 'desc'
          break
        case '是否展示':
          this.orderBy = 'is_show'
          break
        default:
          this.orderBy = 'id'
      }

      if (order === 'descending') {
        this.orderBy = '-' + this.orderBy
      } else {
        this.orderBy = '+' + this.orderBy
      }

      await this.getInfoByClass(this.classId)
    },
    onSearchName() {
      this.curPage = 1
      this.classId = ''
      this.getInfoByClass(this.classId)
    },
    onToggleShowNobody() {
      this.curPage = 1
      this.getInfoByClass(this.classId)
    },
    onClassClick(classId) {
      this.classId = classId
      this.curPage = 1
      this.getInfoByClass(this.classId)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getInfoByClass(this.classId)
    },
    handleCurrentChange(val) {
      this.curPage = val
      this.getInfoByClass(this.classId)
    },

    fetchData() {
      this.getInfoByClass(this.classId)
    },
    async onUpdateUserShow(row) {
      try {
        await updateUserInfo(row.id, { isShow: row.isShow })
        this.$message.success('更新成功')
      } catch (error) {
        this.$message.error('失败：' + error)
      }
    },
    // 用户质量打分
    async onUpdateUserScore(row) {
      try {
        await updateUserInfo(row.id, { score: row.score })
        this.$message.success('更新成功')
      } catch (error) {
        this.$message.error('失败：' + error)
      }
    },
    // 编辑用户信息
    async handleEdit(index, row) {
      if (this.isEdit && !row.edit) {
        Message({
          message: '一次性只能编辑一个用户',
          type: 'error',
          duration: 3 * 1000
        })
        return
      }
      this.updateObj = row
      if (this.isEdit) {
        const { desc, rank } = this.updateObj

        try {
          await updateUserInfo(row.id, { desc, rank })
          this.$message.success('更新成功')
        } catch (error) {
          this.$message.error('失败：' + error)
        }

        this.isEdit = false
        this.$set(this.tableData, index, { ...row, ...this.updateObj, edit: false })
      } else {
        row.edit = true
        this.isEdit = true
        this.$set(this.tableData, index, row)
      }
    },
    getInfoByClass(classId) {
      this.classId = classId

      this.loading = true

      getList({
        classId,
        page: this.curPage,
        limit: this.pageSize,
        showNobody: this.showNobody,
        searchName: this.searchName,
        orderBy: this.orderBy
      }).then(res => {
        console.log('RES', res)
        this.tableData = res.data.list
        this.total = res.data.total
      }).finally(() => {
        this.loading = false
      })
    },
    getInfoByNickName() {

    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.search {
  margin-left: 30px;
  width: 400px;
}

.desc-show {
  // height: 100px;
  height: 5rem;
  box-sizing: border-box;
  // border: 1px solid black;
  overflow-y: scroll
}

.picture {
  object-fit: contain;
  width: 5rem;
  height: 5rem;
  border: 1px solid gray;

}
</style>
