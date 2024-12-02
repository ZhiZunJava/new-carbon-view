<template>
  <div class="main">
    <el-breadcrumb separator="/" class="breadcrumb" style="padding: 0 20px">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/info/list' }">平台动态</el-breadcrumb-item>
      <el-breadcrumb-item>动态详情页</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <el-card v-loading="loading" shadow="hover" :body-style="{ padding: '12px', 'border-radius': '6px' }">
        <div class="info-title">{{ title }}</div>
        <div class="info-footer">
          <span>发布人：{{ author }}</span>
          <span>发布时间：{{ parseTime(publishTime, '{y}-{m}-{d}') }}</span>
        </div>
        <div class="info-content" v-html="content"></div>

        <div class="file-wrap">
          <div class="file-title">附件</div>
          <div class="file-list">
            <div class="file-item" v-for="(file, index) in files">
              <span class="file-item-title">附件{{ index + 1 }}.</span>
              <a :href="file.fileUrl" @click="download(file.fileName, file.filePath)" target="_blank">{{ file.fileName
                }}</a>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { getInformationDetail } from '../../api/bid/information/information';


export default {
  name: "detail",
  methods: {
    download(fileName, filePath) {
      axios({
        method: 'get',
        url: filePath, // 文件的 URL
        responseType: 'blob', // 指定响应类型为 blob
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' // 请求头，视情况调整
        }
      })
        .then(function (response) {
          const blob = response.data;
          const a = document.createElement('a');
          const blobUrl = window.URL.createObjectURL(blob);

          a.href = blobUrl;
          a.setAttribute('download', fileName);
          a.click();
          window.URL.revokeObjectURL(blobUrl);
        })
        .catch(function (error) {
          console.error('下载失败', error);
        });
    }
  },
  data() {
    return {
      id: '',
      loading: false,
      data: {},
      title: '',
      content: '',
      author: '',
      publishTime: '',
      files: []
    }
  },
  async created() {
    this.id = this.$route.query.id
  },
  mounted() {
    this.loading = true
    getInformationDetail(this.id).then(response => {
      this.$nextTick(() => {
        this.data = response.data
        this.title = response.data.title
        this.content = response.data.content
        this.author = response.data.publisher
        this.publishTime = response.data.publishDatetime
        this.files = response.data.filesList
        this.loading = false
      })
    })
  },

}
</script>

<style lang="scss" scoped>
.content {
  margin-top: 15px;
  background: #FFFFFF;
}

.el-card {
  border-radius: 10px !important;
}

.info-title {
  margin-top: 25px;
  text-align: center;
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
  line-height: 40px;
}

.info-footer {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
}

.info-content {
  position: relative;
  font-size: 16px;
  word-wrap: break-word;
  line-height: 30px;
  text-align: left;
  margin: 50px 44px 0 36px;

  p {
    word-wrap: break-word;
    word-break: normal;
    line-height: 1.5;
    margin-bottom: 1.7em;
  }
}
</style>
