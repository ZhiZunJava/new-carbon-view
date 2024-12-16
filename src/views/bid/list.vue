<template>
  <div class="main">
    <el-breadcrumb separator="/" class="breadcrumb" style="padding: 0 20px">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>公告列表页</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <el-container>
        <el-main v-loading="loading">
          <div class="content">
            <el-table v-loading="loading" style="width: 100%" :data="data" :header-cell-style="{
              background: '#F6FDFD', height: '46px', color: '#000000', border: '0px solid tan', boxShadow: 'inset 0px -1px 0px 0px #EEEEEE'
            }" :row-style="{ height: '50px' }" @row-click="handleTableRow">
              <el-table-column label="序号" type="index" width="244"></el-table-column>
              <el-table-column label="招投标标题" align="left" width="530" prop="bidTitle" />
              <el-table-column label="发布时间" align="left" prop="bidPublishDatetime">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.bidPublishDatetime, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize" @pagination="getList" />
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import { listBidding } from '../../api/bid/bidding/bidding';


export default {
  name: "list",
  data() {
    return {
      category: null,
      loading: false,
      data: [],
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 12,
        category: null
      },
    }
  },
  async created() {
    this.category = this.$route.query.category;
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      this.queryParams.category = this.category
      listBidding(this.queryParams).then(response => {
        this.data = response.rows;
        this.total = response.total;
        this.loading = false
      })
    },
    handleTableRow(row, column, event) {
      this.$router.push(`/bid/detail?id=${row.id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-weight: 700;
  color: #1f2f3d;
}

.content {
  background: #FFFFFF;
  border-radius: 10px;
  opacity: 1;
  min-height: 860px;
  padding: 24px 21px 0 21px;
}

.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.card-content {
  text-align: left;
  padding: 14px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.el-card {
  height: 100%;

  ::v-deep .el-card__body {
    height: 100%;
  }
}
</style>