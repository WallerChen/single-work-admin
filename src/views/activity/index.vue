<template>
  <div class="dashboard-container">
    <el-row type="flex" justify="center"> 
      <el-upload
        class="avatar-uploader"
        drag
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :before-upload="uploadFile">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <!-- <el-input placeholder="活动图片" size="mini" class="search"/> -->
      <!-- <el-input placeholder="请输入昵称" size="mini" v-model="searchWord" class="search">
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input> -->
    </el-row>
    <el-row style="margin-top: 10px;">
      <el-input v-model="activityTitle" placeholder="活动名称" size="mini" class="search"/>
      <el-input v-model="activityDesc" placeholder="活动介绍" size="mini" class="activity-desc"/>
      <el-input v-model="activityPrice" placeholder="活动价格" size="mini" class="activity-desc"/>
      <el-input v-model="activityOrganizer" placeholder="组织者" size="mini" class="activity-desc"/>

      <el-button style="margin-left: 10px;" type="success" size="mini" @click="createActivity">创建</el-button>
    </el-row>
    <el-table
      :data="tableData"
      size="mini"
      style="width: 100%">
      <el-table-column
        prop="title"
        label="活动名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="images"
        label="活动图片"
        width="180">
      </el-table-column>
      <el-table-column
        prop="content"
        label="活动详情"
        width="250">
        <template slot-scope="scope">
          <div class="desc-show">{{scope.row.content}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
      <template slot-scope="scope">
        <!-- <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">{{ scope.row.edit ? '完成' : '编辑' }} </el-button> -->
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import { createAct, getAct, deleteAct } from '../../api/group'
import { BosClient } from '@baiducloud/sdk'

let config = {
 credentials: {
      ak: 'ALTAKDX222UNidxlCOLsYRUhtH',       //您的AK
      sk: '6ad5e18a3cb546bc9a10eb52e04a13f7'        //您的SK
   },
 endpoint: 'https://bj.bcebos.com'  //需要根据bucket所属局域进行修改
};

const client = new BosClient(config);
export default {
  name: 'Dashboard',
  data() {
    return {
      tableData: [],
      searchWord: '',
      select: '',
      imageUrl: '',
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

      activityTitle: '',
      activityDesc: '',
      activityPrice: '',
      activityOrganizer: '',
      isEdit: false
  };
},
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
      this.getAct();
  },
  methods: {
    // 删除
    handleDelete(index, row) {
      deleteAct({id: row.id}).then( res => {
        this.getAct();
      })
    },
    // 获取活动
    getAct() {
      getAct().then(res=> {
        this.tableData = res.rows;
      })
    },
    // 创建活动
    createActivity() {
      let params = {
        images: 'https://normal-wr.bj.bcebos.com/93fe148c62684bd7d6a35ffccfadfd30.jpeg',
        title: this.activityTitle,
        content: this.activityDesc,
        price: this.activityPrice,
        organizer: this.activityOrganizer
      };
      createAct(params).then(res=> {
        this.getAct();
        this.activityTitle = '';
        this.activityDesc = '';
        this.activityPrice = '';
        this.activityOrganizer = '';
        console.log('----res:' + JSON.stringify(res));
      })
    },
    // 上传头像
    uploadFile(file) {
      console.log('------333');
      console.log('fiel:' + file);
      let reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = e => {
        client.putObject("name" , file.name, new Buffer(e.target.result)).then(res=> {
          // this.img = 
          console.log('res:' + JSON.stringify(res));
        });
      }
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
  width: 200px;
}

.activity-desc {
  margin-left: 30px;
  width: 200px;
}

.activity-image {
  margin-left: 30px;
  width: 400px;
}

.desc-show {
  height: 100px;
  overflow-y: scroll
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
