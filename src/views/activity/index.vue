<template>
  <div class="main">

    <div>
      <el-button size="mini" type="primary" @click="onCreate">新建活动</el-button>
    </div>

    <el-table v-loading="listLoading" :data="tableData" border header-align="center" align="center">
      <el-table-column prop="title" label="名称" width="100" />
      <el-table-column prop="price" label="价格" width="120" />
      <el-table-column prop="location" label="地点" width="120" />
      <el-table-column prop="brief" label="简介" />
      <el-table-column prop="organizer" label="组织者" width="120" />
      <!--  -->

      <el-table-column prop="createdAt" label="创建时间" width="160">
        <template slot-scope="scope">
          {{ scope.row.createdAt | formatDate('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="更新时间" width="160">
        <template slot-scope="scope">
          {{ scope.row.updatedAt | formatDate('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <div>
            <el-button size="mini" type="primary" @click="onEdit(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" @click="onRemove(scope.row.id)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      :auto-scroll="false"
      @pagination="fetchData"
    />
  </div>
</template>

<script>
import { getActivityList } from '@/api/activity'
import Pagination from '@/components/Pagination'
import moment from 'moment'

export default {
  name: 'Activity',
  components: {
    Pagination
  },
  filters: {
    formatDate(time, format) {
      if (!time) return ''
      return moment(time).format(format)
    }
  },
  data() {
    return {

      listLoading: false,
      searchStatus: '',

      tableData: [],

      total: 0,
      listQuery: {
        page: 1,
        limit: 5
      }
    }
  },
  async created() {
    this.fetchData()
  },
  methods: {

    onEdit(id) {
      this.$router.push({ path: `/activity/detail?mode=edit&id=${id}` })
    },
    onRemove(id) {
      this.$confirm('删除该活动, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        // pass
      })
    },

    async fetchData() {
      this.listLoading = true

      const query = {
        limit: this.listQuery.limit,
        offset: (this.listQuery.page - 1) * this.listQuery.limit,
        status: this.searchStatus
      }

      getActivityList(query).then(res => {
        console.log('getActivityList res', res)
        this.tableData = res.data.list
        this.total = res.data.total
        this.listLoading = false
      })
      this.tableData = []
      this.listLoading = false
    },
    handleSearch() {
      this.fetchData()
    },
    onCreate() {
      this.$router.push({ path: '/activity/detail?mode=create' })
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  margin: 1rem;
}

.searcher {
  margin-bottom: 2rem;
}

.img-list {
  // height: 10rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .image {
    display: block;
    border: 1px solid black;
    width: 6rem;
    height: 6rem;
    margin: 0.5rem;
    flex-shrink: 0;
  }
}

.btn-reject:not(:disabled) {
  color: red;
}
</style>
