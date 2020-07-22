import {
  getReviewList
} from '../../../utils/requestApi.js'
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    currentTab: String,
    prDid: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    listData: [], //页面数据
    img1: app.data.imgurl + 'icon_01@2x (2).png',
    img2: app.data.imgurl + 'icon_02@2x.png',
  },

  pageLifetimes: {
    show: function () {


    },
    created() {
      this.initData();
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initData: function () {
      let {
        prDid
      } = this.data;
      getReviewList({
        action: 'LoadReviewYinLiu',
        PageSize: '10',
        pageIndex: '1',
        ProductId: prDid
      }).then(res => {
        // console.log("点击数组数据预览图片", res.data.Result.Data);
        if (res.statusCode == 200) {
          this.setData({
            listData: res.data.Result.Data
          })
        }
      })
    },

    //点击图片预览
    previewImage(e) {
      let {
        pindex,
        cindex
      } = e.target.dataset
      let arr = this.data.listData;
      wx.previewImage({
        urls: arr[pindex].ImagesList, // 需要预览的图片http链接列表
        current: arr[pindex].ImagesList[cindex], // 当前显示图片的http链接
      })
    },

  }
})