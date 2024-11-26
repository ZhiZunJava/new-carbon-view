<template>
  <div class="main">
    <el-breadcrumb separator="/" class="breadcrumb" style="padding: 0 20px">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/info/list' }">平台动态</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 20px">
      <el-container>
        <el-main v-loading="loading">
          <el-row :gutter="20" v-if="data.length > 0" type="flex" style="flex-wrap:wrap;row-gap: 12px;">
            <el-col :xs="24" :sm="12" :md="8" :lg="8" v-for="(item) in data" :key="item.id">
              <el-card shadow="hover" :body-style="{ padding: '0px' }">
                <div class="card-content">
                  <span class="title">{{ item.title }}</span>
                  <div class="bottom clearfix">
                    <time class="time">发布时间: {{ parseTime(item.bidPublishDatetime, '{y}-{m}-{d}') }}</time>
                    <el-button type="text" class="button" @click="toDetail(item.id)">查看详情</el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <div v-else style="text-align: center;margin-top: 50px">暂无数据</div>
          <pagination style="background-color: transparent;" v-show="total > 0" :total="total"
            :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" :page-sizes="[6, 12, 24, 32, 64]"
            background @pagination="getList"></pagination>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import { getInformationList } from '@/api/bid/information/information';


export default {
  name: "list",
  data() {
    return {
      loading: false,
      data: [],
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 6,
      },
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getInformationList(this.queryParams).then(response => {
        this.data = response.rows;
        this.total = response.total;
        this.loading = false
      })
    },
    toDetail(id) {
      this.$router.push({ path: '/info/detail/', query: { id: id } })
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
