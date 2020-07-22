import {
  getReviewList
} from '../../../utils/requestApi.js'
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsComment: Object,
    prDid: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    listData: [], //页面数据
    img1: app.data.imgurl + 'icon_01@2x (2).png',
    img2: app.data.imgurl+'icon_02@2x.png',
    imgList:[
      {
        img: app.data.imgurl + 'icon_01@2x (2).png',
      },
      {
        img: app.data.imgurl + 'icon_01@2x (2).png',
      },
      {
        img: app.data.imgurl + 'icon_01@2x (2).png',
      },
      {
        img: app.data.imgurl + 'icon_01@2x (2).png',
      },
      {
        img: app.data.imgurl + 'icon_01@2x (2).png',
      },
    ]
  },

  ready: function() {
    this.initData();
  },


  /**
   * 组件的方法列表
   */
  methods: {
    //打开实拍页面
    onChange: function(e) {
      this.triggerEvent('toChange', {
        id: 2
      })
    },

    initData: function() {
      let {
        prDid
      } = this.data;
      getReviewList({
        action: 'LoadReviewYinLiu',
        PageSize: '10',
        pageIndex: '1',
        ProductId: prDid
      }).then(res => {
        // console.log("评论信息",res);

        if (res.statusCode == 200) {
          let pf = res.data.Result.Data;
          this.setData({
            listData: res.data.Result.Data
          })
        }
      })
    },

    //点击预览图片
    previewImage(e){
      let { pindex, sindex } = e.target.dataset
      let arr = this.data.listData;
      console.log("详情预览图片",arr);
      wx.previewImage({
        urls: arr[pindex].ImagesList, // 需要预览的图片http链接列表
        current: arr[pindex].ImagesList[sindex],// 当前显示图片的http链接
      })
    },
  }
})