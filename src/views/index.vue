<template>
  <div class="app-container home">
    <div style="width: 100%">
      <swiper class="swiper" :options="swiperOption">
        <swiper-slide><img :src="swiperImage1" class="bannerImage" /></swiper-slide>
        <swiper-slide><img :src="swiperImage2" class="bannerImage" /></swiper-slide>
        <swiper-slide><img :src="swiperImage3" class="bannerImage" /></swiper-slide>
      </swiper>
    </div>
    <div style="margin-top: 30px">
      <el-row>
        <el-col :span="12" style="display: flex;justify-content: center;">
          <home-card title="招标预告" :source-data="bidData1" :category="1"/>
        </el-col>
        <el-col :span="12" style="display: flex;justify-content: center;">
          <home-card title="招标公告" :source-data="bidData2" :category="2"/>
        </el-col>
      </el-row>
      <el-row style="margin-top: 30px">
        <el-col :span="12" style="display: flex;justify-content: center;">
          <home-card title="中标公告" :source-data="bidData3" :category="3"/>
        </el-col>
        <el-col :span="12" style="display: flex;justify-content: center;">
          <home-card title="企业采购" :source-data="bidData4" :category="4"/>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import HomeCard from "@/components/Platform/HomeCard.vue";
import { swiper, swiperSlide } from 'vue-awesome-swiper'
// Import Swiper styles
import 'swiper/dist/css/swiper.css'
import { listBidding } from '../api/bid/bidding/bidding';
export default {
  name: "index",
  components: { swiper, swiperSlide,HomeCard },
  data() {
    return {
      swiperImage1: require('@/assets/images/swiper1.png'),
      swiperImage2: require('@/assets/images/swiper2.png'),
      swiperImage3: require('@/assets/images/swiper3.png'),
      swiperOption: {
        loop: true,
        activeIndex: 2,
        autoplay: {
          delay: 2000,    //秒
          stopOnLastSlide: false,
          disableOnInteraction: false,//滑动不会失效
        }
      },
      bidding: {
        loading: false,
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          category: null
        },
        data: [],
        total: 0
      },
      bidData1: null,
      bidData2: null,
      bidData3: null,
      bidData4: null,
    }
  },
  async created() {
    // this.getBiddingList()
  },
  mounted() {
    this.$nextTick(async() => {
      this.bidData1 = await this.getBidData(1);
      this.bidData2 = await this.getBidData(2);
      this.bidData3 = await this.getBidData(3);
      this.bidData4 = await this.getBidData(4);
    })
  },
  methods: {
    // getBiddingList() {
    //   this.bidding.loading = true
    //   listBidding(this.bidding.queryParams).then(response => {
    //     this.bidding.data = response.rows;
    //     this.bidding.total = response.total;
    //     this.bidding.loading = false
    //   })
    // },
    async getBidData(category) {
      const that = this;
      const params = that.bidding.queryParams;
      params.category = category;
      return listBidding(params);
    },
    toDetail(id, type) {
      this.$router.push({ path: '/bid/detail/', query: { id: id, type: type } })
    },
    toMoreList(type) {
      this.$router.push({ path: '/bid/list/', query: { type: type } })
    }
  }

}
</script>

<style scoped lang="scss">
.swiper {
  height: 350px;
  //width: 5000px;
}

.swiper-wrapper {
  width: 1000px;
}

.swiper-slide {
  width: 1000px;
  //margin-left: 30px;
}

.bannerImage {
  width: 100%;
  height: 350px;
  border-radius: 10px;
  opacity: 1;
  border: 0;
}

.noticeWrapper {
  margin-top: 30px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;

  .notice_Item {
    margin-bottom: 30px;
    width: 48%;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);

    .notice_title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid rgba(0, 0, 0, .1);

      .notice_title_text {
        font-size: 16px;
        font-weight: 600;
      }

      .notice_title_more {
        display: flex;
        align-items: center;
        gap: 5px;
        color: #999999;
        font-size: 14px;
        cursor: pointer;

        &:hover {
          color: #409EFF;
        }

        img {
          width: 14px;
          height: 14px;
        }
      }
    }

    .notice_content {
      padding: 0 20px;
      min-height: 120px;

      .notice_content_item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;

        .notice_content_item_title {
          font-size: 14px;
          color: #333333;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          cursor: pointer;
          text-align: left;
          width: 80%;

          &:hover {
            color: #409EFF;
          }
        }

        .notice_content_item_time {
          font-size: 12px;
          color: #999999;
          flex: 1;
          text-align: right;
        }

        .notice_content_item_img {
          img {
            width: 18px;
            height: 18px;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 767px) {

  // 调整外部边距
  .app-container {
    padding: 0;
  }

  // 轮播图尺寸
  .swiper {
    width: 100%;
    height: 140px;

    &>>>.swiper-wrapper {
      width: 100%;
    }
  }

  .swiper-slide {
    width: 100%;
  }

  .bannerImage {
    width: 100%;
    height: 140px;
  }

  .notice_Item {
    width: 100%;
  }
}
</style>
