<template>
  <div class="dashboard-container">
    <el-row>
      <el-button size="mini" @click="getInfoByClass('one')">一班</el-button>
      <el-button size="mini" @click="getInfoByClass('two')">二班</el-button>
      <el-button size="mini" @click="getInfoByClass('three')">三班</el-button>
      <el-button size="mini" @click="getInfoByClass('four')">四班</el-button>

      <el-input placeholder="请输入昵称" size="mini" v-model="searchWord" class="search">
      <el-button slot="append" icon="el-icon-search" @click="getInfoByNickName()"></el-button>
    </el-input>
    </el-row>
    <el-table
      :data="tableData"
      size="mini"
      style="width: 100%">
      <el-table-column
        prop="class"
        label="班级"
        width="180">
      </el-table-column>
      <el-table-column
        prop="avatar_url"
        label="用户头像"
        width="180">
      </el-table-column>
      <el-table-column
        prop="nick_name"
        label="用户昵称"
        width="100">
      </el-table-column>
      <el-table-column
        prop="desc"
        label="用户介绍"
        sortable
        width="250">
        <template slot-scope="scope">
          <div class="desc-show">{{scope.row.desc}}</div>
          <!-- <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
            v-model="scope.row.desc">
          </el-input> -->
        </template>
      </el-table-column>
      <el-table-column
        prop="score"
        label="用户质量分"
        sortable
        width="120">
        <template slot-scope="scope">
          <el-select v-model="scope.row.score" size="mini" placeholder="请打分"  @change="userScore($event, scope.row.id)">
            <el-option
              v-for="item in options"
              :key="item + scope.row.id"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="is_show"
        label="是否展示"
        sortable
        width="120">
        <template slot-scope="scope">
          <el-select v-model="scope.row.is_show" size="mini" placeholder="请选择"  @change="userShow($event, scope.row.id)">
            <el-option
              v-for="item in optionsShow"
              :key="item.label + scope.row.id"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="created_at"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="updated_at"
        label="更新时间">
      </el-table-column> -->
      <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">{{ scope.row.edit ? '完成' : '编辑' }} </el-button>
        <!-- <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">实战</el-button> -->
      </template>
    </el-table-column>
    </el-table>
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
      options: [
        1,2,3,4,5
      ],
      optionsShow: [
        {
          label: '展示',
          value: 1
        },
        {
          label: '不展示',
          value: 0
        }
      ],
      updateObj:{},
      isEdit: false
  };
},
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    // userDesc(value, id) {
    //   updateUserInfo(id, {desc: value}).then(res=>{
    //     console.log('resres:' + JSON.stringify(res));
    //   });
    // },
    // 用户质量打分
    userScore(value, id) {
      updateUserInfo(id, {score: value}).then(res=>{
        console.log('resres:' + JSON.stringify(res));
      });
    },
    // 用户展示
    userShow(value, id) {
      updateUserInfo(id, {is_show: value}).then(res=>{
        console.log('resres:' + JSON.stringify(res));
      });
    },
    // 编辑用户信息
    // handleEdit(index, row) {
    //   if(this.isEdit && !row.edit) {
    //     Message({
    //       message: '一次性只能编辑一个用户',
    //       type: 'error',
    //       duration: 3 * 1000
    //     })
    //     return;
    //   }
    //   this.updateObj = row;
    //   if(row.edit) { 
    //     const {desc, score} = this.updateObj;
    //     row.edit = false;
    //     updateUserInfo(row.id, {desc, score}).then(res=>{
    //       this.isEdit = false;
    //       this.$set(this.tableData, index - 1, {row, ...this.updateObj});
    //       // console.log('resres:' + JSON.stringify(res));
    //     });
    //     return;
    //   }
    //   row.edit = true;
    //   this.isEdit = true;
    //   this.$set(this.tableData, index - 1, row);
    // },
    getInfoByClass(cls) {
      getList({cls}).then(res => {
        this.tableData = res.rows;
      })
    },
    getInfoByNickName() {
      getListByNickname({nickName: this.searchWord}).then(res=> {
        this.tableData = res.rows;
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
  height: 100px;
  overflow-y: scroll
}
</style>
