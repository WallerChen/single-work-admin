<template>
  <div class="dashboard-container">
    <el-row style="margin-bottom: 2rem;">
      <el-button size="mini" @click="getInfoByClass('one')">一班</el-button>
      <el-button size="mini" @click="getInfoByClass('two')">二班</el-button>
      <el-button size="mini" @click="getInfoByClass('three')">三班</el-button>
      <el-button size="mini" @click="getInfoByClass('four')">四班</el-button>

      <el-input v-model="searchWord" placeholder="请输入昵称" size="mini" class="search">
        <el-button slot="append" icon="el-icon-search" @click="getInfoByNickName()" />
      </el-input>

      <el-switch v-model="showNobody" active-text="显示三无人员" @change="onToggleShowNobody" />
    </el-row>

    <el-table :data="tableData" size="mini" style="width: 100%" border>
      <el-table-column prop="id" label="#" />
      <el-table-column prop="classId" label="班级" width="100" />
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
      <!-- <el-table-column prop="desc" label="强制排序" sortable width="100">
        <template slot-scope="scope">
          <div v-if="!scope.row.edit">{{ scope.row.rank }}</div>
          <el-input v-else v-model="scope.row.rank" placeholder="请输入排序" />
        </template>
      </el-table-column> -->
      <el-table-column label="是否展示" sortable width="120">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isShow" @change="onUpdateUserShow(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" />
      <el-table-column prop="updated_at" label="更新时间" />
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
import { getList, getListByNickname, updateUserInfo } from '../../api/group'

export default {
  name: 'Dashboard',
  data() {
    return {
      tableData: [],
      searchWord: '',
      select: '',
      updateObj: {},
      isEdit: false,
      total: 0,
      pageSize: 20,
      curPage: 1,
      classId: 'one',
      showNobody: true
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
      getList({
        classId,
        page: this.curPage,
        limit: this.pageSize,
        showNobody: this.showNobody
      }).then(res => {
        console.log('RES', res)
        this.tableData = res.data.list
        this.total = res.data.total
      })
    },
    getInfoByNickName() {
      getListByNickname({ nickName: this.searchWord }).then(res => {
        this.tableData = res.rows
      })
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
