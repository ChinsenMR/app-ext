import {
     getProductsList
} from '../../utils/requestApi.js'
import {
     countdown
} from '../../utils/util.js'
let timer2 = null
const app = getApp()
Page({

     /**
      * 页面的初始数据
      */
     data: {
          imgurl: app.data.imgurl, //小图标
          goodslist: [], //商品列表
          pageIndex: 1,
          totoalpage: "",
          pagetype: 5
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function(options) {
          console.log("品牌id", options)
          this.getdata(options.CatetoryId, true)
     },
     //     获取即将开售商品列表
     getdata(CatetoryId, params) {
          let {
               goodslist
          } = this.data
          let _this = this
          if (params) {
               getProductsList({
                    action: 'GetProducts',
                    pageSize: 10,
                    pageIndex: _this.data.pageIndex,
                    CatetoryId: CatetoryId
               }).then(res => {
                    console.log("即将开售", res)
                    if (res.statusCode == 200) {
                         _this.setData({
                              goodslist: _this.data.goodslist.concat(res.data.Result.Data),
                              totoalpage: res.data.Result.TotalRecords
                         })
                    }
               })
          }
          // 实现倒计时

          goodslist.forEach((item2) => {
               item2.countDownState = {
                    limitHours: countdown(item2.SaleStartDate).limitHours,
                    limitMin: countdown(item2.SaleStartDate).limitMin,
                    limitSecond: countdown(item2.SaleStartDate).limitSecond,
                    overTime: countdown(item2.SaleStartDate).overTime
               }
          })

          this.setData({
               goodslist
          })
     },

     /**
      * 生命周期函数--监听页面初次渲染完成
      */
     onReady: function() {

     },

     /**
      * 生命周期函数--监听页面显示
      */
     onShow: function() {
          //  即将开售倒计时
          timer2 = setInterval(() => {
               this.getdata(false)
          }, 1000)

     },

     /**
      * 生命周期函数--监听页面隐藏
      */
     onHide: function() {
          clearInterval(timer2)
     },

     /**
      * 生命周期函数--监听页面卸载
      */
     onUnload: function() {

     },

     /**
      * 页面相关事件处理函数--监听用户下拉动作
      */
     onPullDownRefresh: function() {

     },

     /**
      * 页面上拉触底事件的处理函数
      */
     onReachBottom: function() {
          if (this.data.goodslist.length < this.data.totoalpage) {
               this.data.pageIndex++
                    this.getdata()
          } else {
               wx.showToast({
                    title: '到底啦~~',
               })
          }

     },

})