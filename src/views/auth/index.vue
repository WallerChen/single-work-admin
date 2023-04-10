<template>
  <div class="main">

    <div class="searcher">
      <!-- <el-input v-model="searchIdcard" placeholder="身份证" style="width: 20rem;" /> -->

      <el-select v-model="searchStatus" placeholder="请选择">
        <el-option label="全部" value="" />
        <el-option label="任一未审核" :value="UNCHECKED" />
        <el-option label="全部已通过" :value="PASS" />
        <el-option label="任一已驳回" :value="REJECT" />
      </el-select>

      <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
    </div>

    <el-table v-loading="listLoading" :data="tableData" border header-align="center" align="center">
      <el-table-column prop="id" label="id" width="100" />
      <el-table-column prop="sex" label="性别" width="100" />
      <el-table-column prop="realName" label="真实姓名" width="120" />
      <el-table-column prop="idCard" label="身份证" width="120" />
      <!--  -->
      <el-table-column label="身份证状态" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.idCardStatus === PASS" type="success">已通过</el-tag>
          <el-tag v-else type="info">未通过</el-tag>
        </template>
      </el-table-column>
      <!--  -->
      <el-table-column label="学历" width="180">
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.education" :key="index" width="180">
            {{ item }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="学历照片">
        <template slot-scope="scope">
          <div class="img-list">
            <!-- <img v-for="(item, index) in scope.row.educationImages" :key="index" :src="item"> -->
            <el-image
              v-for="(item, index) in scope.row.educationImages"
              :key="index"
              class="image"
              :src="item"
              :preview-src-list="scope.row.educationImages"
            />
          </div>
        </template>
      </el-table-column>

      <el-table-column label="学历状态" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.educationAuthStatus === UNCHECKED" type="info">未审核</el-tag>
          <el-tag v-else-if="scope.row.educationAuthStatus === PASS" type="success">已通过</el-tag>
          <el-tag v-else type="danger">已驳回</el-tag>

          <div>
            <el-button
              class="btn-reject"
              :disabled="scope.row.educationAuthStatus==REJECT"
              type="text"
              @click="handleVerify(scope.$index,'education' ,REJECT)"
            >驳回</el-button>
            <el-button :disabled="scope.row.educationAuthStatus==PASS" type="text" @click="handleVerify(scope.$index,'education', PASS)">通过</el-button>
          </div>
        </template>
      </el-table-column>
      <!-- 工作 -->
      <el-table-column prop="jobCompany" label="工作" width="180" />

      <el-table-column label="工作照片">
        <template slot-scope="scope">
          <div class="img-list">
            <!-- <img v-for="(item, index) in scope.row.jobImages" :key="index" :src="item"> -->
            <el-image
              v-for="(item, index) in scope.row.jobImages"
              :key="index"
              class="image"
              :src="item"
              :preview-src-list="scope.row.jobImages"
            />
          </div>
        </template>
      </el-table-column>

      <el-table-column label="工作状态" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.jobAuthStatus === UNCHECKED" type="info">未审核</el-tag>
          <el-tag v-else-if="scope.row.jobAuthStatus === PASS" type="success">已通过</el-tag>
          <el-tag v-else type="danger">已驳回</el-tag>

          <div>
            <el-button class="btn-reject" :disabled="scope.row.jobAuthStatus==REJECT" type="text" @click="handleVerify(scope.$index,'job' ,REJECT)">驳回</el-button>
            <el-button :disabled="scope.row.jobAuthStatus==PASS" type="text" @click="handleVerify(scope.$index,'job', PASS)">通过</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="200" />
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

import { getStudentInfo, verifyInfo } from '@/api/infoVerify'
import Pagination from '@/components/Pagination'

const UNCHECKED = 0
const PASS = 1
const REJECT = 2

const BOS_ADDR = 'https://single-student.bj.bcebos.com/'
export default {
  name: 'AuthIdCard',
  components: {
    Pagination
  },
  data() {
    return {
      UNCHECKED,
      PASS,
      REJECT,

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

    async fetchData() {
      this.listLoading = true

      const query = {
        limit: this.listQuery.limit,
        offset: (this.listQuery.page - 1) * this.listQuery.limit,
        status: this.searchStatus
      }
      const res = await getStudentInfo(query)
      console.log('res.count', res.count, res)
      this.total = res.count

      this.tableData = []

      for (const item of res.rows) {
        this.tableData.push({
          id: item.id,
          openid: item.openid,
          realName: item.name,
          idCard: item.id_card,
          sex: item.sex,
          idCardStatus: item.id_card_status,
          failTries: item.fail_tries,

          education: [
            `本科: ${item.school_bachelor}`,
            `硕士: ${item.school_master}`,
            `博士: ${item.school_doctor}`
          ],
          educationImages: item.education_images.split('\n').map(v => BOS_ADDR + v),
          educationAuthStatus: item.education_auth_status,

          jobCompany: item.job_company,
          jobImages: item.job_images.split('\n').map(v => BOS_ADDR + v),
          jobAuthStatus: item.job_auth_status,

          updateTime: item.updatedAt
        })
      }
      this.listLoading = false
    },
    async handleVerify(index, type, status) {
      // row.id
      const row = this.tableData[index]
      console.log('row', row, type, status)
      try {
        await verifyInfo(row.id, type, status)
        if (type === 'education') {
          row.educationAuthStatus = status
        } else {
          row.jobAuthStatus = status
        }
      } catch (error) {
        console.log('error', error)
        this.$message.error(`操作失败: ${error}`)
      }
    },
    handleSearch() {
      this.fetchData()
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
